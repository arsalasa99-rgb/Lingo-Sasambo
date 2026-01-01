
import { PasarKataQuestion, TebakBahasaQuestion, LegendaQuestion, LevelData, Language, BiomeType, InventoryItem } from './types';

// --- HELPER: Randomize Options ---
const createQ = (id: string, question: string, correct: string, distractors: string[]) => {
    const options = [correct, ...distractors].sort(() => Math.random() - 0.5);
    return { id, question, options, correctAnswer: correct };
};

const createL = (id: string, story: string, question: string, correct: string, distractors: string[]) => {
    const options = [correct, ...distractors].sort(() => Math.random() - 0.5);
    return { id, story, question, options, correctAnswer: correct };
};

// --- DYNAMIC LEVEL GENERATOR ---
// Generates 20 levels with increasing question counts (2 -> 3 -> 4 -> 5)
function generateDynamicLevels<T>(pool: T[], totalLevels: number = 20): T[][] {
    const levels: T[][] = [];
    
    for (let i = 0; i < totalLevels; i++) {
        // Determine Question Count: 2 (Lvl 1-3), 3 (Lvl 4-9), 4 (Lvl 10-15), 5 (Lvl 16-20)
        let qCount = 2; 
        if (i >= 3) qCount = 3; 
        if (i >= 9) qCount = 4; 
        if (i >= 15) qCount = 5; 

        const levelQs: T[] = [];
        const poolSize = pool.length;
        
        // Window Logic: Ensure progression from easy (start of array) to hard (end of array)
        // Window covers roughly 30% of the pool to allow variety but keep difficulty bounded
        const windowSize = Math.max(5, Math.floor(poolSize * 0.35));
        const maxStartIndex = Math.max(0, poolSize - windowSize);
        const progress = i / (totalLevels - 1); 
        
        let startIdx = Math.floor(progress * maxStartIndex);
        const usedIndices = new Set<number>();
        
        for (let k = 0; k < qCount; k++) {
            let attempts = 0;
            let pickedIdx = -1;
            while(attempts < 15) {
                const offset = Math.floor(Math.random() * windowSize);
                let tryIdx = (startIdx + offset) % poolSize;
                if (!usedIndices.has(tryIdx)) { pickedIdx = tryIdx; break; }
                attempts++;
            }
            if (pickedIdx === -1) pickedIdx = (startIdx + k) % poolSize;
            usedIndices.add(pickedIdx);
            levelQs.push(pool[pickedIdx]);
        }
        levels.push(levelQs);
    }
    return levels;
}

// --- MASTER INVENTORY ---
export const MASTER_INVENTORY: InventoryItem[] = [
    // TIER 1: JAJARKARANG (Rakyat)
    { id: 'j-1', name: 'Gasing Kayu Asam', image: '🪵', type: 'artifact', rarity: 'JAJARKARANG', description: 'Mainan tradisional dari kayu asam yang kuat, populer di musim kemarau.' },
    { id: 'j-2', name: 'Gerabah Penujak', image: '⚱️', type: 'material', rarity: 'JAJARKARANG', description: 'Periuk tanah liat buatan tangan dari desa Penujak, Lombok Tengah.' },
    { id: 'j-3', name: 'Kopi Tambora', image: '☕', type: 'food', rarity: 'JAJARKARANG', description: 'Kopi robusta dengan aroma khas tanah vulkanik Tambora.' },
    { id: 'j-4', name: 'Caping Tani', image: '👒', type: 'clothing', rarity: 'JAJARKARANG', description: 'Topi bambu pelindung panas saat "Ngebeng" (gembala) di sawah.' },
    { id: 'j-5', name: 'Terasi Lengkoge', image: '🦐', type: 'food', rarity: 'JAJARKARANG', description: 'Terasi udang rebon asli Sumbawa dengan aroma menyengat yang sedap.' },
    
    // TIER 2: KETUA_KARANG (Tokoh Masyarakat)
    { id: 'k-1', name: 'Parang Selong', image: '🗡️', type: 'artifact', rarity: 'KETUA_KARANG', description: 'Parang kerja dengan ukiran sederhana di gagangnya.' },
    { id: 'k-2', name: 'Sapuk Batik', image: '🤕', type: 'clothing', rarity: 'KETUA_KARANG', description: 'Ikat kepala motif batik sederhana untuk acara desa.' },
    { id: 'k-3', name: 'Suling Bambu Tali', image: '🎋', type: 'instrument', rarity: 'KETUA_KARANG', description: 'Alat musik tiup pelipur lara di tengah sawah.' },
    { id: 'k-4', name: 'Topeng Cupak', image: '🎭', type: 'artifact', rarity: 'KETUA_KARANG', description: 'Topeng karakter rakus dalam teater rakyat Sasak.' },
    { id: 'k-5', name: 'Madu Hutan Batu Lanteh', image: '🍯', type: 'food', rarity: 'KETUA_KARANG', description: 'Madu putih langka dari pedalaman hutan Sumbawa.' },

    // TIER 3: PEMANGKU (Adat/Agama)
    { id: 'p-1', name: 'Lontar Takepan', image: '📜', type: 'artifact', rarity: 'PEMANGKU', description: 'Naskah kuno beraksara Jejawan berisi hikayat Monyeh.' },
    { id: 'p-2', name: 'Bokor Kuningan', image: '🥣', type: 'artifact', rarity: 'PEMANGKU', description: 'Wadah air suci untuk ritual "Slametan".' },
    { id: 'p-3', name: 'Sape Klasik', image: '🎸', type: 'instrument', rarity: 'PEMANGKU', description: 'Alat musik petik Bima dengan motif naga.' },
    { id: 'p-4', name: 'Minyak Sumbawa Asli', image: '🏺', type: 'material', rarity: 'PEMANGKU', description: 'Ramuan 44 akar kayu untuk pengobatan patah tulang.' },
    { id: 'p-5', name: 'Rebana Qasidah', image: '🔘', type: 'instrument', rarity: 'PEMANGKU', description: 'Alat musik pengiring syair Islami.' },

    // TIER 4: LALU_BAIQ (Bangsawan Menengah)
    { id: 'lb-1', name: 'Keris Sampari', image: '⚔️', type: 'artifact', rarity: 'LALU_BAIQ', description: 'Keris khas Mbojo/Bima dengan gagang gading.' },
    { id: 'lb-2', name: 'Songket Subahnale', image: '🧣', type: 'clothing', rarity: 'LALU_BAIQ', description: 'Kain tenun Sasak dengan motif geometris rumit.' },
    { id: 'lb-3', name: 'Susu Kuda Liar Fermentasi', image: '🥛', type: 'food', rarity: 'LALU_BAIQ', description: 'Minuman kesehatan para punggawa kerajaan.' },
    { id: 'lb-4', name: 'Kre Alang', image: '🏁', type: 'clothing', rarity: 'LALU_BAIQ', description: 'Sarung tenun Sumbawa dengan benang emas.' },
    { id: 'lb-5', name: 'Kuda Sandel', image: '🐎', type: 'material', rarity: 'LALU_BAIQ', description: 'Kuda pacuan tangkas untuk Main Jaran.' },

    // TIER 5: RADEN_DENDE (Bangsawan Tinggi/Raja)
    { id: 'rd-1', name: 'Keris Ganja Iras Emas', image: '💫', type: 'artifact', rarity: 'RADEN_DENDE', description: 'Pusaka keramat yang bilah dan ganjanya menyatu.' },
    { id: 'rd-2', name: 'Mahkota Binokasih', image: '👑', type: 'clothing', rarity: 'RADEN_DENDE', description: 'Replika mahkota kerajaan kuno.' },
    { id: 'rd-3', name: 'Kitab Bo Sangaji Kai', image: '📖', type: 'artifact', rarity: 'RADEN_DENDE', description: 'Catatan harian Kesultanan Bima yang sangat detail.' },
    { id: 'rd-4', name: 'Baju Lambung Sutra', image: '🧥', type: 'clothing', rarity: 'RADEN_DENDE', description: 'Pakaian adat wanita Sasak dari sutra murni.' },
    { id: 'rd-5', name: 'Bale Lumbung Emas', image: '🏠', type: 'house', rarity: 'RADEN_DENDE', description: 'Miniatur lumbung padi berlapis emas simbol kemakmuran.' },
    { id: 'rd-6', name: 'Permata Mirah Delima', image: '💎', type: 'clothing', rarity: 'RADEN_DENDE', description: 'Batu mulia legenda dari dasar laut selatan.' },
];

