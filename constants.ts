

import { LevelData, Language, Badge, InventoryItem } from './types';

export const APP_NAME = "Lingo-Sasambo";

// Distinct World Data
export const WORLD_THEMES = {
  [Language.SASAK]: "Kerajaan Sasak",
  [Language.SAMAWA]: "Pelabuhan Samawa",
  [Language.MBOJO]: "Pegunungan Mbojo"
};

export const LEVELS_DATA: Record<Language, LevelData[]> = {
  [Language.SASAK]: [
    { 
      id: 1, 
      title: "Gerbang Sade", 
      theme: "Sapaan (Greetings)", 
      location: "Desa Sade", 
      description: "Pelajari salam hormat khas Sasak.", 
      isLocked: false, 
      stars: 3, 
      x: 20, 
      biome: 'VILLAGE',
      difficulty: 'EASY',
      phonemeFocus: "Intonasi 'e' pepet",
      dialogue: [{ speaker: "Guide", native: "Tabe'", translation: "Salam" }, { speaker: "Target", native: "Tabe' wira", translation: "Salam pahlawan" }]
    },
    { 
      id: 2, 
      title: "Rumah Bale", 
      theme: "Keluarga (Family)", 
      location: "Lombok Tengah", 
      description: "Mengenal sebutan anggota keluarga.", 
      isLocked: false, 
      stars: 2, 
      x: 40, 
      biome: 'VILLAGE',
      difficulty: 'EASY',
      phonemeFocus: "Akhiran 'q' glottal",
      dialogue: [{ speaker: "Guide", native: "Inaq", translation: "Ibu" }, { speaker: "Target", native: "Inaq tiang", translation: "Ibu saya" }]
    },
    { 
      id: 3, 
      title: "Pasar Seni", 
      theme: "Pasar (Market)", 
      location: "Sukarara", 
      description: "Tawar menawar kain tenun.", 
      isLocked: true, 
      stars: 0, 
      x: 65, 
      biome: 'VILLAGE',
      difficulty: 'MEDIUM',
      phonemeFocus: "Nada tanya",
      dialogue: [{ speaker: "Guide", native: "Piro", translation: "Berapa" }, { speaker: "Target", native: "Piro aji", translation: "Berapa harga" }]
    },
    { 
      id: 4, 
      title: "Bau Nyale", 
      theme: "Upacara (Ceremony)", 
      location: "Pantai Kuta", 
      description: "Legenda Putri Mandalika.", 
      isLocked: true, 
      stars: 0, 
      x: 80, 
      biome: 'COAST',
      difficulty: 'HARD',
      phonemeFocus: "Diftong 'au'",
      dialogue: [{ speaker: "Guide", native: "Nyale", translation: "Cacing laut" }, { speaker: "Target", native: "Bau nyale", translation: "Tangkap nyale" }]
    },
  ],
  [Language.SAMAWA]: [
    { 
      id: 1, 
      title: "Dermaga Poto", 
      theme: "Sapaan (Greetings)", 
      location: "Sumbawa Besar", 
      description: "Salam hangat dari pelabuhan.", 
      isLocked: false, 
      stars: 0, 
      x: 25, 
      biome: 'COAST',
      difficulty: 'EASY',
      phonemeFocus: "Vokal 'a' panjang",
      dialogue: [{ speaker: "Guide", native: "Mana", translation: "Apa" }, { speaker: "Target", native: "Mana tau", translation: "Apa kabar" }]
    },
    { 
      id: 2, 
      title: "Istana Tua", 
      theme: "Sejarah (History)", 
      location: "Dalam Loka", 
      description: "Bahasa halus istana.", 
      isLocked: true, 
      stars: 0, 
      x: 50, 
      biome: 'PALACE',
      difficulty: 'MEDIUM',
      phonemeFocus: "Intonasi lembut",
      dialogue: [{ speaker: "Guide", native: "Bala", translation: "Istana" }, { speaker: "Target", native: "Dalam loka", translation: "Istana tua" }]
    },
    { 
      id: 3, 
      title: "Karapan Kerbau", 
      theme: "Aktivitas (Activity)", 
      location: "Sumbawa Barat", 
      description: "Sorak sorai Barapan Kebo.", 
      isLocked: true, 
      stars: 0, 
      x: 75, 
      biome: 'VILLAGE',
      difficulty: 'HARD',
      phonemeFocus: "Konsonan keras",
      dialogue: [{ speaker: "Guide", native: "Kebo", translation: "Kerbau" }, { speaker: "Target", native: "Barapan kebo", translation: "Karapan kerbau" }]
    },
  ],
  [Language.MBOJO]: [
    { 
      id: 1, 
      title: "Uma Lengge", 
      theme: "Sapaan (Greetings)", 
      location: "Wawo", 
      description: "Salam dari pegunungan.", 
      isLocked: false, 
      stars: 0, 
      x: 30, 
      biome: 'MOUNTAIN',
      difficulty: 'EASY',
      phonemeFocus: "Sengau 'ng'",
      dialogue: [{ speaker: "Guide", native: "Lembo", translation: "Sabar" }, { speaker: "Target", native: "Lembo ade", translation: "Sabar hati (Salam)" }]
    },
    { 
      id: 2, 
      title: "Asi Mbojo", 
      theme: "Keluarga (Family)", 
      location: "Kota Bima", 
      description: "Kehidupan di kesultanan.", 
      isLocked: true, 
      stars: 0, 
      x: 60, 
      biome: 'PALACE',
      difficulty: 'MEDIUM',
      phonemeFocus: "Vokal 'o' bulat",
      dialogue: [{ speaker: "Guide", native: "Asi", translation: "Istana" }, { speaker: "Target", native: "Asi mbojo", translation: "Istana Bima" }]
    },
    { 
      id: 3, 
      title: "Gunung Tambora", 
      theme: "Alam (Nature)", 
      location: "Dompu", 
      description: "Istilah alam dan gunung.", 
      isLocked: true, 
      stars: 0, 
      x: 80, 
      biome: 'MOUNTAIN',
      difficulty: 'HARD',
      phonemeFocus: "Getaran 'r'",
      dialogue: [{ speaker: "Guide", native: "Doro", translation: "Gunung" }, { speaker: "Target", native: "Doro tambora", translation: "Gunung Tambora" }]
    },
  ]
};

