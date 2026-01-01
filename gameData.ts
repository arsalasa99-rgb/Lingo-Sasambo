
import { PasarKataQuestion, TebakBahasaQuestion, LegendaQuestion, LevelData, Language, BiomeType, InventoryItem } from './types';

// --- HELPER: Randomize Options ---
// Ensures the correct answer is not always at the first index.
const createQ = (id: string, question: string, correct: string, distractors: string[]) => {
    const options = [correct, ...distractors].sort(() => Math.random() - 0.5);
    return { id, question, options, correctAnswer: correct };
};

// --- HELPER: Randomize Options for Legend ---
const createL = (id: string, story: string, question: string, correct: string, distractors: string[]) => {
    const options = [correct, ...distractors].sort(() => Math.random() - 0.5);
    return { id, story, question, options, correctAnswer: correct };
};

// --- MASTER INVENTORY (UPDATED WITH NEW HIERARCHY) ---
export const MASTER_INVENTORY: InventoryItem[] = [
    // TIER 1: JAJARKARANG (Rakyat Biasa - Common)
    { id: 'j-1', name: 'Gasing Kayu', image: '🪵', type: 'artifact', rarity: 'JAJARKARANG', description: 'Mainan rakyat jelata dari kayu nangka. Hiburan sederhana di pekarangan rumah.' },
    { id: 'j-2', name: 'Gerabah Banyumulek', image: '⚱️', type: 'material', rarity: 'JAJARKARANG', description: 'Periuk tanah liat buatan warga desa. Wadah air kehidupan sehari-hari.' },
    { id: 'j-3', name: 'Biji Kopi Tambora', image: '☕', type: 'food', rarity: 'JAJARKARANG', description: 'Hasil panen petani lereng gunung. Minuman penyemangat kerja.' },
    { id: 'j-4', name: 'Topi Caping', image: '👒', type: 'clothing', rarity: 'JAJARKARANG', description: 'Pelindung kepala petani jajarkarang saat menggarap sawah.' },
    { id: 'j-5', name: 'Terasi Lombok', image: '🦐', type: 'food', rarity: 'JAJARKARANG', description: 'Bumbu dapur wajib di setiap dapur warga Sasambo.' },

    // TIER 2: KETUA_KARANG (Pemimpin Sosial - Uncommon)
    { id: 'k-1', name: 'Parang Klewang', image: '🗡️', type: 'artifact', rarity: 'KETUA_KARANG', description: 'Bilah besi simbol penjaga keamanan kampung.' },
    { id: 'k-2', name: 'Ikat Kepala Polos', image: '🤕', type: 'clothing', rarity: 'KETUA_KARANG', description: 'Penanda seorang tetua lingkungan yang dihormati.' },
    { id: 'k-3', name: 'Suling Bambu', image: '🎋', type: 'instrument', rarity: 'KETUA_KARANG', description: 'Alat musik penghibur warga saat ronda malam.' },
    { id: 'k-4', name: 'Topeng Tugal', image: '🎭', type: 'artifact', rarity: 'KETUA_KARANG', description: 'Digunakan ketua karang saat memimpin hiburan rakyat.' },
    { id: 'k-5', name: 'Madu Sumbawa', image: '🍯', type: 'food', rarity: 'KETUA_KARANG', description: 'Madu hutan pilihan, sering dijadikan buah tangan antar kampung.' },

    // TIER 3: PEMANGKU (Pemuka Adat/Agama - Rare)
    { id: 'p-1', name: 'Naskah Lontar', image: '📜', type: 'artifact', rarity: 'PEMANGKU', description: 'Lembaran daun lontar berisi doa dan hukum adat. Dipegang oleh Kyai/Pemangku.' },
    { id: 'p-2', name: 'Bokor Perak', image: '🥣', type: 'artifact', rarity: 'PEMANGKU', description: 'Wadah air suci untuk ritual adat yang dipimpin Pemangku.' },
    { id: 'p-3', name: 'Sape', image: '🎸', type: 'instrument', rarity: 'PEMANGKU', description: 'Alat musik petik yang dimainkan dalam upacara penyembuhan.' },
    { id: 'p-4', name: 'Minyak Sumbawa', image: '🏺', type: 'material', rarity: 'PEMANGKU', description: 'Ramuan rahasia tabib adat untuk pengobatan.' },
    { id: 'p-5', name: 'Gong Gamelan', image: '🔘', type: 'instrument', rarity: 'PEMANGKU', description: 'Gong pembuka upacara sakral.' },

    // TIER 4: LALU_BAIQ (Bangsawan Menengah - Epic)
    { id: 'lb-1', name: 'Keris Sasak Lurus', image: '⚔️', type: 'artifact', rarity: 'LALU_BAIQ', description: 'Pusaka keluarga bangsawan menengah. Tanda garis keturunan.' },
    { id: 'lb-2', name: 'Tenun Ikat Sutra', image: '🧣', type: 'clothing', rarity: 'LALU_BAIQ', description: 'Kain halus yang hanya dipakai kaum Menak (Bangsawan).' },
    { id: 'lb-3', name: 'Susu Kuda Liar', image: '🥛', type: 'food', rarity: 'LALU_BAIQ', description: 'Minuman vitalitas kaum ksatria dan bangsawan.' },
    { id: 'lb-4', name: 'Tembe Nggoli', image: '🏁', type: 'clothing', rarity: 'LALU_BAIQ', description: 'Sarung tenun Mbojo kualitas tinggi untuk acara resmi.' },
    { id: 'lb-5', name: 'Kuda Pacu Bima', image: '🐎', type: 'material', rarity: 'LALU_BAIQ', description: 'Kuda tunggangan para Lalu saat berburu atau berlomba.' },

    // TIER 5: RADEN_DENDE (Bangsawan Tinggi - Legendary)
    { id: 'rd-1', name: 'Keris Ganja Iras', image: '💫', type: 'artifact', rarity: 'RADEN_DENDE', description: 'Pusaka tertinggi para Raden. Pamornya memancarkan kewibawaan mutlak.' },
    { id: 'rd-2', name: 'Mahkota Siger', image: '👑', type: 'clothing', rarity: 'RADEN_DENDE', description: 'Lambang keagungan Dende (Putri) kerajaan.' },
    { id: 'rd-3', name: 'Kitab Negarakertagama', image: '📖', type: 'artifact', rarity: 'RADEN_DENDE', description: 'Salinan naskah kerajaan yang hanya boleh dibaca kerabat raja.' },
    { id: 'rd-4', name: 'Jubah Sasambo Emas', image: '🧥', type: 'clothing', rarity: 'RADEN_DENDE', description: 'Busana kebesaran berlapis emas murni.' },
    { id: 'rd-5', name: 'Bale Lumbung Emas', image: '🏠', type: 'house', rarity: 'RADEN_DENDE', description: 'Simbol kekayaan dan kekuasaan tertinggi di tatanan sosial.' },
    { id: 'rd-6', name: 'Cincin Mustika Merah', image: '💎', type: 'clothing', rarity: 'RADEN_DENDE', description: 'Permata warisan leluhur raja-raja terdahulu.' },
];

