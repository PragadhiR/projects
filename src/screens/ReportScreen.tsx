import {
  AlertTriangle,
  AudioWaveform,
  BrainCircuit,
  Calendar,
  CheckCircle2,
  Download,
  Ear,
  FileText,
  Hash,
  Home,
  Info,
  Percent,
  RotateCcw,
  Sparkles,
  Stethoscope,
  User,
  Users,
} from 'lucide-react';
import type { AudiogramData, Degree, DiagnosisResult, PatientInfo } from '@/types';
import { FREQUENCIES } from '@/types';
import { AudiogramChart } from '@/components/AudiogramChart';
import { downloadReportPdf } from '@/lib/pdf';

const DEGREE_COLOR: Record<Degree, string> = {
  Normal: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Mild: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Moderate: 'bg-orange-100 text-orange-700 border-orange-200',
  'Moderately Severe': 'bg-orange-100 text-orange-800 border-orange-300',
  Severe: 'bg-red-100 text-red-700 border-red-200',
  Profound: 'bg-red-100 text-red-800 border-red-300',
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '—');

interface Props {
  patient: PatientInfo;
  audiogram: AudiogramData;
  diagnosis: DiagnosisResult;
  onRestart: () => void;
  onHome: () => void;
}

export function ReportScreen({ patient, audiogram, diagnosis, onRestart, onHome }: Props) {
  const sevColor =
    diagnosis.severityScore >= 70
      ? 'text-red-600'
      : diagnosis.severityScore >= 40
        ? 'text-orange-600'
        : diagnosis.severityScore >= 15
          ? 'text-yellow-600'
          : 'text-emerald-600';

  const PatientField = ({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) => (
    <div className="rounded-xl border border-ink-200 bg-white p-3.5">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-400">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-1.5 text-sm font-bold text-ink-800">{value}</div>
    </div>
  );

  const EarCard = ({ side, ear }: { side: 'Right' | 'Left'; ear: typeof diagnosis.right }) => (
    <div
      className={[
        'rounded-2xl border p-5',
        side === 'Right' ? 'border-brand-200 bg-brand-50/40' : 'border-red-200 bg-red-50/40',
      ].join(' ')}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ear className={side === 'Right' ? 'h-5 w-5 text-brand-600' : 'h-5 w-5 -scale-x-100 text-red-600'} />
          <h4 className="font-display text-sm font-bold text-ink-900">{side} Ear</h4>
        </div>
        <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${DEGREE_COLOR[ear.degree]}`}>
          {ear.degree}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <div className="flex justify-between border-b border-dashed border-ink-200 pb-1.5">
          <span className="text-ink-500">PTA</span>
          <span className="font-semibold text-ink-800">{ear.pta} dB HL</span>
        </div>
        <div className="flex justify-between border-b border-dashed border-ink-200 pb-1.5">
          <span className="text-ink-500">Configuration</span>
          <span className="font-semibold text-ink-800">{ear.configuration}</span>
        </div>
        <div className="flex justify-between border-b border-dashed border-ink-200 pb-1.5">
          <span className="text-ink-500">Worst</span>
          <span className="font-semibold text-ink-800">
            {ear.worst ? `${ear.worst.freq} Hz · ${ear.worst.db} dB` : '—'}
          </span>
        </div>
        <div className="flex justify-between border-b border-dashed border-ink-200 pb-1.5">
          <span className="text-ink-500">4 kHz notch</span>
          <span className={`font-semibold ${ear.noiseNotch ? 'text-red-600' : 'text-emerald-600'}`}>
            {ear.noiseNotch ? 'Present' : 'Absent'}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl px-5 pb-24 pt-8 sm:px-8">
      {/* report header */}
      <div className="mb-6 animate-fade-in flex flex-col gap-4 rounded-2xl border border-ink-200 bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
            <FileText className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-display text-xl font-bold text-ink-900 sm:text-2xl">Clinical Report</h1>
            <p className="text-xs text-ink-500">
              Report #{patient.patientId || '—'} · Generated {fmtDate(diagnosis.generatedAt)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => downloadReportPdf(patient, audiogram, diagnosis)}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-700 active:scale-[0.98]"
          >
            <Download className="h-4 w-4" /> Download PDF
          </button>
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:border-ink-300"
          >
            <RotateCcw className="h-4 w-4" /> New Diagnosis
          </button>
          <button
            onClick={onHome}
            className="inline-flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:border-ink-300"
          >
            <Home className="h-4 w-4" /> Home
          </button>
        </div>
      </div>

      {/* classification banner */}
      <div className="mb-6 animate-fade-in overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-600 to-brand-700 p-6 text-white shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-100">
              <Sparkles className="h-3.5 w-3.5" /> AI Classification
            </div>
            <h2 className="mt-1.5 font-display text-2xl font-extrabold sm:text-3xl">
              {diagnosis.overall.classification}
            </h2>
            <p className="mt-1 text-sm text-brand-100">
              {diagnosis.overall.bilateral ? 'Both ears affected' : 'One ear primarily affected'}
              {diagnosis.overall.asymmetry ? ' · significant interaural asymmetry' : ''}
            </p>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <div className="font-display text-3xl font-extrabold">{diagnosis.severityScore}</div>
              <div className="text-[11px] uppercase tracking-wide text-brand-100">Severity / 100</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl font-extrabold">{diagnosis.confidence}%</div>
              <div className="text-[11px] uppercase tracking-wide text-brand-100">Confidence</div>
            </div>
          </div>
        </div>
      </div>

      {/* audiogram pattern classification */}
      <section className="mb-6 animate-fade-in overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-5">
          <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-start sm:gap-2">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <AudioWaveform className="h-6 w-6" />
            </span>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                Audiogram Pattern
              </div>
              <div className="font-display text-lg font-bold text-ink-900">
                {diagnosis.pattern.pattern}
              </div>
            </div>
          </div>
          <div className="h-px w-full bg-ink-100 sm:h-12 sm:w-px" />
          <p className="flex-1 text-sm leading-relaxed text-ink-600">
            {diagnosis.pattern.explanation}
          </p>
        </div>
      </section>

      {/* hearing disability estimation */}
      <section className="mb-6 animate-fade-in overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card">
        <div className="flex items-center gap-3 border-b border-ink-100 px-5 py-4">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600">
            <Percent className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display text-base font-bold text-ink-900">
              Hearing Disability Estimation
            </h3>
            <p className="text-xs text-ink-400">
              PTA-based clinical percentage (AAO standard)
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-px bg-ink-100 sm:grid-cols-3">
          <div className="flex flex-col gap-1 bg-white p-5">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
              Right Ear Disability
            </span>
            <span className="font-display text-3xl font-extrabold text-brand-600">
              {diagnosis.disability.rightEar}%
            </span>
            <span className="text-xs text-ink-400">Monaural impairment</span>
          </div>
          <div className="flex flex-col gap-1 bg-white p-5">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
              Left Ear Disability
            </span>
            <span className="font-display text-3xl font-extrabold text-brand-600">
              {diagnosis.disability.leftEar}%
            </span>
            <span className="text-xs text-ink-400">Monaural impairment</span>
          </div>
          <div className="flex flex-col gap-1 bg-white p-5">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
              Overall Binaural Disability
            </span>
            <span className="font-display text-3xl font-extrabold text-ink-900">
              {diagnosis.disability.binaural}%
            </span>
            <span className="text-xs text-ink-400">
              Weighted: 5 × better + worse ÷ 6
            </span>
          </div>
        </div>
        <div className="border-t border-ink-100 bg-ink-50/60 px-5 py-3">
          <p className="text-xs leading-relaxed text-ink-400">
            The first 25 dB HL is treated as within normal range; each dB above
            25 contributes 1.5% per ear (capped at 100%).
          </p>
        </div>
      </section>

      {/* patient details */}
      <section className="mb-6 animate-fade-in">
        <SectionTitle icon={User} title="Patient Details" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <PatientField icon={User} label="Name" value={patient.name || '—'} />
          <PatientField icon={Hash} label="Age" value={patient.age ? `${patient.age} yrs` : '—'} />
          <PatientField icon={Users} label="Gender" value={cap(patient.gender)} />
          <PatientField icon={Hash} label="Patient ID" value={patient.patientId || '—'} />
          <PatientField icon={Calendar} label="Test Date" value={patient.testDate || '—'} />
        </div>
      </section>

      {/* audiogram */}
      <section className="mb-6 animate-fade-in rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
        <SectionTitle icon={Ear} title="Audiogram" inline />
        <AudiogramChart audiogram={audiogram} />
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-200">
                <th className="py-2 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">Ear</th>
                {FREQUENCIES.map((f) => (
                  <th key={f} className="py-2 text-center text-xs font-semibold text-ink-600">
                    {f < 1000 ? `${f}` : `${f / 1000}k`} Hz
                  </th>
                ))}
                <th className="py-2 text-center text-xs font-semibold uppercase text-ink-500">PTA</th>
              </tr>
            </thead>
            <tbody>
              {([
                { side: 'Right', ear: audiogram.right, pta: diagnosis.right.pta, color: 'text-brand-600' },
                { side: 'Left', ear: audiogram.left, pta: diagnosis.left.pta, color: 'text-red-600' },
              ] as const).map((row) => (
                <tr key={row.side} className="border-b border-ink-100 last:border-0">
                  <td className={`py-2.5 text-left text-sm font-bold ${row.color}`}>{row.side}</td>
                  {FREQUENCIES.map((f) => (
                    <td key={f} className="py-2.5 text-center font-semibold text-ink-800">
                      {row.ear[f]}
                    </td>
                  ))}
                  <td className="py-2.5 text-center font-bold text-ink-900">{row.pta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* per-ear analysis */}
      <section className="mb-6 animate-fade-in">
        <SectionTitle icon={BrainCircuit} title="Per-Ear Analysis" />
        <div className="grid gap-4 sm:grid-cols-2">
          <EarCard side="Right" ear={diagnosis.right} />
          <EarCard side="Left" ear={diagnosis.left} />
        </div>
      </section>

      {/* severity gauge */}
      <section className="mb-6 animate-fade-in rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
        <div className="mb-3 flex items-center justify-between">
          <SectionTitle icon={Stethoscope} title="Severity Assessment" inline />
          <span className={`font-display text-lg font-bold ${sevColor}`}>{diagnosis.severityScore}/100</span>
        </div>
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-gradient-to-r from-emerald-400 via-yellow-400 via-orange-500 to-red-600">
          <div
            className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-white bg-ink-800 shadow-md transition-all duration-700"
            style={{ left: `calc(${diagnosis.severityScore}% - 10px)` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-wide text-ink-400">
          <span>Normal</span>
          <span>Mild</span>
          <span>Moderate</span>
          <span>Severe</span>
          <span>Profound</span>
        </div>
      </section>

      {/* findings */}
      <section className="mb-6 animate-fade-in rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
        <SectionTitle icon={Info} title="AI-Generated Findings" inline />
        <ul className="space-y-3">
          {diagnosis.findings.map((f, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-700">
              <span className="mt-1.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-600">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* recommendations */}
      <section className="mb-6 animate-fade-in rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
        <SectionTitle icon={CheckCircle2} title="Clinical Recommendations" inline />
        <ul className="space-y-3">
          {diagnosis.recommendations.map((r, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-700">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* disclaimer */}
      <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 animate-fade-in">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
        <p className="text-xs leading-relaxed text-amber-800">
          <strong>Clinical disclaimer:</strong> This report was generated by an AI-based prediction
          model for clinical decision support only. It is not a substitute for evaluation by a
          licensed audiologist or physician. All findings must be corroborated with comprehensive
          audiological assessment before treatment decisions are made.
        </p>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-7 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-700"
        >
          <RotateCcw className="h-4 w-4" /> Start New Diagnosis
        </button>
        <button
          onClick={onHome}
          className="inline-flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-7 py-3 text-sm font-semibold text-ink-700 transition hover:border-ink-300"
        >
          <Home className="h-4 w-4" /> Home
        </button>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, inline }: { icon: typeof User; title: string; inline?: boolean }) {
  return (
    <div className={inline ? 'mb-3 flex items-center gap-2' : 'mb-3 flex items-center gap-2'}>
      <Icon className="h-4 w-4 text-brand-600" />
      <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink-700">{title}</h3>
    </div>
  );
}
