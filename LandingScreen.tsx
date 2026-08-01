import type {
  AudiogramData,
  AudiogramPattern,
  Degree,
  DiagnosisResult,
  DisabilityEstimate,
  EarAnalysis,
  EarThresholds,
  Frequency,
  PatternAnalysis,
} from '@/types';

const degreeFromDb = (db: number): Degree => {
  if (db <= 25) return 'Normal';
  if (db <= 40) return 'Mild';
  if (db <= 55) return 'Moderate';
  if (db <= 70) return 'Moderately Severe';
  if (db <= 90) return 'Severe';
  return 'Profound';
};

const degreeIndex = (d: Degree): number =>
  (['Normal', 'Mild', 'Moderate', 'Moderately Severe', 'Severe', 'Profound'] as const).indexOf(d);

const ptaOf = (t: EarThresholds): number =>
  Math.round((t[500] + t[1000] + t[2000]) / 3);

const analyzeEar = (t: EarThresholds): EarAnalysis => {
  const pta = ptaOf(t);
  const degree = degreeFromDb(pta);

  const slope = t[4000] - t[500];
  let configuration = 'Flat';
  if (slope >= 15) configuration = 'High-frequency sloping';
  else if (slope <= -15) configuration = 'Low-frequency rising';
  else if (Math.max(...Object.values(t)) - Math.min(...Object.values(t)) <= 10)
    configuration = 'Flat';

  const highFrequencyLoss = t[4000] > 25 && t[4000] >= t[1000] + 10;
  const noiseNotch =
    t[4000] >= t[1000] + 10 && t[4000] >= t[8000] + 5 && t[4000] > 25;

  let worst: { freq: Frequency; db: number } | null = null;
  (Object.keys(t) as unknown as Frequency[]).forEach((f) => {
    if (!worst || t[f] > worst.db) worst = { freq: f, db: t[f] };
  });

  return { pta, degree, configuration, highFrequencyLoss, noiseNotch, worst };
};

const buildFindings = (left: EarAnalysis, right: EarAnalysis): string[] => {
  const out: string[] = [];

  const worse = degreeIndex(right.degree) >= degreeIndex(left.degree) ? right : left;
  const better = worse === right ? left : right;
  const worseSide = worse === right ? 'Right' : 'Left';
  const betterSide = better === right ? 'Left' : 'Right';

  out.push(
    `The ${worseSide.toLowerCase()} ear demonstrates a ${worse.degree.toLowerCase()} hearing loss with a pure-tone average (PTA) of ${worse.pta} dB HL, representing the more affected ear in this evaluation.`,
  );

  if (better.degree !== 'Normal') {
    out.push(
      `The ${betterSide.toLowerCase()} ear shows a ${better.degree.toLowerCase()} loss with a PTA of ${better.pta} dB HL, indicating ${degreeIndex(worse.degree) === degreeIndex(better.degree) ? 'a roughly symmetric' : 'an asymmetric'} bilateral pattern.`,
    );
  } else {
    out.push(
      `The ${betterSide.toLowerCase()} ear retains normal hearing sensitivity (PTA ${better.pta} dB HL), consistent with a unilateral presentation.`,
    );
  }

  if (left.noiseNotch || right.noiseNotch) {
    const sides = [left.noiseNotch && 'left', right.noiseNotch && 'right']
      .filter(Boolean)
      .join(' and ');
    out.push(
      `A characteristic 4 kHz noise notch is present in the ${sides} ear(s), a pattern frequently associated with prolonged noise exposure, firearm use, or occupational acoustic trauma.`,
    );
  } else if (left.highFrequencyLoss || right.highFrequencyLoss) {
    out.push(
      `High-frequency sensitivity is reduced at 4 kHz and/or 8 kHz, a configuration commonly seen in early presbycusis (age-related hearing change) and noise-induced cochlear damage.`,
    );
  }

  if (worse.degree !== 'Normal') {
    out.push(
      `Speech comprehension in quiet is expected to remain functional, but clarity in background noise and group settings is likely reduced given the ${worse.configuration.toLowerCase()} configuration.`,
    );
  }

  const interaural = Math.abs(right.pta - left.pta);
  if (interaural >= 15) {
    out.push(
      `An interaural PTA asymmetry of ${interaural} dB was detected. When asymmetry exceeds 15 dB, referral for retrocochlear evaluation is clinically warranted to exclude acoustic neuroma or other internal auditory canal pathology.`,
    );
  }

  return out;
};

