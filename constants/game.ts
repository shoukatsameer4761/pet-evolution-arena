export const PET_TYPES = {
  DOG: 'dog',
  DRAGON: 'dragon',
  ALIEN: 'alien',
  TIGER: 'tiger',
} as const;

export type PetType = typeof PET_TYPES[keyof typeof PET_TYPES];

export const EVOLUTION_STAGES = {
  EGG: 'egg',
  BABY: 'baby',
  TEEN: 'teen',
  ADULT: 'adult',
  LEGENDARY: 'legendary',
} as const;

export type EvolutionStage = typeof EVOLUTION_STAGES[keyof typeof EVOLUTION_STAGES];

export interface PetStats {
  health: number;
  maxHealth: number;
  attack: number;
  speed: number;
  defense: number;
}

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  stage: EvolutionStage;
  level: number;
  xp: number;
  xpToNextLevel: number;
  stats: PetStats;
  abilities: string[];
  skin: string;
  isHatched: boolean;
}

export interface GameState {
  coins: number;
  gems: number;
  food: number;
  currentPet: Pet | null;
  ownedPets: Pet[];
  unlockedStages: EvolutionStage[];
  dailyQuests: Quest[];
  achievements: Achievement[];
  lastLogin: string;
  loginStreak: number;
  battleWins: number;
  battleLosses: number;
  highestArena: number;
  unlockedSkins: string[];
  isVip: boolean;
  vipExpiryDate: string | null;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: { coins?: number; gems?: number; food?: number };
  progress: number;
  target: number;
  completed: boolean;
  claimed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  reward: { coins?: number; gems?: number };
  unlocked: boolean;
  claimed: boolean;
}

export const PET_BASE_STATS: Record<PetType, PetStats> = {
  dog: { health: 100, maxHealth: 100, attack: 15, speed: 12, defense: 10 },
  dragon: { health: 120, maxHealth: 120, attack: 20, speed: 8, defense: 15 },
  alien: { health: 90, maxHealth: 90, attack: 18, speed: 15, defense: 8 },
  tiger: { health: 110, maxHealth: 110, attack: 22, speed: 14, defense: 12 },
};

export const EVOLUTION_LEVELS: Record<EvolutionStage, number> = {
  egg: 0,
  baby: 1,
  teen: 5,
  adult: 15,
  legendary: 30,
};

export const STAGE_MULTIPLIERS: Record<EvolutionStage, number> = {
  egg: 1,
  baby: 1.2,
  teen: 1.5,
  adult: 2,
  legendary: 3,
};

export const ABILITIES: Record<string, { name: string; damage: number; cooldown: number; description: string }> = {
  bite: { name: 'Bite', damage: 20, cooldown: 3, description: 'A sharp bite attack' },
  fireBreath: { name: 'Fire Breath', damage: 35, cooldown: 5, description: 'Breathes scorching flames' },
  mindBlast: { name: 'Mind Blast', damage: 30, cooldown: 4, description: 'Psychic energy attack' },
  clawSwipe: { name: 'Claw Swipe', damage: 25, cooldown: 3, description: 'Swift claw attack' },
  heal: { name: 'Heal', damage: 0, cooldown: 6, description: 'Restores health' },
  ultimate: { name: 'Ultimate Attack', damage: 60, cooldown: 10, description: 'Devastating ultimate move' },
};

export const SHOP_ITEMS = [
  { id: 'food_small', name: 'Snack Pack', description: '25 food items', price: 100, type: 'food' as const, amount: 25 },
  { id: 'food_large', name: 'Feast Bundle', description: '100 food items', price: 350, type: 'food' as const, amount: 100 },
  { id: 'xp_boost', name: 'XP Boost', description: 'Double XP for 1 hour', price: 300, type: 'boost' as const, duration: 3600000 },
  { id: 'xp_boost_long', name: 'Mega XP Boost', description: 'Double XP for 4 hours', price: 1000, type: 'boost' as const, duration: 14400000 },
  { id: 'revive_token', name: 'Revive Token', description: 'Continue after battle defeat', price: 200, type: 'token' as const },
  { id: 'revive_bundle', name: 'Revive Bundle x5', description: '5 revive tokens', price: 800, type: 'token' as const, amount: 5 },
];

export const LEADERBOARD_ENTRIES = [
  { rank: 1, name: 'DragonMaster', pet: 'Dragon', wins: 152, trophies: 3420 },
  { rank: 2, name: 'AlienKing', pet: 'Alien', wins: 148, trophies: 3380 },
  { rank: 3, name: 'TigerQueen', pet: 'Tiger', wins: 145, trophies: 3350 },
  { rank: 4, name: 'DogWhisperer', pet: 'Dog', wins: 140, trophies: 3280 },
  { rank: 5, name: 'EvolutionPro', pet: 'Dragon', wins: 138, trophies: 3240 },
  { rank: 6, name: 'BattleKing', pet: 'Tiger', wins: 135, trophies: 3200 },
  { rank: 7, name: 'PetMaster', pet: 'Alien', wins: 132, trophies: 3150 },
  { rank: 8, name: 'ArenaChamp', pet: 'Dog', wins: 128, trophies: 3080 },
];

export const COLORS = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  accent: '#FFE66D',
  success: '#52C41A',
  warning: '#FAAD14',
  danger: '#FF4D4F',
  background: '#1A1A2E',
  surface: '#16213E',
  surfaceLight: '#0F3460',
  text: '#FFFFFF',
  textMuted: '#A0A0A0',
  gradient: ['#FF6B6B', '#FF8E53', '#FF6B6B'],
};

export const MINI_GAMES = {
  TAP_SPEED: 'tap_speed',
  FOOD_CATCH: 'food_catch',
  DODGE: 'dodge',
} as const;

export type MiniGameType = typeof MINI_GAMES[keyof typeof MINI_GAMES];
