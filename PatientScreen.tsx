import type { BCEarThresholds, BCFrequency, EarThresholds } from '@/types';
import { BC_FREQUENCIES } from '@/types';

/**
 * Whether masking is required for a bone-conduction reading.
 *
 * Bone-conducted sound reaches both cochleae with negligible interaural
 * attenuation (effectively 0 dB), so an unmasked BC threshold can reflect
 * the better (non-test) ear rather than the ear actually being tested.
 * The standard clinical rule of thumb: masking is indicated whenever the
 * air-bone gap in the test ear is >= 10 dB HL, since a gap that size means
 * the BC reading could plausibly be cross-hearing rather than a true
 * conductive component.
 *
 * This only *flags* the need for masking — it does not simulate or apply
 * masking noise, which is a real audiometric procedure requiring calibrated
 * equipment and is out of scope for this tool.
 */
export const MASKING_ABG_THRESHOLD = 10;

export function isMaskingRequired(acThreshold: number, bcThreshold: number): boolean {
  return acThreshold - bcThreshold >= MASKING_ABG_THRESHOLD;
}

export function maskingFlagsForEar(
  ac: EarThresholds,
  bc: BCEarThresholds,
): Record<BCFrequency, boolean> {
  const flags = {} as Record<BCFrequency, boolean>;
  BC_FREQUENCIES.forEach((f) => {
    flags[f] = isMaskingRequired(ac[f], bc[f]);
  });
  return flags;
}

export function anyMaskingRequired(ac: EarThresholds, bc: BCEarThresholds): boolean {
  return BC_FREQUENCIES.some((f) => isMaskingRequired(ac[f], bc[f]));
}