// --- STORY LEVELS (Maps) ---
export const generateStoryLevels = (language: Language): LevelData[] => {
    // Data level yang diperkaya dengan fonem spesifik dan konteks budaya nyata
    const sasakLevels = [
        { w: "Tabe", t: "Permisi (Sopan)", f: "Intonasi Rendah" }, { w: "Tiang", t: "Saya (Halus)", f: "Sengau 'ng'" }, { w: "Mamiq", t: "Ayah (Bangsawan)", f: "Q Glottal" },
        { w: "Nyetok", t: "Menyentuh Makanan", f: "Konsonan K" }, { w: "Merariq", t: "Menikah (Lari)", f: "R Getar" }, { w: "Begibung", t: "Makan Bersama", f: "B Bibir" },
        { w: "Sorong Serah", t: "Serah Terima", f: "Desah H" }, { w: "Nyongkolan", t: "Arak-arakan", f: "Ny Palatal" }, { w: "Peresean", t: "Tarung Perisai", f: "E Pepet" },
        { w: "Bale Tani", t: "Rumah Petani", f: "A Terbuka" }, { w: "Berugak", t: "Gazebo", f: "G Tegas" }, { w: "Sade", t: "Desa Adat", f: "E Taling" },
        { w: "Gendang Beleq", t: "Gendang Besar", f: "Q Akhir" }, { w: "Bau Nyale", t: "Tangkap Cacing", f: "Diftong Au" }, { w: "Mandalika", t: "Putri Legenda", f: "M Bilabial" },
        { w: "Sembalun", t: "Lembah Gunung", f: "S Desis" }, { w: "Rinjani", t: "Gunung Suci", f: "I Tajam" }, { w: "Segara Anak", t: "Danau Kawah", f: "K Mati" },
        { w: "Plecing", t: "Sambal Kangkung", f: "Pl Kluster" }, { w: "Ayam Taliwang", t: "Ayam Bakar", f: "Ng Sengau" }, { w: "Sate Bulayak", t: "Sate Lontar", f: "Y Luncur" },
        { w: "Lumbung", t: "Tempat Padi", f: "L Lidah" }, { w: "Tenun", t: "Kain Ikat", f: "T Gigi" }, { w: "Sukarara", t: "Desa Tenun", f: "R Getar Kuat" },
        { w: "Bayan", t: "Masjid Kuno", f: "B Plosif" }, { w: "Wektu Telu", t: "Tradisi Lama", f: "W Bibir" }, { w: "Lebaran Topat", t: "Hari Raya Ketupat", f: "P Letup" },
        { w: "Gili Trawangan", t: "Pulau Kecil", f: "Tr Kluster" }, { w: "Mataram", t: "Ibukota", f: "M Akhir" }, { w: "Sasambo", t: "Persatuan NTB", f: "S Desis" }
    ];
    // Mapping placeholder for simplicity, real app would have specific Samawa/Mbojo lists of 30 items each
    const targetList = sasakLevels; 
    const levels: LevelData[] = [];
    const biomes: BiomeType[] = ['VILLAGE', 'COAST', 'MARKET', 'FOREST', 'MOUNTAIN', 'PALACE'];

    targetList.forEach((item, index) => {
        const id = index + 1;
        let difficulty: 'EASY' | 'MEDIUM' | 'HARD' = 'EASY';
        if (id > 10) difficulty = 'MEDIUM';
        if (id > 20) difficulty = 'HARD';
        levels.push({
            id: id,
            title: `Level ${id}`,
            theme: item.f,
            location: difficulty,
            description: `Ucapkan: "${item.w}"`,
            isLocked: false,
            stars: 0,
            x: 50 + (35 * Math.sin(index * 0.8)),
            biome: biomes[index % biomes.length],
            difficulty: difficulty,
            phonemeFocus: item.f,
            dialogue: [{ speaker: "Native", native: item.w, translation: item.t }]
        });
    });
    return levels;
};

// =================================================================================
// --- DATA POOLS (ENRICHED & AUTHENTIC) ---
// =================================================================================

