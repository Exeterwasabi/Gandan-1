import {Shuffle, Menu, X} from 'lucide-react';
import {useState} from 'react';
import {ActiveTab} from '../types/gundam';

interface TopNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onRandomInspect: () => void;
  compareCount: number;
}

const NAV_ITEMS: {id: ActiveTab; label: string}[] = [
  {id: 'database', label: '機體圖鑑'},
  {id: 'compare', label: '性能對比'},
  {id: 'timeline', label: '紀元編年史'},
  {id: 'lineage', label: '系譜與百科'},
];

export function TopNav({
  activeTab,
  onSelectTab,
  onRandomInspect,
  compareCount,
}: TopNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: ActiveTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#070A10]/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-8 px-4 sm:px-6">
        {/* Zone 1: Single-element Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('database')}
          className="font-display text-base font-semibold tracking-wider text-slate-100 hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded"
        >
          機動戰士資料庫
        </button>

        {/* Zone 2: 4 single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7" aria-label="主要導覽">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            const displayLabel =
              item.id === 'compare' && compareCount > 0
                ? `${item.label} (${compareCount})`
                : item.label;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`relative py-4 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded ${
                  isActive
                    ? 'text-cyan-400'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {displayLabel}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-cyan-400"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onRandomInspect}
            className="hidden sm:inline-flex items-center gap-2 rounded border border-cyan-500/40 bg-cyan-500/10 px-4 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
          >
            <Shuffle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>隨機檢視機體</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex md:hidden h-10 w-10 items-center justify-center rounded border border-slate-800 bg-slate-900/70 text-slate-300 hover:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            aria-label={mobileMenuOpen ? '關閉導覽選單' : '開啟導覽選單'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-800/80 bg-[#0B0F18] px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="行動版導覽">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`flex h-11 items-center justify-between rounded px-3 text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.id === 'compare' && (
                    <span className="font-mono text-xs text-slate-400 tabular-nums">
                      {compareCount}/2
                    </span>
                  )}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                onRandomInspect();
                setMobileMenuOpen(false);
              }}
              className="mt-2 flex h-11 items-center justify-center gap-2 rounded border border-cyan-500/40 bg-cyan-500/10 text-xs font-medium text-cyan-300 cursor-pointer"
            >
              <Shuffle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>隨機檢視機體</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
