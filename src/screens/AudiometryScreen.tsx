import { Ear, Headphones, RotateCcw, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { AudiogramData, EarThresholds, Frequency } from '@/types';
import { FREQUENCIES } from '@/types';
import { AudiogramChart } from '@/components/AudiogramChart';

const NORMAL_DEFAULT: EarThresholds = { 250: 10, 500: 10, 1000: 10, 2000: 15, 4000: 20, 8000: 20 };
const EMPTY: EarThresholds = { 250: 0, 500: 0, 1000: 0, 2000: 0, 4000: 0, 8000: 0 };

const DEGREE_HINTS = [
  { max: 25, label: 'Normal', color: 'text-emerald-600' },
  { max: 40, label: 'Mild', color: 'text-yellow-600' },
  { max: 55, label: 'Moderate', color: 'text-orange-600' },
  { max: 70, label: 'Mod. Severe', color: 'text-orange-700' },
  { max: 90, label: 'Severe', color: 'text-red-600' },
  { max: 130, label: 'Profound', color: 'text-red-800' },
];

const degreeFor = (db: number) => DEGREE_HINTS.find((d) => db <= d.max) ?? DEGREE_HINTS[0];

interface Props {
  initial: AudiogramData;
  onNext: (data: AudiogramData) => void;
  onBack: () => void;
}

export function AudiometryScreen({ initial, onNext, onBack }: Props) {
  const [data, setData] = useState<AudiogramData>(initial);
  const [touched, setTouched] = useState(false);

  const allFilled = useMemo(
    () =>
      FREQUENCIES.every(
        (f) => data.right[f] !== undefined && data.left[f] !== undefined,
      ),
    [data],
  );

  const setVal = (ear: 'left' | 'right', freq: Frequency, raw: string) => {
    const n = raw === '' ? 0 : Math.max(0, Math.min(120, Number(raw)));
    setData((d) => ({ ...d, [ear]: { ...d[ear], [freq]: n } }));
  };

  const fillNormal = () =>
    setData({ left: { ...NORMAL_DEFAULT }, right: { ...NORMAL_DEFAULT } });
  const reset = () => setData({ left: { ...EMPTY }, right: { ...EMPTY } });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (allFilled) onNext(data);
  };

  const ThresholdRow = ({
    ear,
    side,
    color,
    bg,
  }: {
    ear: 'right' | 'left';
    side: string;
    color: string;
    bg: string;
  }) => (
    <div className="rounded-2xl border border-ink-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className={`grid h-9 w-9 place-items-center rounded-xl ${bg} ${color}`}>
            {ear === 'right' ? <Ear className="h-5 w-5" /> : <Ear className="h-5 w-5 -scale-x-100" />}
          </span>
          <div>
            <h3 className="font-display text-sm font-bold text-ink-900">{side} Ear</h3>
            <p className="text-[11px] text-ink-500">Air conduction thresholds</p>
          </div>
        </div>
        {(() => {
          const pta = Math.round((data[ear][500] + data[ear][1000] + data[ear][2000]) / 3);
          const d = degreeFor(pta);
          return (
            <div className="text-right">
              <div className={`font-display text-sm font-bold ${d.color}`}>{d.label}</div>
              <div className="text-[11px] text-ink-500">PTA {pta} dB</div>
            </div>
          );
        })()}
      </div>

      <div className="grid grid-cols-6 gap-2 sm:gap-3">
        {FREQUENCIES.map((f) => {
          const v = data[ear][f];
          const d = degreeFor(v);
          return (
            <div key={f} className="text-center">
              <label className="mb-1 block text-[11px] font-semibold text-ink-500">
                {f < 1000 ? `${f}` : `${f / 1000}k`}
                <span className="hidden sm:inline"> Hz</span>
              </label>
              <input
                type="number"
                min={0}
                max={120}
                value={v === 0 && !touched ? '' : v}
                placeholder="0"
                onChange={(e) => setVal(ear, f, e.target.value)}
                onFocus={() => setTouched(true)}
                className="w-full rounded-lg border border-ink-200 bg-white px-1 py-2 text-center text-sm font-semibold text-ink-800 transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
              />
              <span className={`mt-1 block text-[9px] font-bold ${d.color}`}>{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <form onSubmit={submit} className="mx-auto max-w-5xl px-5 pb-24 pt-8 sm:px-8">
      <div className="mb-6 animate-fade-in">
        <h1 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">
          Pure Tone Audiometry
        </h1>
        <p className="mt-2 text-ink-600">
          Enter air-conduction hearing thresholds in dB HL for both ears across six standard
          frequencies. The audiogram updates live.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-100 bg-brand-50/60 p-3.5 animate-fade-in">
        <div className="flex items-center gap-2 text-sm text-ink-600">
          <Headphones className="h-4 w-4 text-brand-600" />
          <span>Reference: 0–25 dB = Normal · 26–40 Mild · 41–55 Moderate · 56–70 Mod. Severe · 71–90 Severe · 90+ Profound</span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={fillNormal}
            className="rounded-lg border border-brand-200 bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            Fill Normal
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-600 transition hover:border-ink-300"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>
      </div>

      <div className="grid gap-5 animate-fade-in lg:grid-cols-2">
        <ThresholdRow ear="right" side="Right" color="text-brand-600" bg="bg-brand-50" />
        <ThresholdRow ear="left" side="Left" color="text-red-600" bg="bg-red-50" />
      </div>

      <div className="mt-6 animate-fade-in rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
        <h3 className="mb-1 font-display text-sm font-bold text-ink-900">Live Audiogram</h3>
        <p className="mb-4 text-xs text-ink-500">
          Standard clinical plot — dB HL (inverted) vs frequency. Blue = Right, Red = Left.
        </p>
        <AudiogramChart audiogram={data} />
      </div>

      {touched && !allFilled && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          Please enter a threshold value (0–120 dB) for all six frequencies in both ears.
        </p>
      )}

      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-ink-200 bg-white px-6 py-3 text-sm font-semibold text-ink-700 transition hover:border-ink-300"
        >
          Back
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-7 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-700 active:scale-[0.98]"
        >
          <Sparkles className="h-4 w-4" /> Run AI Analysis
        </button>
      </div>
    </form>
  );
}
