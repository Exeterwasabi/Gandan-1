import {ArrowRight} from 'lucide-react';
import {useMemo, useState} from 'react';
import {MobileSuit, TimelineCode, TimelineEvent} from '../types/gundam';

interface TimelineViewProps {
  events: TimelineEvent[];
  suits: MobileSuit[];
  onInspectSuit: (id: string) => void;
}

const ERA_FILTERS: {value: TimelineCode | 'ALL'; label: string}[] = [
  {value: 'ALL', label: '全部紀元'},
  {value: 'U.C.', label: 'U.C. 宇宙世紀'},
  {value: 'C.E.', label: 'C.E. 宇宙紀元'},
  {value: 'A.C.', label: 'A.C. 後殖民紀元'},
  {value: 'A.D.', label: 'A.D. 西曆紀元'},
  {value: 'P.D.', label: 'P.D. 災後紀元'},
];

export function TimelineView({
  events,
  suits,
  onInspectSuit,
}: TimelineViewProps) {
  const [eraFilter, setEraFilter] = useState<TimelineCode | 'ALL'>('ALL');

  const filteredEvents = useMemo(() => {
    if (eraFilter === 'ALL') return events;
    return events.filter((e) => e.timeline === eraFilter);
  }, [events, eraFilter]);

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6">
      {/* Header + Segmented Timeline Filter */}
      <div className="rounded-lg border border-slate-800/90 bg-[#0C111C] p-5 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-50">
              鋼彈紀元歷史編年史
            </h1>
            <p className="mt-1 max-w-[68ch] text-sm text-slate-400">
              循著歷代大型武裝衝突與技術革新節點，探索各紀元代表性機動戰士的實戰部署背景。
            </p>
          </div>

          <div className="flex flex-wrap gap-1 rounded border border-slate-800 bg-[#070A10] p-1">
            {ERA_FILTERS.map((era) => {
              const active = eraFilter === era.value;
              return (
                <button
                  key={era.value}
                  type="button"
                  onClick={() => setEraFilter(era.value)}
                  className={`rounded px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  {era.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chronological Timeline Grid */}
      <div className="space-y-4">
        {filteredEvents.map((ev, index) => {
          const linkedSuits = ev.featuredUnitIds
            .map((id) => suits.find((s) => s.id === id))
            .filter((s): s is MobileSuit => Boolean(s));

          return (
            <article
              key={ev.id}
              className="rounded-lg border border-slate-800/90 bg-[#0C111C] p-5 sm:p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  {/* Unboxed Metadata */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono text-slate-500 tabular-nums">
                      {String(index + 1).padStart(2, '0')}.
                    </span>
                    <span className="font-mono font-semibold text-cyan-400">
                      {ev.year}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{ev.conflictName}</span>
                  </div>

                  <h2 className="mt-2 font-display text-xl font-semibold text-slate-100">
                    {ev.title}
                  </h2>

                  <p className="mt-2.5 max-w-[72ch] text-sm leading-7 text-slate-300">
                    {ev.summary}
                  </p>

                  <div className="mt-4 text-xs text-slate-400">
                    <span className="font-medium text-amber-300">核心技術里程碑：</span>
                    <span>{ev.techMilestone}</span>
                  </div>
                </div>

                {/* Linked Mobile Suits */}
                {linkedSuits.length > 0 && (
                  <div className="w-full shrink-0 border-t border-slate-800/80 pt-4 lg:w-[360px] lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
                    <div className="mb-2.5 text-xs font-medium text-slate-400">
                      本時期代表機體
                    </div>
                    <div className="space-y-2">
                      {linkedSuits.map((unit) => (
                        <button
                          key={unit.id}
                          type="button"
                          onClick={() => onInspectSuit(unit.id)}
                          className="group flex w-full items-center justify-between gap-3 rounded border border-slate-800 bg-[#070A10] px-3.5 py-2.5 text-left hover:border-cyan-500/50 transition-colors cursor-pointer"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-semibold text-cyan-300">
                                {unit.modelCode}
                              </span>
                              <span className="truncate text-sm font-medium text-slate-100">
                                {unit.nameZh}
                              </span>
                            </div>
                            <div className="mt-0.5 text-xs text-slate-500">
                              {unit.pilot} · {unit.faction}
                            </div>
                          </div>
                          <ArrowRight
                            className="h-4 w-4 shrink-0 text-slate-500 group-hover:text-cyan-400 transition-colors"
                            aria-hidden="true"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
