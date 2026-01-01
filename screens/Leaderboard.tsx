import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, Shield, Send, UserPlus, MessageCircle, Sparkles, X, MapPin, Users } from 'lucide-react';
import { GlassCard, LiquidButton } from '../components/GlassUI';
import { UserProfile, ScreenState } from '../types';
import { MOCK_LEADERBOARD } from '../constants';

interface LeaderboardProps {
  user: UserProfile;
  onNavigate: (screen: ScreenState) => void;
}

const MOCK_FRIENDS = [
    { name: "Baiq Melati", from: "Lombok Tengah", bio: "Suka menenun & nyanyi lagu Sasak.", avatar: "https://picsum.photos/100/100?random=20" },
    { name: "Lalu Gede", from: "Lombok Timur", bio: "Hobi main Gendang Beleq.", avatar: "https://picsum.photos/100/100?random=21" },
    { name: "Dae Ming", from: "Bima", bio: "Pencinta kuda liar & sejarah.", avatar: "https://picsum.photos/100/100?random=22" },
    { name: "Siti Aisyah", from: "Sumbawa Besar", bio: "Jago bikin permen susu kerbau.", avatar: "https://picsum.photos/100/100?random=23" },
];

const Leaderboard: React.FC<LeaderboardProps> = ({ user, onNavigate }) => {
  // Pen Pal States
  const [penPalState, setPenPalState] = useState<'IDLE' | 'SEARCHING' | 'FOUND'>('IDLE');
  const [foundFriend, setFoundFriend] = useState<any>(null);

  // Combine Mock data with Real User data and Sort
  const combinedData = [
    ...MOCK_LEADERBOARD.filter(u => u.name !== 'Anda').map(u => ({ ...u, isUser: false })), 
    { 
        rank: 0, 
        name: user.name, 
        xp: user.xp, 
        avatar: "https://picsum.photos/100/100?random=99", 
        guild: "Petualang Baru",
        isUser: true 
    }
  ].sort((a, b) => b.xp - a.xp);

  const sortedData = combinedData.map((item, index) => ({
      ...item,
      rank: index + 1
  }));

  const userRank = sortedData.findIndex(u => u.isUser) + 1;

  const findPenPal = () => {
      setPenPalState('SEARCHING');
      setFoundFriend(null);
      
      // Simulate API Call
      setTimeout(() => {
          const randomFriend = MOCK_FRIENDS[Math.floor(Math.random() * MOCK_FRIENDS.length)];
          setFoundFriend(randomFriend);
          setPenPalState('FOUND');
      }, 2500);
  };

  // --- MAIN LEADERBOARD SCREEN ---
  return (
    <div className="h-full flex flex-col p-6 pt-12 pb-32 overflow-y-auto no-scrollbar relative">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold text-white mb-2">Papan Juara</h2>
            <p className="text-white/60 text-sm">Para Penjaga Terbaik NTB</p>
        </div>

        {/* Top 3 Podium */}
        <div className="flex justify-center items-end gap-4 mb-8">
            {/* Rank 2 */}
            <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full border-2 border-gray-400 overflow-hidden mb-2">
                    <img src={sortedData[1]?.avatar} className="w-full h-full object-cover" />
                </div>
                <div className="h-20 w-16 bg-gradient-to-t from-gray-700 to-gray-600 rounded-t-lg flex items-center justify-center text-2xl font-bold text-white/50">2</div>
            </div>
            {/* Rank 1 */}
            <div className="flex flex-col items-center relative z-10">
                <div className="absolute -top-6 text-2xl animate-bounce">👑</div>
                <div className="w-20 h-20 rounded-full border-4 border-yellow-400 overflow-hidden mb-2 shadow-[0_0_20px_rgba(250,204,21,0.5)]">
                    <img src={sortedData[0]?.avatar} className="w-full h-full object-cover" />
                </div>
                <div className="h-28 w-20 bg-gradient-to-t from-yellow-600 to-yellow-500 rounded-t-lg flex items-center justify-center text-4xl font-bold text-white">1</div>
            </div>
             {/* Rank 3 */}
             <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full border-2 border-orange-700 overflow-hidden mb-2">
                    <img src={sortedData[2]?.avatar} className="w-full h-full object-cover" />
                </div>
                <div className="h-16 w-16 bg-gradient-to-t from-orange-800 to-orange-700 rounded-t-lg flex items-center justify-center text-2xl font-bold text-white/50">3</div>
            </div>
        </div>

        {/* Current User Rank Strip */}
        <div className="mb-6 sticky top-0 z-20">
             <GlassCard className="p-4 flex items-center justify-between bg-sasambo-red/60 border-yellow-400/50 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-white w-6">{userRank}</span>
                    <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden border border-white/30">
                        <img src="https://picsum.photos/100/100?random=99" />
                    </div>
                    <div>
                        <div className="font-bold text-white">Anda</div>
                        <div className="text-[10px] text-white/70">{user.xp} XP</div>
                    </div>
                </div>
                <ChevronUp className="text-green-400" />
             </GlassCard>
        </div>

        {/* List (Shortened) */}
        <div className="flex flex-col gap-3 mb-10">
            {sortedData.slice(3, 6).map((player) => (
                <GlassCard key={player.name} className={`p-3 flex items-center justify-between ${player.isUser ? 'bg-white/10' : 'bg-transparent'}`} intensity="low">
                    <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-white/50 w-6">{player.rank}</span>
                        <div className="w-8 h-8 rounded-full bg-white/5 overflow-hidden">
                            <img src={player.avatar} />
                        </div>
                        <div>
                            <div className="font-bold text-white text-sm">{player.name}</div>
                            <div className="text-[10px] text-white/50 flex items-center gap-1">
                                <Shield size={8} /> {player.guild}
                            </div>
                        </div>
                    </div>
                    <div className="font-mono text-sasambo-cream font-bold text-sm">{player.xp}</div>
                </GlassCard>
            ))}
        </div>

        {/* --- ENTRY POINT UNTUK TERAS KOMUNITAS --- */}
        <div className="mb-8">
            <GlassCard 
                className="p-4 flex items-center justify-between cursor-pointer border-2 border-green-500/30 hover:bg-green-900/20 hover:border-green-500/60 transition-all group"
                onClick={() => onNavigate(ScreenState.COMMUNITY_CHAT)}
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center border border-green-500/40 group-hover:scale-110 transition-transform">
                        <Users size={24} className="text-green-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Teras Komunitas</h3>
                        <p className="text-xs text-white/60">Diskusi & ngobrol santai bareng 1.2k+ pemain</p>
                    </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-green-500 group-hover:text-black transition-colors">
                    <MessageCircle size={16} />
                </div>
            </GlassCard>
        </div>

        {/* --- FITUR SAHABAT PENA (PEN PALS) - INTERACTIVE --- */}
        <div className="mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-2xl rounded-full"></div>
            
            <AnimatePresence mode="wait">
                {penPalState === 'IDLE' && (
                    <GlassCard key="idle" className="p-6 relative overflow-hidden border-pink-400/30">
                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex-1 mr-4">
                                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                                    Sahabat Pena <span className="text-pink-400 text-xs px-2 py-0.5 bg-white/10 rounded-full border border-pink-400/50">Baru!</span>
                                </h3>
                                <p className="text-xs text-white/70 mb-4 leading-relaxed">
                                    Cari teman belajar dari Lombok, Sumbawa, atau Bima. Kirim surat digital dan belajar budaya bersama!
                                </p>
                                <LiquidButton onClick={findPenPal} className="py-2 text-sm" variant="secondary">
                                    <UserPlus size={16} /> Cari Teman
                                </LiquidButton>
                            </div>
                            
                            {/* Static Icon */}
                            <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center border border-pink-400/30">
                                <span className="text-4xl">💌</span>
                            </div>
                        </div>
                    </GlassCard>
                )}

                {penPalState === 'SEARCHING' && (
                    <GlassCard key="searching" className="p-8 relative overflow-hidden border-pink-400/50 flex flex-col items-center justify-center text-center h-[180px]">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full mb-4"
                        />
                        <motion.div 
                            animate={{ x: [-20, 20, -20], y: [-5, 5, -5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute"
                        >
                            <span className="text-4xl">🕊️</span>
                        </motion.div>
                        <h3 className="text-white font-bold text-sm mt-4">Menerbangkan surat ke penjuru NTB...</h3>
                        <p className="text-white/50 text-xs">Mencari teman yang cocok...</p>
                    </GlassCard>
                )}

                {penPalState === 'FOUND' && foundFriend && (
                    <GlassCard key="found" className="p-0 relative overflow-hidden border-green-400/50 bg-[#2C1810]/90">
                        <div className="bg-green-600/20 p-2 flex justify-between items-center px-4 border-b border-white/10">
                            <span className="text-xs font-bold text-green-400 flex items-center gap-1"><Sparkles size={12} /> Sahabat Ditemukan!</span>
                            <button onClick={() => setPenPalState('IDLE')}><X size={16} className="text-white/50" /></button>
                        </div>
                        <div className="p-5 flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full border-2 border-green-400 p-0.5 relative">
                                <img src={foundFriend.avatar} className="w-full h-full rounded-full object-cover" />
                                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-white">{foundFriend.name}</h3>
                                <p className="text-xs text-white/60 flex items-center gap-1 mb-1"><MapPin size={10} /> {foundFriend.from}</p>
                                <div className="bg-white/5 p-2 rounded-lg text-[10px] text-white/80 italic border-l-2 border-green-500">
                                    "{foundFriend.bio}"
                                </div>
                            </div>
                        </div>
                        <div className="p-4 pt-0">
                            <LiquidButton onClick={() => { setPenPalState('IDLE'); onNavigate(ScreenState.COMMUNITY_CHAT); }} fullWidth variant="success" className="py-2 text-sm">
                                <Send size={14} /> Sapa Sekarang
                            </LiquidButton>
                        </div>
                    </GlassCard>
                )}
            </AnimatePresence>
        </div>

    </div>
  );
};

export default Leaderboard;