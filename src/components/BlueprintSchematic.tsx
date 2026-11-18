import {BlueprintArchetype, SubsystemPoint} from '../types/gundam';

interface BlueprintSchematicProps {
  archetype: BlueprintArchetype;
  modelCode: string;
  headHeightM: number;
  subsystems: SubsystemPoint[];
  selectedSubsystemId: SubsystemPoint['id'];
  onSelectSubsystem: (id: SubsystemPoint['id']) => void;
  compact?: boolean;
}

export function BlueprintSchematic({
  archetype,
  modelCode,
  headHeightM,
  subsystems,
  selectedSubsystemId,
  onSelectSubsystem,
  compact = false,
}: BlueprintSchematicProps) {
  const isMonoEye = archetype === 'zaku' || archetype === 'gouf' || archetype === 'sazabi';
  const hasWings =
    archetype === 'zeta' ||
    archetype === 'freedom' ||
    archetype === 'wing' ||
    archetype === 'unicorn';
  const hasFinFunnels = archetype === 'nu';
  const isHeavy = archetype === 'sazabi' || archetype === 'zaku' || archetype === 'gouf';
  const hasExposedWaist = archetype === 'barbatos';

  const strokePrimary = isMonoEye ? '#F87171' : '#22D3EE';
  const strokeSecondary = isMonoEye ? 'rgba(248, 113, 113, 0.35)' : 'rgba(34, 211, 238, 0.35)';

  return (
    <div className="relative h-full w-full overflow-hidden hud-blueprint-bg">
      {/* Height measurement scale on left edge */}
      {!compact && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-4 left-3 flex flex-col justify-between font-mono text-[10px] text-cyan-400/60 tabular-nums"
        >
          <span>{headHeightM.toFixed(1)}m</span>
          <span>{(headHeightM * 0.75).toFixed(1)}m</span>
          <span>{(headHeightM * 0.5).toFixed(1)}m</span>
          <span>{(headHeightM * 0.25).toFixed(1)}m</span>
          <span>0.0m</span>
        </div>
      )}

      {/* Model watermark coordinate in top-right (purposeful spec label) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-3 font-mono text-[11px] tracking-wider text-slate-400/80"
      >
        {modelCode} // SCHEMATIC
      </div>

      {/* Mechanical Vector Silhouette */}
      <svg
        viewBox="0 0 400 300"
        className="h-full w-full"
        role="img"
        aria-label={`${modelCode} 工程藍圖視圖`}
      >
        {/* Axis & Calibration Reticle */}
        <line
          x1="200"
          y1="14"
          x2="200"
          y2="286"
          stroke={strokeSecondary}
          strokeDasharray="4 4"
          strokeWidth="0.9"
        />
        <line
          x1="40"
          y1="150"
          x2="360"
          y2="150"
          stroke={strokeSecondary}
          strokeDasharray="4 4"
          strokeWidth="0.9"
        />
        <circle
          cx="200"
          cy="145"
          r="92"
          fill="none"
          stroke="rgba(148, 163, 184, 0.14)"
          strokeWidth="0.8"
        />
        <circle
          cx="200"
          cy="145"
          r="62"
          fill="none"
          stroke={strokeSecondary}
          strokeDasharray="2 5"
          strokeWidth="0.8"
        />

        {/* Dorsal Equipment: Wings / Fin Funnels / Backpack */}
        {hasFinFunnels && (
          <g stroke={strokePrimary} strokeWidth="1.2" fill="rgba(6, 182, 212, 0.06)">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <polygon
                key={idx}
                points={`${152 - idx * 8},${48 + idx * 6} ${140 - idx * 8},${44 + idx * 6} ${116 - idx * 6},${118 + idx * 7} ${128 - idx * 6},${122 + idx * 7}`}
              />
            ))}
          </g>
        )}

        {hasWings && (
          <g stroke={strokePrimary} strokeWidth="1.2" fill="rgba(6, 182, 212, 0.06)">
            <polygon points="172,78 96,42 78,128 158,108" />
            <polygon points="228,78 304,42 322,128 242,108" />
            {archetype === 'freedom' && (
              <>
                <line x1="164" y1="86" x2="88" y2="96" />
                <line x1="236" y1="86" x2="312" y2="96" />
              </>
            )}
          </g>
        )}

        {archetype === 'exia' && (
          <g stroke={strokePrimary} strokeWidth="1.2" fill="rgba(6, 182, 212, 0.07)">
            {/* GN Drive Dorsal Cone + GN Sword silhouette */}
            <polygon points="184,82 216,82 200,56" />
            <line x1="248" y1="110" x2="294" y2="176" strokeWidth="1.6" />
          </g>
        )}

        {/* Head Unit */}
        <g stroke={strokePrimary} strokeWidth="1.4" fill="rgba(15, 23, 42, 0.8)">
          {isMonoEye ? (
            <>
              <path d="M188,68 L212,68 L216,52 L200,44 L184,52 Z" />
              {/* Mono-eye track & optic */}
              <rect x="190" y="54" width="20" height="5" fill="rgba(248,113,113,0.18)" />
              <circle cx="200" cy="56.5" r="2.2" fill="#F59E0B" stroke="none" />
              {archetype !== 'gouf' && (
                <line x1="200" y1="44" x2="200" y2="31" strokeWidth="1.5" />
              )}
            </>
          ) : (
            <>
              <polygon points="190,68 210,68 213,51 200,45 187,51" />
              {/* V-Fin Crest */}
              {archetype === 'unicorn' ? (
                <polyline points="193,48 184,31 200,44 216,31 207,48" fill="none" />
              ) : (
                <polyline points="200,49 175,35 194,51 206,51 225,35 200,49" fill="none" />
              )}
            </>
          )}
        </g>

        {/* Torso & Shoulders */}
        <g stroke={strokePrimary} strokeWidth="1.4" fill="rgba(15, 23, 42, 0.72)">
          {/* Core Chest */}
          <polygon points="175,74 225,74 219,116 181,116" />
          {/* Cockpit Hatch */}
          <rect
            x="192"
            y="84"
            width="16"
            height="22"
            fill={isMonoEye ? 'rgba(248,113,113,0.12)' : 'rgba(6,182,212,0.14)'}
          />
          {archetype === 'exia' && (
            <circle cx="200" cy="92" r="7" fill="rgba(34, 211, 238, 0.25)" />
          )}

          {/* Left & Right Shoulders */}
          {isHeavy ? (
            <>
              <path d="M142,76 Q146,60 174,74 L172,102 L144,98 Z" />
              <path d="M258,76 Q254,60 226,74 L228,102 L256,98 Z" />
            </>
          ) : (
            <>
              <polygon points="145,74 174,72 174,98 148,96" />
              <polygon points="255,74 226,72 226,98 252,96" />
            </>
          )}

          {/* Arms */}
          <polygon points="150,98 168,98 164,148 148,146" />
          <polygon points="232,98 250,98 252,146 236,148" />
        </g>

        {/* Waist / Hydraulic Frame */}
        <g stroke={strokePrimary} strokeWidth="1.3" fill="rgba(15, 23, 42, 0.7)">
          {hasExposedWaist ? (
            <>
              <line x1="190" y1="116" x2="188" y2="140" strokeWidth="2.5" />
              <line x1="210" y1="116" x2="212" y2="140" strokeWidth="2.5" />
              <polygon points="182,136 218,136 214,156 186,156" />
            </>
          ) : (
            <>
              <polygon points="182,116 218,116 226,154 174,154" />
              <rect x="195" y="122" width="10" height="28" />
            </>
          )}
        </g>

        {/* Legs & Thruster Bell Silhouette */}
        <g stroke={strokePrimary} strokeWidth="1.4" fill="rgba(15, 23, 42, 0.72)">
          {/* Left Leg */}
          <polygon
            points={
              isHeavy
                ? '175,154 196,154 191,206 164,206'
                : '176,154 195,154 191,206 170,206'
            }
          />
          <polygon
            points={
              isHeavy
                ? '164,208 192,208 196,264 152,264'
                : '170,208 191,208 193,262 162,262'
            }
          />
          <polygon points="156,264 192,264 194,274 148,274" />

          {/* Right Leg */}
          <polygon
            points={
              isHeavy
                ? '204,154 225,154 236,206 209,206'
                : '205,154 224,154 230,206 209,206'
            }
          />
          <polygon
            points={
              isHeavy
                ? '208,208 236,208 248,264 204,264'
                : '209,208 230,208 238,262 207,262'
            }
          />
          <polygon points="208,264 244,264 252,274 206,274" />
        </g>

        {/* Interactive Hotspot Pins inside SVG */}
        {!compact &&
          subsystems.map((sub) => {
            const cx = (sub.xPercent / 100) * 400;
            const cy = (sub.yPercent / 100) * 300;
            const isSelected = selectedSubsystemId === sub.id;

            return (
              <g
                key={sub.id}
                onClick={() => onSelectSubsystem(sub.id)}
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`檢視 ${sub.label}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectSubsystem(sub.id);
                  }
                }}
              >
                <circle cx={cx} cy={cy} r={16} fill="transparent" />
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 9 : 6}
                  fill="none"
                  stroke={isSelected ? '#F59E0B' : '#22D3EE'}
                  strokeWidth="1.5"
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={3}
                  fill={isSelected ? '#F59E0B' : '#22D3EE'}
                />
              </g>
            );
          })}
      </svg>
    </div>
  );
}
