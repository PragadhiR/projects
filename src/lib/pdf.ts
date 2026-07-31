import type { AudiogramData, DiagnosisResult, PatientInfo } from '@/types';
import { FREQUENCIES } from '@/types';

// Builds a self-contained printable clinical report. Uses window.print() on a
// dedicated print-styled document so the browser's native PDF engine handles
// vector text and crisp layout without a heavyweight client-side PDF library.
export function downloadReportPdf(
  patient: PatientInfo,
  audiogram: AudiogramData,
  diagnosis: DiagnosisResult,
): void {
  const w = window.open('', '_blank', 'width=900,height=1000');
  if (!w) {
    alert('Please allow pop-ups to download the clinical report PDF.');
    return;
  }

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const worst = (ear: typeof diagnosis.right) =>
    ear.worst ? `${ear.worst.freq} Hz @ ${ear.worst.db} dB HL` : '—';

  const thresholdRow = (label: string, ear: Record<number, number>, color: string, fill: string) => `
    <tr>
      <td class="ear-label" style="color:${color}">${label}</td>
      ${FREQUENCIES.map((f) => `<td style="background:${fill}">${ear[f]}</td>`).join('')}
      <td class="pta">${ptaOf(ear)}</td>
    </tr>`;

  const ptaOf = (t: Record<number, number>) =>
    Math.round((t[500] + t[1000] + t[2000]) / 3);

  w.document.write(`<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<title>Clinical Audiometry Report — ${escapeHtml(patient.name || 'Patient')}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', Arial, sans-serif; color: #1f2a40; padding: 40px; background: #fff; }
  h1,h2,h3 { font-family: 'Plus Jakarta Sans', Arial, sans-serif; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #1d72f1; padding-bottom: 18px; margin-bottom: 24px; }
  .brand { display: flex; align-items: center; gap: 12px; }
  .brand-mark { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg,#3391fb,#1d72f1); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 20px; font-weight: 700; }
  .brand-text h1 { font-size: 17px; color: #152a57; }
  .brand-text p { font-size: 11px; color: #5f7290; }
  .meta { text-align: right; font-size: 11px; color: #5f7290; line-height: 1.6; }
  .meta strong { color: #1f2a40; }
  .section { margin-bottom: 22px; }
  .section-title { font-size: 12px; text-transform: uppercase; letter-spacing: .08em; color: #1d72f1; margin-bottom: 10px; border-left: 3px solid #1d72f1; padding-left: 8px; }
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
  .field { border: 1px solid #eef2f7; border-radius: 8px; padding: 9px 12px; }
  .field .k { font-size: 9px; text-transform: uppercase; letter-spacing: .06em; color: #8d9fb8; }
  .field .v { font-size: 13px; font-weight: 600; margin-top: 3px; }
  .classification { background: #eef7ff; border: 1px solid #bce0ff; border-radius: 12px; padding: 18px; display: flex; justify-content: space-between; align-items: center; }
  .classification .label { font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: #1d72f1; }
  .classification .value { font-size: 18px; font-weight: 700; color: #152a57; margin-top: 4px; }
  .pattern-box { background: #f6f8fb; border: 1px solid #dde5ee; border-radius: 12px; padding: 16px; display: flex; gap: 16px; align-items: flex-start; }
  .pattern-box .tag { background: #eef7ff; border: 1px solid #bce0ff; color: #175bde; border-radius: 8px; padding: 6px 12px; font-size: 13px; font-weight: 700; white-space: nowrap; }
  .pattern-box .desc { font-size: 12px; line-height: 1.55; color: #475a78; margin: 0; }
  .disability { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
  .disability .cell { border: 1px solid #eef2f7; border-radius: 10px; padding: 12px; text-align: center; }
  .disability .cell .k { font-size: 9px; text-transform: uppercase; letter-spacing: .06em; color: #8d9fb8; }
  .disability .cell .v { font-size: 22px; font-weight: 800; color: #152a57; margin-top: 4px; }
  .disability .cell.primary { background: #eef7ff; border-color: #bce0ff; }
  .disability .cell.primary .v { color: #175bde; }
  .disability-note { font-size: 10px; color: #8d9fb8; margin-top: 10px; line-height: 1.5; }
  .scores { display: flex; gap: 24px; }
  .score { text-align: right; }
  .score .n { font-size: 20px; font-weight: 700; color: #152a57; }
  .score .l { font-size: 9px; text-transform: uppercase; letter-spacing: .06em; color: #8d9fb8; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th, td { padding: 8px 6px; text-align: center; border: 1px solid #eef2f7; }
  th { background: #f6f8fb; color: #5f7290; font-weight: 600; font-size: 10px; text-transform: uppercase; letter-spacing: .04em; }
  .ear-label { text-align: left; font-weight: 700; }
  .pta { font-weight: 700; background: #f6f8fb; }
  .ears { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; }
  .ear-card { border: 1px solid #eef2f7; border-radius: 10px; padding: 12px; }
  .ear-card h3 { font-size: 13px; margin-bottom: 8px; color: #152a57; }
  .ear-card .row { display: flex; justify-content: space-between; font-size: 11px; padding: 3px 0; border-bottom: 1px dashed #eef2f7; }
  .ear-card .row:last-child { border: 0; }
  .ear-card .row span:first-child { color: #8d9fb8; }
  .ear-card .row span:last-child { font-weight: 600; }
  .list { list-style: none; }
  .list li { font-size: 12px; line-height: 1.55; padding: 8px 0 8px 22px; position: relative; border-bottom: 1px dashed #eef2f7; }
  .list li:last-child { border: 0; }
  .list.findings li:before { content: '◆'; position: absolute; left: 0; color: #1d72f1; font-size: 10px; top: 9px; }
  .list.recs li:before { content: '✓'; position: absolute; left: 0; color: #16a34a; font-weight: 700; top: 8px; }
  .footer { margin-top: 28px; padding-top: 14px; border-top: 1px solid #eef2f7; font-size: 9px; color: #8d9fb8; text-align: center; line-height: 1.6; }
  .disclaimer { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 10px 14px; font-size: 10px; color: #92400e; margin-top: 16px; line-height: 1.5; }
  @media print { body { padding: 20px; } @page { margin: 14mm; } }
</style></head><body>

<div class="header">
  <div class="brand">
    <div class="brand-mark">A</div>
    <div class="brand-text">
      <h1>AI Audiometry Diagnosis Predictor</h1>
      <p>Clinical Pure-Tone Audiometry Report</p>
    </div>
  </div>
  <div class="meta">
    <strong>Report ID</strong> ${escapeHtml(patient.patientId || '—')}<br/>
    Generated ${escapeHtml(fmtDate(diagnosis.generatedAt))}<br/>
    AI Confidence ${diagnosis.confidence}%
  </div>
</div>

<div class="section">
  <div class="section-title">Patient Information</div>
  <div class="grid">
    <div class="field"><div class="k">Patient Name</div><div class="v">${escapeHtml(patient.name || '—')}</div></div>
    <div class="field"><div class="k">Age</div><div class="v">${patient.age || '—'}</div></div>
    <div class="field"><div class="k">Gender</div><div class="v">${escapeHtml(capitalize(patient.gender))}</div></div>
    <div class="field"><div class="k">Patient ID</div><div class="v">${escapeHtml(patient.patientId || '—')}</div></div>
    <div class="field"><div class="k">Test Date</div><div class="v">${escapeHtml(patient.testDate || '—')}</div></div>
    <div class="field"><div class="k">Frequencies Tested</div><div class="v">250–8000 Hz</div></div>
    <div class="field"><div class="k">Severity Score</div><div class="v">${diagnosis.severityScore}/100</div></div>
    <div class="field"><div class="k">Laterality</div><div class="v">${diagnosis.overall.bilateral ? 'Bilateral' : 'Unilateral'}</div></div>
  </div>
</div>

<div class="section">
  <div class="section-title">AI Classification</div>
  <div class="classification">
    <div>
      <div class="label">Hearing Loss Classification</div>
      <div class="value">${escapeHtml(diagnosis.overall.classification)}</div>
    </div>
    <div class="scores">
      <div class="score"><div class="n">${diagnosis.severityScore}</div><div class="l">Severity</div></div>
      <div class="score"><div class="n">${diagnosis.confidence}%</div><div class="l">Confidence</div></div>
    </div>
  </div>
</div>

<div class="section">
  <div class="section-title">Audiogram Pattern</div>
  <div class="pattern-box">
    <span class="tag">${escapeHtml(diagnosis.pattern.pattern)}</span>
    <p class="desc">${escapeHtml(diagnosis.pattern.explanation)}</p>
  </div>
</div>

<div class="section">
  <div class="section-title">Hearing Disability Estimation</div>
  <div class="disability">
    <div class="cell">
      <div class="k">Right Ear</div>
      <div class="v">${diagnosis.disability.rightEar}%</div>
    </div>
    <div class="cell">
      <div class="k">Left Ear</div>
      <div class="v">${diagnosis.disability.leftEar}%</div>
    </div>
    <div class="cell primary">
      <div class="k">Binaural</div>
      <div class="v">${diagnosis.disability.binaural}%</div>
    </div>
  </div>
  <p class="disability-note">PTA-based monaural impairment: first 25 dB HL normal, each dB above 25 = 1.5% per ear (capped 100%). Binaural = (5 × better + worse) ÷ 6.</p>
</div>

<div class="section">
  <div class="section-title">Audiometric Thresholds (dB HL)</div>
  <table>
    <thead><tr><th style="text-align:left">Ear</th>${FREQUENCIES.map((f) => `<th>${f} Hz</th>`).join('')}<th>PTA</th></tr></thead>
    <tbody>
      ${thresholdRow('Right', audiogram.right, '#1d72f1', '#eef7ff')}
      ${thresholdRow('Left', audiogram.left, '#dc2626', '#fef2f2')}
    </tbody>
  </table>
  <div class="ears">
    <div class="ear-card"><h3>Right Ear</h3>
      <div class="row"><span>Degree</span><span>${diagnosis.right.degree}</span></div>
      <div class="row"><span>PTA</span><span>${diagnosis.right.pta} dB HL</span></div>
      <div class="row"><span>Configuration</span><span>${diagnosis.right.configuration}</span></div>
      <div class="row"><span>Worst threshold</span><span>${worst(diagnosis.right)}</span></div>
    </div>
    <div class="ear-card"><h3>Left Ear</h3>
      <div class="row"><span>Degree</span><span>${diagnosis.left.degree}</span></div>
      <div class="row"><span>PTA</span><span>${diagnosis.left.pta} dB HL</span></div>
      <div class="row"><span>Configuration</span><span>${diagnosis.left.configuration}</span></div>
      <div class="row"><span>Worst threshold</span><span>${worst(diagnosis.left)}</span></div>
    </div>
  </div>
</div>

<div class="section">
  <div class="section-title">AI-Generated Findings</div>
  <ul class="list findings">${diagnosis.findings.map((f) => `<li>${escapeHtml(f)}</li>`).join('')}</ul>
</div>

<div class="section">
  <div class="section-title">Clinical Recommendations</div>
  <ul class="list recs">${diagnosis.recommendations.map((r) => `<li>${escapeHtml(r)}</li>`).join('')}</ul>
</div>

<div class="disclaimer">
  This report was generated by an AI-based prediction model for clinical decision support only. It is not a substitute for evaluation by a licensed audiologist or physician. All findings must be corroborated with comprehensive audiological assessment before treatment.
</div>

<div class="footer">
  AI-Based Pure Tone Audiometry Diagnosis Predictor · Generated ${escapeHtml(fmtDate(diagnosis.generatedAt))}<br/>
  Report ${escapeHtml(patient.patientId || '—')} · Confidential Clinical Document
</div>

<script>
  window.onload = function() { setTimeout(function(){ window.print(); }, 400); };
<\/script>
</body></html>`);

  w.document.close();
}

function escapeHtml(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string),
  );
}

function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '—';
}
