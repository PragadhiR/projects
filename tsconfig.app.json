import { BrainCircuit, CheckCircle2, Cpu, Ear, Waves } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ANALYSIS_STEPS } from '@/lib/diagnosis';

export function AnalysisScreen({ onComplete }: { onComplete: () => void }) {
  const [active, setActive] = useState(0);
  const total = ANALYSIS_STEPS.length;

  useEffect(() => {
    if (active >= total) {
      const t = setTimeout(onComplete, 700);
      return () => clearTimeout(t);
    }
    const delay = active === 0 ? 500 : 950 + Math.random() * 500;
    const t = setTimeout(() => setActive((a) => a + 1), delay);
    return () => clearTimeout(t);
  }, [active, total, onComplete]);

  const progress = Math.min(100, Math.round((active / total) * 100));
  const ekgBars = [14, 22, 30, 18, 36, 26, 40, 20, 32, 24, 38, 16, 28, 22, 34];

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-5 pb-24 pt-12 sm:px-8">
      <div className="relative mb-8 animate-fade-in-scale">
        {/* pulsing rings */}
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-400/40" />
        <span
          className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-300/40"
          style={{ animationDelay: '0.8s' }}
        />
        <span
          className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-200/40"
          style={{ animationDelay: '1.6s' }}
        />
        <div className="relative grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
          <BrainCircuit className="h-12 w-12" strokeWidth={1.8} />
        </div>
      </div>

      <h1 className="animate-fade-in text-center font-display text-2xl font-bold text-ink-900 sm:text-3xl">
        AI Analysis in Progress
      </h1>
      <p className="mt-2 animate-fade-in text-center text-ink-600">
        The neural audiometric model is evaluating thresholds against clinical criteria.
      </p>

      {/* EKG / waveform animation */}
      <div className="mt-8 flex h-14 items-end justify-center gap-1.5">
        {ekgBars.map((h, i) => (
          <span
            key={i}
            className="w-1.5 animate-wave rounded-full bg-gradient-to-t from-brand-400 to-brand-600"
            style={{ height: `${h}px`, animationDelay: `${i * 70}ms` }}
          />
        ))}
      </div>

      {/* overall progress bar */}
      <div className="mt-8 w-full max-w-md animate-fade-in">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold text-ink-700">Overall progress</span>
          <span className="font-display font-bold text-brand-600">{progress}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink-100">
          <div
            className="relative h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          >
            <span className="absolute inset-0 -translate-x-full animate-shimmer bg-white/30" />
          </div>
        </div>
      </div>

      {/* step list */}
      <div className="mt-8 w-full max-w-md animate-fade-in space-y-2.5">
        {ANALYSIS_STEPS.map((step, i) => {
          const done = i < active;
          const running = i === active;
          return (
            <div
              key={step.label}
              className={[
                'flex items-start gap-3 rounded-xl border p-3.5 transition-all duration-300',
                done
                  ? 'border-emerald-200 bg-emerald-50/50'
                  : running
                    ? 'border-brand-300 bg-brand-50 shadow-sm'
                    : 'border-ink-200 bg-white opacity-60',
              ].join(' ')}
            >
              <span className="mt-0.5 shrink-0">
                {done ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : running ? (
                  <Cpu className="h-5 w-5 animate-pulse text-brand-600" />
                ) : (
                  <span className="grid h-5 w-5 place-items-center rounded-full border-2 border-ink-300 text-[10px] font-bold text-ink-400">
                    {i + 1}
                  </span>
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={[
                    'text-sm font-semibold',
                    done ? 'text-emerald-700' : running ? 'text-brand-700' : 'text-ink-600',
                  ].join(' ')}
                >
                  {step.label}
                </p>
                <p className="text-xs text-ink-500">{step.detail}</p>
              </div>
              {running && (
                <span className="flex gap-1">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-500"
                      style={{ animationDelay: `${d * 150}ms` }}
                    />
                  ))}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center gap-2 text-xs font-medium text-ink-400">
        <Waves className="h-3.5 w-3.5" />
        <Ear className="h-3.5 w-3.5" />
        <span>Model v2.4 · ASHA / WHO criteria · 250–8000 Hz</span>
      </div>
    </div>
  );
}