// ... (Rest of the file remains unchanged, keep generateStoryLevels, getPasarKataData, etc.)

export const generateStoryLevels = (language: Language): LevelData[] => {
    
    const sasakLevels = [
        // 1-15: EASY (Basic Words, Greetings, Pronouns)
        { w: "Tabe", t: "Permisi/Salam", f: "Sopan Santun" },
        { w: "Mbe", t: "Dimana", f: "Bunyi 'e' pepet" },
        { w: "Araq", t: "Ada", f: "Akhiran 'q' glottal" },
        { w: "Inaq", t: "Ibu", f: "Intonasi hormat" },
        { w: "Amaq", t: "Bapak", f: "Intonasi hormat" },
        { w: "Batur", t: "Teman", f: "Huruf 'r' jelas" },
        { w: "Solah", t: "Bagus", f: "Akhiran 'h' desah" },
        { w: "Piro", t: "Berapa", f: "Nada tanya" },
        { w: "Nasi", t: "Nasi", f: "Vokal jelas" },
        { w: "Aiq", t: "Air", f: "Akhiran 'q' tegas" },
        { w: "Gumi", t: "Bumi/Tanah", f: "Vokal bulat" },
        { w: "Jari", t: "Jadi", f: "Konsonan 'j'" },
        { w: "Side", t: "Anda", f: "Sapaan halus" },
        { w: "Tiang", t: "Saya (Halus)", f: "Sengau 'ng'" },
        { w: "Mele", t: "Mau", f: "E taling vs pepet" },

        // 16-35: MEDIUM (Phrases, Actions, Places)
        { w: "Mangan", t: "Makan", f: "Sengau 'ng'" },
        { w: "Tindoq", t: "Tidur", f: "Akhiran 'q' mati" },
        { w: "Lampaq", t: "Jalan", f: "Tekanan akhir" },
        { w: "Berugak", t: "Gazebo", f: "Konsonan 'g' & 'k'" },
        { w: "Cidomo", t: "Kereta Kuda", f: "Irama kata" },
        { w: "Kandoq", t: "Lauk", f: "Glottal berat" },
        { w: "Pelecing", t: "Plecing", f: "Bunyi 'c'" },
        { w: "Begibung", t: "Makan Bersama", f: "Kebersamaan" },
        { w: "Midang", t: "Apel/Bertamu", f: "Sengau akhir" },
        { w: "Merariq", t: "Menikah", f: "Getaran 'r'" },
        { w: "Ngebeng", t: "Menggembala", f: "Sengau tengah" },
        { w: "Besiru", t: "Gotong Royong", f: "Semangat" },
        { w: "Sampi", t: "Sapi", f: "Bilabial 'm'" },
        { w: "Gawah", t: "Hutan", f: "Desah 'h'" },
        { w: "Segara", t: "Laut", f: "Vokal terbuka" },
        { w: "Montong", t: "Bukit", f: "Sengau ganda" },
        { w: "Ujan", t: "Hujan", f: "Awal vokal" },
        { w: "Panas", t: "Panas", f: "Sibilan 's'" },
        { w: "Jaje", t: "Kue", f: "Vokal 'e' taling" },
        { w: "Kelak", t: "Masak", f: "Akhiran 'k' mati" },

        // 36-50: HARD (Cultural Terms, Proverbs, Complex Sentences)
        { w: "Gendang Beleq", t: "Gendang Besar", f: "Tekanan frasa" },
        { w: "Bau Nyale", t: "Tangkap Nyale", f: "Diftong 'au'" },
        { w: "Peresean", t: "Tarung Rotan", f: "Intonasi semangat" },
        { w: "Sorong Serah", t: "Serah Terima Adat", f: "Aliterasi 's'" },
        { w: "Tindih Gumi", t: "Menjaga Tanah Air", f: "Keseriusan" },
        { w: "Sopo Angen", t: "Satu Hati", f: "Filosofi" },
        { w: "Ajining Diri", t: "Harga Diri", f: "Nada dalam" },
        { w: "Patuh Karya", t: "Bekerja Bersama", f: "Harmoni" },
        { w: "Aiq Meneng", t: "Air Tenang", f: "Ketenangan" },
        { w: "Tunjung Tilah", t: "Bunga Mengapung", f: "Puitis" },
        { w: "Mandalika", t: "Putri Mandalika", f: "Nama Legenda" },
        { w: "Dewi Anjani", t: "Penunggu Rinjani", f: "Nama Suci" },
        { w: "Bale Tani", t: "Rumah Petani", f: "Arsitektur" },
        { w: "Lumbung Padi", t: "Tempat Padi", f: "Kesejahteraan" },
        { w: "Sasak Tulen", t: "Sasak Asli", f: "Identitas" }
    ];

    const samawaLevels = [
        // 1-15: EASY
        { w: "Mana", t: "Apa", f: "Vokal 'a' pendek" },
        { w: "Tau", t: "Orang/Kabar", f: "Diftong 'au'" },
        { w: "Bala", t: "Rumah/Istana", f: "Lidah lembut" },
        { w: "Lawang", t: "Pintu", f: "Sengau 'ng'" },
        { w: "Lalo", t: "Pergi", f: "Vokal 'o' bulat" },
        { w: "Mangan", t: "Makan", f: "Sengau 'ng'" },
        { w: "Nyer", t: "Cepat", f: "Sengau 'ny'" },
        { w: "Turas", t: "Tidur", f: "Getar 'r'" },
        { w: "Ninda", t: "Indah", f: "Sengau 'n'" },
        { w: "Cota", t: "Asin", f: "Konsonan 'c'" },
        { w: "Ina", t: "Ibu", f: "Sapaan" },
        { w: "Bapak", t: "Bapak", f: "Akhiran 'k'" },
        { w: "Kaji", t: "Saya (Halus)", f: "Sopan" },
        { w: "Nene", t: "Kamu/Tuhan", f: "Konteks" },
        { w: "Mikir", t: "Berpikir", f: "Konsonan 'm'" },

        // 16-35: MEDIUM
        { w: "Barapan", t: "Balapan", f: "Semangat" },
        { w: "Basiru", t: "Gotong Royong", f: "Harmoni" },
        { w: "Nyorong", t: "Mengantar", f: "Sengau 'ny'" },
        { w: "Sandro", t: "Dukun/Tabib", f: "Konsonan 'dr'" },
        { w: "Rarit", t: "Dendeng", f: "Getar 'r' ganda" },
        { w: "Sepat", t: "Ikan Kuah Asam", f: "Akhiran 't'" },
        { w: "Singang", t: "Ikan Kuah Kuning", f: "Sengau 'ng' ganda" },
        { w: "Olat", t: "Gunung", f: "Akhiran 't'" },
        { w: "Lito", t: "Batu", f: "Vokal 'o'" },
        { w: "Ai Awak", t: "Keringat", f: "Diftong 'ai'" },
        { w: "Dalam Loka", t: "Istana Tua", f: "Nama Tempat" },
        { w: "Bala Kuning", t: "Istana Kuning", f: "Warna" },
        { w: "Jaran", t: "Kuda", f: "Konsonan 'j'" },
        { w: "Kebo", t: "Kerbau", f: "Vokal 'o'" },
        { w: "Menjangan", t: "Rusa", f: "Sengau 'nj'" },
        { w: "Poto", t: "Ujung", f: "Vokal 'o' pendek" },
        { w: "Labuhan", t: "Pelabuhan", f: "Desah 'h'" },
        { w: "Pasola", t: "Pesta Kuda", f: "Serapan" },
        { w: "Moyo", t: "Pulau Moyo", f: "Nama Pulau" },
        { w: "Tano", t: "Tanjung", f: "Vokal 'o'" },

        // 36-50: HARD
        { w: "Sabalong Samalewa", t: "Membangun Bersama", f: "Slogan" },
        { w: "Pariri Lema Bariri", t: "Memperbaiki Jadi Baik", f: "Filosofi" },
        { w: "Saling Siki", t: "Saling Memperbaiki", f: "Nilai Moral" },
        { w: "Adat Barenti Ko Syara", t: "Adat Bersendi Syara", f: "Religius" },
        { w: "Takit Ko Nene", t: "Takut Tuhan", f: "Spiritual" },
        { w: "Lawas", t: "Puisi Lisan", f: "Sastra" },
        { w: "Sakeco", t: "Musik Tradisi", f: "Kesenian" },
        { w: "Nguri", t: "Upacara Adat", f: "Ritual" },
        { w: "Ponan", t: "Pesta Bukit", f: "Tradisi" },
        { w: "Munit", t: "Adat Kematian", f: "Sakral" },
        { w: "Kre Alang", t: "Kain Tenun", f: "Kriya" },
        { w: "Kemang Satange", t: "Bunga Setangkai", f: "Motif" },
        { w: "Lonto Engal", t: "Tumbuhan Menjalar", f: "Motif" },
        { w: "Samawa Rea", t: "Sumbawa Besar", f: "Kebanggaan" },
        { w: "Intan Bulaeng", t: "Emas Permata", f: "Kiasan" }
    ];

    const mbojoLevels = [
        // 1-15: EASY
        { w: "Mada", t: "Saya", f: "Konsonan 'd' lembut" },
        { w: "Ita", t: "Anda", f: "Sopan" },
        { w: "Au Habba", t: "Apa Kabar", f: "Desah 'h'" },
        { w: "Lembo Ade", t: "Sabar Hati/Salam", f: "Intonasi Halus" },
        { w: "Ngaha", t: "Makan", f: "Sengau 'ng'" },
        { w: "Nara", t: "Minum", f: "Getar 'r'" },
        { w: "La'o", t: "Pergi", f: "Glottal '''" },
        { w: "Mai Ta", t: "Mari Sini", f: "Ajakan" },
        { w: "Jara", t: "Kuda", f: "Konsonan 'j'" },
        { w: "Wadu", t: "Batu", f: "Vokal 'u'" },
        { w: "Haju", t: "Kayu", f: "Desah 'h'" },
        { w: "Uma", t: "Rumah", f: "Vokal 'u'" },
        { w: "Doro", t: "Gunung", f: "Getar 'r'" },
        { w: "Oi", t: "Air", f: "Diftong" },
        { w: "Moti", t: "Laut", f: "Akhiran 'i'" },

        // 16-35: MEDIUM
        { w: "Rimpu", t: "Sarung Kepala", f: "Identitas" },
        { w: "Sambolo", t: "Ikat Kepala", f: "Sengau 'mb'" },
        { w: "Uma Lengge", t: "Lumbung Padi", f: "Sengau 'ngg'" },
        { w: "Asi Mbojo", t: "Istana Bima", f: "Sejarah" },
        { w: "Pacoa Jara", t: "Pacuan Kuda", f: "Aktivitas" },
        { w: "Hanta Ua Pua", t: "Maulid Nabi", f: "Upacara" },
        { w: "Tembe Nggoli", t: "Sarung Tenun", f: "Sengau 'ngg'" },
        { w: "Uta Londe", t: "Ikan Bandeng", f: "Makanan" },
        { w: "Janga", t: "Ayam", f: "Sengau 'ng'" },
        { w: "Buja", t: "Tombak", f: "Konsonan 'b'" },
        { w: "Golo", t: "Parang", f: "Vokal 'o'" },
        { w: "Saremba", t: "Selendang", f: "Sengau 'mb'" },
        { w: "Saloko", t: "Mahkota", f: "Adat" },
        { w: "Kalembo Ade", t: "Maaf/Sabar", f: "Permintaan" },
        { w: "Kasama Weki", t: "Kebersamaan", f: "Sosial" },
        { w: "Taho", t: "Baik", f: "Sifat" },
        { w: "Meci", t: "Rusak", f: "Sifat" },
        { w: "Na'e", t: "Besar", f: "Glottal" },
        { w: "To'i", t: "Kecil", f: "Glottal" },
        { w: "Disi", t: "Dingin", f: "Sibilan" },

        // 36-50: HARD
        { w: "Maja Labo Dahu", t: "Malu & Takut", f: "Filosofi Utama" },
        { w: "Nggahi Rawi Pahu", t: "Satunya Kata Perbuatan", f: "Integritas" },
        { w: "Dou Labo Dana", t: "Rakyat & Tanah Air", f: "Nasionalisme" },
        { w: "Taho Ro Ne'e", t: "Baik & Mau", f: "Ketulusan" },
        { w: "Karawi Kaboju", t: "Kerja Sungguh-sungguh", f: "Etos Kerja" },
        { w: "Mbojo Mantoi", t: "Bima Masa Lalu", f: "Sejarah" },
        { w: "Dana Traha", t: "Makam Raja", f: "Situs" },
        { w: "Sultan Abdul Kahir", t: "Sultan Pertama", f: "Tokoh" },
        { w: "Buja Kadanda", t: "Tari Perang", f: "Tarian" },
        { w: "Gantao", t: "Bela Diri", f: "Seni" },
        { w: "Mpama", t: "Cerita Rakyat", f: "Sastra" },
        { w: "Kalero", t: "Nyanyian Ratapan", f: "Vokal" },
        { w: "Biola Katongga", t: "Biola Bambu", f: "Musik" },
        { w: "Sangeang Api", t: "Gunung Berapi", f: "Geografi" },
        { w: "Wadu Ntanda Rahi", t: "Batu Melihat Suami", f: "Legenda" }
    ];

    const targetList = language === Language.SASAK ? sasakLevels : (language === Language.SAMAWA ? samawaLevels : mbojoLevels);
    const levels: LevelData[] = [];
    const biomes: BiomeType[] = ['VILLAGE', 'COAST', 'MARKET', 'FOREST', 'MOUNTAIN', 'PALACE'];

    targetList.forEach((item, index) => {
        const id = index + 1;
        let difficulty: 'EASY' | 'MEDIUM' | 'HARD' = 'EASY';
        if (id > 15) difficulty = 'MEDIUM';
        if (id > 35) difficulty = 'HARD';

        // Rotate biomes every level to keep map interesting
        const biome = biomes[index % biomes.length];
        
        // Calculate Map X Position (Zig-zag pattern logic handled in StoryMode component via index, 
        // but here we can hint or just leave it to the render engine. 
        // We'll set a standard value here, the Map component overrides it with the SVG path logic)
        const x = 50 + (35 * Math.sin(index * 0.8));

        levels.push({
            id: id,
            title: `Level ${id}`,
            theme: item.f,
            location: difficulty,
            description: `Ucapkan: "${item.w}"`,
            isLocked: false, // This is overridden by user progress in the UI
            stars: 0,
            x: x,
            biome: biome,
            difficulty: difficulty,
            phonemeFocus: item.f,
            dialogue: [{ speaker: "Native", native: item.w, translation: item.t }]
        });
    });

    return levels;
};

