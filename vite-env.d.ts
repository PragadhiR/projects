import { Activity } from 'lucide-react';

export function AppHeader({ onHome }: { onHome: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-200/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <button
          onClick={onHome}
          className="group flex items-center gap-3 rounded-xl px-1.5 py-1 transition"
          aria-label="Go to home"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-glow transition group-hover:scale-105">
            <Activity className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="text-left leading-tight">
            <span className="block font-display text-[15px] font-bold text-ink-900">
              AI Audiometry
            </span>
            <span className="block text-[11px] font-medium tracking-wide text-ink-500">
              Diagnosis Predictor
            </span>
          </span>
        </button>

        <div className="hidden items-center gap-2 rounded-full border border-ink-200 bg-ink-50 px-3.5 py-1.5 sm:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs font-medium text-ink-600">Model Online · v2.4</span>
        </div>
      </div>
    </header>
  );
}
