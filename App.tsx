import type { AudiogramData, BCFrequency } from '@/types';
import { BC_FREQUENCIES, FREQUENCIES } from '@/types';
import { isMaskingRequired } from '@/lib/masking';

// Standard clinical audiogram: Y axis inverted (0 dB at top, 110 at bottom).
// Right ear = blue circles, Left ear = red X marks — international convention.
const Y_TOP = 0;
const Y_BOTTOM = 110;
const CHART_H = 280;
const CHART_W = 520;
const PAD_L = 46;
const PAD_R = 18;
const PAD_T = 18;
const PAD_B = 36;
const PLOT_W = CHART_W - PAD_L - PAD_R;
const PLOT_H = CHART_H - PAD_T - PAD_B;

const dbTicks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110];

const xFor = (i: number) => PAD_L + (PLOT_W * i) / (FREQUENCIES.length - 1);
const yFor = (db: number) =>
  PAD_T + (PLOT_H * (Math.min(Math.max(db, Y_TOP), Y_BOTTOM) - Y_TOP)) / (Y_BOTTOM - Y_TOP);

const DbGridLines = () => (
  <>
    {dbTicks.map((db) => (
      <line
        key={db}
        x1={PAD_L}
        x2={CHART_W - PAD_R}
        y1={yFor(db)}
        y2={yFor(db)}
        stroke={db === 25 ? '#94a3b8' : '#e2e8f0'}
        strokeWidth={db === 25 ? 1 : 0.6}
        strokeDasharray={db === 25 ? '4 4' : undefined}
      />
    ))}
  </>
);

const FreqLabels = () => (
  <>
    {FREQUENCIES.map((f, i) => (
      <text
        key={f}
        x={xFor(i)}
        y={CHART_H - PAD_B + 16}
        textAnchor="middle"
        className="fill-ink-600"
        style={{ fontSize: 10, fontWeight: 600 }}
      >
        {f < 1000 ? `${f}` : `${f / 1000}k`}
      </text>
    ))}
    <text
      x={PAD_L + PLOT_W / 2}
      y={CHART_H - 4}
      textAnchor="middle"
      className="fill-ink-500"
      style={{ fontSize: 10, fontWeight: 600 }}
    >
      Frequency (Hz)
    </text>
  </>
);

const DbLabels = () => (
  <>
    {dbTicks.filter((d) => d % 20 === 0).map((db) => (
      <text
        key={db}
        x={PAD_L - 8}
        y={yFor(db) + 3}
        textAnchor="end"
        className="fill-ink-500"
        style={{ fontSize: 9, fontWeight: 600 }}
      >
        {db}
      </text>
    ))}
    <text
      x={12}
      y={PAD_T + PLOT_H / 2}
      textAnchor="middle"
      className="fill-ink-500"
      transform={`rotate(-90 12 ${PAD_T + PLOT_H / 2})`}
      style={{ fontSize: 10, fontWeight: 600 }}
    >
      Hearing Level (dB HL)
    </text>
  </>
);

const EarLine = ({ ear, color }: { ear: Record<number, number>; color: string }) => (
  <>
    <polyline
      points={FREQUENCIES.map((f, i) => `${xFor(i)},${yFor(ear[f])}`).join(' ')}
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    {FREQUENCIES.map((f, i) => (
      <circle key={f} cx={xFor(i)} cy={yFor(ear[f])} r={5.5} fill={color} stroke="#fff" strokeWidth={1.5} />
    ))}
  </>
);

const EarLineLeft = ({ ear, color }: { ear: Record<number, number>; color: string }) => (
  <>
    <polyline
      points={FREQUENCIES.map((f, i) => `${xFor(i)},${yFor(ear[f])}`).join(' ')}
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    {FREQUENCIES.map((f, i) => (
      <g key={f}>
        <line
          x1={xFor(i) - 5}
          y1={yFor(ear[f]) - 5}
          x2={xFor(i) + 5}
          y2={yFor(ear[f]) + 5}
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <line
          x1={xFor(i) - 5}
          y1={yFor(ear[f]) + 5}
          x2={xFor(i) + 5}
          y2={yFor(ear[f]) - 5}
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      </g>
    ))}
  </>
);