export const LANGUAGE_INFO = {
  [Language.SASAK]: {
    desc: "Pulihkan 'Spirit of Sasak' di dunia Kerajaan yang penuh tata krama.",
    icon: "🌺",
    greeting: "Tabe' Wira!",
    worldName: "Kerajaan Sasak"
  },
  [Language.SAMAWA]: {
    desc: "Jelajahi Pelabuhan Samawa dan pelajari intonasi yang mendayu.",
    icon: "🌊",
    greeting: "Mana Tau!",
    worldName: "Pelabuhan Samawa"
  },
  [Language.MBOJO]: {
    desc: "Daki Pegunungan Mbojo dan kuasai bahasa yang tegas dan lugas.",
    icon: "⛰️",
    greeting: "Lembo Ade!",
    worldName: "Pegunungan Mbojo"
  }
};

export const MOCK_BADGES: Badge[] = [
  { id: '1', name: 'Ahli Basa Alus', icon: '🙏', description: 'Menyelesaikan Level Sapaan dengan Nilai 100', earned: true },
  { id: '2', name: 'Penutur Murni', icon: '🗣️', description: 'Akurasi suara rata-rata > 90%', earned: false },
  { id: '3', name: 'Juragan Tenun', icon: '🧣', description: 'Mengoleksi 5 motif kain digital', earned: false },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'w-2', name: 'Tenun Ikat Dasar', image: '🧣', type: 'clothing', rarity: 'KETUA_KARANG', description: 'Kain tenun dengan motif geometri sederhana namun berwarna cerah.' },
  { id: 'pm-1', name: 'Keris Sasak', image: '⚔️', type: 'artifact', rarity: 'PEMANGKU', description: 'Keris dengan pamor indah, simbol kehormatan seorang tuan.' },
];

export const MOCK_LEADERBOARD = [
  { rank: 1, name: "Baiq Sari", xp: 12500, avatar: "https://picsum.photos/100/100?random=1", guild: "Sanggar Mandalika" },
  { rank: 2, name: "Lalu Wira", xp: 11200, avatar: "https://picsum.photos/100/100?random=2", guild: "Padepokan Rinjani" },
  { rank: 3, name: "Anda", xp: 4500, avatar: "https://picsum.photos/100/100?random=3", guild: "Petualang Baru" },
];