const PASAR_KATA_POOL = {
    [Language.SASAK]: [
        // Level 1-5: Dasar & Sapaan
        { id: 's-1', target: "Tabe wira", translation: "Permisi pahlawan/saudara" },
        { id: 's-2', target: "Mbe laiq", translation: "Mau kemana (Pergi kemana)" },
        { id: 's-3', target: "Ndek araq kepeng", translation: "Tidak ada uang" },
        { id: 's-4', target: "Silaq mampir juluk", translation: "Silakan mampir dulu" },
        { id: 's-5', target: "Tiang lalo midang", translation: "Saya pergi apel/bertamu" },
        // Level 6-12: Kegiatan & Makanan
        { id: 's-6', target: "Mangan kandoq plecing", translation: "Makan lauk plecing" },
        { id: 's-7', target: "Inaq masak ares", translation: "Ibu memasak sayur batang pisang" },
        { id: 's-8', target: "Lalo begibung leq masjid", translation: "Pergi makan bersama di masjid" },
        { id: 's-9', target: "Bau nyale leq pantai", translation: "Menangkap cacing laut di pantai" },
        { id: 's-10', target: "Amaq ngebeng sampi", translation: "Bapak menggembala sapi" },
        // Level 13-20: Adat & Filosofi (Complex)
        { id: 's-11', target: "Sorong serah aji krama", translation: "Serah terima upacara adat" },
        { id: 's-12', target: "Mbait wali leq wali", translation: "Mengambil wali pada wali (akad)" },
        { id: 's-13', target: "Sopo angen sopo gumi", translation: "Satu hati satu bumi (Bersatu)" },
        { id: 's-14', target: "Tindih gumi paer sasak", translation: "Setia menjaga tanah air Sasak" },
        { id: 's-15', target: "Adat luir gama", translation: "Adat berjalan iring agama" },
        { id: 's-16', target: "Ndek te bani ngelawan dengan toaq", translation: "Kita tidak berani melawan orang tua" },
        { id: 's-17', target: "Solah solah side lampaq", translation: "Hati-hatilah anda berjalan" },
        { id: 's-18', target: "Pepadu peresean wah siq", translation: "Petarung peresean sudah siap" },
        { id: 's-19', target: "Gendang beleq nuntun penganten", translation: "Gendang besar mengiringi pengantin" },
        { id: 's-20', target: "Jari manusia sak tatas", translation: "Menjadi manusia yang sadar/mampu" }
    ],
    [Language.SAMAWA]: [
        // Level 1-5
        { id: 'sm-1', target: "Mana tau", translation: "Apa kabar / Kemana orang" },
        { id: 'sm-2', target: "Kaji lalo mandi", translation: "Saya pergi mandi" },
        { id: 'sm-3', target: "Mangan jangan sepat", translation: "Makan sayur sepat" },
        { id: 'sm-4', target: "Ina lalo ka pasar", translation: "Ibu pergi ke pasar" },
        { id: 'sm-5', target: "Bapak nginum kupi", translation: "Bapak minum kopi" },
        // Level 6-12
        { id: 'sm-6', target: "Lalo nonton main jaran", translation: "Pergi menonton pacuan kuda" },
        { id: 'sm-7', target: "Barapan kebo di samongkat", translation: "Balapan kerbau di Samongkat" },
        { id: 'sm-8', target: "Sandro ubat tau sakit", translation: "Tabib mengobati orang sakit" },
        { id: 'sm-9', target: "Datang ko dalam loka", translation: "Datang ke istana tua" },
        { id: 'sm-10', target: "Basiru bangun bala", translation: "Gotong royong bangun rumah" },
        // Level 13-20
        { id: 'sm-11', target: "Sabalong samalewa tana samawa", translation: "Membangun bersama tanah Sumbawa" },
        { id: 'sm-12', target: "Nyorong panganten rea", translation: "Mengantar pengantin besar" },
        { id: 'sm-13', target: "Adat barenti ko syara", translation: "Adat bersendi pada syara (agama)" },
        { id: 'sm-14', target: "Syara barenti ko kitabullah", translation: "Syara bersendi pada Kitab Allah" },
        { id: 'sm-15', target: "Takit ko nene kangila", translation: "Takut pada Tuhan Yang Maha Kuasa" },
        { id: 'sm-16', target: "Saling siki saling satotang", translation: "Saling memperbaiki saling mengingatkan" },
        { id: 'sm-17', target: "Lema bariri pariri", translation: "Agar menjadi baik, perbaikilah" },
        { id: 'sm-18', target: "Tu samawa rea gama", translation: "Orang Sumbawa besar agamanya" },
        { id: 'sm-19', target: "Intan rua gantang", translation: "Seperti dua sisi mata uang" },
        { id: 'sm-20', target: "Puter lawas nonda", translation: "Memutar syair (lawas) yang tiada" }
    ],
    [Language.MBOJO]: [
        // Level 1-5
        { id: 'm-1', target: "Au habba", translation: "Apa kabar" },
        { id: 'm-2', target: "Mada la'o", translation: "Saya pergi" },
        { id: 'm-3', target: "Ngaha u'a", translation: "Makan sudah" },
        { id: 'm-4', target: "Lembo ade", translation: "Sabar hati / Maaf / Permisi" },
        { id: 'm-5', target: "Mai ta", translation: "Mari sini" },
        // Level 6-12
        { id: 'm-6', target: "La'o aka uma", translation: "Pergi ke sawah/ladang" },
        { id: 'm-7', target: "Rimpu mpida raba", translation: "Berhijab sarung menutup wajah" },
        { id: 'm-8', target: "Hanta ua pua", translation: "Mengantar sirih pinang (Maulid)" },
        { id: 'm-9', target: "Pacoa jara di panda", translation: "Pacuan kuda di Panda" },
        { id: 'm-10', target: "Nara oi mada", translation: "Minum air mata air" },
        // Level 13-20
        { id: 'm-11', target: "Maja labo dahu di ruma", translation: "Malu dan takut pada Tuhan" },
        { id: 'm-12', target: "Nggahi rawi pahu", translation: "Satunya kata dan perbuatan" },
        { id: 'm-13', target: "Karawi kaboju ma taho", translation: "Kerja sungguh-sungguh yang baik" },
        { id: 'm-14', target: "Kasama weki kasama dana", translation: "Kebersamaan diri kebersamaan tanah" },
        { id: 'm-15', target: "Taho ro ne'e weki", translation: "Baik dan menyayangi sesama" },
        { id: 'm-16', target: "Kalembo ade ma na'e", translation: "Kesabaran hati yang besar" },
        { id: 'm-17', target: "Dou mbojo dou ma nggahi", translation: "Orang Bima orang yang berjanji" },
        { id: 'm-18', target: "Teku ma nggahi rawi pahu", translation: "Tegakkan satunya kata dan perbuatan" },
        { id: 'm-19', target: "Aina ngaha riba", translation: "Jangan memakan riba" },
        { id: 'm-20', target: "Ede mpa dou mbojo", translation: "Itulah orang Bima" }
    ]
};

