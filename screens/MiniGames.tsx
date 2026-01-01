

import React, { useState, useEffect, useRef } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CheckCircle2, Grid, Music, Book, Play, Lock, Star, Search, Check, XCircle, Sparkles, Compass, GripHorizontal, X, Heart, ThumbsUp, ThumbsDown, Zap, Crown } from 'lucide-react';
import { GlassCard, LiquidButton } from '../components/GlassUI';
import { GameActions, UserProfile, Language, InventoryItem, ItemRarity } from '../types';
import { getPasarKataData, getTebakBahasaData, getLegendaData, MASTER_INVENTORY } from '../gameData';
import { PasarKataQuestion, TebakBahasaQuestion, LegendaQuestion } from '../types';

interface MiniGamesProps {
  onBack: () => void;
  actions: GameActions;
  user: UserProfile;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

enum GameType {
    MENU = 'MENU',
    PASAR_KATA = 'PASAR_KATA',
    TEBAK_BAHASA = 'TEBAK_BAHASA',
    LEGENDA = 'LEGENDA',
    MISTERI_SASAMBO = 'MISTERI_SASAMBO',
    PANTUN_HYPE = 'PANTUN_HYPE',
    TAKDIR_BEBAS = 'TAKDIR_BEBAS'
}

enum ViewState {
    LEVEL_SELECT = 'LEVEL_SELECT',
    LANG_SELECT = 'LANG_SELECT', // New State for picking language
    PLAYING = 'PLAYING',
    RESULT = 'RESULT'
}

// --- EXPANDED GAME DATA GENERATORS (10 LEVELS) ---

const getMisteriLevels = () => {
    // Helper to create a level set
    const createLevel = (items: any[]) => items;
    return [
        // Level 1: Makanan Ikonik (Easy)
        createLevel([
            { target: "Ayam Taliwang", culture: "Sasak", clues: ["Makanan pedas.", "Ayam kampung bakar.", "Bumbu pelalah."], options: ["Ayam Taliwang", "Sate Bulayak", "Ayam Betutu", "Bebek Bengil"] }
        ]),
        // Level 2: Minuman Khas (Easy)
        createLevel([
            { target: "Susu Kuda Liar", culture: "Mbojo", clues: ["Minuman putih.", "Dari hewan pacuan.", "Fermentasi alami."], options: ["Susu Kuda Liar", "Tuak Manis", "Susu Sapi", "Yoghurt"] }
        ]),
        // Level 3: Busana Adat (Easy)
        createLevel([
            { target: "Rimpu", culture: "Mbojo", clues: ["Menggunakan sarung.", "Menutup kepala wanita.", "Seperti hijab tradisional."], options: ["Rimpu", "Jilbab", "Kebaya", "Songket"] }
        ]),
        // Level 4: Alat Musik (Medium)
        createLevel([
            { target: "Gendang Beleq", culture: "Sasak", clues: ["Alat musik pukul.", "Ukurannya sangat besar.", "Dimainkan berkelompok."], options: ["Gendang Beleq", "Serunai", "Gamelan", "Rebana"] }
        ]),
        // Level 5: Arsitektur (Medium)
        createLevel([
            { target: "Dalam Loka", culture: "Samawa", clues: ["Bangunan kayu raksasa.", "Bekas istana sultan.", "Bertopang 99 tiang."], options: ["Dalam Loka", "Bala Kuning", "Uma Lengge", "Bale Tani"] }
        ]),
        // Level 6: Tempat Penyimpanan (Medium)
        createLevel([
            { target: "Uma Lengge", culture: "Mbojo", clues: ["Bentuknya mengerucut.", "Atap alang-alang.", "Tempat simpan padi."], options: ["Uma Lengge", "Lumbung", "Berugak", "Pendopo"] }
        ]),
        // Level 7: Tradisi Pertarungan (Hard)
        createLevel([
            { target: "Peresean", culture: "Sasak", clues: ["Adu ketangkasan.", "Memakai rotan dan perisai.", "Meminta hujan."], options: ["Peresean", "Gulat", "Karapan Sapi", "Pencak Silat"] }
        ]),
        // Level 8: Tradisi Hewan (Hard)
        createLevel([
            { target: "Main Jaran", culture: "Samawa", clues: ["Joki cilik.", "Kecepatan tinggi.", "Hewan Poni Sumbawa."], options: ["Main Jaran", "Barapan Kebo", "Adu Domba", "Karapan Sapi"] }
        ]),
        // Level 9: Kain Tenun (Hard)
        createLevel([
            { target: "Kre Alang", culture: "Samawa", clues: ["Benang emas/perak.", "Motif tumbuhan/hewan.", "Kain khas Sumbawa."], options: ["Kre Alang", "Songket Sasak", "Tembe Nggoli", "Batik"] }
        ]),
        // Level 10: Filosofi (Expert)
        createLevel([
            { target: "Maja Labo Dahu", culture: "Mbojo", clues: ["Malu berbuat salah.", "Takut kepada Tuhan.", "Pedoman hidup Bima."], options: ["Maja Labo Dahu", "Sopo Angen", "Sabalong Samalewa", "Bhinneka Tunggal Ika"] }
        ])
    ];
};

const getPantunLevels = () => {
    const createLevel = (items: any[]) => items;
    return [
        // Level 1: Sasak (Simple Rhyme -aq)
        createLevel([ 
            { culture: "Sasak", sampiran: ["Jok segara bau empaq", "Beli terasi leq mataram"], question: "Cari rima A-B-A-B (Akhiran -ak/-am)", correct: {l3: "Lamun side ngaku sasak", l4: "Endaq girang ngebang gumi"}, options: [{l3: "Lamun side ngaku sasak", l4: "Endaq girang ngebang gumi"}, {l3: "Lalo mandi jok kali", l4: "Beli nasi leq warung"}] }
        ]),
        // Level 2: Samawa (Simple Rhyme -as)
        createLevel([
            { culture: "Samawa", sampiran: ["Ke pasar beli gulas", "Beli juga buah manggis"], question: "Rima Ikhlas - Manis", correct: {l3: "Lamun nene sate ikhlas", l4: "Dapat pahala manis"}, options: [{l3: "Lamun nene sate ikhlas", l4: "Dapat pahala manis"}, {l3: "Lalo turing ka moyo", l4: "Dapat ikan besar"}] }
        ]),
        // Level 3: Mbojo (Simple Rhyme -u)
        createLevel([
            { culture: "Mbojo", sampiran: ["La'o la'o di pasar Bima", "Beli uhi rura kahawa"], question: "Rima Pahu - Dahu", correct: {l3: "Nggahi rawi pahu", l4: "Maja labo dahu"}, options: [{l3: "Nggahi rawi pahu", l4: "Maja labo dahu"}, {l3: "Nara kahawa di uma", l4: "Beli uhi rura"}] }
        ]),
        // Level 4: Sasak (Advice -e)
        createLevel([
            { culture: "Sasak", sampiran: ["Mun belayar leq segara", "Bau kandoq araq lime"], question: "Rima A-A-A-A (Vokal e/a)", correct: {l3: "Mun belajar leq dunya", l4: "Jari sangune leq akhirat"}, options: [{l3: "Mun belajar leq dunya", l4: "Jari sangune leq akhirat"}, {l3: "Mun tindoq leq bale", l4: "Ndek arak gune"}] }
        ]),
        // Level 5: Samawa (Love -ar)
        createLevel([
            { culture: "Samawa", sampiran: ["Beli jarum di toko", "Jarum patah beli baru"], question: "Rima Toko - Baru", correct: {l3: "Lamar dadi siong", l4: "Ku sate kau"}, options: [{l3: "Lamar dadi siong", l4: "Ku sate kau"}, {l3: "Beli baju baru", l4: "Warna biru"}] }
        ]),
        // Level 6: Mbojo (Social -a)
        createLevel([
            { culture: "Mbojo", sampiran: ["Ntara wura di langi", "Sinar mpori di dana"], question: "Rima i - a", correct: {l3: "Taho ra ne'e weki", l4: "Kasama weki dana"}, options: [{l3: "Taho ra ne'e weki", l4: "Kasama weki dana"}, {l3: "La'o la'o di pasar", l4: "Beli sayur"}] }
        ]),
        // Level 7: Sasak (Philosophy -i)
        createLevel([
            { culture: "Sasak", sampiran: ["Bau paku leq sedin kokok", "Masak kandoq leq sedin rurung"], question: "Rima o - u", correct: {l3: "Inaq amaq ndek te laloq", l4: "Saling tulung jari roah"}, options: [{l3: "Inaq amaq ndek te laloq", l4: "Saling tulung jari roah"}, {l3: "Mangan nasi leq mataram", l4: "Enak rasanya"}] }
        ]),
        // Level 8: Samawa (Heroism)
        createLevel([
            { culture: "Samawa", sampiran: ["Main jaran di kerato", "Menang lomba dapat piala"], question: "Rima o - a", correct: {l3: "Tu samawa rea", l4: "Sabalong samalewa"}, options: [{l3: "Tu samawa rea", l4: "Sabalong samalewa"}, {l3: "Lalo mandi di sungai", l4: "Airnya dingin sekali"}] }
        ]),
        // Level 9: Mbojo (Values)
        createLevel([
            { culture: "Mbojo", sampiran: ["Wadu ntanda rahi", "Di pinggir laut"], question: "Rima i - ut", correct: {l3: "Dou labo dana", l4: "Mesti bersatu"}, options: [{l3: "Dou labo dana", l4: "Mesti bersatu"}, {l3: "Lihat batu besar", l4: "Di atas gunung"}] }
        ]),
        // Level 10: Sasambo Mix (Unity)
        createLevel([
            { culture: "Sasambo", sampiran: ["Rinjani Tambora menjulang tinggi", "Sumbawa pulau harapan"], question: "Rima i - an", correct: {l3: "Sasak Samawa Mbojo berseri", l4: "NTB Gemilang masa depan"}, options: [{l3: "Sasak Samawa Mbojo berseri", l4: "NTB Gemilang masa depan"}, {l3: "Jalan jalan ke pantai", l4: "Makan ikan bakar"}] }
        ]),
    ];
};

const getTakdirLevels = () => {
    const createLevel = (items: any[]) => items;
    return [
        // Level 1: Bertamu (Easy)
        createLevel([ 
            { title: "Bertamu di Sade", culture: "Sasak", context: "Pintu rumah adat Sasak sangat rendah.", question: "Apa yang kamu lakukan?", options: [{text: "Menunduk hormat", isCorrect: true, feedback: "Benar! Menunduk tanda menghormati tuan rumah."}, {text: "Masuk tegak", isCorrect: false, feedback: "Dug! Kepalamu terbentur. Tidak sopan."}] }
        ]),
        // Level 2: Makan (Easy)
        createLevel([
            { title: "Makan Sepat", culture: "Samawa", context: "Disuguhi ikan kuah asam (Sepat).", question: "Cara makan yang sopan?", options: [{text: "Pakai tangan (Muluk)", isCorrect: true, feedback: "Tepat. Tradisi 'Muluk' mempererat rasa."}, {text: "Minta sendok", isCorrect: false, feedback: "Kurang luwes, tuan rumah mungkin bingung."}] }
        ]),
        // Level 3: Menyapa (Easy)
        createLevel([
            { title: "Salam Bima", culture: "Mbojo", context: "Bertemu tetua adat Bima di jalan.", question: "Salam yang pas?", options: [{text: "Lembo Ade", isCorrect: true, feedback: "Salam halus khas Bima."}, {text: "Halo Bos", isCorrect: false, feedback: "Sangat tidak sopan."}] }
        ]),
        // Level 4: Pernikahan (Medium)
        createLevel([
            { title: "Merariq", culture: "Sasak", context: "Temanmu ingin menikahi gadis Sasak sesuai adat.", question: "Apa langkah pertamanya?", options: [{text: "Menculik (Melarikan) gadis", isCorrect: true, feedback: "Benar, 'Merariq' diawali dengan melarikan gadis atas persetujuan bersama."}, {text: "Melamar resmi ke rumah", isCorrect: false, feedback: "Itu adat umum, bukan adat Sasak tradisional."}] }
        ]),
        // Level 5: Etika Menonton (Medium)
        createLevel([
            { title: "Barapan Kebo", culture: "Samawa", context: "Kerbau sedang berlari kencang di sawah.", question: "Dimana kamu berdiri?", options: [{text: "Di pinggir pematang aman", isCorrect: true, feedback: "Aman dan tidak mengganggu Sandro (dukun)."}, {text: "Di tengah lintasan", isCorrect: false, feedback: "Bahaya! Kamu bisa tertabrak."}] }
        ]),
        // Level 6: Berpakaian (Medium)
        createLevel([
            { title: "Rimpu", culture: "Mbojo", context: "Seorang wanita memakai sarung menutup wajah (Rimpu Mpida).", question: "Apa statusnya?", options: [{text: "Belum Menikah", isCorrect: true, feedback: "Benar, hanya mata yang terlihat."}, {text: "Sudah Menikah", isCorrect: false, feedback: "Salah, kalau sudah menikah wajah terlihat (Rimpu Colo)."}] }
        ]),
        // Level 7: Konflik (Hard)
        createLevel([
            { title: "Peresean", culture: "Sasak", context: "Lawanmu di arena Peresean terluka.", question: "Sikapmu?", options: [{text: "Memeluk/Salaman setelah laga", isCorrect: true, feedback: "Sportivitas adalah inti Peresean."}, {text: "Mengejek lawan", isCorrect: false, feedback: "Tidak ksatria. Anda diusir dari arena."}] }
        ]),
        // Level 8: Hadiah (Hard)
        createLevel([
            { title: "Nyorong", culture: "Samawa", context: "Membawa hantaran pernikahan.", question: "Siapa yang harus membawa?", options: [{text: "Rombongan keluarga pria", isCorrect: true, feedback: "Ramai-ramai membawa barang."}, {text: "Dikirim lewat kurir", isCorrect: false, feedback: "Tidak menghargai adat."}] }
        ]),
        // Level 9: Upacara (Expert)
        createLevel([
            { title: "Hanta Ua Pua", culture: "Mbojo", context: "Upacara peringatan Maulid Nabi.", question: "Apa yang diarak?", options: [{text: "Rumah mahligai berisi bunga", isCorrect: true, feedback: "Benar, berisi sirih pinang dan bunga telur."}, {text: "Patung hewan", isCorrect: false, feedback: "Salah."}] }
        ]),
        // Level 10: Bahasa Halus (Expert)
        createLevel([
            { title: "Bicara dengan Datu", culture: "Sasambo", context: "Raja bertanya namamu.", question: "Jawaban paling halus?", options: [{text: "Tiang / Kaji / Mada", isCorrect: true, feedback: "Kata ganti 'Saya' yang paling halus."}, {text: "Aku / Saya", isCorrect: false, feedback: "Terlalu kasar untuk Raja."}] }
        ]),
    ];
};

// ... (KEEPING RENDER COMPONENTS: MisteriSasamboLevel, PantunHypeLevel, TakdirBebasLevel) ...
const MisteriSasamboLevel: React.FC<{ item: any, onWin: (won: boolean) => void }> = ({ item, onWin }) => {
    const [currentClueIdx, setCurrentClueIdx] = useState(0);
    const [showResult, setShowResult] = useState<'correct'|'wrong'|null>(null);

    const handleGuess = (option: string) => {
        if (option === item.target) {
            triggerFeedback('success');
            setShowResult('correct');
        } else {
            triggerFeedback('error');
            setShowResult('wrong');
        }
    };

    const handleNext = () => {
        const won = showResult === 'correct';
        setShowResult(null);
        setCurrentClueIdx(0);
        onWin(won);
    };

    return (
        <div className="flex flex-col h-full w-full max-w-md mx-auto relative overflow-y-auto pb-20 no-scrollbar">
            <div className="flex-1 relative mb-6 flex flex-col items-center justify-center min-h-[200px]">
                <AnimatePresence mode="wait">
                    <motion.div key={currentClueIdx} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full">
                        <GlassCard className="p-6 min-h-[200px] flex flex-col items-center justify-center text-center border-2 border-yellow-500/30 bg-[#3E2723]/90 relative overflow-hidden">
                            <span className="text-xs text-yellow-500 uppercase font-bold mb-4 tracking-widest bg-black/20 px-3 py-1 rounded-full">Petunjuk {currentClueIdx + 1} / 3</span>
                            <h2 className="text-xl font-bold text-white leading-relaxed font-serif italic">"{item.clues[currentClueIdx]}"</h2>
                        </GlassCard>
                    </motion.div>
                </AnimatePresence>
                {currentClueIdx < 2 && (
                    <button onClick={() => setCurrentClueIdx(p => p+1)} className="mt-4 text-[#D4A373] text-sm font-bold flex items-center gap-1 animate-pulse">Buka Petunjuk <ChevronLeft className="-rotate-90" size={14}/></button>
                )}
            </div>
            <div className="grid grid-cols-2 gap-3 pb-6 mt-auto flex-shrink-0">
                {item.options.map((opt: string, i: number) => (
                    <button key={i} onClick={() => handleGuess(opt)} className="p-4 rounded-xl bg-[#4E342E] border-2 border-[#8B5E3C] text-white font-bold text-sm shadow-lg active:scale-95 transition-all">
                        {opt}
                    </button>
                ))}
            </div>
            <AnimatePresence>
                {showResult && <ResultModal status={showResult} message={showResult === 'wrong' ? `Jawabannya: ${item.target}` : undefined} onNext={handleNext} />}
            </AnimatePresence>
        </div>
    );
};

const PantunHypeLevel: React.FC<{ item: any, onWin: (won: boolean) => void }> = ({ item, onWin }) => {
    const [showResult, setShowResult] = useState<'correct'|'wrong'|null>(null);
    const handleChoice = (option: any) => {
        if (option.l3 === item.correct.l3 && option.l4 === item.correct.l4) {
            triggerFeedback('success');
            setShowResult('correct');
        } else {
            triggerFeedback('error');
            setShowResult('wrong');
        }
    };
    const handleNext = () => {
        const won = showResult === 'correct';
        setShowResult(null);
        onWin(won);
    };
    return (
        <div className="flex flex-col h-full w-full max-w-md mx-auto relative overflow-y-auto pb-20 no-scrollbar">
            <div className="flex-1 flex flex-col items-center justify-start gap-4">
                <GlassCard className="w-full p-6 text-center border-purple-400/30 bg-purple-900/40 relative overflow-hidden">
                    <p className="text-pink-200 text-xs uppercase tracking-widest font-bold mb-3">Sampiran ({item.culture})</p>
                    <div className="space-y-2">
                        <p className="text-lg text-white font-serif italic">"{item.sampiran[0]}"</p>
                        <p className="text-lg text-white font-serif italic">"{item.sampiran[1]}"</p>
                    </div>
                </GlassCard>
                <div className="w-full flex flex-col gap-3 pb-6">
                    {item.options.map((opt: any, idx: number) => (
                        <motion.button
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => handleChoice(opt)}
                            className="text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-pink-600/20 hover:border-pink-500 active:scale-95 transition-all group"
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-1 w-5 h-5 rounded-full border border-white/30 group-hover:border-pink-400 flex items-center justify-center text-[10px] text-white/50 group-hover:text-pink-300">
                                    {String.fromCharCode(65 + idx)}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-white/90 font-medium">{opt.l3}</p>
                                    <p className="text-sm text-white/90 font-medium">{opt.l4}</p>
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
            <AnimatePresence>
                {showResult && <ResultModal status={showResult} onNext={handleNext} />}
            </AnimatePresence>
        </div>
    );
};

const TakdirBebasLevel: React.FC<{ item: any, onWin: (won: boolean) => void }> = ({ item, onWin }) => {
    const [showResult, setShowResult] = useState<'correct'|'wrong'|null>(null);
    const [feedback, setFeedback] = useState("");
    const handleChoice = (option: any) => {
        setFeedback(option.feedback);
        if (option.isCorrect) {
            triggerFeedback('success');
            setShowResult('correct');
        } else {
            triggerFeedback('error');
            setShowResult('wrong');
        }
    };
    const handleNext = () => {
        const won = showResult === 'correct';
        setShowResult(null);
        onWin(won);
    };
    return (
        <div className="flex flex-col h-full w-full max-w-md mx-auto relative overflow-y-auto pb-20 no-scrollbar">
            <div className="flex-1 flex flex-col items-center z-10">
                <GlassCard className="p-6 mb-6 bg-indigo-900/60 border-indigo-400/30">
                    <h2 className="text-xl font-bold text-white mb-4 leading-relaxed">"{item.context}"</h2>
                    <p className="text-indigo-200 text-sm italic mb-2">Pertanyaan:</p>
                    <p className="text-white font-medium">{item.question}</p>
                </GlassCard>
                <div className="flex flex-col gap-3 pb-8 w-full">
                    {item.options.map((opt: any, i: number) => (
                        <motion.button 
                            key={i}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 + 0.2 }}
                            onClick={() => handleChoice(opt)}
                            className="w-full p-4 rounded-xl bg-white/5 border border-indigo-300/20 text-left text-indigo-50 hover:bg-indigo-600/30 hover:border-indigo-400 transition-all active:scale-95 shadow-lg"
                        >
                            <span className="text-sm font-medium">{opt.text}</span>
                        </motion.button>
                    ))}
                </div>
            </div>
            <AnimatePresence>
                {showResult && (
                    <ResultModal status={showResult} message={feedback} onNext={handleNext} />
                )}
            </AnimatePresence>
        </div>
    );
};

const triggerFeedback = (type: 'success' | 'error' | 'click') => {
    if (navigator.vibrate) {
        if (type === 'success') navigator.vibrate([50, 50, 100]);
        if (type === 'error') navigator.vibrate(200);
        if (type === 'click') navigator.vibrate(20);
    }
};

const EarthyContainer: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-[#3E2723]/60 border border-[#8B5E3C]/50 backdrop-blur-md rounded-3xl p-4 shadow-xl ${className}`}>
        {children}
    </div>
);

// --- RANDOM REWARD LOGIC (FOR INTERMEDIATE LEVELS) ---
const getRandomReward = (userInventory: InventoryItem[]): InventoryItem | undefined => {
    const ownedIds = new Set(userInventory.map(i => i.id));
    // Exclude DATU items for normal rewards
    const available = MASTER_INVENTORY.filter(i => !ownedIds.has(i.id) && i.rarity !== 'RADEN_DENDE');

    if (available.length === 0) return undefined;

    const roll = Math.random();
    let targetRarity: ItemRarity = 'JAJARKARANG';

    if (roll > 0.90) targetRarity = 'PEMANGKU'; // 10% chance
    else if (roll > 0.60) targetRarity = 'KETUA_KARANG'; // 30% chance
    else targetRarity = 'JAJARKARANG'; // 60% chance

    let pool = available.filter(i => i.rarity === targetRarity);
    if (pool.length === 0) pool = available;

    return pool[Math.floor(Math.random() * pool.length)];
}

// --- GUARANTEED DATU REWARD LOGIC (FOR FINAL LEVEL) ---
const getDatuReward = (userInventory: InventoryItem[]): InventoryItem | undefined => {
    const ownedIds = new Set(userInventory.map(i => i.id));
    
    // Filter only DATU items
    const datuItems = MASTER_INVENTORY.filter(i => i.rarity === 'RADEN_DENDE');
    
    // Find unowned Datu items
    const available = datuItems.filter(i => !ownedIds.has(i.id));

    // If player has all Datu items, give a random Datu item (duplicate)
    if (available.length === 0) {
        return datuItems[Math.floor(Math.random() * datuItems.length)];
    }

    // Return a random new Datu item
    return available[Math.floor(Math.random() * available.length)];
}

const getRarityColor = (rarity: ItemRarity) => {
    switch (rarity) {
        case 'JAJARKARANG': return 'text-amber-200 border-amber-800 from-amber-900 to-amber-950'; // Wood/Earthy
        case 'KETUA_KARANG': return 'text-blue-200 border-blue-500 from-slate-800 to-slate-900'; // Iron/Steel
        case 'PEMANGKU': return 'text-yellow-100 border-yellow-400 from-yellow-900 to-amber-900'; // Gold
        case 'LALU_BAIQ': return 'text-amber-200 border-amber-500 from-amber-800 to-amber-900'; // Epic
        case 'RADEN_DENDE': return 'text-fuchsia-200 border-fuchsia-500 from-purple-900 to-fuchsia-950 shadow-[0_0_30px_rgba(216,180,254,0.3)]'; // Mystical
        default: return 'text-white border-white';
    }
}

// --- NEW SPECTACULAR GRAND CELEBRATION COMPONENT ---
const GrandCelebration: React.FC<{ item: InventoryItem, onCollected: () => void }> = ({ item, onCollected }) => {
    useEffect(() => {
        triggerFeedback('success');
    }, []);

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 overflow-hidden"
        >
            {/* Background Rotating Rays */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-[200vw] h-[200vw] bg-[conic-gradient(from_0deg,transparent_0_20deg,rgba(168,85,247,0.1)_20deg_40deg,transparent_40deg_60deg,rgba(234,179,8,0.1)_60deg_80deg,transparent_80deg)] opacity-50"
                />
            </div>

            {/* Exploding Particles (Simulated with simple divs for performance) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                        animate={{ 
                            x: (Math.random() - 0.5) * 800, 
                            y: (Math.random() - 0.5) * 800, 
                            scale: Math.random() * 1.5, 
                            opacity: 0 
                        }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        className={`absolute top-1/2 left-1/2 w-4 h-4 rounded-full ${Math.random() > 0.5 ? 'bg-yellow-400' : 'bg-purple-500'}`}
                    />
                ))}
            </div>

            {/* Main Content */}
            <motion.div 
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
                className="relative z-10 flex flex-col items-center text-center p-8 w-full max-w-sm"
            >
                {/* Crown Icon */}
                <motion.div 
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mb-4"
                >
                    <Crown size={64} className="text-yellow-400 fill-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
                </motion.div>

                {/* Title */}
                <motion.h1 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-4xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-purple-300 mb-2 drop-shadow-lg"
                >
                    LUAR BIASA!
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 0.7 }}
                    className="text-purple-200 text-sm font-bold tracking-widest uppercase mb-10"
                >
                    Master Penjaga Bahasa
                </motion.p>