// Standard clinical BC symbols: right ear "<", left ear ">" (unmasked); the
// bracket-style "[" / "]" variant conventionally signals masking. We reuse
// that convention here to flag frequencies where masking is indicated, since
// this tool doesn't distinguish "was masked" from "should be masked" —
// both cases mean "don't take this reading at face value."
const BCMarker = ({
  ear,
  acEar,
  color,
  side,
}: {
  ear: Record<BCFrequency, number>;
  acEar: Record<number, number>;
  color: string;
  side: 'left' | 'right';
}) => (
  <>
    {BC_FREQUENCIES.map((f) => {
      const i = FREQUENCIES.indexOf(f as (typeof FREQUENCIES)[number]);
      const x = xFor(i);
      const y = yFor(ear[f]);
      const masked = isMaskingRequired(acEar[f], ear[f]);
      const w = 5;

      if (masked) {
        // Bracket: "[" for right ear, "]" for left ear
        const openLeft = side === 'right';
        return (
          <polyline
            key={f}
            points={
              openLeft
                ? `${x + w},${y - w} ${x - w},${y - w} ${x - w},${y + w} ${x + w},${y + w}`
                : `${x - w},${y - w} ${x + w},${y - w} ${x + w},${y + w} ${x - w},${y + w}`
            }
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      }

      // Angle: "<" for right ear, ">" for left ear
      const pointsLeft = side === 'right';
      return (
        <polyline
          key={f}
          points={
            pointsLeft
              ? `${x + w},${y - w} ${x - w},${y} ${x + w},${y + w}`
              : `${x - w},${y - w} ${x + w},${y} ${x - w},${y + w}`
          }
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    })}
  </>
);

const hasBcData = (t?: Record<BCFrequency, number>) =>
  !!t && BC_FREQUENCIES.some((f) => t[f] !== undefined);

export function AudiogramChart({ audiogram }: { audiogram: AudiogramData }) {
  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        className="mx-auto block w-full max-w-[560px]"
        role="img"
        aria-label="Pure tone audiogram showing right and left ear thresholds"
      >
        <rect x={PAD_L} y={PAD_T} width={PLOT_W} height={PLOT_H} fill="#f8fafc" rx={6} />
        <DbGridLines />
        {FREQUENCIES.map((_, i) =>
          i === 0 ? null : (
            <line
              key={i}
              x1={xFor(i)}
              x2={xFor(i)}
              y1={PAD_T}
              y2={PAD_T + PLOT_H}
              stroke="#e2e8f0"
              strokeWidth={0.6}
            />
          ),
        )}
        <DbLabels />
        <FreqLabels />
        <EarLine ear={audiogram.right} color="#1d72f1" />
        <EarLineLeft ear={audiogram.left} color="#dc2626" />
        {hasBcData(audiogram.boneRight) && (
          <BCMarker ear={audiogram.boneRight} acEar={audiogram.right} color="#1d72f1" side="right" />
        )}
        {hasBcData(audiogram.boneLeft) && (
          <BCMarker ear={audiogram.boneLeft} acEar={audiogram.left} color="#dc2626" side="left" />
        )}
      </svg>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 text-xs font-medium text-ink-600">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-brand-600" /> Right Ear (AC)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="relative inline-block h-3 w-3 text-red-600">
            <span className="absolute inset-0 rotate-45 border-x-2 border-red-600" />
          </span>
          Left Ear (AC)
        </span>
        {(hasBcData(audiogram.boneRight) || hasBcData(audiogram.boneLeft)) && (
          <>
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-brand-600">&lt;</span> Right (BC)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-red-600">&gt;</span> Left (BC)
            </span>
            <span className="flex items-center gap-1.5 text-ink-400">
              <span className="font-bold">[ ]</span> = masking indicated
            </span>
          </>
        )}
      </div>
    </div>
  );
}