const TEBAK_BAHASA_POOL = {
    [Language.SASAK]: [
        createQ('1-1', "Apa arti 'Inaq'?", "Ibu", ["Bapak", "Kakak", "Adik"]), 
        createQ('1-2', "Apa arti 'Mamiq'?", "Ayah (Bangsawan)", ["Ibu", "Paman", "Rakyat"]),
        createQ('1-3', "Apa bahasa halusnya 'Makan'?", "Majengan", ["Mangan", "Neda", "Wareg"]),
        createQ('1-4', "Apa arti 'Batur'?", "Teman", ["Musuh", "Orang Lain", "Tamu"]),
        createQ('1-5', "Apa itu 'Bale'?", "Rumah", ["Sawah", "Pasar", "Lumbung"]),
        createQ('1-6', "Apa arti 'Merariq'?", "Menikah (Lari)", ["Pacaran", "Bertunangan", "Bercerai"]),
        createQ('1-7', "Apa arti 'Nyetok'?", "Menyentuh Makanan (Etiket)", ["Memukul", "Menunjuk", "Membuang"]),
        createQ('1-8', "Apa arti 'Pepadu'?", "Petarung Peresean", ["Penari", "Penyanyi", "Pedagang"]),
        createQ('1-9', "Apa itu 'Berugak'?", "Gazebo/Saung", ["Dapur", "Kamar Mandi", "Pagar"]),
        createQ('1-10', "Apa arti 'Solah'?", "Bagus/Baik", ["Jelek", "Rusak", "Jahat"]),
        createQ('1-11', "Apa arti 'Piro'?", "Berapa", ["Siapa", "Dimana", "Kapan"]),
        createQ('1-12', "Apa itu 'Cidomo'?", "Delman Khas Lombok", ["Mobil", "Motor", "Sepeda"]),
        createQ('1-13', "Apa arti 'Mbe Laiq'?", "Mau Kemana", ["Siapa Nama", "Jam Berapa", "Apa Kabar"]),
        createQ('1-14', "Apa arti 'Tindih'?", "Setia/Teguh", ["Lari", "Takut", "Berani"]),
        createQ('1-15', "Apa itu 'Ares'?", "Sayur Batang Pisang", ["Sayur Nangka", "Daging Sapi", "Ikan Bakar"]),
        createQ('1-16', "Apa arti 'Begibung'?", "Makan Bersama (Satu Nampan)", ["Makan Sendiri", "Puasa", "Masak"]),
        createQ('1-17', "Apa arti 'Midang'?", "Apel/Bertamu ke Gadis", ["Melamar", "Menikah", "Pergi"]),
        createQ('1-18', "Apa bahasa Sasak 'Air'?", "Aiq", ["Banyu", "Toyo", "Danu"]),
        createQ('1-19', "Apa arti 'Gumi'?", "Bumi/Tanah", ["Langit", "Laut", "Api"]),
        createQ('1-20', "Apa itu 'Sorong Serah'?", "Upacara Serah Terima Adat", ["Upacara Panen", "Upacara Hujan", "Upacara Lahir"])
    ],
    [Language.SAMAWA]: [
        createQ('2-1', "Apa arti 'Ina'?", "Ibu", ["Bapak", "Nenek", "Tante"]), 
        createQ('2-2', "Apa arti 'Bapak'?", "Ayah", ["Paman", "Kakek", "Kakak"]),
        createQ('2-3', "Apa itu 'Bala'?", "Istana/Rumah Besar", ["Gubuk", "Lumbung", "Pasar"]),
        createQ('2-4', "Apa arti 'Basiru'?", "Gotong Royong", ["Kerja Sendiri", "Berantem", "Tidur"]),
        createQ('2-5', "Apa itu 'Sepat'?", "Masakan Kuah Asam Khas", ["Ikan Goreng", "Sate", "Gulai"]),
        createQ('2-6', "Apa arti 'Sandro'?", "Dukun/Tabib", ["Guru", "Petani", "Nelayan"]),
        createQ('2-7', "Apa arti 'Lawas'?", "Puisi Lisan Sumbawa", ["Lagu Pop", "Cerita Rakyat", "Berita"]),
        createQ('2-8', "Apa arti 'Mana Tau'?", "Apa Kabar", ["Siapa Nama", "Mau Kemana", "Jam Berapa"]),
        createQ('2-9', "Apa arti 'Nyorong'?", "Mengantar Hantaran Nikah", ["Mengambil", "Meminta", "Menahan"]),
        createQ('2-10', "Apa itu 'Barapan Kebo'?", "Karapan Kerbau", ["Balap Kuda", "Adu Ayam", "Lari"]),
        createQ('2-11', "Apa arti 'Olat'?", "Gunung", ["Laut", "Sungai", "Danau"]),
        createQ('2-12', "Apa arti 'Lito'?", "Batu", ["Pasir", "Tanah", "Kayu"]),
        createQ('2-13', "Apa arti 'Ai'?", "Air", ["Api", "Udara", "Asap"]),
        createQ('2-14', "Apa arti 'Turas'?", "Tidur", ["Bangun", "Mimpi", "Diam"]),
        createQ('2-15', "Apa arti 'Pariri'?", "Memperbaiki/Merawat", ["Merusak", "Membuang", "Melihat"]),
        createQ('2-16', "Apa itu 'Sakeco'?", "Musik Tradisional", ["Tarian", "Lukisan", "Makanan"]),
        createQ('2-17', "Apa arti 'Samalewa'?", "Membangun Bersama", ["Hancur", "Sendiri", "Pisah"]),
        createQ('2-18', "Apa arti 'Rea'?", "Besar", ["Kecil", "Panjang", "Pendek"]),
        createQ('2-19', "Apa itu 'Kre Alang'?", "Sarung Tenun Sumbawa", ["Batik", "Songket", "Kain Polos"]),
        createQ('2-20', "Apa arti 'Tau'?", "Orang/Manusia", ["Hewan", "Tahu", "Tempe"])
    ],
    [Language.MBOJO]: [
        createQ('3-1', "Apa arti 'Mada'?", "Saya (Halus)", ["Kamu", "Dia", "Mereka"]), 
        createQ('3-2', "Apa arti 'Ita'?", "Anda (Sopan)", ["Aku", "Dia", "Kita"]),
        createQ('3-3', "Apa itu 'Uma'?", "Rumah/Ladang", ["Sawah", "Kebun", "Pasar"]),
        createQ('3-4', "Apa arti 'Lembo Ade'?", "Sabar Hati/Maaf", ["Marah", "Senang", "Sedih"]),
        createQ('3-5', "Apa itu 'Rimpu'?", "Hijab Sarung Khas Bima", ["Topi", "Baju", "Celana"]),
        createQ('3-6', "Apa arti 'Maja'?", "Malu", ["Takut", "Berani", "Sedih"]),
        createQ('3-7', "Apa arti 'Dahu'?", "Takut (pada Tuhan)", ["Berani", "Marah", "Senang"]),
        createQ('3-8', "Apa itu 'Uma Lengge'?", "Rumah Lumbung Kerucut", ["Istana", "Masjid", "Sekolah"]),
        createQ('3-9', "Apa arti 'Nggahi'?", "Berkata/Bicara", ["Berbuat", "Berlari", "Berdoa"]),
        createQ('3-10', "Apa arti 'Rawi'?", "Berbuat/Bekerja", ["Berkata", "Melihat", "Mendengar"]),
        createQ('3-11', "Apa arti 'Dou Mbojo'?", "Orang Bima", ["Orang Asing", "Wisatawan", "Pejabat"]),
        createQ('3-12', "Apa itu 'Tembe Nggoli'?", "Sarung Tenun Bima", ["Batik", "Sutra", "Jeans"]),
        createQ('3-13', "Apa arti 'Ngaha'?", "Makan", ["Minum", "Tidur", "Mandi"]),
        createQ('3-14', "Apa arti 'Nara'?", "Minum", ["Makan", "Masak", "Cuci"]),
        createQ('3-15', "Apa arti 'Doro'?", "Gunung", ["Lembah", "Pantai", "Laut"]),
        createQ('3-16', "Apa arti 'Moti'?", "Laut", ["Sungai", "Kolam", "Air"]),
        createQ('3-17', "Apa arti 'Jara'?", "Kuda", ["Sapi", "Kerbau", "Kambing"]),
        createQ('3-18', "Apa arti 'Kaboju'?", "Sungguh-sungguh", ["Main-main", "Malas", "Santai"]),
        createQ('3-19', "Apa arti 'Taho'?", "Baik", ["Jahat", "Buruk", "Salah"]),
        createQ('3-20', "Apa arti 'Asi'?", "Istana", ["Rumah", "Gubuk", "Toko"])
    ]
};