const buildRecommendations = (
  left: EarAnalysis,
  right: EarAnalysis,
  bilateral: boolean,
): string[] => {
  const recs: string[] = [];
  const maxDegree = Math.max(degreeIndex(left.degree), degreeIndex(right.degree));

  if (maxDegree === 0) {
    recs.push(
      'No audiological intervention is required at this time. Recommend routine hearing surveillance every 2–3 years and hearing-conservation counseling.',
    );
  } else {
    const worse = degreeIndex(right.degree) >= degreeIndex(left.degree) ? right : left;
    const fitted = bilateral
      ? 'binaural amplification'
      : `${worse === right ? 'right' : 'left'}-ear amplification`;
    recs.push(
      `Hearing rehabilitation with ${fitted} is recommended. Modern devices should include directional microphones and noise-reduction to address the observed ${worse.configuration.toLowerCase()} loss.`,
    );
  }

  if (left.noiseNotch || right.noiseNotch) {
    recs.push(
      'Implement a structured hearing-conservation program: custom musician or shooter hearing protection for exposure environments, and limit cumulative noise dose below NIOSH-recommended 85 dBA 8-hour TWA.',
    );
  }

  const interaural = Math.abs(right.pta - left.pta);
  if (interaural >= 15) {
    recs.push(
      'Refer to otolaryngology for asymmetry workup, including MRI of the internal auditory canals with gadolinium to rule out retrocochlear lesion.',
    );
  } else {
    recs.push(
      'Refer to otolaryngology for medical clearance and comprehensive audiological evaluation including speech-in-noise and tympanometric assessment.',
    );
  }

  if (maxDegree >= degreeIndex('Moderate')) {
    recs.push(
      'Arrange auditory rehabilitation sessions to support communication strategies and assistive-listening device orientation (remote microphones, captioning, alerting systems).',
    );
  }

  recs.push(
    'Re-evaluate thresholds annually, or sooner if the patient reports subjective change, tinnitus progression, or speech-understanding difficulty.',
  );

  return recs;
};

/**
 * Audiogram pattern classification.
 *
 * Analyzes the overall shape of the audiogram across both ears to assign one
 * of nine clinically-recognized configuration patterns. Uses the mean threshold
 * per frequency (averaging left + right) so a single dominant pattern surfaces
 * even when the ears differ slightly. This is independent of the per-ear
 * degree/configuration analysis above and does not alter it.
 */
function classifyPattern(audiogram: AudiogramData): PatternAnalysis {
  const mean = (f: Frequency) =>
    Math.round((audiogram.left[f] + audiogram.right[f]) / 2);

  const v250 = mean(250);
  const v500 = mean(500);
  const v1000 = mean(1000);
  const v2000 = mean(2000);
  const v4000 = mean(4000);
  const v8000 = mean(8000);

  const lowAvg = (v250 + v500) / 2;
  const midAvg = (v500 + v1000 + v2000) / 3;
  const highAvg = (v4000 + v8000) / 2;
  const allVals = [v250, v500, v1000, v2000, v4000, v8000];
  const maxVal = Math.max(...allVals);
  const minVal = Math.min(...allVals);
  const spread = maxVal - minVal;

  const noiseNotch =
    v4000 >= v1000 + 10 && v4000 >= v8000 + 5 && v4000 > 25;

  const cookieBite =
    midAvg > lowAvg + 5 &&
    midAvg > highAvg + 5 &&
    v1000 > v250 + 5 &&
    v1000 > v4000 + 5;

  const reverseCookieBite =
    midAvg < lowAvg - 5 &&
    midAvg < highAvg - 5 &&
    v1000 < v250 - 5 &&
    v1000 < v4000 - 5;

  const lowLoss = lowAvg > midAvg + 10 && lowAvg > 25;
  const highLoss = highAvg > midAvg + 10 && highAvg > 25;

  const isNormal = allVals.every((v) => v <= 25);

  let pattern: AudiogramPattern;
  let explanation: string;

  if (isNormal) {
    pattern = 'Normal Pattern';
    explanation =
      'All thresholds fall within normal sensitivity (<=25 dB HL) across the tested frequency range, indicating no measurable hearing loss.';
  } else if (noiseNotch) {
    pattern = 'Noise Notch';
    explanation =
      'A characteristic dip centered near 4 kHz with recovery at 8 kHz is the classic signature of noise-induced hearing loss, commonly linked to prolonged acoustic exposure.';
  } else if (cookieBite) {
    pattern = 'Cookie Bite';
    explanation =
      'Mid frequencies (around 1000-2000 Hz) are more affected than the low and high ends, forming a U-shaped dip typical of congenital or genetic sensorineural loss.';
  } else if (reverseCookieBite) {
    pattern = 'Reverse Cookie Bite';
    explanation =
      'Mid frequencies are better preserved than the low and high ends, an inverted-U shape occasionally seen in certain hereditary or metabolic hearing conditions.';
  } else if (lowLoss) {
    pattern = 'Low Frequency Loss';
    explanation =
      'Hearing thresholds are elevated at 250-500 Hz relative to higher frequencies, a rising configuration often associated with Meniere disease or endolymphatic hydrops.';
  } else if (highLoss) {
    pattern = 'High Frequency Loss';
    explanation =
      'High frequencies (4000-8000 Hz) show greater threshold elevation, a downsloping configuration typical of presbycusis (age-related change) and noise-induced cochlear damage.';
  } else if (spread <= 10) {
    pattern = 'Flat';
    explanation =
      'Thresholds are broadly uniform across the frequency range, a flat configuration commonly seen with conductive loss or stable sensorineural loss of equal degree across pitches.';
  } else if (highAvg > lowAvg + 10) {
    pattern = 'Sloping';
    explanation =
      'Thresholds worsen progressively from low to high frequencies, a downsloping shape where high-pitch sounds are harder to detect than low-pitch ones.';
  } else if (lowAvg > highAvg + 10) {
    pattern = 'Rising';
    explanation =
      'Thresholds improve from low to high frequencies, a rising configuration where low-pitch sounds are harder to detect than high-pitch ones.';
  } else {
    pattern = 'Flat';
    explanation =
      'Thresholds are broadly uniform across the frequency range, indicating a flat configuration with relatively even hearing loss across pitches.';
  }

  return { pattern, explanation };
}

