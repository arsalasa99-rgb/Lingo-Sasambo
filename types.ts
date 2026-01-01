
export enum ScreenState {
  SPLASH = 'SPLASH',
  ONBOARDING = 'ONBOARDING',
  AUTH = 'AUTH',
  LANG_SELECTION = 'LANG_SELECTION',
  DASHBOARD = 'DASHBOARD',
  STORY_MAP = 'STORY_MAP',
  STORY_LEVEL = 'STORY_LEVEL',
  MINI_GAMES = 'MINI_GAMES',
  MINI_GAME_PLAY = 'MINI_GAME_PLAY',
  PROFILE = 'PROFILE',
  LEADERBOARD = 'LEADERBOARD',
  TANYA_DATU = 'TANYA_DATU',
  COMMUNITY_CHAT = 'COMMUNITY_CHAT'
}

export enum Language {
  SASAK = 'Sasak',
  SAMAWA = 'Samawa',
  MBOJO = 'Mbojo'
}

// Updated Rarity Tiers based on Sasak social hierarchy
export type ItemRarity = 
  | 'JAJARKARANG'   // Rakyat Biasa (Tier 1)
  | 'KETUA_KARANG'  // Pemimpin Sosial (Tier 2)
  | 'PEMANGKU'      // Pemuka Adat/Agama (Tier 3)
  | 'LALU_BAIQ'     // Bangsawan Menengah (Tier 4)
  | 'RADEN_DENDE';  // Bangsawan Tinggi (Tier 5)

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  image: string; // Emoji or URL
  type: 'clothing' | 'artifact' | 'house' | 'food' | 'material' | 'instrument';
  description?: string;
  rarity: ItemRarity; 
}

export interface UserProfile {
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  selectedLanguage: Language | null;
  badges: Badge[];
  inventory: InventoryItem[];
  // Streak System
  streak: number;
  lastLoginDate: string; // ISO Date String
  streakHistory: { date: string; active: boolean }[]; // Last 7 days tracking
  // Track unlocked levels for games. 
  gameProgress: Record<string, number>;
}

export type BiomeType = 'COAST' | 'VILLAGE' | 'FOREST' | 'MOUNTAIN' | 'PALACE' | 'MARKET';

export interface LevelData {
  id: number;
  title: string;
  theme: string; 
  location: string;
  description: string;
  isLocked: boolean;
  stars: number;
  x: number; // For map positioning (0-100%)
  biome: BiomeType;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  phonemeFocus: string; // e.g. "Bunyi 'e' pepet"
  // Dialogue Data for the level (Modified for Accent Training)
  dialogue: {
    speaker: string;
    native: string;
    translation: string;
    phonetic?: string; // Guidance on how to say it
  }[];
}

// Action Props to pass down state modifiers
export interface GameActions {
  addXp: (amount: number) => void;
  unlockBadge: (badgeId: string) => void;
  addItem: (item: InventoryItem) => void;
  unlockGameLevel: (gameKey: string, level: number) => void;
}

// Game Data Interfaces
export interface PasarKataQuestion {
  id: string;
  target: string;
  translation: string;
}

export interface TebakBahasaQuestion {
  id: string;
  question: string; 
  options: string[];
  correctAnswer: string;
}

export interface LegendaQuestion {
  id: string;
  story: string;
  question: string;
  options: string[];
  correctAnswer: string;
}
