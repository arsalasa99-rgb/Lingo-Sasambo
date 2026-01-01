
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Scroll, Zap, Star, BookOpen, Shield, ShoppingBag, ArrowRight, MessageCircle, Sparkles, Bell, X, PlayCircle, Mic, Flame, Calendar, Info } from 'lucide-react';
import { GlassCard, LiquidButton } from '../components/GlassUI';
import { UserProfile, ScreenState, Language } from '../types';
import { LANGUAGE_INFO, APP_NAME } from '../constants';

interface DashboardProps {
  user: UserProfile;
  onNavigate: (screen: ScreenState) => void;
  onEnterWorld: (lang: Language) => void;
}

// --- REALISTIC FIRE CSS COMPONENT (SCALABLE INTENSITY) ---
const RealisticFire = ({ intensity = 1 }: { intensity?: number }) => {
    // Logic: Base scale 1, increases by 0.1 for every streak day, capped at 1.5x size
    // Also modifies the color slightly towards blue/hotter if intensity > 7
    const scale = Math.min(1 + (intensity * 0.1), 1.6);
    const isBlueFire = intensity > 7;

    return (
        <div className="relative w-40 h-40 flex items-end justify-center transition-transform duration-1000" style={{ transform: `scale(${scale})` }}>
            {/* Core Glow */}
            <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute bottom-0 w-32 h-32 rounded-full blur-[50px] mix-blend-screen ${isBlueFire ? 'bg-blue-500' : 'bg-orange-500'}`}
            />
            
            {/* Flames Layer 1 (Dark Base) */}
            <motion.div 
                animate={{ scaleY: [1, 1.2, 0.9, 1], skewX: [0, 5, -5, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute bottom-4 w-20 h-32 bg-gradient-to-t rounded-full blur-[10px] opacity-90 origin-bottom ${isBlueFire ? 'from-blue-800 to-blue-500' : 'from-red-600 to-orange-500'}`}
            />

            {/* Flames Layer 2 (Bright Body) */}
            <motion.div 
                animate={{ scaleY: [1, 1.3, 1], skewX: [0, -5, 5, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                className={`absolute bottom-4 w-16 h-28 bg-gradient-to-t rounded-full blur-[6px] opacity-90 origin-bottom ${isBlueFire ? 'from-blue-500 to-cyan-300' : 'from-orange-500 to-yellow-400'}`}
            />

            {/* Flames Layer 3 (White Hot Core) */}
            <motion.div 
                animate={{ scale: [1, 1.1, 0.9, 1], y: [0, -5, 0] }}
                transition={{ duration: 0.4, repeat: Infinity }}
                className="absolute bottom-6 w-10 h-20 bg-white rounded-full blur-[4px] opacity-80 mix-blend-overlay origin-bottom"
            />

            {/* Sparks/Particles */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
                    animate={{ y: -100 - Math.random() * 50, x: (Math.random() - 0.5) * 40, opacity: 0, scale: 0 }}
                    transition={{ duration: 1 + Math.random(), repeat: Infinity, delay: Math.random() * 2, ease: "easeOut" }}
                    className={`absolute bottom-10 w-1.5 h-1.5 rounded-full blur-[1px] ${isBlueFire ? 'bg-cyan-200' : 'bg-yellow-200'}`}
                />
            ))}
        </div>
    );
};

