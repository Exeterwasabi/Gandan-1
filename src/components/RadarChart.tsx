import {useState} from 'react';
import {RadarStats} from '../types/gundam';

interface RadarChartProps {
  primaryStats: RadarStats;
  primaryLabel: string;
  secondaryStats?: RadarStats;
  secondaryLabel?: string;
}

const AXES: {key: keyof RadarStats; label: string}[] = [
  {key: 'firepower', label: '火力'},
  {key: 'mobility', label: '機動'},
  {key: 'thrust', label: '推力'},
  {key: 'sensor', label: '感測'},
  {key: 'versatility', label: '汎用'},
  {key: 'armor', label: '裝甲'},
];

const CENTER_X = 160;
const CENTER_Y = 145;
const RADIUS = 94;

function getPoint(index: number, value: number): {x: number; y: number} {
  const angle = (Math.PI * 2 * index) / AXES.length - Math.PI / 2;
  const r = (value / 100) * RADIUS;
  return {
    x: CENTER_X + r * Math.cos(angle),
    y: CENTER_Y + r * Math.sin(angle),
  };
}

function buildPolygonPoints(stats: RadarStats): string {
  return AXES.map((axis, idx) => {
    const pt = getPoint(idx, stats[axis.key]);
    return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
  }).join(' ');
}

export function RadarChart({
  primaryStats,
  primaryLabel,
  secondaryStats,
  secondaryLabel,
}: RadarChartProps) {
  const [hoveredAxis, setHoveredAxis] = useState<keyof RadarStats | null>(null);

  const rings = [25, 50, 75, 100];

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 320 290"
        className="w-full max-w-[320px] select-none overflow-visible"
        role="img"
        aria-label={`${primaryLabel} 六維性能雷達圖`}
      >
        {/* Concentric grid polygons */}
        {rings.map((level) => {
          const pts = AXES.map((_, idx) => {
            const pt = getPoint(idx, level);
            return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
          }).join(' ');
          return (
            <polygon
              key={level}
              points={pts}
              fill="none"
              stroke="rgba(148, 163, 184, 0.16)"
              strokeWidth={level === 100 ? '1.2' : '0.8'}
              strokeDasharray={level === 50 ? '3 3' : undefined}
            />
          );
        })}

        {/* Radial axes lines */}
        {AXES.map((axis, idx) => {
          const outer = getPoint(idx, 100);
          const labelPt = getPoint(idx, 122);
          const isHovered = hoveredAxis === axis.key;

          return (
            <g key={axis.key}>
              <line
                x1={CENTER_X}
                y1={CENTER_Y}
                x2={outer.x}
                y2={outer.y}
                stroke={isHovered ? 'rgba(6, 182, 212, 0.5)' : 'rgba(148, 163, 184, 0.16)'}
                strokeWidth="1"
              />
              <text
                x={labelPt.x}
                y={labelPt.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`text-[11px] font-medium transition-colors ${
                  isHovered ? 'fill-cyan-300' : 'fill-slate-400'
                }`}
              >
                {axis.label}
              </text>
            </g>
          );
        })}

        {/* Scale numbers along top axis */}
        {[50, 100].map((val) => {
          const pt = getPoint(0, val);
          return (
            <text
              key={val}
              x={pt.x + 5}
              y={pt.y + 3}
              className="fill-slate-500 font-mono text-[9px] tabular-nums"
            >
              {val}
            </text>
          );
        })}

        {/* Secondary polygon (Comparison Unit B - Amber) */}
        {secondaryStats && (
          <polygon
            points={buildPolygonPoints(secondaryStats)}
            fill="rgba(245, 158, 11, 0.16)"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        )}

        {/* Primary polygon (Unit A - Cyan) */}
        <polygon
          points={buildPolygonPoints(primaryStats)}
          fill="rgba(6, 182, 212, 0.22)"
          stroke="#06B6D4"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Interactive vertices */}
        {AXES.map((axis, idx) => {
          const primaryPt = getPoint(idx, primaryStats[axis.key]);
          const secondaryPt = secondaryStats
            ? getPoint(idx, secondaryStats[axis.key])
            : null;
          const isHovered = hoveredAxis === axis.key;

          return (
            <g
              key={axis.key}
              onMouseEnter={() => setHoveredAxis(axis.key)}
              onMouseLeave={() => setHoveredAxis(null)}
              className="cursor-crosshair"
            >
              {/* Invisible generous hit target */}
              <circle
                cx={primaryPt.x}
                cy={primaryPt.y}
                r={14}
                fill="transparent"
              />
              {secondaryPt && (
                <circle
                  cx={secondaryPt.x}
                  cy={secondaryPt.y}
                  r={isHovered ? 5 : 3.5}
                  fill="#F59E0B"
                  stroke="#070A10"
                  strokeWidth="1.5"
                />
              )}
              <circle
                cx={primaryPt.x}
                cy={primaryPt.y}
                r={isHovered ? 5 : 3.5}
                fill="#06B6D4"
                stroke="#070A10"
                strokeWidth="1.5"
              />
            </g>
          );
        })}
      </svg>

      {/* Compact Tabular Readout Strip */}
      <div className="mt-1 grid w-full grid-cols-3 gap-x-3 gap-y-2 border-t border-slate-800/80 pt-3">
        {AXES.map((axis) => {
          const valA = primaryStats[axis.key];
          const valB = secondaryStats ? secondaryStats[axis.key] : null;
          const isHovered = hoveredAxis === axis.key;

          return (
            <div
              key={axis.key}
              onMouseEnter={() => setHoveredAxis(axis.key)}
              onMouseLeave={() => setHoveredAxis(null)}
              className={`flex items-baseline justify-between rounded px-1.5 py-1 transition-colors ${
                isHovered ? 'bg-slate-800/70' : ''
              }`}
            >
              <span className="text-xs text-slate-400">{axis.label}</span>
              <span className="font-mono text-xs font-semibold tabular-nums">
                <span className="text-cyan-300">{valA}</span>
                {valB !== null && (
                  <span className="text-slate-500">
                    {' / '}
                    <span className="text-amber-400">{valB}</span>
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend when comparing two units */}
      {secondaryStats && secondaryLabel && (
        <div className="mt-2.5 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-3 bg-cyan-400/80" aria-hidden="true" />
            <span>{primaryLabel}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-3 bg-amber-400/80" aria-hidden="true" />
            <span>{secondaryLabel}</span>
          </span>
        </div>
      )}
    </div>
  );
}