/**
 * Hearing disability percentage estimation (AAO 1979 / standard PTA-based).
 *
 * Per-ear monaural impairment uses the four-frequency average PTA (500, 1000,
 * 2000, 4000 Hz). The first 25 dB is considered within normal range and not
 * counted as impairment; each dB above 25 contributes 1.5% disability, capped
 * at 100% per ear.
 *
 * Binaural impairment weights the better ear five times and the worse ear once,
 * then divides by six, per the standard binaural formula:
 *   (5 * better + 1 * worse) / 6
 */
function computeDisability(audiogram: AudiogramData): DisabilityEstimate {
  const pta4 = (ear: EarThresholds) =>
    Math.round((ear[500] + ear[1000] + ear[2000] + ear[4000]) / 4);

  const monaural = (pta: number) =>
    Math.max(0, Math.min(100, (pta - 25) * 1.5));

  const rightPta = pta4(audiogram.right);
  const leftPta = pta4(audiogram.left);
  const rightEar = monaural(rightPta);
  const leftEar = monaural(leftPta);

  const better = Math.min(rightEar, leftEar);
  const worse = Math.max(rightEar, leftEar);
  const binaural = Math.round(((5 * better + worse) / 6) * 10) / 10;

  return {
    rightEar: Math.round(rightEar * 10) / 10,
    leftEar: Math.round(leftEar * 10) / 10,
    binaural,
  };
}

/**
 * Severity score (0-100).
 *
 * Derived directly from the worse ear's three-frequency PTA rather than a
 * random value. 0 dB HL maps to 0, and 105 dB HL (deep into the profound
 * range) maps to 100, with values in between scaled linearly and clamped.
 * This gives a continuous severity measure that moves predictably with the
 * actual input thresholds instead of jittering between runs.
 */
const severityFromPta = (worsePta: number): number =>
  Math.round(Math.max(0, Math.min(100, (worsePta / 105) * 100)));

/**
 * Confidence score (0-100).
 *
 * Reflects how clean and decisive the classification is, based on two
 * real signals instead of randomness:
 *
 * 1. Boundary margin - how far each ear's PTA sits from the nearest
 *    degree-grading cutoff (25/40/55/70/90 dB HL). A PTA sitting right on
 *    a boundary is inherently more ambiguous to grade than one solidly
 *    within a band, so confidence dips near boundaries.
 * 2. Threshold smoothness - real audiograms vary gradually across adjacent
 *    frequencies. Large frequency-to-frequency jumps (>20 dB) suggest an
 *    unusual configuration or inconsistent data entry, which should lower
 *    confidence in the automated pattern/degree call.
 *
 * The result is clamped to a 60-99 range: never absolute certainty (this is
 * a heuristic engine, not a validated diagnostic device), never below a
 * floor that would undermine every result.
 */
