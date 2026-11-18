import {ArrowRight, Search, X} from 'lucide-react';
import {useMemo, useState} from 'react';
import {GlossaryTerm, LineageNode} from '../types/gundam';

interface LineageGlossaryViewProps {
  lineageNodes: LineageNode[];
  glossaryTerms: GlossaryTerm[];
  onInspectSuit: (id: string) => void;
}

type GlossaryCategory = GlossaryTerm['category'] | 'ALL';

const CATEGORIES: GlossaryCategory[] = [
  'ALL',
  '動力物理',
  '裝甲結構',
  '感應與火控',
  '戰術系統',
];

export function LineageGlossaryView({
  lineageNodes,
  glossaryTerms,
  onInspectSuit,
}: LineageGlossaryViewProps) {
  const [glossarySearch, setGlossarySearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<GlossaryCategory>('ALL');

  const federationBranch = lineageNodes.filter((n) => n.branch === 'federation');
  const zeonBranch = lineageNodes.filter((n) => n.branch === 'zeon');
  const alternativeBranch = lineageNodes.filter((n) => n.branch === 'alternative');

  const filteredTerms = useMemo(() => {
    const q = glossarySearch.trim().toLowerCase();
    return glossaryTerms.filter((item) => {
      if (categoryFilter !== 'ALL' && item.category !== categoryFilter) {
        return false;
      }
      if (!q) return true;
      return (
        item.term.toLowerCase().includes(q) ||
        item.english.toLowerCase().includes(q) ||
        item.definition.toLowerCase().includes(q)
      );
    });
  }, [glossaryTerms, glossarySearch, categoryFilter]);

  const renderBranchTrack = (
    title: string,
    subtitle: string,
    nodes: LineageNode[],
    accentClass: string,
  ) => (
    <div className="rounded-lg border border-slate-800/90 bg-[#0C111C] p-5">
      <div className="border-b border-slate-800/80 pb-3">
        <h2 className={`font-display text-base font-semibold ${accentClass}`}>
          {title}
        </h2>
        <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>
      </div>

      <div className="mt-4 space-y-3">
        {nodes.map((node, idx) => (
          <div key={node.id} className="relative">
            {idx > 0 && (
              <div
                aria-hidden="true"
                className="mx-auto mb-1.5 h-3 w-px bg-slate-700"
              />
            )}
            <button
              type="button"
              onClick={() => node.unitId && onInspectSuit(node.unitId)}
              disabled={!node.unitId}
              className="group flex w-full items-start justify-between gap-3 rounded border border-slate-800 bg-[#070A10] p-3.5 text-left hover:border-cyan-500/50 transition-colors cursor-pointer"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-cyan-300">
                    {node.modelCode}
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    {node.year}
                  </span>
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-100">
                  {node.title}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  {node.note}
                </p>
              </div>
              <ArrowRight
                className="mt-1 h-4 w-4 shrink-0 text-slate-500 group-hover:text-cyan-400 transition-colors"
                aria-hidden="true"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1440px] space-y-8 px-4 py-6 sm:px-6">
      {/* Development Lineage Section */}
      <section className="space-y-4">
        <div className="rounded-lg border border-slate-800/90 bg-[#0C111C] p-5 sm:p-6">
          <h1 className="font-display text-2xl font-bold text-slate-50">
            機體開發系譜與科技百科
          </h1>
          <p className="mt-1 max-w-[70ch] text-sm text-slate-400">
            追蹤地球聯邦、吉翁及多元紀元鋼彈的架構演進脈絡，點選任一節點可直接跳轉至對應機體的詳細檔案。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {renderBranchTrack(
            '地球聯邦 / 幽谷開發主軸',
            '從 V 作戰、可動骨架進化至全精神感應框體',
            federationBranch,
            'text-cyan-300',
          )}
          {renderBranchTrack(
            '吉翁 / 新吉翁系譜',
            '從流體脈衝泛用機發展為新人類重裝旗艦',
            zeonBranch,
            'text-rose-400',
          )}
          {renderBranchTrack(
            '多元宇宙平行技術線',
            'A.C. / C.E. / A.D. / P.D. 獨立能源與裝甲架構',
            alternativeBranch,
            'text-amber-300',
          )}
        </div>
      </section>

      {/* Technical Glossary Section */}
      <section className="rounded-lg border border-slate-800/90 bg-[#0C111C] p-5 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-slate-100">
              機動戰士核心科技詞彙表
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              解析各作品世界觀背後的物理理論、裝甲複合材與神經控制介面。
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                aria-hidden="true"
              />
              <input
                type="text"
                value={glossarySearch}
                onChange={(e) => setGlossarySearch(e.target.value)}
                placeholder="搜尋技術詞彙..."
                aria-label="搜尋技術詞彙"
                className="h-9 w-full sm:w-56 rounded border border-slate-700/80 bg-[#070A10] pl-9 pr-8 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
              />
              {glossarySearch && (
                <button
                  type="button"
                  onClick={() => setGlossarySearch('')}
                  aria-label="清除詞彙搜尋"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-100 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1 rounded border border-slate-800 bg-[#070A10] p-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`rounded px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat === 'ALL' ? '全部' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredTerms.length === 0 ? (
          <div className="mt-6 rounded border border-slate-800 bg-[#070A10] py-10 text-center text-sm text-slate-400">
            沒有符合「{glossarySearch}」的技術詞彙，請嘗試其他關鍵字。
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredTerms.map((item) => (
              <article
                key={item.id}
                className="rounded border border-slate-800/80 bg-[#070A10] p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                  <span className="font-mono text-cyan-400">{item.english}</span>
                  <span>
                    {item.category} · {item.timeline}
                  </span>
                </div>
                <h3 className="mt-1.5 font-display text-base font-semibold text-slate-100">
                  {item.term}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {item.definition}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
