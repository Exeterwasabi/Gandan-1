import {ArrowLeftRight, ExternalLink} from 'lucide-react';
import {MobileSuit} from '../types/gundam';
import {BlueprintSchematic} from './BlueprintSchematic';
import {RadarChart} from './RadarChart';

interface ComparisonViewProps {
  suits: MobileSuit[];
  compareIds: [string, string];
  onChangeCompareIds: (next: [string, string]) => void;
  onInspectSuit: (id: string) => void;
}

export function ComparisonView({
  suits,
  compareIds,
  onChangeCompareIds,
  onInspectSuit,
}: ComparisonViewProps) {
  const unitA = suits.find((s) => s.id === compareIds[0]) || suits[0];
  const unitB = suits.find((s) => s.id === compareIds[1]) || suits[1];

  const swapUnits = () => {
    onChangeCompareIds([unitB.id, unitA.id]);
  };

  const formatDelta = (valA: number, valB: number, unit: string, higherBetter = true) => {
    const diff = valA - valB;
    if (Math.abs(diff) < 0.001) {
      return <span className="text-slate-400">同規格</span>;
    }
    const pct = valB !== 0 ? ((diff / valB) * 100).toFixed(1) : '0.0';
    const sign = diff > 0 ? '+' : '';
    const isAdvantage = higherBetter ? diff > 0 : diff < 0;

    return (
      <span className={isAdvantage ? 'text-cyan-300' : 'text-amber-300'}>
        {sign}
        {Number.isInteger(diff) ? diff.toLocaleString() : diff.toFixed(2)} {unit} ({sign}
        {pct}%)
      </span>
    );
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6">
      {/* Header Bar & Slot Selectors */}
      <div className="rounded-lg border border-slate-800/90 bg-[#0C111C] p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-50">
              雙機體規格性能對比工作台
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              選擇任意兩架機動戰士，即時疊加六維雷達指標並比較動力、推力與武裝諸元差異。
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <select
              value={unitA.id}
              onChange={(e) => onChangeCompareIds([e.target.value, unitB.id])}
              aria-label="選擇對比機體 A"
              className="h-10 rounded border border-cyan-500/50 bg-[#070A10] px-3 text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none cursor-pointer"
            >
              {suits.map((s) => (
                <option key={s.id} value={s.id}>
                  機體 A：{s.modelCode} {s.nameZh}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={swapUnits}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded border border-slate-700 bg-slate-900/80 px-3 text-xs font-medium text-slate-200 hover:border-slate-500 cursor-pointer shrink-0"
              aria-label="對調機體 A 與機體 B"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" />
              <span>對調</span>
            </button>

            <select
              value={unitB.id}
              onChange={(e) => onChangeCompareIds([unitA.id, e.target.value])}
              aria-label="選擇對比機體 B"
              className="h-10 rounded border border-amber-500/50 bg-[#070A10] px-3 text-sm text-amber-200 focus:border-amber-400 focus:outline-none cursor-pointer"
            >
              {suits.map((s) => (
                <option key={s.id} value={s.id}>
                  機體 B：{s.modelCode} {s.nameZh}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Visual Previews + Overlay Radar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
        {/* Unit A Preview */}
        <div className="flex flex-col justify-between rounded-lg border border-cyan-500/30 bg-[#0C111C] p-5 lg:col-span-4">
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-semibold text-cyan-400">
                機體 A · {unitA.eraYear}
              </span>
              <button
                type="button"
                onClick={() => onInspectSuit(unitA.id)}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-cyan-300 cursor-pointer"
              >
                <span>檢視詳細檔案</span>
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
            <h2 className="mt-1.5 font-display text-xl font-bold text-slate-100">
              {unitA.modelCode} {unitA.nameZh}
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              {unitA.faction} · {unitA.pilot}
            </p>
          </div>

          <div className="mt-4 aspect-[4/3] overflow-hidden rounded border border-slate-800 bg-[#070A10]">
            {unitA.imageUrl ? (
              <img
                src={unitA.imageUrl}
                alt={`${unitA.modelCode} ${unitA.nameZh}`}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            ) : (
              <BlueprintSchematic
                archetype={unitA.archetype}
                modelCode={unitA.modelCode}
                headHeightM={unitA.specs.headHeightM}
                subsystems={unitA.subsystems}
                selectedSubsystemId="head"
                onSelectSubsystem={() => {}}
                compact
              />
            )}
          </div>
        </div>

        {/* Center Dual Radar Overlay */}
        <div className="flex flex-col justify-center rounded-lg border border-slate-800/90 bg-[#0C111C] p-5 lg:col-span-4">
          <div className="mb-2 text-center">
            <h3 className="font-display text-sm font-semibold text-slate-100">
              雙機六維能力疊加雷達
            </h3>
            <p className="mt-0.5 font-mono text-xs text-slate-400">
              {unitA.modelCode} vs {unitB.modelCode}
            </p>
          </div>

          <RadarChart
            primaryStats={unitA.radar}
            primaryLabel={unitA.modelCode}
            secondaryStats={unitB.radar}
            secondaryLabel={unitB.modelCode}
          />
        </div>

        {/* Unit B Preview */}
        <div className="flex flex-col justify-between rounded-lg border border-amber-500/30 bg-[#0C111C] p-5 lg:col-span-4">
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-semibold text-amber-400">
                機體 B · {unitB.eraYear}
              </span>
              <button
                type="button"
                onClick={() => onInspectSuit(unitB.id)}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-amber-300 cursor-pointer"
              >
                <span>檢視詳細檔案</span>
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
            <h2 className="mt-1.5 font-display text-xl font-bold text-slate-100">
              {unitB.modelCode} {unitB.nameZh}
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              {unitB.faction} · {unitB.pilot}
            </p>
          </div>

          <div className="mt-4 aspect-[4/3] overflow-hidden rounded border border-slate-800 bg-[#070A10]">
            {unitB.imageUrl ? (
              <img
                src={unitB.imageUrl}
                alt={`${unitB.modelCode} ${unitB.nameZh}`}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            ) : (
              <BlueprintSchematic
                archetype={unitB.archetype}
                modelCode={unitB.modelCode}
                headHeightM={unitB.specs.headHeightM}
                subsystems={unitB.subsystems}
                selectedSubsystemId="head"
                onSelectSubsystem={() => {}}
                compact
              />
            )}
          </div>
        </div>
      </div>

      {/* Tabular Spec Delta Matrix */}
      <div className="rounded-lg border border-slate-800/90 bg-[#0C111C] p-5 sm:p-6">
        <h3 className="font-display text-base font-semibold text-slate-100">
          工程諸元數值差異矩陣
        </h3>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs text-slate-400">
                <th className="py-3 pr-4 font-medium">工程項目</th>
                <th className="py-3 pr-4 font-medium text-cyan-300">
                  {unitA.modelCode} {unitA.nameZh}
                </th>
                <th className="py-3 pr-4 font-medium text-amber-300">
                  {unitB.modelCode} {unitB.nameZh}
                </th>
                <th className="py-3 font-medium">A 相對於 B 差值</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              <tr>
                <td className="py-3 pr-4 text-slate-400">頭頂高</td>
                <td className="py-3 pr-4 font-mono text-slate-100 tabular-nums">
                  {unitA.specs.headHeightM.toFixed(2)} m
                </td>
                <td className="py-3 pr-4 font-mono text-slate-100 tabular-nums">
                  {unitB.specs.headHeightM.toFixed(2)} m
                </td>
                <td className="py-3 font-mono text-xs tabular-nums">
                  {formatDelta(unitA.specs.headHeightM, unitB.specs.headHeightM, 'm')}
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-slate-400">本體空重</td>
                <td className="py-3 pr-4 font-mono text-slate-100 tabular-nums">
                  {unitA.specs.baseWeightT.toFixed(1)} t
                </td>
                <td className="py-3 pr-4 font-mono text-slate-100 tabular-nums">
                  {unitB.specs.baseWeightT.toFixed(1)} t
                </td>
                <td className="py-3 font-mono text-xs tabular-nums">
                  {formatDelta(unitA.specs.baseWeightT, unitB.specs.baseWeightT, 't', false)}
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-slate-400">全備戰鬥重量</td>
                <td className="py-3 pr-4 font-mono text-slate-100 tabular-nums">
                  {unitA.specs.fullWeightT.toFixed(1)} t
                </td>
                <td className="py-3 pr-4 font-mono text-slate-100 tabular-nums">
                  {unitB.specs.fullWeightT.toFixed(1)} t
                </td>
                <td className="py-3 font-mono text-xs tabular-nums">
                  {formatDelta(unitA.specs.fullWeightT, unitB.specs.fullWeightT, 't', false)}
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-slate-400">發電機出力</td>
                <td className="py-3 pr-4 font-mono text-slate-100 tabular-nums">
                  {unitA.specs.generatorKw.toLocaleString()} kW
                </td>
                <td className="py-3 pr-4 font-mono text-slate-100 tabular-nums">
                  {unitB.specs.generatorKw.toLocaleString()} kW
                </td>
                <td className="py-3 font-mono text-xs tabular-nums">
                  {formatDelta(unitA.specs.generatorKw, unitB.specs.generatorKw, 'kW')}
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-slate-400">推進器總推力</td>
                <td className="py-3 pr-4 font-mono text-slate-100 tabular-nums">
                  {unitA.specs.thrusterKg.toLocaleString()} kg
                </td>
                <td className="py-3 pr-4 font-mono text-slate-100 tabular-nums">
                  {unitB.specs.thrusterKg.toLocaleString()} kg
                </td>
                <td className="py-3 font-mono text-xs tabular-nums">
                  {formatDelta(unitA.specs.thrusterKg, unitB.specs.thrusterKg, 'kg')}
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-slate-400">推重比（全備）</td>
                <td className="py-3 pr-4 font-mono text-slate-100 tabular-nums">
                  {(unitA.specs.thrusterKg / (unitA.specs.fullWeightT * 1000)).toFixed(2)} G
                </td>
                <td className="py-3 pr-4 font-mono text-slate-100 tabular-nums">
                  {(unitB.specs.thrusterKg / (unitB.specs.fullWeightT * 1000)).toFixed(2)} G
                </td>
                <td className="py-3 font-mono text-xs tabular-nums">
                  {formatDelta(
                    unitA.specs.thrusterKg / (unitA.specs.fullWeightT * 1000),
                    unitB.specs.thrusterKg / (unitB.specs.fullWeightT * 1000),
                    'G',
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-slate-400">感測器有效半徑</td>
                <td className="py-3 pr-4 font-mono text-slate-100 tabular-nums">
                  {unitA.specs.sensorRadiusM.toLocaleString()} m
                </td>
                <td className="py-3 pr-4 font-mono text-slate-100 tabular-nums">
                  {unitB.specs.sensorRadiusM.toLocaleString()} m
                </td>
                <td className="py-3 font-mono text-xs tabular-nums">
                  {formatDelta(unitA.specs.sensorRadiusM, unitB.specs.sensorRadiusM, 'm')}
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-slate-400">裝甲材質</td>
                <td className="py-3 pr-4 text-slate-200">{unitA.specs.armorMaterial}</td>
                <td className="py-3 pr-4 text-slate-200">{unitB.specs.armorMaterial}</td>
                <td className="py-3 text-xs text-slate-500">材質架構差異</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-slate-400">動力源</td>
                <td className="py-3 pr-4 text-slate-200">{unitA.specs.powerSource}</td>
                <td className="py-3 pr-4 text-slate-200">{unitB.specs.powerSource}</td>
                <td className="py-3 text-xs text-slate-500">反應爐世代差異</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
