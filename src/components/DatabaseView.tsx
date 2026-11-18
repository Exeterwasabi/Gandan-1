import {
  Bookmark,
  Crosshair,
  GitCompareArrows,
  Layers,
  RotateCcw,
  Search,
  Shield,
  Wrench,
  X,
} from 'lucide-react';
import {useEffect, useMemo, useRef, useState} from 'react';
import {
  FactionGroup,
  MobileSuit,
  SubsystemPoint,
  TimelineCode,
} from '../types/gundam';
import {BlueprintSchematic} from './BlueprintSchematic';
import {RadarChart} from './RadarChart';

interface DatabaseViewProps {
  suits: MobileSuit[];
  selectedSuitId: string;
  onSelectSuit: (id: string) => void;
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
  compareIds: [string, string];
  onAddToCompare: (id: string) => void;
  onOpenCompare: () => void;
}

type SortKey = 'year' | 'generator' | 'thruster' | 'height';
type DetailTab = 'overview' | 'armaments' | 'systems';
type VisualMode = 'hangar' | 'blueprint';

const TIMELINE_FILTERS: {value: TimelineCode | 'ALL'; label: string}[] = [
  {value: 'ALL', label: '全部'},
  {value: 'U.C.', label: 'U.C.'},
  {value: 'C.E.', label: 'C.E.'},
  {value: 'A.C.', label: 'A.C.'},
  {value: 'A.D.', label: 'A.D.'},
  {value: 'P.D.', label: 'P.D.'},
];

const FACTION_FILTERS: (FactionGroup | 'ALL')[] = [
  'ALL',
  '地球聯邦軍',
  '吉翁系勢力',
  '幽谷 (A.E.U.G.)',
  '其他勢力',
];