                {/* The Item Card */}
                <div className={`relative w-full bg-gradient-to-b from-purple-900/80 to-black/80 border-4 border-purple-500 p-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(168,85,247,0.4)] backdrop-blur-xl group overflow-hidden`}>
                    
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <motion.div 
                        animate={{ y: [0, -10, 0] }} 
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="text-9xl mb-4 filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
                    >
                        {item.image}
                    </motion.div>
                    
                    <div className="bg-black/50 rounded-full px-4 py-1 inline-block mb-3 border border-purple-400/50">
                        <span className="text-xs font-bold text-fuchsia-300 uppercase tracking-widest">RADEN DENDE (Legendary)</span>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-2">{item.name}</h2>
                    <p className="text-white/60 text-xs italic">"{item.description}"</p>
                </div>

                {/* Button */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                    className="mt-10 w-full"
                >
                    <LiquidButton onClick={onCollected} variant="success" fullWidth className="py-4 text-lg border-2 border-yellow-400/50 shadow-[0_0_20px_rgba(250,204,21,0.3)]">
                        Klaim Pusaka Abadi
                    </LiquidButton>
                </motion.div>

            </motion.div>
        </motion.div>
    );
};

// --- ANIMATED REWARD CHEST (Standard - kept for intermediate levels) ---
const RewardChestAnimation: React.FC<{ item: InventoryItem, onCollected: () => void }> = ({ item, onCollected }) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleOpen = () => { triggerFeedback('success'); setIsOpen(true); };
    const renderChestVisual = () => {
        switch(item.rarity) {
            case 'JAJARKARANG': return <div className="text-8xl filter drop-shadow-xl grayscale-[0.2]">📦</div>;
            case 'KETUA_KARANG': return <div className="text-8xl filter drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]">🛡️</div>;
            case 'PEMANGKU': return <div className="text-8xl filter drop-shadow-[0_0_20px_rgba(250,204,21,0.6)]">⚱️</div>;
            case 'LALU_BAIQ': return <div className="text-8xl filter drop-shadow-[0_0_25px_rgba(250,150,50,0.7)]">🗡️</div>;
            case 'RADEN_DENDE': return <div className="text-9xl filter drop-shadow-[0_0_30px_rgba(232,121,249,0.8)] animate-pulse">🔮</div>;
            default: return <div className="text-8xl">🎁</div>;
        }
    };
    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <AnimatePresence mode="wait">
                {!isOpen ? (
                    <motion.div key="chest" className="cursor-pointer relative flex flex-col items-center" onClick={handleOpen} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 1.5, opacity: 0 }}>
                        {(item.rarity === 'PEMANGKU' || item.rarity === 'LALU_BAIQ' || item.rarity === 'RADEN_DENDE') && (<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-500/20 blur-3xl rounded-full animate-pulse"></div>)}
                        <motion.div animate={{ rotate: [0, -2, 2, -2, 2, 0], scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}>{renderChestVisual()}</motion.div>
                        <p className="text-white/80 font-bold mt-8 text-center animate-bounce bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">Ketuk untuk Buka!</p>
                    </motion.div>
                ) : (
                    <motion.div key="item" initial={{ scale: 0, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="flex flex-col items-center w-full px-4">
                        <div className={`relative w-full max-w-xs bg-gradient-to-b ${getRarityColor(item.rarity).split(' ').slice(2).join(' ')} border-4 ${getRarityColor(item.rarity).split(' ')[1]} p-6 rounded-[2rem] shadow-2xl flex flex-col items-center text-center overflow-hidden`}>
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                            <div className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-4 px-3 py-1 rounded-full bg-black/40 ${getRarityColor(item.rarity).split(' ')[0]}`}>{item.rarity}</div>
                            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.2, type: "spring" }} className="text-8xl mb-6 filter drop-shadow-2xl">{item.image}</motion.div>
                            <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{item.name}</h2>
                            <p className="text-white/70 text-xs mb-6 leading-relaxed px-2 font-medium">"{item.description || "Sebuah artefak legendaris dari tanah Sasambo."}"</p>
                            <LiquidButton onClick={onCollected} variant="success" fullWidth>Simpan ke Museum</LiquidButton>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ResultModal: React.FC<{ status: 'correct' | 'wrong' | 'reward', message?: string, onNext: () => void, rewardItem?: InventoryItem }> = ({ status, message, onNext, rewardItem }) => {
    // If it's a DATU item, show the new GrandCelebration component
    if (status === 'reward' && rewardItem && rewardItem.rarity === 'RADEN_DENDE') {
        return <GrandCelebration item={rewardItem} onCollected={onNext} />;
    }

    if (status === 'reward' && rewardItem) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
                <RewardChestAnimation item={rewardItem} onCollected={onNext} />
            </motion.div>
        )
    }
    return (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <div className={`w-full max-w-sm p-6 rounded-3xl border-4 text-center shadow-2xl ${status === 'correct' ? 'bg-green-900/90 border-green-500' : 'bg-red-900/90 border-red-500'}`}>
                <div className="text-6xl mb-4 animate-bounce">{status === 'correct' ? '🎉' : '❌'}</div>
                <h2 className="text-2xl font-bold text-white mb-2">{status === 'correct' ? 'Benar Sekali!' : 'Kurang Tepat!'}</h2>
                {message && <p className="text-white/80 mb-6">{message}</p>}
                <LiquidButton onClick={onNext} fullWidth variant={status === 'wrong' ? 'secondary' : 'success'}>{status === 'wrong' ? 'Coba Lagi' : 'Lanjut'}</LiquidButton>
            </div>
        </motion.div>
    );
};

// --- PASAR KATA, TEBAK BAHASA, LEGENDA (Fixed Layouts) ---
const PasarKataLevel: React.FC<{ item: PasarKataQuestion, onWin: (won: boolean) => void }> = ({ item, onWin }) => {
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [availableWords, setAvailableWords] = useState<string[]>([]);
    const [showResult, setShowResult] = useState<'correct'|'wrong'|null>(null);

    useEffect(() => {
        const split = item.target.split(' ');
        const shuffled = [...split].sort(() => Math.random() - 0.5);
        setAvailableWords(shuffled);
        setSelectedWords([]);
        setShowResult(null);
    }, [item]);

    const addToSentence = (word: string, index: number) => {
        triggerFeedback('click');
        const newAvail = [...availableWords];
        newAvail.splice(index, 1);
        setAvailableWords(newAvail);
        setSelectedWords([...selectedWords, word]);
    };

    const removeFromSentence = (word: string) => {
        triggerFeedback('click');
        const newSel = selectedWords.filter(w => w !== word);
        setSelectedWords(newSel);
        setAvailableWords([...availableWords, word]);
    };

    const check = () => {
        if (selectedWords.join(' ') === item.target) {
            triggerFeedback('success');
            setShowResult('correct');
        } else {
            triggerFeedback('error');
            setShowResult('wrong');
        }
    };

    const handleNext = () => {
        const won = showResult === 'correct';
        setShowResult(null);
        onWin(won);
    };

    return (
        <div className="flex flex-col h-full w-full max-w-md mx-auto relative overflow-y-auto pb-20 no-scrollbar">
             <EarthyContainer className="mb-4 text-center border-[#D4A373]/30 flex-shrink-0">
                <p className="text-[#D4A373] text-xs mb-2 uppercase tracking-widest font-bold">Susun Kalimat</p>
                <h2 className="text-xl font-display font-bold text-[#FEFAE0] italic tracking-wide">"{item.translation}"</h2>
            </EarthyContainer>
             <div className="bg-[#2C1810]/40 rounded-2xl border-2 border-dashed border-[#8B5E3C]/30 p-4 mb-6 min-h-[140px] relative flex-shrink-0">
                {selectedWords.length === 0 && (<div className="absolute inset-0 flex items-center justify-center text-white/20 text-sm italic pointer-events-none text-center p-4">Ketuk kata di bawah untuk menambahkan.</div>)}
                <Reorder.Group axis="y" values={selectedWords} onReorder={setSelectedWords} className="flex flex-wrap gap-2">
                    {selectedWords.map((word) => (
                        <Reorder.Item key={word} value={word}>
                            <motion.div layout onClick={() => removeFromSentence(word)} className="px-3 py-2 bg-[#FEFAE0] text-[#2C1810] rounded-xl font-bold shadow-md border-b-4 border-[#D4A373] flex items-center justify-between gap-2 cursor-pointer text-sm">
                                <span>{word}</span><X size={12} className="text-red-500" />
                            </motion.div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            </div>
             <div className="flex flex-wrap gap-2 justify-center mb-8 flex-shrink-0">
                {availableWords.map((w, i) => (
                    <motion.button layoutId={`word-${w}-${i}`} key={`avail-${i}`} onClick={() => addToSentence(w, i)} className="px-3 py-2 bg-[#5D4037] text-[#FEFAE0] border border-[#8B5E3C] rounded-xl font-bold text-sm shadow-lg active:scale-95">{w}</motion.button>
                ))}
            </div>
            <div className="mt-auto pb-4"><LiquidButton onClick={check} disabled={availableWords.length > 0} fullWidth className={availableWords.length > 0 ? 'opacity-50 grayscale' : ''}><Check size={20} /> Cek Jawaban</LiquidButton></div>
            <AnimatePresence>{showResult && <ResultModal status={showResult} message={showResult === 'wrong' ? `Jawabannya: "${item.target}"` : undefined} onNext={handleNext} />}</AnimatePresence>
        </div>
    )
};

const TebakBahasaLevel: React.FC<{ item: TebakBahasaQuestion, onWin: (won: boolean) => void }> = ({ item, onWin }) => {
    const [showResult, setShowResult] = useState<'correct'|'wrong'|null>(null);
    const handleAnswer = (ans: string) => {
        if (ans === item.correctAnswer) { triggerFeedback('success'); setShowResult('correct'); } 
        else { triggerFeedback('error'); setShowResult('wrong'); }
    };
    const handleNext = () => { const won = showResult === 'correct'; setShowResult(null); onWin(won); };
    return (
        <div className="flex flex-col h-full w-full max-w-md mx-auto relative overflow-y-auto pb-20 no-scrollbar">
             <EarthyContainer className="mb-4 text-center border-[#D4A373]/30 flex-shrink-0">
                <p className="text-[#D4A373] text-xs mb-2 uppercase tracking-widest font-bold">Kuis Kosakata</p>
                <h2 className="text-xl font-display font-bold text-[#FEFAE0] italic tracking-wide">{item.question}</h2>
            </EarthyContainer>
             <div className="grid gap-3 flex-shrink-0">
                {item.options.map((opt, i) => (
                    <motion.button key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} onClick={() => handleAnswer(opt)} className="p-4 bg-[#4E342E] text-[#FEFAE0] border border-[#8B5E3C] rounded-xl font-bold text-sm shadow-lg active:scale-95 text-left flex items-center justify-between hover:bg-[#5D4037]">
                        {opt}<div className="w-6 h-6 rounded-full border border-[#FEFAE0]/30 flex items-center justify-center text-xs opacity-50">{String.fromCharCode(65+i)}</div>
                    </motion.button>
                ))}
            </div>
            <AnimatePresence>{showResult && <ResultModal status={showResult} message={showResult === 'wrong' ? `Jawaban: ${item.correctAnswer}` : undefined} onNext={handleNext} />}</AnimatePresence>
        </div>
    )
};

const LegendaLevel: React.FC<{ item: LegendaQuestion, onWin: (won: boolean) => void }> = ({ item, onWin }) => {
    const [showResult, setShowResult] = useState<'correct'|'wrong'|null>(null);
    const handleAnswer = (ans: string) => {
        if (ans === item.correctAnswer) { triggerFeedback('success'); setShowResult('correct'); } 
        else { triggerFeedback('error'); setShowResult('wrong'); }
    };
    const handleNext = () => { const won = showResult === 'correct'; setShowResult(null); onWin(won); };
    return (
        <div className="flex flex-col h-full w-full max-w-md mx-auto relative overflow-y-auto pb-20 no-scrollbar">
             <EarthyContainer className="mb-4 text-center border-[#D4A373]/30 flex-shrink-0">
                <p className="text-[#D4A373] text-xs mb-2 uppercase tracking-widest font-bold">Legenda & Budaya</p>
                {item.story && <p className="text-white/60 text-xs italic mb-3">"{item.story}"</p>}
                <h2 className="text-lg font-bold text-[#FEFAE0]">{item.question}</h2>
            </EarthyContainer>
             <div className="grid gap-3 flex-shrink-0">
                {item.options.map((opt, i) => (
                    <motion.button key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} onClick={() => handleAnswer(opt)} className="p-4 bg-[#2C1810] text-[#FEFAE0] border border-[#8B5E3C] rounded-xl font-bold text-sm shadow-lg active:scale-95 text-left hover:bg-[#3E2723]">{opt}</motion.button>
                ))}
            </div>
            <AnimatePresence>{showResult && <ResultModal status={showResult} message={showResult === 'wrong' ? `Jawaban: ${item.correctAnswer}` : undefined} onNext={handleNext} />}</AnimatePresence>
        </div>
    )
};

// --- GENERIC GAME ENGINE (UPDATED FOR LANGUAGE KEY) ---
const GameEngine = <T,>({ title, maxUnlocked, levelsData, onExit, actions, gameKey, onPlayStateChange, renderContent }: any) => {
    const [view, setView] = useState<ViewState>(ViewState.LEVEL_SELECT);
    const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [score, setScore] = useState(0); 
    const [user, setUser] = useState<UserProfile|null>(null);
    const [rewardItem, setRewardItem] = useState<InventoryItem | undefined>(undefined);

    useEffect(() => {
        const u = localStorage.getItem('lingo_user');
        if(u) setUser(JSON.parse(u));
    }, [view]);

    useEffect(() => {
        if (onPlayStateChange) onPlayStateChange(view === ViewState.PLAYING);
        return () => { if (onPlayStateChange) onPlayStateChange(false); };
    }, [view, onPlayStateChange]);

    if (view === ViewState.LEVEL_SELECT) {
        return (
            <div className="h-full flex flex-col p-6 pt-12 relative overflow-hidden">
                 <div className="flex items-center gap-4 mb-8 z-10 flex-shrink-0">
                    <button onClick={onExit} className="p-2 rounded-full bg-[#5D4037] border border-[#8B5E3C]"><ChevronLeft className="text-[#FEFAE0]" /></button>
                    <h1 className="text-2xl font-display font-bold text-[#FEFAE0]">{title}</h1>
                </div>
                {/* Scrollable Grid */}
                <div className="grid grid-cols-3 gap-4 overflow-y-auto pb-32 z-10 no-scrollbar flex-1 content-start">
                    {levelsData.map((_: any, idx: number) => {
                        const isLocked = idx + 1 > maxUnlocked;
                        return (
                            <motion.button key={idx} disabled={isLocked} onClick={() => { setCurrentLevelIdx(idx); setCurrentQuestionIdx(0); setScore(0); setView(ViewState.PLAYING); setRewardItem(undefined); }} className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative border-2 shadow-lg ${isLocked ? 'bg-[#2C1810] opacity-60' : 'bg-gradient-to-br from-[#8B5E3C] to-[#5D4037]'}`}>
                                {isLocked ? <Lock className="text-[#8B5E3C]" /> : <span className="text-3xl font-bold text-[#FEFAE0]">{idx + 1}</span>}
                            </motion.button>
                        )
                    })}
                </div>
            </div>
        )
    }

    if (view === ViewState.RESULT) {
        // Need roughly 66% correct (2 out of 3, or similar, or 1/1)
        const totalQs = levelsData[currentLevelIdx].length;
        const passed = score >= Math.ceil(totalQs * 0.6); 

        if (rewardItem) return <ResultModal status="reward" rewardItem={rewardItem} onNext={() => { setRewardItem(undefined); }} />;

        return (
            <div className="h-full flex flex-col items-center justify-center p-8 pb-32 overflow-y-auto">
                <GlassCard className="p-8 w-full flex flex-col items-center text-center border-2 border-[#8B5E3C] bg-[#3E2723]/90 my-auto">
                    <div className="text-6xl mb-4">{passed ? "🎉" : "💪"}</div>
                    <h2 className="text-3xl font-bold text-[#FEFAE0] mb-2">{passed ? "Luar Biasa!" : "Jangan Menyerah"}</h2>
                    <p className="text-[#D4A373] mb-8">Skor: {score} / {totalQs}</p>
                    <div className="w-full flex flex-col gap-3">
                        {passed && currentLevelIdx < levelsData.length - 1 && <LiquidButton variant="primary" onClick={() => { 
                             actions.unlockGameLevel(gameKey, currentLevelIdx + 2); 
                             setCurrentLevelIdx(c => c + 1); 
                             setCurrentQuestionIdx(0); 
                             setScore(0); 
                             setView(ViewState.PLAYING); 
                        }}>Level Berikutnya</LiquidButton>}
                        <LiquidButton variant="secondary" onClick={() => { setCurrentQuestionIdx(0); setScore(0); setView(ViewState.PLAYING); }}>Main Lagi</LiquidButton>
                        <button onClick={() => setView(ViewState.LEVEL_SELECT)} className="text-[#8B5E3C] text-sm py-4">Kembali ke Menu</button>
                    </div>
                </GlassCard>
            </div>
        )
    }

    const handleLevelNext = (won: boolean) => {
        if (won) {
            setScore(s => s + 1);
            actions.addXp(10);
        }
        if (currentQuestionIdx < levelsData[currentLevelIdx].length - 1) {
            setCurrentQuestionIdx(c => c + 1);
        } else {
             // Level Finished Check
             const totalQs = levelsData[currentLevelIdx].length;
             const finalScore = won ? score + 1 : score;
             const passed = finalScore >= Math.ceil(totalQs * 0.6);
             
             if (passed) {
                 actions.unlockGameLevel(gameKey, currentLevelIdx + 2);
                 
                 // Check if this is the FINAL level of the game
                 const isFinalLevel = currentLevelIdx === levelsData.length - 1;

                 if(user) {
                     if (isFinalLevel) {
                         // GRAND FINALE: Guaranteed DATU Reward & Spectacular Animation
                         const reward = getDatuReward(user.inventory);
                         if(reward) { actions.addItem(reward); setRewardItem(reward); }
                     } else {
                         // INTERMEDIATE LEVELS: Chance for Standard Reward (Non-Datu)
                         // 30% chance to get a common/rare item
                         if (Math.random() > 0.7) {
                             const reward = getRandomReward(user.inventory);
                             if (reward) { actions.addItem(reward); setRewardItem(reward); }
                         }
                     }
                 }
            }
            setView(ViewState.RESULT);
        }
    };

    return (
        <div className="h-full flex flex-col p-6 pt-12 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 z-10 flex-shrink-0">
                <button onClick={() => setView(ViewState.LEVEL_SELECT)} className="p-2 bg-[#3E2723] rounded-full"><ChevronLeft className="text-[#FEFAE0]" /></button>
                <div className="flex flex-col items-center">
                     <span className="text-[10px] font-bold text-[#8B5E3C]">LEVEL {currentLevelIdx + 1}</span>
                     <span className="text-sm font-bold text-[#FEFAE0]">Soal {currentQuestionIdx + 1} / {levelsData[currentLevelIdx].length}</span>
                </div>
                <div className="w-8" />
            </div>
            <div className="w-full h-3 bg-[#2C1810] rounded-full mb-8 overflow-hidden z-10 border border-[#5D4037] flex-shrink-0">
                <motion.div animate={{ width: `${((currentQuestionIdx) / levelsData[currentLevelIdx].length) * 100}%` }} className="h-full bg-gradient-to-r from-[#8B5E3C] to-[#D4A373]" />
            </div>
            
            <div className="flex-1 z-10 relative overflow-y-auto pb-20 no-scrollbar">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={currentQuestionIdx} 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: -20 }}
                        className="h-full"
                    >
                        {renderContent(levelsData[currentLevelIdx][currentQuestionIdx], handleLevelNext)}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
};

