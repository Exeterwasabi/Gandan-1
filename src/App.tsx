/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {useEffect, useState} from 'react';
import {ComparisonView} from './components/ComparisonView';
import {DatabaseView} from './components/DatabaseView';
import {LineageGlossaryView} from './components/LineageGlossaryView';
import {TimelineView} from './components/TimelineView';
import {TopNav} from './components/TopNav';
import {
  GLOSSARY_TERMS,
  LINEAGE_NODES,
  TIMELINE_EVENTS,
} from './data/encyclopediaData';
import {MOBILE_SUITS} from './data/mobileSuits';
import {ActiveTab} from './types/gundam';

const STORAGE_FAVS_KEY = 'ms_archives_favorites_v1';
const STORAGE_COMPARE_KEY = 'ms_archives_compare_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('database');
  const [selectedSuitId, setSelectedSuitId] = useState<string>(MOBILE_SUITS[0].id);

  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FAVS_KEY);
      return saved ? (JSON.parse(saved) as string[]) : ['rx-78-2', 'rx-93'];
    } catch {
      return ['rx-78-2', 'rx-93'];
    }
  });

  const [compareIds, setCompareIds] = useState<[string, string]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_COMPARE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as [string, string];
        if (Array.isArray(parsed) && parsed.length === 2) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return ['rx-78-2', 'ms-06s'];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FAVS_KEY, JSON.stringify(favoriteIds));
    } catch {
      // ignore storage errors
    }
  }, [favoriteIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_COMPARE_KEY, JSON.stringify(compareIds));
    } catch {
      // ignore storage errors
    }
  }, [compareIds]);

  const handleToggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleAddToCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev;
      return [prev[1], id];
    });
  };

  const handleInspectSuit = (id: string) => {
    setSelectedSuitId(id);
    setActiveTab('database');
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const handleRandomInspect = () => {
    const candidates = MOBILE_SUITS.filter((s) => s.id !== selectedSuitId);
    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    if (picked) {
      setSelectedSuitId(picked.id);
      setActiveTab('database');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070A10] text-slate-100 hud-grid-bg">
      <TopNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onRandomInspect={handleRandomInspect}
        compareCount={compareIds.length}
      />

      <main className="flex-1">
        {activeTab === 'database' && (
          <DatabaseView
            suits={MOBILE_SUITS}
            selectedSuitId={selectedSuitId}
            onSelectSuit={setSelectedSuitId}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
            compareIds={compareIds}
            onAddToCompare={handleAddToCompare}
            onOpenCompare={() => setActiveTab('compare')}
          />
        )}

        {activeTab === 'compare' && (
          <ComparisonView
            suits={MOBILE_SUITS}
            compareIds={compareIds}
            onChangeCompareIds={setCompareIds}
            onInspectSuit={handleInspectSuit}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineView
            events={TIMELINE_EVENTS}
            suits={MOBILE_SUITS}
            onInspectSuit={handleInspectSuit}
          />
        )}

        {activeTab === 'lineage' && (
          <LineageGlossaryView
            lineageNodes={LINEAGE_NODES}
            glossaryTerms={GLOSSARY_TERMS}
            onInspectSuit={handleInspectSuit}
          />
        )}
      </main>

      <footer className="border-t border-slate-800/80 bg-[#070A10]/90 py-5">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 px-4 text-xs text-slate-500 sm:flex-row sm:px-6">
          <span>機動戰士鋼彈百科與機體資料庫 · Static SPA Build</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('database')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              機體圖鑑
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('compare')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              性能對比
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('timeline')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              紀元編年史
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('lineage')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              系譜與百科
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