const LEGENDA_POOL = {
    [Language.SASAK]: [
        createL('ls-1', "Putri Mandalika menceburkan diri ke laut selatan.", "Ia dipercaya berubah menjadi apa?", "Nyale (Cacing Laut)", ["Ikan Duyung", "Batu Karang", "Burung Camar"]),
        createL('ls-2', "Dewi Anjani dipercaya sebagai penguasa gaib di...", "Gunung mana?", "Gunung Rinjani", ["Gunung Tambora", "Gunung Agung", "Gunung Semeru"]),
        createL('ls-3', "Masjid Bayan Beleq adalah saksi sejarah penyebaran Islam...", "Aliran apa?", "Wektu Telu", ["Muhammadiyah", "NU", "Wahabi"]),
        createL('ls-4', "Tari Gendang Beleq awalnya digunakan untuk...", "Acara apa?", "Mengantar Prajurit Perang", ["Pesta Panen", "Sunatan", "Lomba Lari"]),
        createL('ls-5', "Tradisi tarung perisai rotan untuk meminta hujan disebut...", "Apa?", "Peresean", ["Pencak Silat", "Karate", "Gulat"]),
        createL('ls-6', "Desa Sade terkenal dengan lantai rumahnya yang dilapisi...", "Kotoran apa?", "Kotoran Kerbau/Sapi", ["Kotoran Kuda", "Tanah Liat Saja", "Semen"]),
        createL('ls-7', "Raja terakhir Kerajaan Selaparang dikalahkan oleh...", "Kerajaan mana?", "Karangasem (Bali)", ["Majapahit", "Gowa", "Bima"]),
        createL('ls-8', "Senjata khas Suku Sasak yang sering diselipkan di pinggang...", "Apa namanya?", "Keris", ["Parang", "Celurit", "Pedang"]),
        createL('ls-9', "Motif kain tenun Sasak yang terkenal dan mahal...", "Apa namanya?", "Subahnale", ["Rangrang", "Endek", "Batik"]),
        createL('ls-10', "Makanan ayam bakar pedas dengan bumbu pelalah disebut...", "Apa?", "Ayam Taliwang", ["Ayam Betutu", "Ayam Pop", "Ayam Penyet"]),
        createL('ls-11', "Danau kawah di puncak Rinjani bernama...", "Apa?", "Segara Anak", ["Danau Toba", "Ranu Kumbolo", "Danau Batur"]),
        createL('ls-12', "Upacara mencukur rambut bayi pertama kali di Lombok disebut...", "Apa?", "Ngurisan", ["Nyongkolan", "Merariq", "Bau Nyale"]),
        createL('ls-13', "Putri Mandalika diperebutkan oleh...", "Berapa pangeran?", "Banyak Pangeran", ["Satu Pangeran", "Dua Raja", "Rakyat Jelata"]),
        createL('ls-14', "Rumah adat Sasak dengan atap melengkung seperti lumbung disebut...", "Apa?", "Bale Lumbung", ["Bale Tani", "Bale Jajar", "Berugak"]),
        createL('ls-15', "Alat musik tiup khas Sasak yang suaranya melengking...", "Apa?", "Seruling/Preret", ["Terompet", "Saxophone", "Harmonika"]),
        createL('ls-16', "Tokoh penyebar Islam pertama di Lombok...", "Siapa?", "Sunan Prapen", ["Wali Songo", "Datuk Ri Bandang", "Tuan Guru"]),
        createL('ls-17', "Desa penghasil gerabah tanah liat...", "Desa apa?", "Banyumulek", ["Sukarara", "Sade", "Sembalun"]),
        createL('ls-18', "Tradisi arak-arakan pengantin Sasak ke rumah mempelai wanita...", "Disebut?", "Nyongkolan", ["Midang", "Nyetok", "Begibung"]),
        createL('ls-19', "Sayur khas Lombok berbahan batang pisang muda...", "Apa?", "Ares", ["Plecing", "Beberuk", "Sayur Asem"]),
        createL('ls-20', "Slogan pariwisata Lombok dan Sumbawa...", "Apa?", "Pesona Lombok Sumbawa", ["Wonderful Indonesia", "Visit NTB", "Lombok Bangkit"])
    ],
    [Language.SAMAWA]: [
        createL('lsm-1', "Istana Dalam Loka dibangun tanpa paku besi, melainkan...", "Menggunakan apa?", "Pasak Kayu", ["Lem", "Tali Ijuk", "Semen"]),
        createL('lsm-2', "Jumlah tiang Istana Dalam Loka melambangkan...", "Apa?", "Asmaul Husna (99)", ["Jumlah Nabi", "Jumlah Desa", "Umur Sultan"]),
        createL('lsm-3', "Barapan Kebo dilakukan di sawah basah untuk...", "Tujuan apa?", "Menyambut Musim Tanam", ["Meminta Hujan", "Pesta Pernikahan", "Lomba Lari"]),
        createL('lsm-4', "Masakan ikan kuah asam khas Sumbawa yang segar...", "Apa?", "Sepat", ["Singang", "Soto", "Gecok"]),
        createL('lsm-5', "Pulau tempat Putri Diana pernah berlibur di Sumbawa...", "Pulau apa?", "Pulau Moyo", ["Pulau Bungin", "Pulau Komodo", "Gili Trawangan"]),
        createL('lsm-6', "Susu Kuda Liar Sumbawa terkenal karena...", "Proses apa?", "Fermentasi Alami", ["Dimasak", "Diberi Gula", "Dibekukan"]),
        createL('lsm-7', "Tanjung Menangis dinamakan demikian karena legenda...", "Siapa?", "Putri Lala Bulaeng", ["Putri Mandalika", "Bawang Putih", "Malin Kundang"]),
        createL('lsm-8', "Kain tenun khas Sumbawa dengan benang emas/perak...", "Disebut?", "Kre Alang", ["Songket", "Batik", "Tenun Ikat"]),
        createL('lsm-9', "Slogan Kabupaten Sumbawa...", "Apa?", "Sabalong Samalewa", ["Maja Labo Dahu", "Patuh Karya", "Bersinar"]),
        createL('lsm-10', "Alat musik gesek khas Sumbawa...", "Apa?", "Rabap (Rebab)", ["Biola", "Cello", "Gitar"]),
        createL('lsm-11', "Permen tradisional dari susu kerbau...", "Apa?", "Manjareal", ["Dodol", "Wajik", "Jenang"]),
        createL('lsm-12', "Upacara adat hantaran pernikahan di Sumbawa...", "Disebut?", "Nyorong", ["Lamaran", "Resepsi", "Akad"]),
        createL('lsm-13', "Seni bertutur/bernyanyi diiringi rebana...", "Apa?", "Sakeco", ["Karaoke", "Orkestra", "Gambus"]),
        createL('lsm-14', "Gunung Tambora meletus dahsyat pada tahun...", "Tahun berapa?", "1815", ["1945", "1883", "2004"]),
        createL('lsm-15', "Joki cilik dalam pacuan kuda Sumbawa disebut...", "Apa?", "Joki", ["Rider", "Pilot", "Sais"]),
        createL('lsm-16', "Kerbau pemenang Barapan Kebo dinilai dari...", "Apa?", "Mengenai Saka (Kayu)", ["Kecepatan Lari", "Besar Badan", "Warna Kulit"]),
        createL('lsm-17', "Masakan daging sapi/kerbau khas Sumbawa dengan kuah kental...", "Apa?", "Singang", ["Rendang", "Semur", "Rawon"]),
        createL('lsm-18', "Pulau terpadat di dunia yang ada di Sumbawa...", "Pulau apa?", "Pulau Bungin", ["Pulau Moyo", "Pulau Medang", "Pulau Panjang"]),
        createL('lsm-19', "Tabib tradisional Sumbawa disebut...", "Apa?", "Sandro", ["Dukun", "Dokter", "Suhu"]),
        createL('lsm-20', "Istana tempat tinggal Sultan Sumbawa saat ini...", "Apa?", "Bala Kuning", ["Dalam Loka", "Bale Puti", "Keraton"])
    ],
    [Language.MBOJO]: [
        createL('lm-1', "Falsafah hidup masyarakat Bima adalah...", "Apa?", "Maja Labo Dahu", ["Sabalong Samalewa", "Sopo Angen", "Gotong Royong"]),
        createL('lm-2', "Rimpu Mpida (menutup wajah) digunakan oleh...", "Siapa?", "Wanita Belum Menikah", ["Wanita Sudah Menikah", "Nenek-nenek", "Anak Kecil"]),
        createL('lm-3', "Uma Lengge berbentuk kerucut digunakan untuk...", "Menyimpan apa?", "Padi (Lumbung)", ["Emas", "Senjata", "Air"]),
        createL('lm-4', "Istana Kesultanan Bima yang sekarang menjadi museum...", "Apa?", "Asi Mbojo", ["Asi Bou", "Dalam Loka", "Bale Tani"]),
        createL('lm-5', "Sultan Bima pertama yang memeluk Islam...", "Siapa?", "Sultan Abdul Kahir", ["Sultan Hasanuddin", "Sultan Salahuddin", "Sultan Agung"]),
        createL('lm-6', "Pantai di Bima dengan pasir berwarna merah muda...", "Pantai apa?", "Pantai Pink (Lambu)", ["Pantai Lawata", "Pantai Kalaki", "Pantai Kuta"]),
        createL('lm-7', "Upacara adat mengantar sirih pinang ke istana saat Maulid...", "Disebut?", "Hanta Ua Pua", ["Siraman", "Grebeg Maulid", "Tabuik"]),
        createL('lm-8', "Kain sarung tenun khas Bima yang bisa dipakai lari...", "Disebut?", "Tembe Nggoli", ["Batik", "Sutra", "Ulos"]),
        createL('lm-9', "Pahlawan Nasional dari Bima...", "Siapa?", "Sultan Muhammad Salahuddin", ["Pattimura", "Diponegoro", "Cut Nyak Dien"]),
        createL('lm-10', "Gunung berapi aktif di lepas pantai Bima...", "Apa?", "Sangeang Api", ["Tambora", "Rinjani", "Krakatau"]),
        createL('lm-11', "Legenda 'Wadu Ntanda Rahi' menceritakan istri yang...", "Menjadi apa?", "Batu (Menunggu Suami)", ["Pohon", "Burung", "Ikan"]),
        createL('lm-12', "Tari perang khas Bima menggunakan tombak dan perisai...", "Apa?", "Buja Kadanda", ["Tari Piring", "Tari Saman", "Tari Kecak"]),
        createL('lm-13', "Masjid Terapung di Kota Bima terletak di...", "Pantai mana?", "Ama Hami", ["Lawata", "Wane", "Sape"]),
        createL('lm-14', "Minuman khas Bima dari susu kuda liar...", "Apa?", "Susu Kuda Liar", ["Yoghurt", "Kefir", "Susu Kedelai"]),
        createL('lm-15', "Makanan khas Bima dari ikan bandeng bakar...", "Disebut?", "Uta Londe Puru", ["Ikan Bakar Jimbaran", "Pecel Lele", "Mangut"]),
        createL('lm-16', "Makam raja-raja Bima terletak di bukit...", "Apa?", "Dana Traha", ["Gunung Piring", "Makam Pahlawan", "Imogiri"]),
        createL('lm-17', "Rimpu Colo (wajah terbuka) digunakan oleh...", "Siapa?", "Wanita Sudah Menikah", ["Gadis", "Anak-anak", "Janda"]),
        createL('lm-18', "Alat musik gesek dari tempurung kelapa khas Bima...", "Apa?", "Biola Katongga", ["Rebab", "Cello", "Gitar"]),
        createL('lm-19', "Ikat kepala khas pria Bima disebut...", "Apa?", "Sambolo", ["Udeng", "Blangkon", "Peci"]),
        createL('lm-20', "Pacuan kuda tradisional Bima menggunakan joki...", "Siapa?", "Anak-anak (Joki Cilik)", ["Dewasa", "Wanita", "Orang Tua"])
    ]
};

