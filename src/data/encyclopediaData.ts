import {GlossaryTerm, LineageNode, TimelineEvent} from '../types/gundam';

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'uc-0079',
    timeline: 'U.C.',
    year: 'U.C. 0079',
    title: '一年戰爭與「V 作戰」的誕生',
    conflictName: 'One Year War',
    summary:
      '吉翁公國憑藉米諾夫斯基粒子與機動戰士 MS-06 薩克 II 在初期取得壓倒性優勢。地球聯邦軍啟動 V 作戰，於 Side 7 完成搭載小型化光束兵器的 RX-78-2 鋼彈，徹底改寫宇宙戰爭型態。',
    techMilestone: '小型核融合爐 · 月神鈦合金 · E-CAP 光束步槍 · 學習型電腦',
    featuredUnitIds: ['rx-78-2', 'ms-06s', 'ms-07b'],
  },
  {
    id: 'uc-0087',
    timeline: 'U.C.',
    year: 'U.C. 0087',
    title: '格里普斯戰役與可動式骨架時代',
    conflictName: 'Gryps Conflict',
    summary:
      '聯邦激進派「泰坦斯」與反抗組織「幽谷 (A.E.U.G.)」爆發內戰。全可動式骨架 (Movable Frame) 與鋼彈尼姆合金 γ 的成熟，讓高機動可變式機動戰士 MSZ-006 Z 鋼彈正式登上舞台。',
    techMilestone: '可動式骨架 · 360° 全週天駕駛艙 · 可變形穿波機 · 生體感測器',
    featuredUnitIds: ['rx-178', 'msz-006'],
  },
  {
    id: 'uc-0093',
    timeline: 'U.C.',
    year: 'U.C. 0093',
    title: '第二次新吉翁抗爭（夏亞的逆襲）',
    conflictName: 'Second Neo Zeon War',
    summary:
      '由夏亞·阿茲納布爾領導的新吉翁企圖將小行星阿克西斯墜落地球。阿姆羅駕駛由亞納海姆秘密製造的 RX-93 ν 鋼彈迎戰 MSN-04 沙薩比，精神感應框體在軌道邊緣引發了共振奇蹟。',
    techMilestone: '精神感應框體 (Psycoframe) · 翼狀感應砲 (Fin Funnel)',
    featuredUnitIds: ['rx-93', 'msn-04'],
  },
  {
    id: 'uc-0096',
    timeline: 'U.C.',
    year: 'U.C. 0096',
    title: '拉普拉斯之盒與全感應框體機體',
    conflictName: 'Laplace Incident',
    summary:
      '圍繞宇宙世紀憲章原典「拉普拉斯之盒」的爭奪戰中，全機骨架採用精神感應框體打造的 RX-0 獨角獸鋼彈解除封印，以 NT-D 毀滅模式展現超越物理極限的精神共振力量。',
    techMilestone: '全骨架精神感應框體 · NT-D 反新人類系統 · 光束麥格農',
    featuredUnitIds: ['rx-0'],
  },
  {
    id: 'ce-71',
    timeline: 'C.E.',
    year: 'C.E. 71',
    title: '血腥情人節戰爭與核動力自由鋼彈',
    conflictName: 'First Alliance-PLANT War',
    summary:
      '在反中子干擾器克服地球聯合軍「中子干擾器」的能源封鎖後，札夫特秘密開發出核動力與相轉移裝甲結合的 ZGMF-X10A 自由鋼彈，成為三艦同盟平息戰火的核心力量。',
    techMilestone: '反中子干擾器 · 相轉移裝甲 (PS) · HiMAT 全領域高機動系統',
    featuredUnitIds: ['zgmf-x10a'],
  },
  {
    id: 'ac-195',
    timeline: 'A.C.',
    year: 'A.C. 195',
    title: '流星作戰與禁忌原型機覺醒',
    conflictName: 'Eve Wars',
    summary:
      '殖民地組織向地球圈聯合發動「流星作戰」。五架鋼彈的技術母體 XXXG-00W0 飛翼鋼彈零式被重新建造，其極限戰術預知電腦「零式系統」成為影響戰爭走向的雙面刃。',
    techMilestone: '零式系統 (ZERO System) · 雙重破壞來福砲 · 鋼彈尼姆輕量化架構',
    featuredUnitIds: ['xxxg-00w0'],
  },
  {
    id: 'ad-2307',
    timeline: 'A.D.',
    year: 'A.D. 2307',
    title: '天上人武力介入與 GN 太陽爐時代',
    conflictName: 'Celestial Being Armed Interventions',
    summary:
      '超越三大國家群的私人武裝組織「天上人」投入搭載原始 GN 太陽爐的第三世代鋼彈。GN-001 能天使鋼彈以「七劍」近接壓制與 Trans-Am 模式震撼全球軍事體系。',
    techMilestone: '原始 GN 太陽爐 · E-碳素裝甲 · Trans-Am 三倍速爆發模式',
    featuredUnitIds: ['gn-001'],
  },
  {
    id: 'pd-323',
    timeline: 'P.D.',
    year: 'P.D. 323',
    title: '火星鐵華團崛起與厄祭戰遺產',
    conflictName: 'Post Disaster Martian Independence',
    summary:
      '在毀滅性的厄祭戰結束三百年後，火星少年組成的「鐵華團」喚醒了封存於基地底層的 ASW-G-08 獵魔鋼彈，以阿賴耶識神經直連與重物理冷兵器打破末日號角的封鎖。',
    techMilestone: '雙並列亞哈反應爐 · 鋼彈骨架 · 奈米積層裝甲 · 阿賴耶識系統',
    featuredUnitIds: ['asw-g-08'],
  },
];