const DEGREE_BOUNDARIES = [25, 40, 55, 70, 90];

const boundaryMargin = (pta: number): number => {
  const distance = Math.min(...DEGREE_BOUNDARIES.map((b) => Math.abs(pta - b)));
  return Math.min(1, distance / 12);
};

const thresholdSmoothness = (t: EarThresholds): number => {
  const freqs: Frequency[] = [250, 500, 1000, 2000, 4000, 8000];
  const jumps = freqs.slice(1).map((f, i) => Math.abs(t[f] - t[freqs[i]]));
  const maxJump = Math.max(...jumps);
  return Math.max(0, 1 - Math.max(0, maxJump - 20) / 40);
};

const computeConfidence = (
  left: EarThresholds,
  right: EarThresholds,
  leftPta: number,
  rightPta: number,
): number => {
  const margin = (boundaryMargin(leftPta) + boundaryMargin(rightPta)) / 2;
  const smoothness = (thresholdSmoothness(left) + thresholdSmoothness(right)) / 2;
  const score = 75 + margin * 15 + smoothness * 9;
  return Math.round(Math.max(60, Math.min(99, score)));
};

const deriveOverall = (left: EarAnalysis, right: EarAnalysis) => {
  const bilateral =
    left.degree !== 'Normal' && right.degree !== 'Normal';
  const asymmetry = Math.abs(right.pta - left.pta) >= 15;

  const worse =
    degreeIndex(right.degree) >= degreeIndex(left.degree) ? right : left;
  const worseSide = worse === right ? 'Right' : 'Left';

  let laterality: string;
  if (bilateral) {
    laterality = asymmetry
      ? `Asymmetric Bilateral (${worseSide}-dominant)`
      : 'Bilateral Symmetric';
  } else if (worse.degree === 'Normal') {
    laterality = 'Bilateral Normal';
  } else {
    laterality = `Unilateral (${worseSide})`;
  }

  const configPart = worse.degree === 'Normal' ? '' : `, ${worse.configuration}`;

  return {
    classification: `${worse.degree} ${laterality} Hearing Loss${configPart}`,
    bilateral,
    asymmetry,
  };
};

/**
 * Pure-Tone Audiometry diagnosis engine.
 *
 * Implements clinically-grounded heuristics used in audiology:
 *   - Pure-Tone Average (PTA) across 500/1000/2000 Hz
 *   - WHO/ASHGA degree grading (Normal <= 25, Mild 26-40, Moderate 41-55,
 *     Moderately Severe 56-70, Severe 71-90, Profound > 90)
 *   - Configuration classification (flat / sloping / rising)
 *   - 4 kHz noise-notch detection (noise-induced hearing loss signature)
 *   - High-frequency loss detection (presbycusis / NIHL pattern)
 *   - Interaural asymmetry flag (>15 dB triggers retrocochlear referral)
 *
 * Thresholds are in dB HL (hearing level), the standard audiometric unit.
 */
export function diagnose(audiogram: AudiogramData): DiagnosisResult {
  const left = analyzeEar(audiogram.left);
  const right = analyzeEar(audiogram.right);
  const overall = deriveOverall(left, right);

  const worsePta = Math.max(left.pta, right.pta);
  const severityScore = severityFromPta(worsePta);
  const confidence = computeConfidence(audiogram.left, audiogram.right, left.pta, right.pta);

  return {
    left,
    right,
    overall,
    pattern: classifyPattern(audiogram),
    disability: computeDisability(audiogram),
    findings: buildFindings(left, right),
    recommendations: buildRecommendations(left, right, overall.bilateral),
    severityScore,
    confidence,
    generatedAt: new Date().toISOString(),
  };
}

export const ANALYSIS_STEPS = [
  { label: 'Normalizing audiometric thresholds', detail: 'Validating dB HL values across 250–8000 Hz' },
  { label: 'Computing pure-tone averages', detail: 'Calculating PTA for 500, 1000, 2000 Hz' },
  { label: 'Classifying degree & configuration', detail: 'Applying ASHA / WHO grading criteria' },
  { label: 'Detecting loss signatures', detail: 'Scanning for noise-notch and high-frequency patterns' },
  { label: 'Evaluating interaural asymmetry', detail: 'Comparing bilateral PTA for retrocochular flags' },
  { label: 'Generating clinical narrative', detail: 'Synthesizing findings and recommendations' },
] as const;