// --- MISTERI POOL (Enriched clues) ---
const MISTERI_POOL = [
    { target: "Ayam Taliwang", culture: "Sasak", clues: ["Berasal dari Karang Taliwang.", "Ayam kampung muda dibakar.", "Bumbunya pedas menyengat (Pelalah)."], options: ["Ayam Taliwang", "Sate Bulayak", "Ayam Betutu", "Bebek Bengil"] },
    { target: "Susu Kuda Liar", culture: "Mbojo", clues: ["Minuman kesehatan para Sultan.", "Tahan lama tanpa pengawet.", "Rasanya asam segar (fermentasi)."], options: ["Susu Kuda Liar", "Tuak Manis", "Susu Sapi", "Yoghurt"] },
    { target: "Madu Sumbawa", culture: "Samawa", clues: ["Diambil dari hutan lebat.", "Khasiatnya terkenal se-Nusantara.", "Warnanya putih atau kuning keemasan."], options: ["Madu Sumbawa", "Gula Merah", "Sirup", "Kecap"] },
    { target: "Rimpu", culture: "Mbojo", clues: ["Pakaian wanita muslimah Bima.", "Menggunakan dua lembar sarung.", "Hanya terlihat mata (Mpida) atau wajah (Colo)."], options: ["Rimpu", "Jilbab", "Kebaya", "Songket"] },
    { target: "Gasing", culture: "Sasambo", clues: ["Permainan adu putaran.", "Terbuat dari kayu keras (asam/kemuning).", "Dipukul dengan tali pelintir."], options: ["Gasing", "Layangan", "Kelereng", "Yoyo"] },
    { target: "Plecing Kangkung", culture: "Sasak", clues: ["Sayuran wajib di Lombok.", "Kangkung air yang renyah.", "Disajikan dengan sambal tomat terasi segar."], options: ["Plecing Kangkung", "Gado-gado", "Pecel", "Sayur Asem"] },
    { target: "Sepat", culture: "Samawa", clues: ["Ikan bakar kuah asam.", "Bumbunya dibakar dulu.", "Kadang dicelup batu panas (batu lito)."], options: ["Sepat", "Soto", "Rawon", "Sop Buntut"] },
    { target: "Gendang Beleq", culture: "Sasak", clues: ["Alat musik kebesaran.", "Dimainkan sambil menari gagah.", "Dulu pengiring perang, kini pengantin."], options: ["Gendang Beleq", "Serunai", "Gamelan", "Rebana"] },
    { target: "Dalam Loka", culture: "Samawa", clues: ["Rumah panggung raksasa.", "Bekas istana Sultan Sumbawa.", "Punya 99 tiang penyangga."], options: ["Dalam Loka", "Bala Kuning", "Uma Lengge", "Bale Tani"] },
    { target: "Uma Lengge", culture: "Mbojo", clues: ["Bangunan mengerucut tinggi.", "Atap dari alang-alang.", "Tempat menyimpan padi (Lumbung)."], options: ["Uma Lengge", "Lumbung", "Berugak", "Pendopo"] },
    { target: "Bale Tani", culture: "Sasak", clues: ["Rumah adat rakyat biasa.", "Lantainya dari tanah campur kotoran ternak.", "Atapnya rendah agar tamu menunduk."], options: ["Bale Tani", "Bale Lumbung", "Istana", "Masjid"] },
    { target: "Serunai", culture: "Samawa", clues: ["Alat musik tiup.", "Suaranya melengking tinggi.", "Mirip terompet tapi tradisional."], options: ["Serunai", "Gendang", "Gong", "Biola"] },
    { target: "Tembe Nggoli", culture: "Mbojo", clues: ["Sarung tenun khas Bima.", "Bahannya halus tapi hangat (benang kapas).", "Motif kotak-kotak cerah."], options: ["Tembe Nggoli", "Batik", "Ulos", "Tenun Ikat"] },
    { target: "Keris", culture: "Sasambo", clues: ["Senjata tikam golongan bangsawan.", "Bilahnya berlekuk-lekuk (luk).", "Dianggap memiliki kekuatan gaib."], options: ["Keris", "Pedang", "Tombak", "Panah"] },
    { target: "Peresean", culture: "Sasak", clues: ["Pertarungan dua lelaki.", "Bersenjata rotan (penjalin).", "Memakai perisai kulit kerbau (ende)."], options: ["Peresean", "Gulat", "Karapan Sapi", "Pencak Silat"] },
    { target: "Main Jaran", culture: "Samawa", clues: ["Lomba kecepatan.", "Jokinya anak kecil (Joki Cilik).", "Kudanya jenis Sumbawa (Poni)."], options: ["Main Jaran", "Barapan Kebo", "Adu Domba", "Karapan Sapi"] },
    { target: "Kre Alang", culture: "Samawa", clues: ["Kain mewah khas Sumbawa.", "Disulam benang emas/perak.", "Motif tumbuhan (kemang)."], options: ["Kre Alang", "Songket Sasak", "Tembe Nggoli", "Batik"] },
    { target: "Maja Labo Dahu", culture: "Mbojo", clues: ["Falsafah hidup orang Bima.", "Artinya Malu dan Takut.", "Takut kepada Allah SWT."], options: ["Maja Labo Dahu", "Sopo Angen", "Sabalong Samalewa", "Bhinneka Tunggal Ika"] },
    { target: "Bau Nyale", culture: "Sasak", clues: ["Pesta rakyat di pantai selatan.", "Menangkap cacing laut warna-warni.", "Jelmaan Putri Mandalika."], options: ["Bau Nyale", "Perang Topat", "Lebaran", "Maulid"] },
    { target: "Gunung Tambora", culture: "Mbojo", clues: ["Gunung dengan kaldera raksasa.", "Letusannya tahun 1815 menggelapkan dunia.", "Terletak di semenanjung Sanggar."], options: ["Gunung Tambora", "Gunung Rinjani", "Gunung Agung", "Gunung Merapi"] }
];

