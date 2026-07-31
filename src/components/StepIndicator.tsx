import { Check } from 'lucide-react';
import type { ScreenName } from '@/types';

const STEPS: { key: ScreenName; label: string }[] = [
  { key: 'patient', label: 'Patient' },
  { key: 'audiometry', label: 'Audiometry' },
  { key: 'analysis', label: 'Analysis' },
  { key: 'report', label: 'Report' },
];

const ORDER: ScreenName[] = ['patient', 'audiometry', 'analysis', 'report'];

export function StepIndicator({ current }: { current: ScreenName }) {
  const currentIdx = ORDER.indexOf(current);
  if (currentIdx === -1) return null;

  return (
    <div className="mx-auto flex max-w-md items-center justify-between px-1">
      {STEPS.map((step, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <div key={step.key} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={[
                  'grid h-9 w-9 place-items-center rounded-full border-2 text-sm font-semibold transition-all duration-300',
                  done
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : active
                      ? 'border-brand-600 bg-white text-brand-600 shadow-glow'
                      : 'border-ink-300 bg-white text-ink-400',
                ].join(' ')}
              >
                {done ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
              </div>
              <span
                className={[
                  'text-[11px] font-semibold transition-colors',
                  active || done ? 'text-ink-800' : 'text-ink-400',
                ].join(' ')}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="mx-2 mt-[-18px] h-0.5 flex-1 rounded-full bg-ink-200">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all duration-500"
                  style={{ width: i < currentIdx ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