export const LINEAGE_NODES: LineageNode[] = [
  // Federation / AEUG Lineage
  {
    id: 'lin-rx78',
    unitId: 'rx-78-2',
    modelCode: 'RX-78-2',
    title: '鋼彈（V 作戰初號實戰型）',
    year: 'U.C. 0079',
    branch: 'federation',
    note: '確立 E-CAP 光束步槍與核心區塊設計標準',
  },
  {
    id: 'lin-rx178',
    unitId: 'rx-178',
    modelCode: 'RX-178',
    title: '鋼彈 Mk-II（可動骨架驗證）',
    year: 'U.C. 0087',
    branch: 'federation',
    parentId: 'lin-rx78',
    note: '導入全可動式骨架，數據由幽谷移交亞納海姆',
  },
  {
    id: 'lin-msz006',
    unitId: 'msz-006',
    modelCode: 'MSZ-006',
    title: 'Z 鋼彈（可變機構巔峰）',
    year: 'U.C. 0087',
    branch: 'federation',
    parentId: 'lin-rx178',
    note: '實現單機大氣圈突入與生體感測器應用',
  },
  {
    id: 'lin-rx93',
    unitId: 'rx-93',
    modelCode: 'RX-93',
    title: 'ν 鋼彈（新人類泛用旗艦）',
    year: 'U.C. 0093',
    branch: 'federation',
    parentId: 'lin-msz006',
    note: '回歸高可靠泛用結構，搭載翼狀感應砲與精神感應框體',
  },
  {
    id: 'lin-rx0',
    unitId: 'rx-0',
    modelCode: 'RX-0',
    title: '獨角獸鋼彈（全感應框體）',
    year: 'U.C. 0096',
    branch: 'federation',
    parentId: 'lin-rx93',
    note: '全身骨架精神感應化並裝載 NT-D 反新人類系統',
  },

  // Zeon Lineage
  {
    id: 'lin-ms06s',
    unitId: 'ms-06s',
    modelCode: 'MS-06S',
    title: '夏亞專用薩克 II（指揮官型）',
    year: 'U.C. 0079',
    branch: 'zeon',
    note: '確立流體脈衝驅動與單眼感測器基礎規格',
  },
  {
    id: 'lin-ms07b',
    unitId: 'ms-07b',
    modelCode: 'MS-07B',
    title: '古夫（陸戰近接特化型）',
    year: 'U.C. 0079',
    branch: 'zeon',
    parentId: 'lin-ms06s',
    note: '針對重力下白兵對抗研發電熱鞭與手掌機關砲',
  },
  {
    id: 'lin-msn04',
    unitId: 'msn-04',
    modelCode: 'MSN-04',
    title: '沙薩比（新吉翁總帥旗艦）',
    year: 'U.C. 0093',
    branch: 'zeon',
    parentId: 'lin-ms07b',
    note: '整合吉翁重裝甲傳統與頭部精神感應駕駛艙',
  },

  // Alternative Timelines
  {
    id: 'lin-wing',
    unitId: 'xxxg-00w0',
    modelCode: 'XXXG-00W0',
    title: '飛翼鋼彈零式（A.C. 195）',
    year: 'A.C. 195',
    branch: 'alternative',
    note: 'A.C. 五架鋼彈設計原型，搭載戰術預知零式系統',
  },
  {
    id: 'lin-freedom',
    unitId: 'zgmf-x10a',
    modelCode: 'ZGMF-X10A',
    title: '自由鋼彈（C.E. 71）',
    year: 'C.E. 71',
    branch: 'alternative',
    note: '反中子干擾器核動力 + 相轉移裝甲 + 多重鎖定',
  },
  {
    id: 'lin-exia',
    unitId: 'gn-001',
    modelCode: 'GN-001',
    title: '能天使鋼彈（A.D. 2307）',
    year: 'A.D. 2307',
    branch: 'alternative',
    note: '木星製造原始 GN 太陽爐與七劍格鬥架構',
  },
  {
    id: 'lin-barbatos',
    unitId: 'asw-g-08',
    modelCode: 'ASW-G-08',
    title: '獵魔鋼彈（P.D. 323）',
    year: 'P.D. 323',
    branch: 'alternative',
    note: '雙並列亞哈反應爐 + 鋼彈骨架 + 阿賴耶識直連',
  },
];

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'minovsky-physics',
    term: '米諾夫斯基粒子',
    english: 'Minovsky Particle',
    timeline: 'U.C. 宇宙世紀',
    category: '動力物理',
    definition:
      '核融合反應中產生的特殊基本粒子，散佈後會形成立方晶格構造並全面阻斷長波雷達與無線電通訊。此現象迫使視距外空戰失效，直接催生出適合近距目視戰鬥的人型機動戰士 (MS)。',
  },
  {
    id: 'am-bac',
    term: 'AMBAC 姿態控制系統',
    english: 'Active Mass Balance Auto-Control',
    timeline: 'U.C. 宇宙世紀',
    category: '戰術系統',
    definition:
      '利用機動戰士四肢與尾翼等質量肢體的擺動產生反作用力，使機體在零重力環境下無須消耗任何推進劑即可完成精準的姿態翻滾與瞄準轉向，是人型兵器在太空具備高機動性的力學關鍵。',
  },
  {
    id: 'movable-frame',
    term: '可動式骨架',
    english: 'Movable Frame',
    timeline: 'U.C. 0087 以降',
    category: '裝甲結構',
    definition:
      '將動力管線、致動器與承力結構整合為一體化內骨骼的設計理念，外部裝甲不再承擔結構應力而只負責防禦。不僅大幅輕量化與提升關節活動度，更讓可變式 MS 成為可能。',
  },
  {
    id: 'psycoframe',
    term: '精神感應框體',
    english: 'Psycoframe',
    timeline: 'U.C. 0093 以降',
    category: '感應與火控',
    definition:
      '將微米大小的腦波傳導晶片直接鑄造於機體金屬構造材料之中，將駕駛艙與感應武裝的指令延遲縮短至微秒級，當大量人類意識共鳴時甚至能引發超越現有物理法則的空間現象。',
  },
  {
    id: 'ps-armor',
    term: '相轉移裝甲',
    english: 'Phase Shift Armor',
    timeline: 'C.E. 宇宙紀元',
    category: '裝甲結構',
    definition:
      '對特殊合金通電以引發分子排列相變，使裝甲硬度急遽上升並顯現鮮豔塗裝色彩。在電力充足時幾乎能完全彈開實彈砲火與近戰物理斬擊，僅對高能光束與電力耗盡較為脆弱。',
  },
  {
    id: 'gn-drive',
    term: '原始 GN 太陽爐',
    english: 'Original GN Drive',
    timeline: 'A.D. 西曆紀元',
    category: '動力物理',
    definition:
      '於木星極端環境下完成核心組裝的永久動力機關，透過重粒子衰變持續釋放 GN 粒子。除了近乎無限的電能供給，還能調節機體慣性質量並干擾傳統雷達通訊。',
  },
  {
    id: 'nano-laminate',
    term: '奈米積層裝甲',
    english: 'Nano-Laminate Armor',
    timeline: 'P.D. 災後紀元',
    category: '裝甲結構',
    definition:
      '在亞哈波共振下形成高密度分子結晶塗層的多層複合裝甲，能夠將高能光束能量偏折散逸，迫使 P.D. 紀元戰場重新回歸巨型實體冷兵器與大口徑滑膛砲對決。',
  },
  {
    id: 'alaya-vijnana',
    term: '阿賴耶識系統',
    english: 'Alaya-Vijnana System',
    timeline: 'P.D. 災後紀元',
    category: '感應與火控',
    definition:
      '厄祭戰時期遺留的人機神經直連技術，透過手術於駕駛員脊椎植入奈米接口，讓大腦直接處理機動戰士的空間平衡感與火控資訊，免除學習繁瑣手動操作介面。',
  },
];