export function DatabaseView({
  suits,
  selectedSuitId,
  onSelectSuit,
  favoriteIds,
  onToggleFavorite,
  compareIds,
  onAddToCompare,
  onOpenCompare,
}: DatabaseViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [timelineFilter, setTimelineFilter] = useState<TimelineCode | 'ALL'>('ALL');
  const [factionFilter, setFactionFilter] = useState<FactionGroup | 'ALL'>('ALL');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>('year');
  const [detailTab, setDetailTab] = useState<DetailTab>('overview');
  const [visualMode, setVisualMode] = useState<VisualMode>('hangar');
  const [selectedSubsystemId, setSelectedSubsystemId] =
    useState<SubsystemPoint['id']>('head');

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA' &&
        document.activeElement?.tagName !== 'SELECT'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredSuits = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = suits.filter((suit) => {
      if (timelineFilter !== 'ALL' && suit.timeline !== timelineFilter) {
        return false;
      }
      if (factionFilter !== 'ALL' && suit.factionGroup !== factionFilter) {
        return false;
      }
      if (onlyFavorites && !favoriteIds.includes(suit.id)) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        suit.modelCode,
        suit.nameZh,
        suit.nameEn,
        suit.pilot,
        suit.faction,
        suit.manufacturer,
        ...suit.armaments.map((a) => a.name),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'generator') return b.specs.generatorKw - a.specs.generatorKw;
      if (sortBy === 'thruster') return b.specs.thrusterKg - a.specs.thrusterKg;
      if (sortBy === 'height') return b.specs.headHeightM - a.specs.headHeightM;
      return a.yearSort - b.yearSort;
    });
  }, [suits, searchQuery, timelineFilter, factionFilter, onlyFavorites, favoriteIds, sortBy]);

  const activeSuit = useMemo(
    () => suits.find((s) => s.id === selectedSuitId) || suits[0],
    [suits, selectedSuitId],
  );

  // Reset subsystem selection when switching suits, and auto-pick blueprint if no photo
  useEffect(() => {
    setSelectedSubsystemId('head');
    if (!activeSuit.imageUrl) {
      setVisualMode('blueprint');
    } else {
      setVisualMode('hangar');
    }
  }, [activeSuit.id, activeSuit.imageUrl]);

  const activeSubsystem =
    activeSuit.subsystems.find((sub) => sub.id === selectedSubsystemId) ||
    activeSuit.subsystems[0];

  const isFavorite = favoriteIds.includes(activeSuit.id);
  const isInCompare = compareIds.includes(activeSuit.id);

  const resetFilters = () => {
    setSearchQuery('');
    setTimelineFilter('ALL');
    setFactionFilter('ALL');
    setOnlyFavorites(false);
    setSortBy('year');
  };

  const getFactionAccentColor = (factionGroup: FactionGroup) => {
    if (factionGroup === '吉翁系勢力') return 'text-rose-400';
    if (factionGroup === '幽谷 (A.E.U.G.)') return 'text-amber-300';
    return 'text-cyan-400';
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Left Control & Catalog Rail */}
        <aside className="w-full shrink-0 rounded-lg border border-slate-800/90 bg-[#0C111C] lg:w-[356px]">
          <div className="border-b border-slate-800/80 p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm font-semibold tracking-wide text-slate-100">
                機體檢索目錄
              </h2>
              <span className="font-mono text-xs text-slate-400 tabular-nums">
                {filteredSuits.length} / {suits.length}
              </span>
            </div>

            {/* Search Input */}
            <div className="relative mt-3">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="型號、名稱、駕駛員或武裝 (按 / 聚焦)"
                aria-label="搜尋機體型號、名稱、駕駛員或武裝"
                className="h-10 w-full rounded border border-slate-700/80 bg-[#070A10] pl-9 pr-8 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="清除搜尋文字"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-100 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Segmented Timeline Filter */}
            <div className="mt-3 flex flex-wrap gap-1 rounded bg-[#070A10] p-1 border border-slate-800/80">
              {TIMELINE_FILTERS.map((tl) => {
                const active = timelineFilter === tl.value;
                return (
                  <button
                    key={tl.value}
                    type="button"
                    onClick={() => setTimelineFilter(tl.value)}
                    className={`flex-1 rounded px-2 py-1.5 font-mono text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    {tl.label}
                  </button>
                );
              })}
            </div>

            {/* Faction & Sort Controls */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <select
                value={factionFilter}
                onChange={(e) =>
                  setFactionFilter(e.target.value as FactionGroup | 'ALL')
                }
                aria-label="依陣營篩選"
                className="h-9 rounded border border-slate-700/80 bg-[#070A10] px-2.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none cursor-pointer"
              >
                {FACTION_FILTERS.map((fac) => (
                  <option key={fac} value={fac}>
                    {fac === 'ALL' ? '所有陣營勢力' : fac}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                aria-label="機體排序方式"
                className="h-9 rounded border border-slate-700/80 bg-[#070A10] px-2.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none cursor-pointer"
              >
                <option value="year">按紀元年代排序</option>
                <option value="generator">按反應爐出力</option>
                <option value="thruster">按總推進力</option>
                <option value="height">按機體全高</option>
              </select>
            </div>

            {/* Favorites Quick Filter */}
            <div className="mt-2.5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setOnlyFavorites((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  onlyFavorites
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
                <span>僅顯示已收藏 ({favoriteIds.length})</span>
              </button>

              {(searchQuery ||
                timelineFilter !== 'ALL' ||
                factionFilter !== 'ALL' ||
                onlyFavorites) && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden="true" />
                  <span>重設篩選</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Suit List */}
          <div className="hud-scroll max-h-[360px] divide-y divide-slate-800/70 overflow-y-auto lg:max-h-[680px]">
            {filteredSuits.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                <p className="text-sm font-medium text-slate-300">
                  找不到符合篩選條件的機體
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  請嘗試調整搜尋關鍵字、紀元或陣營條件
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 rounded border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs font-medium text-cyan-300 hover:bg-cyan-500/20 cursor-pointer"
                >
                  重設所有篩選條件
                </button>
              </div>
            ) : (
              filteredSuits.map((suit) => {
                const isSelected = suit.id === activeSuit.id;
                const isSuitFav = favoriteIds.includes(suit.id);

                return (
                  <button
                    key={suit.id}
                    type="button"
                    onClick={() => onSelectSuit(suit.id)}
                    className={`group flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/10'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-xs font-semibold tracking-wider ${
                            isSelected
                              ? 'text-cyan-300'
                              : getFactionAccentColor(suit.factionGroup)
                          }`}
                        >
                          {suit.modelCode}
                        </span>
                        <span className="truncate text-sm font-semibold text-slate-100">
                          {suit.nameZh}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                        <span className="font-mono">{suit.eraYear}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{suit.faction}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isSuitFav && (
                        <Bookmark
                          className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                          aria-label="已收藏"
                        />
                      )}
                      <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                        {suit.specs.generatorKw.toLocaleString()} kW
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Main Inspection Viewport */}
        <section className="min-w-0 flex-1 space-y-6">
          {/* Unit Identity Header Card */}
          <div className="rounded-lg border border-slate-800/90 bg-[#0C111C] p-5 sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                {/* Unboxed metadata line */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span className="font-mono font-medium text-cyan-400">
                    {activeSuit.eraYear}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeSuit.faction}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeSuit.unitType}</span>
                  <span aria-hidden="true">·</span>
                  <span>駕駛員：{activeSuit.pilot}</span>
                </div>

                <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl [text-wrap:balance]">
                  <span className="font-mono text-cyan-400 mr-2.5">
                    {activeSuit.modelCode}
                  </span>
                  <span>{activeSuit.nameZh}</span>
                </h1>
                <p className="mt-1 font-mono text-xs tracking-wider text-slate-400">
                  {activeSuit.nameEn} — {activeSuit.manufacturer}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => onToggleFavorite(activeSuit.id)}
                  className={`inline-flex h-10 items-center gap-2 rounded border px-4 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isFavorite
                      ? 'border-amber-500/50 bg-amber-500/15 text-amber-300'
                      : 'border-slate-700 bg-slate-900/70 text-slate-200 hover:border-slate-500'
                  }`}
                >
                  <Bookmark
                    className={`h-3.5 w-3.5 ${isFavorite ? 'fill-amber-400' : ''}`}
                    aria-hidden="true"
                  />
                  <span>{isFavorite ? '已收藏機體' : '加入收藏'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (isInCompare) {
                      onOpenCompare();
                    } else {
                      onAddToCompare(activeSuit.id);
                    }
                  }}
                  className={`inline-flex h-10 items-center gap-2 rounded border px-4 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isInCompare
                      ? 'border-cyan-500/60 bg-cyan-500/20 text-cyan-200'
                      : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20'
                  }`}
                >
                  <GitCompareArrows className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{isInCompare ? '前往性能對比' : '加入對比清單'}</span>
                </button>
              </div>
            </div>

            <p className="mt-4 max-w-[75ch] text-sm leading-relaxed text-slate-300">
              {activeSuit.summary}
            </p>
          </div>

          {/* Visual Stage + Radar Telemetry Split */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 xl:items-stretch">
            {/* Hangar Visual / Blueprint Stage */}
            <div className="flex flex-col rounded-lg border border-slate-800/90 bg-[#0C111C] p-4 sm:p-5 xl:col-span-7">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="font-mono text-xs tracking-wider text-slate-400">
                  機體檢視視窗
                </span>

                {/* Segmented View Toggle */}
                <div className="flex items-center gap-1 rounded border border-slate-800 bg-[#070A10] p-1">
                  {activeSuit.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setVisualMode('hangar')}
                      className={`rounded px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                        visualMode === 'hangar'
                          ? 'bg-slate-800 text-cyan-300'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      實機格納庫
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setVisualMode('blueprint')}
                    className={`rounded px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      visualMode === 'blueprint'
                        ? 'bg-slate-800 text-cyan-300'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    工程線框藍圖
                  </button>
                </div>
              </div>

              {/* 4:3 Viewport Container with Crisp Corner Brackets */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded border border-slate-800 bg-[#070A10]">
                {/* Precision HUD Corner Reticle Marks */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-2 top-2 z-10 h-3 w-3 border-l border-t border-cyan-400/60"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-2 top-2 z-10 h-3 w-3 border-r border-t border-cyan-400/60"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-2 left-2 z-10 h-3 w-3 border-b border-l border-cyan-400/60"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-2 right-2 z-10 h-3 w-3 border-b border-r border-cyan-400/60"
                />

                {visualMode === 'hangar' && activeSuit.imageUrl ? (
                  <div className="relative h-full w-full">
                    <img
                      src={activeSuit.imageUrl}
                      alt={`${activeSuit.modelCode} ${activeSuit.nameZh} 格納庫技術視圖`}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070A10]/85 via-transparent to-transparent"
                    />

                    {/* Interactive Subsystem Overlay Hotspots on Hangar Image */}
                    {activeSuit.subsystems.map((sub) => {
                      const active = sub.id === selectedSubsystemId;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => setSelectedSubsystemId(sub.id)}
                          aria-label={`檢視 ${sub.label}`}
                          style={{
                            left: `${sub.xPercent}%`,
                            top: `${sub.yPercent}%`,
                          }}
                          className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full border transition-transform cursor-pointer ${
                            active
                              ? 'scale-110 border-amber-400 bg-amber-500/30 text-amber-200'
                              : 'border-cyan-400/80 bg-[#070A10]/70 text-cyan-300 hover:scale-110'
                          }`}
                        >
                          <Crosshair className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      );
                    })}

                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-xs">
                      <span className="font-mono text-slate-300">
                        {activeSuit.modelCode} · {activeSuit.role}
                      </span>
                      <span className="font-mono text-slate-400 tabular-nums">
                        全高 {activeSuit.specs.headHeightM.toFixed(1)} m
                      </span>
                    </div>
                  </div>
                ) : (
                  <BlueprintSchematic
                    archetype={activeSuit.archetype}
                    modelCode={activeSuit.modelCode}
                    headHeightM={activeSuit.specs.headHeightM}
                    subsystems={activeSuit.subsystems}
                    selectedSubsystemId={selectedSubsystemId}
                    onSelectSubsystem={setSelectedSubsystemId}
                  />
                )}
              </div>

              {/* Interactive Subsystem Inspector Strip */}
              <div className="mt-4 border-t border-slate-800/80 pt-3">
                <div className="flex flex-wrap gap-1.5">
                  {activeSuit.subsystems.map((sub) => {
                    const active = sub.id === selectedSubsystemId;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setSelectedSubsystemId(sub.id)}
                        className={`rounded border px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                          active
                            ? 'border-amber-500/50 bg-amber-500/15 text-amber-300'
                            : 'border-slate-800 bg-[#070A10] text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2.5 flex flex-col gap-0.5 rounded border border-slate-800/70 bg-[#070A10] px-3.5 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-100">
                      {activeSubsystem.componentName}
                    </span>
                    <span className="font-mono text-[11px] text-amber-400">
                      {activeSubsystem.label}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-400">
                    {activeSubsystem.detail}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Radar Chart + Tabular Telemetry KPIs */}
            <div className="flex flex-col justify-between rounded-lg border border-slate-800/90 bg-[#0C111C] p-4 sm:p-5 xl:col-span-5">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="font-display text-sm font-semibold tracking-wide text-slate-100">
                    六維作戰性能評估
                  </h2>
                  <span className="font-mono text-xs text-slate-400">
                    CALIBRATED INDEX
                  </span>
                </div>

                <RadarChart
                  primaryStats={activeSuit.radar}
                  primaryLabel={`${activeSuit.modelCode} ${activeSuit.nameZh}`}
                />
              </div>

              {/* 4-cell Tabular Metric Strip */}
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-800/80 pt-4">
                <div className="rounded border border-slate-800/80 bg-[#070A10] p-3">
                  <div className="text-[11px] text-slate-400">頭頂高</div>
                  <div className="mt-1 flex items-baseline">
                    <span className="font-mono text-lg font-semibold text-slate-100 tabular-nums">
                      {activeSuit.specs.headHeightM.toFixed(1)}
                    </span>
                    <span className="ml-1.5 font-mono text-xs text-slate-400">m</span>
                  </div>
                </div>

                <div className="rounded border border-slate-800/80 bg-[#070A10] p-3">
                  <div className="text-[11px] text-slate-400">本體 / 全備重量</div>
                  <div className="mt-1 flex items-baseline">
                    <span className="font-mono text-lg font-semibold text-slate-100 tabular-nums">
                      {activeSuit.specs.baseWeightT.toFixed(1)}
                    </span>
                    <span className="ml-1 font-mono text-xs text-slate-400 tabular-nums">
                      / {activeSuit.specs.fullWeightT.toFixed(1)} t
                    </span>
                  </div>
                </div>

                <div className="rounded border border-slate-800/80 bg-[#070A10] p-3">
                  <div className="text-[11px] text-slate-400">發電機出力</div>
                  <div className="mt-1 flex items-baseline">
                    <span className="font-mono text-lg font-semibold text-cyan-300 tabular-nums">
                      {activeSuit.specs.generatorKw.toLocaleString()}
                    </span>
                    <span className="ml-1.5 font-mono text-xs text-slate-400">kW</span>
                  </div>
                </div>

                <div className="rounded border border-slate-800/80 bg-[#070A10] p-3">
                  <div className="text-[11px] text-slate-400">推進器總推力</div>
                  <div className="mt-1 flex items-baseline">
                    <span className="font-mono text-lg font-semibold text-slate-100 tabular-nums">
                      {activeSuit.specs.thrusterKg.toLocaleString()}
                    </span>
                    <span className="ml-1.5 font-mono text-xs text-slate-400">kg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Encyclopedia Details Tabs */}
          <div className="rounded-lg border border-slate-800/90 bg-[#0C111C]">
            <div className="flex flex-wrap border-b border-slate-800/80 px-4 sm:px-6">
              <button
                type="button"
                onClick={() => setDetailTab('overview')}
                className={`inline-flex items-center gap-2 border-b-2 px-4 py-3.5 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  detailTab === 'overview'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="h-4 w-4" aria-hidden="true" />
                <span>開發沿革與機體規格</span>
              </button>

              <button
                type="button"
                onClick={() => setDetailTab('armaments')}
                className={`inline-flex items-center gap-2 border-b-2 px-4 py-3.5 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  detailTab === 'armaments'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield className="h-4 w-4" aria-hidden="true" />
                <span>武裝配備清單 ({activeSuit.armaments.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setDetailTab('systems')}
                className={`inline-flex items-center gap-2 border-b-2 px-4 py-3.5 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  detailTab === 'systems'
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Wrench className="h-4 w-4" aria-hidden="true" />
                <span>核心技術與特殊系統 ({activeSuit.specialSystems.length})</span>
              </button>
            </div>

            <div className="p-5 sm:p-6">
              {detailTab === 'overview' && (
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                  <div className="lg:col-span-7">
                    <h3 className="font-display text-base font-semibold text-slate-100">
                      技術背景與實戰履歷
                    </h3>
                    <p className="mt-3 max-w-[70ch] text-sm leading-7 text-slate-300">
                      {activeSuit.developmentHistory}
                    </p>
                  </div>

                  <div className="lg:col-span-5">
                    <h3 className="font-display text-base font-semibold text-slate-100">
                      詳細工程諸元表
                    </h3>
                    <dl className="mt-3 divide-y divide-slate-800/80 border-t border-b border-slate-800/80 text-sm">
                      <div className="flex items-center justify-between gap-4 py-2.5">
                        <dt className="text-slate-400">裝甲材質</dt>
                        <dd className="text-right font-medium text-slate-200">
                          {activeSuit.specs.armorMaterial}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between gap-4 py-2.5">
                        <dt className="text-slate-400">動力源架構</dt>
                        <dd className="text-right font-medium text-slate-200">
                          {activeSuit.specs.powerSource}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between gap-4 py-2.5">
                        <dt className="text-slate-400">感測器有效半徑</dt>
                        <dd className="font-mono text-slate-100 tabular-nums">
                          {activeSuit.specs.sensorRadiusM.toLocaleString()} m
                        </dd>
                      </div>
                      <div className="flex items-center justify-between gap-4 py-2.5">
                        <dt className="text-slate-400">開發製造商</dt>
                        <dd className="text-right text-slate-200">
                          {activeSuit.manufacturer}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between gap-4 py-2.5">
                        <dt className="text-slate-400">戰術定位</dt>
                        <dd className="text-right text-slate-200">
                          {activeSuit.role}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}

              {detailTab === 'armaments' && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 text-xs text-slate-400">
                        <th className="py-2.5 pr-4 font-medium">武裝名稱</th>
                        <th className="py-2.5 pr-4 font-medium">武器分類</th>
                        <th className="py-2.5 pr-4 font-medium">口徑 / 出力規格</th>
                        <th className="py-2.5 font-medium">戰術特性說明</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {activeSuit.armaments.map((weapon) => (
                        <tr key={weapon.name} className="hover:bg-slate-800/30">
                          <td className="py-3.5 pr-4 font-semibold text-slate-100 whitespace-nowrap">
                            {weapon.name}
                          </td>
                          <td className="py-3.5 pr-4 text-xs text-cyan-300 whitespace-nowrap">
                            {weapon.category}
                          </td>
                          <td className="py-3.5 pr-4 font-mono text-xs text-slate-300 tabular-nums whitespace-nowrap">
                            {weapon.outputOrCaliber}
                          </td>
                          <td className="py-3.5 text-slate-300 leading-relaxed">
                            {weapon.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {detailTab === 'systems' && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {activeSuit.specialSystems.map((sys) => (
                    <div
                      key={sys.name}
                      className="rounded border border-slate-800/80 bg-[#070A10] p-4"
                    >
                      <h4 className="font-display text-sm font-semibold text-cyan-300">
                        {sys.name}
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-slate-300">
                        {sys.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