const StreakModal: React.FC<{ streak: number, history: any[], onClose: () => void }> = ({ streak, history, onClose }) => {
    // Days of week visualizer
    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    
    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 p-6 backdrop-blur-xl"
            onClick={onClose}
        >
            <motion.div 
                initial={{ scale: 0.5, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 12 }}
                className="w-full max-w-sm flex flex-col items-center text-center"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Title */}
                <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-wide uppercase">
                    Api Semangat
                </h2>
                <p className="text-orange-200/80 text-sm mb-8 font-medium">Jaga apimu tetap menyala setiap hari!</p>

                {/* THE BIG FIRE */}
                <div className="mb-10 relative">
                    <RealisticFire intensity={streak} />
                    <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 to-red-600 px-6 py-2 rounded-full border border-orange-400 shadow-lg z-20"
                    >
                        <span className="text-2xl font-bold text-white drop-shadow-md">{streak}</span>
                        <span className="text-xs text-orange-100 font-bold uppercase ml-2">Hari</span>
                    </motion.div>
                </div>

                {/* Calendar Grid */}
                <GlassCard className="w-full p-6 bg-[#2C1810]/80 border-orange-500/30">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-white/70 uppercase tracking-widest flex items-center gap-2">
                            <Calendar size={14} /> Aktivitas Minggu Ini
                        </span>
                    </div>
                    <div className="flex justify-between gap-2">
                        {days.map((d, i) => {
                            // Logic: If streak is 3, the last 3 days (indices 4, 5, 6) should be active.
                            // 7 days in week. Streak count S.
                            // Active indices = [7-S, ..., 6]
                            // Clamp streak to max 7 for display logic
                            const displayStreak = Math.min(streak, 7);
                            const isActive = i >= (7 - displayStreak);
                            const isToday = i === 6; // Assume Sunday/Today is last

                            return (
                                <div key={d} className="flex flex-col items-center gap-2">
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500
                                        ${isActive 
                                            ? 'bg-gradient-to-t from-orange-600 to-yellow-500 text-white shadow-[0_0_10px_rgba(255,165,0,0.5)] scale-110' 
                                            : 'bg-white/10 text-white/30 border border-white/5'}
                                        ${isToday && !isActive ? 'border-2 border-orange-500/50 animate-pulse' : ''}
                                    `}>
                                        {isActive ? <Flame size={14} fill="currentColor" /> : (isToday ? <div className="w-2 h-2 rounded-full bg-orange-500"/> : null)}
                                    </div>
                                    <span className={`text-[10px] ${isActive ? 'text-orange-300' : 'text-white/20'}`}>{d}</span>
                                </div>
                            );
                        })}
                    </div>
                </GlassCard>

                {/* Motivational Text */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6 text-white/80 text-sm italic"
                >
                    "{streak > 0 ? "Luar biasa! Konsistensi adalah kunci menjadi Pahlawan Bahasa." : "Ayo mulai latihan hari ini untuk menyalakan apimu!"}"
                </motion.div>

                <LiquidButton onClick={onClose} variant="primary" fullWidth className="mt-8">
                    Lanjut Latihan
                </LiquidButton>

            </motion.div>
        </motion.div>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, onEnterWorld }) => {
  const [showNotification, setShowNotification] = useState(true);
  const [showStreakModal, setShowStreakModal] = useState(false);

  // Determine Streak Status for Notification (Simulated Push Notification Logic)
  let notifColor = "from-blue-600 to-cyan-600";
  let notifTitle = "Latihan Harian";
  let streakMessage = "Ayo belajar budaya Sasambo hari ini!";
  
  if (user.streak === 0) {
      notifColor = "from-gray-600 to-gray-700";
      notifTitle = "Api Padam!";
      streakMessage = "Jangan menyerah! Nyalakan kembali semangatmu sekarang.";
  } else if (user.streak >= 1) {
      notifColor = "from-orange-600 to-red-600";
      notifTitle = "Api Menyala! 🔥";
      streakMessage = `${user.streak} Hari berturut-turut! Semangatmu luar biasa!`;
  }

  return (
    <div className="flex flex-col h-full p-6 pt-8 pb-32 overflow-y-auto">
      
      {/* --- APP BRAND HEADER --- */}
      <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             {/* Logo with Glassmorphic Frame */}
             <div className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg flex items-center justify-center p-0 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-50"></div>
                <img 
                  src="https://image2url.com/r2/bucket1/images/1766542008319-1ba46b07-5417-4c7c-aec6-4e8a39b40eb0.png" 
                  alt={APP_NAME} 
                  className="w-full h-full object-contain drop-shadow-md relative z-10"
                />
             </div>
             <div className="flex flex-col justify-center">
                 <h1 className="text-xl font-display font-bold text-white leading-none tracking-wide">Lingo<span className="text-yellow-400">.</span></h1>
                 <span className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-medium">Sasambo RPG</span>
             </div>
          </div>

          {/* --- STREAK FIRE WIDGET (INTERACTIVE) --- */}
          <motion.button 
             whileTap={{ scale: 0.9 }}
             onClick={() => setShowStreakModal(true)}
             className="flex flex-col items-center group cursor-pointer"
          >
             <div className="relative w-12 h-12 flex items-center justify-center">
                {/* Fire Animation Logic */}
                {user.streak > 0 ? (
                  <>
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.8, 0.6] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 bg-orange-500/40 blur-xl rounded-full group-hover:bg-orange-500/60 transition-colors"
                    />
                    <motion.div
                        animate={{ scaleY: [1, 1.1, 0.9, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    >
                         <Flame size={32} className={`
                             ${user.streak > 7 ? 'text-blue-400 fill-blue-200' : 'text-orange-500 fill-yellow-400'} 
                             drop-shadow-[0_0_10px_rgba(255,165,0,0.8)] filter transition-all
                         `} />
                    </motion.div>
                  </>
                ) : (
                   <Flame size={32} className="text-gray-600/50" />
                )}
             </div>
             <span className={`text-[10px] font-bold ${user.streak > 0 ? (user.streak > 7 ? 'text-blue-300' : 'text-orange-400') : 'text-gray-500'}`}>
                {user.streak} Hari
             </span>
          </motion.button>
      </div>

      {/* Daily Notification Banner (Updated with Streak Context) */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: 'auto', opacity: 1, marginBottom: 16 }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className={`bg-gradient-to-r ${notifColor} rounded-2xl p-3 flex items-start gap-3 shadow-lg border border-white/10 relative overflow-hidden`}>
                {/* Shimmer on banner */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                
                <div className="p-2 bg-white/20 rounded-full relative z-10">
                    <Bell size={16} className="text-white animate-bounce" />
                </div>
                <div className="flex-1 relative z-10">
                    <h4 className="text-sm font-bold text-white">{notifTitle}</h4>
                    <p className="text-[10px] text-white/90 leading-tight mt-0.5 font-medium">{streakMessage}</p>
                </div>
                <button onClick={() => setShowNotification(false)} className="text-white/50 hover:text-white relative z-10">
                    <X size={14} />
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Profile */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-white/80 text-sm font-medium italic">Tabe', Pahlawan Bahasa</h2>
          <h1 className="text-3xl font-display font-bold text-white">{user.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-white shadow-md">
              Level {user.level}
            </span>
            <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-medium text-white/90 backdrop-blur-md flex items-center gap-1">
              <Shield size={10} /> Guild: Petualang Baru
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
            <div className="relative cursor-pointer" onClick={() => onNavigate(ScreenState.PROFILE)}>
            <div className="w-14 h-14 rounded-full border-2 border-white/50 overflow-hidden bg-white/10 shadow-lg">
                <img src="https://picsum.photos/100/100" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            {/* Online Status */}
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-sasambo-red animate-pulse"></div>
            </div>
            
            {/* Quick Play Button */}
            <button 
                onClick={() => onNavigate(ScreenState.MINI_GAMES)}
                className="text-[10px] font-bold text-yellow-300 bg-black/40 px-2 py-1 rounded-full border border-yellow-500/30 flex items-center gap-1 hover:bg-yellow-500/20 transition-colors"
            >
                <PlayCircle size={10} /> Main Acak
            </button>
        </div>
      </div>

      {/* TANYA DATU WIDGET (NEW) */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div 
            onClick={() => onNavigate(ScreenState.TANYA_DATU)}
            className="w-full p-0.5 rounded-3xl bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 cursor-pointer shadow-lg hover:shadow-yellow-500/20 transition-all active:scale-95"
        >
            <div className="bg-[#2C1810] rounded-[22px] p-4 flex items-center gap-4 relative overflow-hidden">
                {/* Background Sparkles */}
                <div className="absolute right-0 top-0 opacity-20"><Sparkles size={80} className="text-white" /></div>
                
                <div className="w-16 h-16 rounded-full border-2 border-yellow-400 bg-black/20 flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.5)] z-10 overflow-hidden">
                    <img 
                      src="https://image2url.com/images/1765900454650-3b4b3dca-44b0-4a8a-9a51-3d0c9fb3f46b.jpeg" 
                      alt="Datu Sasambo" 
                      className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 z-10">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white">Tanya Datu</h3>
                        <span className="bg-blue-500/20 text-blue-200 text-[9px] px-2 py-0.5 rounded font-bold border border-blue-500/30">AI ASSISTANT</span>
                    </div>
                    <p className="text-xs text-white/70 leading-snug">
                        "Bingung arti kata atau budaya? Tanyakan padaku, sang penjaga ilmu."
                    </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center z-10">
                    <MessageCircle size={16} className="text-yellow-400" />
                </div>
            </div>
        </div>
      </motion.div>

      {/* XP & Stats */}
      <div className="flex gap-3 mb-6">
        <GlassCard className="flex-1 p-4" intensity="low">
             <div className="text-xs text-white/60 mb-1">XP Earned</div>
             <div className="text-2xl font-bold text-white">{user.xp}</div>
             <div className="h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden relative">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((user.xp / user.maxXp) * 100, 100)}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 relative overflow-hidden"
                >
                    {/* Shimmer Effect */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[blob_2s_infinite] opacity-50 translate-x-[-100%]" style={{ animation: 'shimmer 2s infinite' }} />
                </motion.div>
             </div>
             <div className="text-[9px] text-right text-white/40 mt-1">Next: {user.maxXp} XP</div>
        </GlassCard>
        <GlassCard className="flex-1 p-4" intensity="low">
             <div className="text-xs text-white/60 mb-1">Badges</div>
             <div className="text-2xl font-bold text-white">{user.badges.filter(b => b.earned).length} <span className="text-sm text-white/40">/ {user.badges.length}</span></div>
        </GlassCard>
      </div>

      {/* WORLD SELECTION AREA */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
            <Mic size={16} className="text-yellow-400" />
            <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider">Latih Logat Daerah</h3>
        </div>
        <div className="flex flex-col gap-4">
            {Object.entries(LANGUAGE_INFO).map(([key, info], i) => (
                <GlassCard 
                    key={key}
                    className="p-0 overflow-hidden cursor-pointer group relative border-2 border-transparent hover:border-white/30 transition-all"
                    onClick={() => onEnterWorld(key as Language)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                >
                    {/* Decorative Background */}
                    <div className={`absolute inset-0 opacity-40 bg-gradient-to-r 
                        ${key === Language.SASAK ? 'from-red-900 to-orange-800' : 
                          key === Language.SAMAWA ? 'from-blue-900 to-cyan-800' : 
                          'from-emerald-900 to-green-800'}
                    `} />
                    
                    <div className="relative z-10 p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl border border-white/20 shadow-md">
                                {info.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">{info.worldName}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded text-white/80">30 Level</span>
                                    <span className="text-[10px] text-white/60">Fokus: Pronunciation</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <ArrowRight size={16} className="text-white" />
                        </div>
                    </div>
                </GlassCard>
            ))}
        </div>
      </div>

      {/* Other Activities */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Mini Games */}
        <GlassCard 
          className="p-4 flex flex-col justify-between cursor-pointer hover:bg-white/25 transition-colors border-2 border-transparent hover:border-blue-400/50"
          onClick={() => onNavigate(ScreenState.MINI_GAMES)}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-500/30 flex items-center justify-center mb-3 text-blue-100">
            <Zap size={20} fill="currentColor" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Arcade Zone</h3>
            <p className="text-[10px] text-white/60">3 Games AI Baru!</p>
          </div>
        </GlassCard>

        {/* Inventory */}
        <GlassCard 
          className="p-4 flex flex-col justify-between cursor-pointer hover:bg-white/25 transition-colors border-2 border-transparent hover:border-purple-400/50"
          onClick={() => onNavigate(ScreenState.PROFILE)}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-500/30 flex items-center justify-center mb-3 text-purple-100">
            <ShoppingBag size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Museum</h3>
            <p className="text-[10px] text-white/60">Koleksi Budaya</p>
          </div>
        </GlassCard>
      </div>

      {/* STREAK MODAL OVERLAY */}
      <AnimatePresence>
        {showStreakModal && (
            <StreakModal 
                streak={user.streak} 
                history={user.streakHistory || []} 
                onClose={() => setShowStreakModal(false)} 
            />
        )}
      </AnimatePresence>
      
      {/* Styles for shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