// --- PANTUN POOL (Renamed & Structured as Sesenggak/Lawas/Patu) ---
const PANTUN_POOL = [
    // SESENGGAK SASAK (Nasihat)
    { culture: "Sasak", sampiran: ["Bau paku leq sedin kokok", "Masak kandoq leq sedin rurung"], question: "Lengkapi Sesenggak ini (Nasihat rukun):", correct: {l3: "Inaq amaq ndek te laloq", l4: "Saling tulung jari roah"}, options: [{l3: "Inaq amaq ndek te laloq", l4: "Saling tulung jari roah"}, {l3: "Mangan nasi leq mataram", l4: "Enak rasanya"}] },
    { culture: "Sasak", sampiran: ["Mun belayar leq segara", "Bau kandoq araq lime"], question: "Sesenggak Agama:", correct: {l3: "Mun belajar leq dunya", l4: "Jari sangune leq akhirat"}, options: [{l3: "Mun belajar leq dunya", l4: "Jari sangune leq akhirat"}, {l3: "Mun tindoq leq bale", l4: "Ndek arak gune"}] },
    { culture: "Sasak", sampiran: ["Leq praya araq batu", "Batu beleq jari penanda"], question: "Tentang Ilmu:", correct: {l3: "Lamun side mele mampu", l4: "Rajin belajar ndek araq gune"}, options: [{l3: "Lamun side mele mampu", l4: "Rajin belajar ndek araq gune"}, {l3: "Lalo midang jok bale", l4: "Mangan jaje"}] },
    { culture: "Sasak", sampiran: ["Jok segara bau empaq", "Beli terasi leq mataram"], question: "Cinta Tanah Air:", correct: {l3: "Lamun side ngaku sasak", l4: "Endaq girang ngebang gumi"}, options: [{l3: "Lamun side ngaku sasak", l4: "Endaq girang ngebang gumi"}, {l3: "Lalo mandi jok kali", l4: "Beli nasi leq warung"}] },
    
    // LAWAS SAMAWA (Puisi Sumbawa)
    { culture: "Samawa", sampiran: ["Beli jarum di toko", "Jarum patah beli baru"], question: "Lawas Percintaan (Siong):", correct: {l3: "Lamar dadi siong", l4: "Ku sate kau"}, options: [{l3: "Lamar dadi siong", l4: "Ku sate kau"}, {l3: "Beli baju baru", l4: "Warna biru"}] },
    { culture: "Samawa", sampiran: ["Ke pasar beli gulas", "Beli juga buah manggis"], question: "Lawas Agama:", correct: {l3: "Lamun nene sate ikhlas", l4: "Dapat pahala manis"}, options: [{l3: "Lamun nene sate ikhlas", l4: "Dapat pahala manis"}, {l3: "Lalo turing ka moyo", l4: "Dapat ikan besar"}] },
    { culture: "Samawa", sampiran: ["Main jaran di kerato", "Menang lomba dapat piala"], question: "Lawas Semangat:", correct: {l3: "Tu samawa rea", l4: "Sabalong samalewa"}, options: [{l3: "Tu samawa rea", l4: "Sabalong samalewa"}, {l3: "Lalo mandi di sungai", l4: "Airnya dingin sekali"}] },
    
    // PATU MBOJO (Pantun Bima)
    { culture: "Mbojo", sampiran: ["La'o la'o di pasar Bima", "Beli uhi rura kahawa"], question: "Patu Nasihat (Maja Labo Dahu):", correct: {l3: "Nggahi rawi pahu", l4: "Maja labo dahu"}, options: [{l3: "Nggahi rawi pahu", l4: "Maja labo dahu"}, {l3: "Nara kahawa di uma", l4: "Beli uhi rura"}] },
    { culture: "Mbojo", sampiran: ["Ntara wura di langi", "Sinar mpori di dana"], question: "Patu Persaudaraan:", correct: {l3: "Taho ra ne'e weki", l4: "Kasama weki dana"}, options: [{l3: "Taho ra ne'e weki", l4: "Kasama weki dana"}, {l3: "La'o la'o di pasar", l4: "Beli sayur"}] },
    { culture: "Mbojo", sampiran: ["Wadu ntanda rahi", "Di pinggir laut"], question: "Patu Persatuan:", correct: {l3: "Dou labo dana", l4: "Mesti bersatu"}, options: [{l3: "Dou labo dana", l4: "Mesti bersatu"}, {l3: "Lihat batu besar", l4: "Di atas gunung"}] },
    
    // CAMPURAN (Untuk level awal)
    { culture: "Sasambo", sampiran: ["Rinjani Tambora menjulang tinggi", "Sumbawa pulau harapan"], question: "Persatuan NTB:", correct: {l3: "Sasak Samawa Mbojo berseri", l4: "NTB Gemilang masa depan"}, options: [{l3: "Sasak Samawa Mbojo berseri", l4: "NTB Gemilang masa depan"}, {l3: "Jalan jalan ke pantai", l4: "Makan ikan bakar"}] },
    { culture: "Sasambo", sampiran: ["Tiga suku satu hati", "NTB rumah kita"], question: "Harmoni:", correct: {l3: "Mari kita saling mengerti", l4: "Agar damai selamanya"}, options: [{l3: "Mari kita saling mengerti", l4: "Agar damai selamanya"}, {l3: "Jalan jalan sore", l4: "Lihat pemandangan"}] }
];