export const getPasarKataData = (): Record<Language, PasarKataQuestion[][]> => {
    return {
        [Language.SASAK]: [
            // LEVEL 1-10: BASIC (Existing)
            [{ id: 's-1', target: "Mbe laiq", translation: "Mau kemana" }, { id: 's-2', target: "Araq te", translation: "Ada teh" }, { id: 's-3', target: "Ndek araq", translation: "Tidak ada" }],
            [{ id: 's-4', target: "Tabe wira", translation: "Permisi pahlawan" }, { id: 's-5', target: "Silaq mampir", translation: "Silakan mampir" }, { id: 's-6', target: "Mangan juluk", translation: "Makan dulu" }],
            [{ id: 's-7', target: "Inaq kaji", translation: "Ibu saya (Halus)" }, { id: 's-8', target: "Amaq te", translation: "Bapak kita" }, { id: 's-9', target: "Semeton jari", translation: "Saudara sekalian" }],
            [{ id: 's-10', target: "Piro aji niki", translation: "Berapa harga ini" }, { id: 's-11', target: "Mahal gati", translation: "Mahal sekali" }, { id: 's-12', target: "Kurang bedik", translation: "Kurang sedikit" }, { id: 's-13', target: "Beli telu", translation: "Beli tiga" }],
            [{ id: 's-14', target: "Bau nyale leq pantai", translation: "Tangkap nyale di pantai" }, { id: 's-15', target: "Lalo midang", translation: "Pergi apel/berkunjung" }, { id: 's-16', target: "Mangan kandoq pelecing", translation: "Makan lauk plecing" }, { id: 's-17', target: "Tidur leq berugak", translation: "Tidur di gazebo" }],
            [{ id: 's-18', target: "Ndek ku bani", translation: "Tidak aku berani" }, { id: 's-19', target: "Sai aran side", translation: "Siapa nama kamu" }, { id: 's-20', target: "Mbe taok bale", translation: "Dimana letak rumah" }, { id: 's-21', target: "Ndek narak kepeng", translation: "Tidak ada uang" }, { id: 's-22', target: "Sampun mangan", translation: "Sudah makan" }],
            [{ id: 's-23', target: "Kangen gati side", translation: "Rindu sekali kamu" }, { id: 's-24', target: "Solah angen dengan", translation: "Hati orang yang baik" }, { id: 's-25', target: "Susah angen kaji", translation: "Sedih hati saya" }, { id: 's-26', target: "Endaq girang serek", translation: "Jangan suka marah" }],
            [{ id: 's-27', target: "Begibung mangan bareng", translation: "Begibung makan bersama" }, { id: 's-28', target: "Nyongkolan iring penganten", translation: "Nyongkolan iring pengantin" }, { id: 's-29', target: "Gendang beleq suarane", translation: "Gendang beleq suaranya" }, { id: 's-30', target: "Peresean adu rotan", translation: "Peresean adu rotan" }],
            [{ id: 's-31', target: "Endaq girang ngebang gumi", translation: "Jangan suka merusak bumi" }, { id: 's-32', target: "Tindih gumi paer", translation: "Menjaga tanah air" }, { id: 's-33', target: "Ajining diri", translation: "Harga diri" }, { id: 's-34', target: "Solah solah gama", translation: "Baik baiklah beragama" }, { id: 's-35', target: "Jagaq lisan side", translation: "Jaga lisan kamu" }],
            [{ id: 's-36', target: "Sopo angen sopo gumi", translation: "Satu hati satu bumi" }, { id: 's-37', target: "Adat luir gama", translation: "Adat bersendi agama" }, { id: 's-38', target: "Gumi sasak mirah adi", translation: "Bumi Sasak permata adik" }, { id: 's-39', target: "Patuh patuh pade", translation: "Sama sama rata" }, { id: 's-40', target: "Tau tatas tuhu trasna", translation: "Tahu, mampu, tulus, cinta" }],
        ],
        [Language.SAMAWA]: [
             [{ id: 'sm-1', target: "Mana tau", translation: "Apa kabar" }, { id: 'sm-2', target: "Kaji lalo", translation: "Saya pergi" }, { id: 'sm-3', target: "Mangan sepat", translation: "Makan sepat" }],
             [{ id: 'sm-4', target: "Ina masak jangan", translation: "Ibu masak sayur" }, { id: 'sm-5', target: "Bapak inum kopi", translation: "Bapak minum kopi" }, { id: 'sm-6', target: "Nene uda mangan", translation: "Kamu sudah makan" }],
        ],
        [Language.MBOJO]: [
             [{ id: 'm-1', target: "Au habba", translation: "Apa kabar" }, { id: 'm-2', target: "Mada la'o", translation: "Saya pergi" }, { id: 'm-3', target: "Ngaha u'a", translation: "Makan sudah" }],
        ]
    };
};

