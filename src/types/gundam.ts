export type TimelineCode = 'U.C.' | 'C.E.' | 'A.C.' | 'A.D.' | 'P.D.';

export type FactionGroup =
  | '地球聯邦軍'
  | '吉翁系勢力'
  | '幽谷 (A.E.U.G.)'
  | '其他勢力';

export type BlueprintArchetype =
  | 'rx78'
  | 'zaku'
  | 'zeta'
  | 'nu'
  | 'freedom'
  | 'barbatos'
  | 'sazabi'
  | 'unicorn'
  | 'wing'
  | 'exia'
  | 'gouf'
  | 'mk2';

export interface RadarStats {
  armor: number;       // 裝甲防護 (0-100)
  mobility: number;    // 機動力 (0-100)
  firepower: number;   // 火力輸出 (0-100)
  thrust: number;      // 推進加速 (0-100)
  sensor: number;      // 感測索敵 (0-100)
  versatility: number; // 戰術汎用 (0-100)
}

export interface Armament {
  name: string;
  category: '實彈兵器' | '光束兵器' | '格鬥武裝' | '感應兵器' | '特殊武裝';
  outputOrCaliber: string;
  description: string;
}

export interface SubsystemPoint {
  id: 'head' | 'cockpit' | 'reactor' | 'thruster';
  label: string;
  xPercent: number;
  yPercent: number;
  componentName: string;
  detail: string;
}

export interface MobileSuit {
  id: string;
  modelCode: string;
  nameZh: string;
  nameEn: string;
  timeline: TimelineCode;
  eraYear: string;
  yearSort: number;
  faction: string;
  factionGroup: FactionGroup;
  pilot: string;
  manufacturer: string;
  unitType: string;
  role: string;
  imageUrl?: string;
  archetype: BlueprintArchetype;
  specs: {
    headHeightM: number;
    baseWeightT: number;
    fullWeightT: number;
    generatorKw: number;
    thrusterKg: number;
    sensorRadiusM: number;
    armorMaterial: string;
    powerSource: string;
  };
  radar: RadarStats;
  summary: string;
  developmentHistory: string;
  specialSystems: {
    name: string;
    description: string;
  }[];
  armaments: Armament[];
  subsystems: SubsystemPoint[];
}

export interface TimelineEvent {
  id: string;
  timeline: TimelineCode;
  year: string;
  title: string;
  conflictName: string;
  summary: string;
  techMilestone: string;
  featuredUnitIds: string[];
}

export interface LineageNode {
  id: string;
  unitId?: string;
  modelCode: string;
  title: string;
  year: string;
  branch: 'federation' | 'zeon' | 'alternative';
  parentId?: string;
  note: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  english: string;
  timeline: string;
  category: '動力物理' | '裝甲結構' | '感應與火控' | '戰術系統';
  definition: string;
}

export type ActiveTab = 'database' | 'compare' | 'timeline' | 'lineage';