// --- TAKDIR POOL (Etiquette & Choices) ---
const TAKDIR_POOL = [
    // FASE 1: ETIKA DASAR (Manners)
    { title: "Bertamu di Sade", culture: "Sasak", context: "Pintu rumah adat Sasak sangat rendah.", question: "Apa yang kamu lakukan saat masuk?", options: [{text: "Menunduk hormat", isCorrect: true, feedback: "Benar! Menunduk tanda menghormati tuan rumah & Tuhan."}, {text: "Masuk tegak", isCorrect: false, feedback: "Dug! Kepalamu terbentur. Tidak sopan."}] },
    { title: "Makan Sepat", culture: "Samawa", context: "Disuguhi ikan kuah asam (Sepat).", question: "Bagaimana cara makan yang paling akrab?", options: [{text: "Pakai tangan (Muluk)", isCorrect: true, feedback: "Tepat. Tradisi 'Muluk' mempererat rasa kekeluargaan."}, {text: "Minta sendok garpu", isCorrect: false, feedback: "Terlalu formal, tuan rumah merasa berjarak."}] },
    { title: "Salam Bima", culture: "Mbojo", context: "Bertemu tetua adat Bima di jalan.", question: "Apa salam yang paling pas?", options: [{text: "Lembo Ade", isCorrect: true, feedback: "Benar! 'Lembo Ade' (Sabar Hati/Permisi) adalah salam halus."}, {text: "Halo Bos", isCorrect: false, feedback: "Sangat tidak sopan kepada orang tua."}] },
    { title: "Menolak Makanan", culture: "Sasambo", context: "Tuan rumah menyuguhkan kopi tapi kamu kenyang.", question: "Bagaimana cara menolaknya?", options: [{text: "Cicipi sedikit (Nyetok)", isCorrect: true, feedback: "Benar! 'Nyetok' (menyentuh bibir/piring) menghargai tuan rumah."}, {text: "Tolak mentah-mentah", isCorrect: false, feedback: "Dianggap sombong dan bisa kualat (pamali)."}] },
    { title: "Lewat Depan Orang Tua", culture: "Sasak", context: "Ada orang tua duduk di berugak.", question: "Sikapmu saat lewat?", options: [{text: "Membungkuk & bilang Tabe'", isCorrect: true, feedback: "Sangat sopan. Adat Sasak sangat menghormati usia."}, {text: "Jalan biasa saja", isCorrect: false, feedback: "Dianggap kurang ajar (kurang tata krama)."}] },
    
    // FASE 2: ADAT & TRADISI (Customs)
    { title: "Merariq", culture: "Sasak", context: "Temanmu ingin menikahi gadis Sasak sesuai adat.", question: "Apa langkah pertamanya?", options: [{text: "Menculik (Melarikan) gadis", isCorrect: true, feedback: "Benar, 'Merariq' diawali dengan melarikan gadis atas persetujuan bersama."}, {text: "Melamar resmi ke rumah", isCorrect: false, feedback: "Itu 'Ngemblok', bukan adat Sasak tradisional (Merariq)."}] },
    { title: "Barapan Kebo", culture: "Samawa", context: "Kerbau sedang berlari kencang di sawah.", question: "Dimana posisi amanmu?", options: [{text: "Di pinggir pematang", isCorrect: true, feedback: "Aman dan tidak mengganggu Sandro (dukun) yang bertugas."}, {text: "Di tengah lintasan", isCorrect: false, feedback: "Bahaya! Kamu bisa tertabrak kerbau."}] },
    { title: "Rimpu", culture: "Mbojo", context: "Wanita memakai sarung menutup wajah (Rimpu Mpida).", question: "Apa statusnya?", options: [{text: "Belum Menikah (Gadis)", isCorrect: true, feedback: "Benar, Rimpu Mpida menandakan gadis/belum menikah."}, {text: "Sudah Menikah", isCorrect: false, feedback: "Salah, kalau sudah menikah wajah terlihat (Rimpu Colo)."}] },
    { title: "Nyorong", culture: "Samawa", context: "Membawa hantaran pernikahan.", question: "Siapa yang harus membawa?", options: [{text: "Rombongan keluarga pria", isCorrect: true, feedback: "Ramai-ramai membawa barang (lemari, kasur, dll)."}, {text: "Dikirim lewat kurir", isCorrect: false, feedback: "Tidak menghargai adat kebersamaan."}] },
    { title: "Bau Nyale", culture: "Sasak", context: "Cacing Nyale mulai keluar di pantai.", question: "Apa yang kamu lakukan?", options: [{text: "Tangkap ramai-ramai", isCorrect: true, feedback: "Tradisi setahun sekali mencari berkah."}, {text: "Lari ketakutan", isCorrect: false, feedback: "Sayang sekali melewatkan momen legendaris."}] },

    // FASE 3: KONFLIK & FILOSOFI (Values)
    { title: "Peresean", culture: "Sasak", context: "Lawanmu di arena Peresean terluka.", question: "Apa sikap seorang Pepadu?", options: [{text: "Memeluk/Salaman usai laga", isCorrect: true, feedback: "Sportivitas adalah inti Peresean. Dendam dilarang."}, {text: "Mengejek lawan", isCorrect: false, feedback: "Tidak ksatria. Anda akan diusir dari arena."}] },
    { title: "Hanta Ua Pua", culture: "Mbojo", context: "Upacara peringatan Maulid Nabi.", question: "Apa yang diarak?", options: [{text: "Rumah mahligai berisi bunga", isCorrect: true, feedback: "Benar, berisi sirih pinang dan 99 bunga telur."}, {text: "Patung hewan", isCorrect: false, feedback: "Salah, Bima sangat Islami."}] },
    { title: "Bicara dengan Datu", culture: "Sasambo", context: "Raja bertanya namamu.", question: "Kata ganti diri paling halus?", options: [{text: "Tiang / Kaji / Mada", isCorrect: true, feedback: "Benar, ini bahasa paling halus untuk 'Saya'."}, {text: "Aku / Saya", isCorrect: false, feedback: "Terlalu kasar untuk berbicara dengan Raja."}] },
    { title: "Membangun Rumah", culture: "Samawa", context: "Warga berkumpul membantu bangun rumah (Basiru).", question: "Apa peranmu?", options: [{text: "Ikut membantu semampunya", isCorrect: true, feedback: "Gotong royong adalah kunci masyarakat Sumbawa."}, {text: "Hanya menonton", isCorrect: false, feedback: "Kurang peka sosial (Individualis)."}] },
    { title: "Menjaga Alam", culture: "Sasambo", context: "Melihat orang menebang pohon di hutan lindung.", question: "Sikapmu?", options: [{text: "Tegur / Lapor Tetua", isCorrect: true, feedback: "Menjaga Gumi Paer (Tanah Air) adalah kewajiban."}, {text: "Biarkan saja", isCorrect: false, feedback: "Alam akan rusak dan bencana datang."}] }
];

// --- EXPORTED GETTERS (Using Generator) ---

export const getPasarKataData = (): Record<Language, PasarKataQuestion[][]> => ({
    [Language.SASAK]: generateDynamicLevels(PASAR_KATA_POOL[Language.SASAK]),
    [Language.SAMAWA]: generateDynamicLevels(PASAR_KATA_POOL[Language.SAMAWA]),
    [Language.MBOJO]: generateDynamicLevels(PASAR_KATA_POOL[Language.MBOJO]),
});

export const getTebakBahasaData = (): Record<Language, TebakBahasaQuestion[][]> => ({
    [Language.SASAK]: generateDynamicLevels(TEBAK_BAHASA_POOL[Language.SASAK]),
    [Language.SAMAWA]: generateDynamicLevels(TEBAK_BAHASA_POOL[Language.SAMAWA]),
    [Language.MBOJO]: generateDynamicLevels(TEBAK_BAHASA_POOL[Language.MBOJO]),
});

export const getLegendaData = (): Record<Language, LegendaQuestion[][]> => ({
    [Language.SASAK]: generateDynamicLevels(LEGENDA_POOL[Language.SASAK]),
    [Language.SAMAWA]: generateDynamicLevels(LEGENDA_POOL[Language.SAMAWA]),
    [Language.MBOJO]: generateDynamicLevels(LEGENDA_POOL[Language.MBOJO]),
});

export const getMisteriLevels = () => generateDynamicLevels(MISTERI_POOL);
export const getPantunLevels = () => generateDynamicLevels(PANTUN_POOL);
export const getTakdirLevels = () => generateDynamicLevels(TAKDIR_POOL);