export const getTebakBahasaData = (): Record<Language, TebakBahasaQuestion[][]> => {
    return {
        [Language.SASAK]: [
             [createQ('1-1', "Apa arti 'Inaq'?", "Ibu", ["Bapak", "Kakak", "Adik"]), createQ('1-2', "Apa arti 'Amaq'?", "Bapak", ["Ibu", "Paman", "Kakek"]), createQ('1-3', "Apa arti 'Baloq'?", "Nenek/Kakek", ["Anak", "Cucu", "Buyut"])],
        ],
        [Language.SAMAWA]: [
            [createQ('1-1', "Apa arti 'Bala'?", "Rumah", ["Jalan", "Kota", "Desa"]), createQ('1-2', "Apa arti 'Ina'?", "Ibu", ["Bapak", "Adik", "Kakak"]), createQ('1-3', "Apa arti 'Bapak'?", "Ayah", ["Paman", "Kakek", "Adik"])],
        ],
        [Language.MBOJO]: [
             [createQ('1-1', "Apa arti 'Mada'?", "Saya", ["Kamu", "Dia", "Kita"]), createQ('1-2', "Apa arti 'Ita'?", "Anda (Sopan)", ["Saya", "Dia", "Mereka"]), createQ('1-3', "Apa arti 'Nahhu'?", "Aku (Kasar/Akrab)", ["Kamu", "Dia", "Kita"])],
        ]
    };
};

export const getLegendaData = (): Record<Language, LegendaQuestion[][]> => {
    return {
        [Language.SASAK]: [
             [
                createL('l-s-1', "Legenda Putri Mandalika menceritakan pengorbanan seorang putri yang berubah menjadi...", "Menjadi apa?", "Cacing Nyale", ["Ikan Duyung", "Batu Karang", "Burung Laut"]),
                createL('l-s-2', "Putri Mandalika memilih menceburkan diri ke laut agar...", "Apa alasannya?", "Tidak terjadi pertumpahan darah", ["Bisa berenang bebas", "Menemui Raja Laut", "Menghindari pernikahan"]),
            ]
        ],
        [Language.SAMAWA]: [
            [
                createL('l-sm-1', "Tanjung Menangis konon berasal dari tangisan...", "Siapa yang menangis?", "Putri Lala Bulaeng", ["Putri Mandalika", "Dewi Anjani", "Ratu Sumbawa"]),
            ]
        ],
        [Language.MBOJO]: [
            [
                 createL('l-m-1', "La Hila berubah menjadi batu di...", "Dimana?", "Wadu Ntanda Rahi", ["Gunung Tambora", "Pulau Sangeang", "Pantai Lawata"]),
            ]
        ]
    };
};