// --- LANGUAGE SELECTION SCREEN ---
const LanguageSelector: React.FC<{ onSelect: (l: Language) => void, onBack: () => void }> = ({ onSelect, onBack }) => {
    return (
        <div className="h-full flex flex-col p-6 pt-12 relative overflow-hidden">
            <div className="flex items-center gap-4 mb-8 z-10">
                <button onClick={onBack} className="p-2 rounded-full bg-[#5D4037] border border-[#8B5E3C]"><ChevronLeft className="text-[#FEFAE0]" /></button>
                <h1 className="text-2xl font-display font-bold text-[#FEFAE0]">Pilih Bahasa</h1>
            </div>
            <div className="grid gap-4 z-10">
                {[Language.SASAK, Language.SAMAWA, Language.MBOJO].map((lang, i) => (
                    <motion.button 
                        key={lang}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => onSelect(lang)}
                        className={`p-6 rounded-3xl border-2 text-left relative overflow-hidden group shadow-xl
                            ${lang === Language.SASAK ? 'bg-gradient-to-r from-red-900/80 to-red-800/80 border-red-500/30' : 
                              lang === Language.SAMAWA ? 'bg-gradient-to-r from-blue-900/80 to-blue-800/80 border-blue-500/30' : 
                              'bg-gradient-to-r from-purple-900/80 to-purple-800/80 border-purple-500/30'}`
                        }
                    >
                        <h2 className="text-2xl font-bold text-white mb-1">{lang}</h2>
                        <p className="text-white/60 text-xs">Mulai Petualangan</p>
                        <ArrowRightIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" size={32} />
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
const ArrowRightIcon = ({className, size}: any) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;


// --- MAIN MINI GAMES COMPONENT (CONTROLLER) ---
const MiniGames: React.FC<MiniGamesProps> = ({ onBack, actions, user, onPlayStateChange }) => {
  const [activeGame, setActiveGame] = useState<GameType>(GameType.MENU);
  const [selectedLang, setSelectedLang] = useState<Language | null>(null);
  
  const renderGame = () => {
      // 1. Language Dependent Games
      if (activeGame === GameType.PASAR_KATA) {
          if (!selectedLang) return <LanguageSelector onSelect={setSelectedLang} onBack={() => setActiveGame(GameType.MENU)} />;
          return <GameEngine 
              title={`Pasar Kata (${selectedLang})`} 
              maxUnlocked={user.gameProgress[`pasarKata_${selectedLang}`] || 1} 
              levelsData={getPasarKataData()[selectedLang]} 
              onExit={() => { setSelectedLang(null); setActiveGame(GameType.MENU); }} 
              actions={actions} 
              gameKey={`pasarKata_${selectedLang}`} 
              onPlayStateChange={onPlayStateChange} 
              renderContent={(item:any, onWin:any) => <PasarKataLevel item={item} onWin={onWin} />} 
          />;
      }
      if (activeGame === GameType.TEBAK_BAHASA) {
          if (!selectedLang) return <LanguageSelector onSelect={setSelectedLang} onBack={() => setActiveGame(GameType.MENU)} />;
          return <GameEngine 
              title={`Kuis Budaya (${selectedLang})`} 
              maxUnlocked={user.gameProgress[`tebakBahasa_${selectedLang}`] || 1} 
              levelsData={getTebakBahasaData()[selectedLang]} 
              onExit={() => { setSelectedLang(null); setActiveGame(GameType.MENU); }} 
              actions={actions} 
              gameKey={`tebakBahasa_${selectedLang}`} 
              onPlayStateChange={onPlayStateChange} 
              renderContent={(item:any, onWin:any) => <TebakBahasaLevel item={item} onWin={onWin} />} 
          />;
      }
      if (activeGame === GameType.LEGENDA) {
          if (!selectedLang) return <LanguageSelector onSelect={setSelectedLang} onBack={() => setActiveGame(GameType.MENU)} />;
          return <GameEngine 
              title={`Legenda Quest (${selectedLang})`} 
              maxUnlocked={user.gameProgress[`legenda_${selectedLang}`] || 1} 
              levelsData={getLegendaData()[selectedLang]} 
              onExit={() => { setSelectedLang(null); setActiveGame(GameType.MENU); }} 
              actions={actions} 
              gameKey={`legenda_${selectedLang}`} 
              onPlayStateChange={onPlayStateChange} 
              renderContent={(item:any, onWin:any) => <LegendaLevel item={item} onWin={onWin} />} 
          />;
      }

      // 2. Global Games (Already Mixed or Specific)
      if (activeGame === GameType.MISTERI_SASAMBO) {
          return <GameEngine title="Misteri Sasambo" maxUnlocked={user.gameProgress.misteriSasambo} levelsData={getMisteriLevels()} onExit={() => setActiveGame(GameType.MENU)} actions={actions} gameKey="misteriSasambo" onPlayStateChange={onPlayStateChange} renderContent={(item:any, onWin:any) => <MisteriSasamboLevel item={item} onWin={onWin} />} />;
      }
      if (activeGame === GameType.PANTUN_HYPE) {
          return <GameEngine title="Pantun Hype" maxUnlocked={user.gameProgress.pantunHype} levelsData={getPantunLevels()} onExit={() => setActiveGame(GameType.MENU)} actions={actions} gameKey="pantunHype" onPlayStateChange={onPlayStateChange} renderContent={(item:any, onWin:any) => <PantunHypeLevel item={item} onWin={onWin} />} />;
      }
      if (activeGame === GameType.TAKDIR_BEBAS) {
          return <GameEngine title="Takdir Bebas" maxUnlocked={user.gameProgress.pantunHype} levelsData={getTakdirLevels()} onExit={() => setActiveGame(GameType.MENU)} actions={actions} gameKey="pantunHype" onPlayStateChange={onPlayStateChange} renderContent={(item:any, onWin:any) => <TakdirBebasLevel item={item} onWin={onWin} />} />;
      }
      
      return <GameMenu onSelect={setActiveGame} onBack={onBack} />;
  }

  return (
    <div className="h-full w-full bg-[#2a1b15] overflow-hidden relative flex flex-col">
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/wood-pattern.png")`, backgroundSize: '200px' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
        <div className="relative z-10 h-full flex flex-col">{renderGame()}</div>
    </div>
  );
};

// ... (KEEPING GameMenu COMPONENT AS IS) ...
const GameMenu: React.FC<{ onSelect: (g: GameType) => void, onBack: () => void }> = ({ onSelect, onBack }) => {
    const games = [
        { id: GameType.PASAR_KATA, title: "Pasar Kata", desc: "Susun Kalimat", icon: <Grid size={24} />, color: "bg-amber-700" },
        { id: GameType.TEBAK_BAHASA, title: "Kuis Budaya", desc: "Tebak Arti Kata", icon: <Music size={24} />, color: "bg-purple-800" },
        { id: GameType.LEGENDA, title: "Legenda Quest", desc: "Pengetahuan Umum", icon: <Book size={24} />, color: "bg-emerald-800" },
        { id: GameType.MISTERI_SASAMBO, title: "Misteri Sasambo", desc: "Detektif Benda/Adat", icon: <Search size={24} />, color: "bg-cyan-700" },
        { id: GameType.PANTUN_HYPE, title: "Pantun Hype", desc: "Lengkapi Rima", icon: <Sparkles size={24} />, color: "bg-pink-700" },
        { id: GameType.TAKDIR_BEBAS, title: "Takdir Bebas", desc: "Pilih Jalan Cerita", icon: <Compass size={24} />, color: "bg-indigo-700" },
    ];
    return (
        <div className="p-6 pt-12 flex flex-col h-full relative overflow-y-auto pb-32 no-scrollbar">
            <div className="flex items-center gap-4 mb-8 z-10 flex-shrink-0">
                <button onClick={onBack} className="p-2 rounded-full bg-[#5D4037] border border-[#8B5E3C]"><ChevronLeft className="text-[#FEFAE0]" /></button>
                <h1 className="text-2xl font-display font-bold text-[#FEFAE0]">Arcade</h1>
            </div>
            <div className="grid gap-4 z-10 pb-10">
                {games.map((game, i) => (
                    <motion.button key={game.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} onClick={() => onSelect(game.id)} className={`relative overflow-hidden group rounded-3xl shadow-lg bg-[#3E2723] border border-[#8B5E3C] active:translate-y-1 transition-all`}>
                        <div className="p-6 text-left flex items-center justify-between">
                            <div className="flex items-center gap-4 z-10">
                                <div className={`w-14 h-14 rounded-2xl ${game.color} flex items-center justify-center text-white shadow-inner border-2 border-white/20`}>{game.icon}</div>
                                <div><h3 className="text-lg font-bold text-[#FEFAE0]">{game.title}</h3><p className="text-xs text-[#D4A373]">{game.desc}</p></div>
                            </div>
                            <Play size={16} className="text-[#8B5E3C]" />
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default MiniGames;
