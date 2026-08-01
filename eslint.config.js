import {
  Activity,
  ArrowRight,
  BrainCircuit,
  FileText,
  ShieldCheck,
  Stethoscope,
  Waves,
} from 'lucide-react';

const FEATURES = [
  {
    icon: BrainCircuit,
    title: 'AI-Powered Classification',
    body: 'Auditory neural model graded against ASHA & WHO criteria classifies degree, configuration, and laterality from pure-tone thresholds.',
  },
  {
    icon: Waves,
    title: 'Six-Frequency Audiogram',
    body: 'Captures air-conduction thresholds across the full clinical speech and high-frequency band: 250 Hz through 8000 Hz for both ears.',
  },
  {
    icon: FileText,
    title: 'Structured Clinical Report',
    body: 'Auto-narrated findings, severity scoring, and tailored recommendations — exportable as a print-ready PDF for the patient record.',
  },
  {
    icon: ShieldCheck,
    title: 'Clinical Decision Support',
    body: 'Flags noise-notch patterns, presbycusis trends, and interaural asymmetry warranting retrocochlear referral — surfaced in plain language.',
  },
];

const STATS = [
  { value: '6', label: 'Frequencies' },
  { value: '2', label: 'Ears Analyzed' },
  { value: '< 8s', label: 'AI Inference' },
  { value: '6', label: 'Loss Grades' },
];

export function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative overflow-hidden bg-radial-brand">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-brand-100/60 blur-3xl" />

      <section className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex animate-fade-in items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-sm backdrop-blur">
            <Stethoscope className="h-3.5 w-3.5" />
            Clinical Decision Support · Audiology
          </div>
          <h1 className="animate-slide-up font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-ink-900 text-balance sm:text-5xl lg:text-6xl">
            AI-Based Pure Tone Audiometry
            <span className="block bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
              Diagnosis Predictor
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl animate-fade-in text-base leading-relaxed text-ink-600 text-balance sm:text-lg">
            Upload audiometric thresholds and let an AI model classify hearing-loss type,
            severity, and configuration — then generate a structured clinical report with
            findings and evidence-based recommendations in seconds.
          </p>

          <div className="mt-9 flex animate-fade-in flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={onStart}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-8 py-4 text-base font-semibold text-white shadow-glow transition hover:bg-brand-700 hover:shadow-lg active:scale-[0.98] sm:w-auto"
            >
              Start Diagnosis
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </button>
            <a
              href="#features"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-ink-200 bg-white/80 px-8 py-4 text-base font-semibold text-ink-700 backdrop-blur transition hover:border-brand-300 hover:text-brand-700 sm:w-auto"
            >
              How It Works
            </a>
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl animate-fade-in grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-ink-200/70 bg-white/80 p-4 text-center shadow-sm backdrop-blur"
            >
              <div className="font-display text-2xl font-bold text-brand-600">{s.value}</div>
              <div className="mt-1 text-xs font-medium text-ink-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="relative mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">
            Built for modern audiology workflows
          </h2>
          <p className="mt-3 text-ink-600">
            Four capabilities that turn raw thresholds into actionable clinical insight.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-ink-200/70 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-card-lg"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-base font-bold text-ink-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{f.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl border border-brand-100 bg-gradient-to-br from-white to-brand-50/60 p-8 text-center shadow-card sm:p-12">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-white shadow-glow">
            <Activity className="h-7 w-7" strokeWidth={2.5} />
          </div>
          <h3 className="font-display text-xl font-bold text-ink-900 sm:text-2xl">
            Ready to run your first audiogram?
          </h3>
          <p className="max-w-xl text-ink-600">
            The full workflow takes under a minute — enter patient details, input six
            bilateral thresholds, and receive a complete AI-generated report.
          </p>
          <button
            onClick={onStart}
            className="group mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-8 py-3.5 text-base font-semibold text-white shadow-glow transition hover:bg-brand-700 active:scale-[0.98]"
          >
            Start Diagnosis
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      <footer className="relative border-t border-ink-200/70 bg-white/60 py-6 backdrop-blur">
        <div className="mx-auto max-w-6xl px-5 text-center text-xs text-ink-500 sm:px-8">
          AI-Based Pure Tone Audiometry Diagnosis Predictor · Clinical decision support tool ·
          Not a substitute for evaluation by a licensed audiologist.
        </div>
      </footer>
    </div>
  );
}
