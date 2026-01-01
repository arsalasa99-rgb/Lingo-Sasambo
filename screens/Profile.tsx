
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, Share2, Award, ShoppingBag, Lock, Info, ChevronDown, Rotate3d, X, Sparkles } from 'lucide-react';
import { GlassCard, LiquidButton } from '../components/GlassUI';
import { UserProfile, ItemRarity, InventoryItem } from '../types';
import { MASTER_INVENTORY } from '../gameData';

interface ProfileProps {
  user: UserProfile;
  onLogout: () => void;
}

// Configuration for each Rarity Tier's Visual Style based on Sasak Hierarchy
const TIER_STYLES: Record<ItemRarity, { label: string, bg: string, border: string, glow: string }> = {
    'JAJARKARANG': { label: 'Jajarkarang (Rakyat Biasa)', bg: 'bg-[#4E342E]', border: 'border-[#6D4C41]', glow: 'shadow-none' }, // Brown/Earth
    'KETUA_KARANG': { label: 'Ketua Karang (Pemimpin Sosial)', bg: 'bg-slate-700', border: 'border-slate-500', glow: 'shadow-lg shadow-slate-500/20' }, // Iron/Stone
    'PEMANGKU': { label: 'Pemangku (Pemuka Adat)', bg: 'bg-emerald-900', border: 'border-emerald-500', glow: 'shadow-lg shadow-emerald-500/30' }, // Green/Nature/Spiritual
    'LALU_BAIQ': { label: 'Lalu/Baiq (Bangsawan Menengah)', bg: 'bg-amber-800', border: 'border-amber-500', glow: 'shadow-xl shadow-amber-500/40' }, // Gold/Brass
    'RADEN_DENDE': { label: 'Raden/Dende (Bangsawan Tinggi)', bg: 'bg-purple-900', border: 'border-purple-500', glow: 'shadow-[0_0_25px_rgba(168,85,247,0.6)]' }, // Purple/Royal
};

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const [inspectedItem, setInspectedItem] = useState<InventoryItem | null>(null);

  // Check unlocked status based on user inventory array
  const isUnlocked = (itemId: string) => user.inventory.some(i => i.id === itemId);

  // Defined Order of tiers for display
  const TIER_ORDER: ItemRarity[] = ['JAJARKARANG', 'KETUA_KARANG', 'PEMANGKU', 'LALU_BAIQ', 'RADEN_DENDE'];

  return (
    <div className="h-full flex flex-col p-6 pt-12 pb-32 overflow-y-auto no-scrollbar">
        {/* Profile Header */}
        <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-display font-bold text-white">Ruang Pusaka</h2>
            <div className="flex gap-2">
                <button className="p-2 rounded-full bg-white/10"><Share2 size={18} className="text-white" /></button>
                <button className="p-2 rounded-full bg-white/10"><Settings size={18} className="text-white" /></button>
            </div>
        </div>

        {/* User Card */}
        <div className="flex flex-col items-center mb-8 relative">
            <div className="w-24 h-24 rounded-full border-4 border-sasambo-pink p-1 mb-4 relative z-10">
                <div className="w-full h-full rounded-full overflow-hidden bg-white/10">
                    <img src="https://picsum.photos/100/100?random=99" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-xs font-bold px-2 py-1 rounded-lg text-black border border-white">
                    Lvl {user.level}
                </div>
            </div>
            {/* Background Glow behind Avatar */}
            <div className="absolute top-0 w-32 h-32 bg-yellow-500/20 rounded-full blur-2xl animate-pulse"></div>
            
            <h1 className="text-2xl font-bold text-white z-10">{user.name}</h1>
            <p className="text-white/60 text-sm z-10">Penjaga Warisan NTB</p>
            <div className="mt-2 text-xs font-mono text-yellow-500 flex items-center gap-1">
               🔥 Streak: {user.streak || 0} Hari
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
            <GlassCard className="p-4 flex flex-col items-center border-[#8B5E3C]" intensity="low">
                <span className="text-2xl font-bold text-white">{user.xp}</span>
                <span className="text-xs text-white/50 uppercase tracking-wider">Total XP</span>
            </GlassCard>
            <GlassCard className="p-4 flex flex-col items-center border-[#8B5E3C]" intensity="low">
                <span className="text-2xl font-bold text-white">{user.inventory.length}</span>
                <span className="text-xs text-white/50 uppercase tracking-wider">Artefak</span>
            </GlassCard>
        </div>

        {/* --- MUSEUM SHELVES SECTION --- */}
        <div className="flex flex-col gap-8">
            
            {/* Loop through Tiers */}
            {TIER_ORDER.map((tier) => {
                const style = TIER_STYLES[tier];
                const itemsInTier = MASTER_INVENTORY.filter(i => i.rarity === tier);
                const ownedCount = itemsInTier.filter(i => isUnlocked(i.id)).length;
                
                // Special Layout for RADEN_DENDE (Display Cases)
                if (tier === 'RADEN_DENDE') {
                    return (
                        <div key={tier} className="relative p-4 rounded-3xl bg-black/40 border border-purple-500/50">
                             <div className="absolute inset-0 bg-purple-900/10 blur-xl rounded-3xl"></div>
                             <h3 className="text-purple-300 font-bold mb-4 flex items-center gap-2 relative z-10 text-xs uppercase tracking-widest border-b border-white/10 pb-2">
                                <Sparkles size={14} /> {style.label}
                             </h3>
                             <div className="grid grid-cols-2 gap-4 relative z-10">
                                {itemsInTier.map(item => {
                                    const unlocked = isUnlocked(item.id);
                                    return (
                                        <button 
                                            key={item.id}
                                            disabled={!unlocked}
                                            onClick={() => setInspectedItem(item)}
                                            className={`
                                                relative h-40 rounded-t-full rounded-b-lg border-2 flex flex-col items-center justify-end p-4 transition-all duration-500
                                                ${unlocked 
                                                    ? 'bg-gradient-to-b from-purple-500/10 to-purple-900/40 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:scale-105' 
                                                    : 'bg-white/5 border-white/10 opacity-50 grayscale'}
                                            `}
                                        >
                                            {/* Spotlight Effect */}
                                            {unlocked && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-20 bg-gradient-to-b from-white/50 to-transparent blur-[1px]"></div>}
                                            
                                            <div className="text-5xl mb-2 drop-shadow-2xl z-10 animate-float">{unlocked ? item.image : <Lock size={24} />}</div>
                                            <div className="w-full h-1 bg-black/50 blur-sm rounded-full mb-2"></div>
                                            <span className="text-[10px] text-center font-bold text-purple-100 leading-tight">{item.name}</span>
                                        </button>
                                    )
                                })}
                             </div>
                        </div>
                    );
                }

                // Standard Layout for Lower Tiers (Shelves)
                return (
                    <div key={tier} className="relative">
                        <div className={`flex items-center justify-between mb-3 px-4 py-2 rounded-lg ${style.bg} ${style.border} border-l-4 shadow-lg`}>
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">{style.label}</span>
                            <span className="text-[10px] text-white/80 font-mono bg-black/30 px-2 py-0.5 rounded-full">{ownedCount} / {itemsInTier.length}</span>
                        </div>
                        
                        {/* Shelf Container */}
                        <div className="bg-[#2C1810]/50 p-3 rounded-xl border border-[#5D4037]">
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                {itemsInTier.map((item) => {
                                    const unlocked = isUnlocked(item.id);
                                    return (
                                        <motion.button 
                                            key={item.id}
                                            whileTap={unlocked ? {scale: 0.9} : {}}
                                            onClick={() => unlocked && setInspectedItem(item)}
                                            className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all overflow-hidden group
                                                ${unlocked 
                                                    ? `bg-white/10 hover:bg-white/20 shadow-inner` 
                                                    : 'bg-black/40 opacity-30'}
                                            `}
                                        >
                                            <span className={`text-3xl filter ${unlocked ? 'drop-shadow-md group-hover:scale-110 transition-transform' : 'grayscale blur-[1px]'}`}>
                                                {item.image}
                                            </span>
                                            {!unlocked && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Lock size={12} className="text-white/50" />
                                                </div>
                                            )}
                                        </motion.button>
                                    )
                                })}
                            </div>
                            {/* Wood Plank Effect */}
                            <div className="h-2 w-full bg-[#3E2723] rounded-b-md mt-2 shadow-md border-t border-[#5D4037]"></div>
                        </div>
                    </div>
                );
            })}
        </div>

        <LiquidButton variant="secondary" className="mt-12" fullWidth onClick={onLogout}>Keluar Game</LiquidButton>

        {/* --- 3D INSPECTION MODAL --- */}
        <AnimatePresence>
            {inspectedItem && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6"
                    onClick={() => setInspectedItem(null)}
                >
                    <motion.div 
                        initial={{ scale: 0.8, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, y: 50 }}
                        className="w-full max-w-sm relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            onClick={() => setInspectedItem(null)}
                            className="absolute -top-4 -right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20 text-white z-20"
                        >
                            <X size={20} />
                        </button>

                        <div className={`
                            relative rounded-[2rem] p-8 overflow-hidden text-center border-2 shadow-2xl
                            ${TIER_STYLES[inspectedItem.rarity].bg.replace('bg-', 'bg-gradient-to-br from-black to-')} 
                            ${TIER_STYLES[inspectedItem.rarity].border}
                            ${TIER_STYLES[inspectedItem.rarity].glow}
                        `}>
                            {/* 3D Item Presentation */}
                            <div className="perspective-1000 w-48 h-48 mx-auto mb-8 relative">
                                <motion.div 
                                    animate={{ rotateY: 360 }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    className="w-full h-full flex items-center justify-center transform-style-3d text-[120px] filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
                                >
                                    {inspectedItem.image}
                                </motion.div>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-black/40 blur-xl rounded-full"></div>
                            </div>

                            <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border ${TIER_STYLES[inspectedItem.rarity].border} bg-black/30 text-white`}>
                                {TIER_STYLES[inspectedItem.rarity].label}
                            </div>

                            <h2 className="text-3xl font-display font-bold text-white mb-4">{inspectedItem.name}</h2>
                            <p className="text-white/70 text-sm leading-relaxed mb-6 font-medium">
                                "{inspectedItem.description}"
                            </p>

                            <div className="flex gap-2 justify-center">
                                <button className="p-2 rounded-xl bg-white/10 border border-white/10 text-white/50 text-xs flex items-center gap-1">
                                    <Rotate3d size={14} /> Putar
                                </button>
                                <button className="p-2 rounded-xl bg-white/10 border border-white/10 text-white/50 text-xs flex items-center gap-1">
                                    <Info size={14} /> Sejarah
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};

export default Profile;
