
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LiquidBackground from './components/LiquidBackground';
import Navigation from './components/Navigation';
import { ScreenState, UserProfile, Language, InventoryItem } from './types';
import { APP_NAME, MOCK_BADGES, MOCK_INVENTORY } from './constants';
import { LiquidButton } from './components/GlassUI';
import { ArrowRight } from 'lucide-react';

// Screens
import Dashboard from './screens/Dashboard';
import StoryMode from './screens/StoryMode';
import MiniGames from './screens/MiniGames';
import Profile from './screens/Profile';
import Leaderboard from './screens/Leaderboard';
import TanyaDatu from './screens/TanyaDatu';
import Auth from './screens/Auth';
import CommunityChat from './screens/CommunityChat';

// --- Inline Small Screens (Splash, Onboarding) ---

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center z-50 p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/20 blur-[80px] rounded-full pointer-events-none"></div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 1, type: "spring", stiffness: 100 }}
        className="relative z-10"
      >
        <div className="w-40 h-40 sm:w-56 sm:h-56 mx-auto bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] shadow-2xl flex items-center justify-center p-0 mb-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50"></div>
            <img 
              src="https://image2url.com/r2/bucket1/images/1766542008319-1ba46b07-5417-4c7c-aec6-4e8a39b40eb0.png" 
              alt={APP_NAME} 
              className="w-full h-full object-contain drop-shadow-2xl relative z-10"
            />
        </div>
      </motion.div>

      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.6 }}
      >
         <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2 tracking-wide drop-shadow-lg">{APP_NAME}</h1>
         <p className="text-sasambo-cream/80 text-xs sm:text-sm uppercase tracking-[0.2em] font-medium bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5 inline-block">
            Gamified Language Guardian
         </p>
      </motion.div>
    </div>
  );
};

const Onboarding = ({ onComplete }: { onComplete: () => void }) => {
  const slides = [
    { 
      title: "Satu Aplikasi, Tiga Dunia", 
      desc: "Jelajahi Kerajaan Sasak, Pelabuhan Samawa, dan Pegunungan Mbojo.", 
      image: "https://image2url.com/images/1765783758328-976564dd-5c11-45bc-ab75-ea578467e1cd.png" 
    },
    { 
      title: "Latih Suaramu", 
      desc: "Bicara seperti warga lokal dengan teknologi pintar.", 
      image: "https://image2url.com/images/1765784074485-0bc7578a-0be7-4783-8153-1a2a52dd163e.png"
    },
    { 
      title: "Jaga Warisan", 
      desc: "Kumpulkan artefak budaya dan jadilah Penjaga Bahasa.", 
      image: "https://image2url.com/images/1765784724464-a509f5fb-c448-4c42-9e66-56e4dd801239.png" 
    }
  ];
  const [idx, setIdx] = useState(0);

  const next = () => {
    if (idx < slides.length - 1) setIdx(idx + 1);
    else onComplete();
  };

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden">
      {/* Content Area - Uses flex to center vertically, shrink image if needed */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            className="text-center w-full flex flex-col items-center"
          >
            {/* Responsive Image Container: Uses percentages and max-height constraints */}
            <div className="relative w-full max-w-[240px] aspect-square mb-6 sm:mb-8 shrink-1">
               <div className="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50"></div>
               </div>
               <img 
                 src={slides[idx].image} 
                 alt="Onboarding" 
                 className="w-full h-full object-contain p-4 drop-shadow-2xl relative z-10"
               />
            </div>

            <h2 className="text-2xl font-display font-bold text-white mb-3 leading-tight">{slides[idx].title}</h2>
            <p className="text-white/70 leading-relaxed text-sm max-w-xs">{slides[idx].desc}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer - Fixed Height + Safe Area Padding */}
      <div className="w-full px-6 py-4 pb-safe bg-gradient-to-t from-black/90 via-black/50 to-transparent flex-shrink-0 z-20 flex flex-col gap-4">
        <div className="flex justify-center gap-2 mb-1">
            {slides.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'w-8 bg-white' : 'w-2 bg-white/30'}`} />
            ))}
        </div>
        <LiquidButton onClick={next} fullWidth>
          {idx === slides.length - 1 ? "Mulai Petualangan" : "Lanjut"} <ArrowRight size={20} />
        </LiquidButton>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [screen, setScreen] = useState<ScreenState>(ScreenState.SPLASH);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedUserStr = localStorage.getItem('lingo_user');
    if (savedUserStr) {
        let savedUser = JSON.parse(savedUserStr);
        const today = new Date();
        const todayStr = today.toDateString();
        const lastLogin = savedUser.lastLoginDate ? new Date(savedUser.lastLoginDate).toDateString() : null;
        if (!savedUser.streakHistory) savedUser.streakHistory = [];

        if (lastLogin !== todayStr) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (lastLogin === yesterday.toDateString()) {
                savedUser.streak = (savedUser.streak || 0) + 1;
            } else {
                savedUser.streak = 1;
            }
            savedUser.lastLoginDate = new Date().toISOString();
        }
        savedUser.streakHistory = savedUser.streakHistory.filter((h: any) => h.date !== todayStr);
        savedUser.streakHistory.push({ date: todayStr, active: true });
        if (savedUser.streakHistory.length > 7) savedUser.streakHistory.shift();

        localStorage.setItem('lingo_user', JSON.stringify(savedUser));
        setUser(savedUser);
    }
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('lingo_user', JSON.stringify(user));
  }, [user]);

  const handleSplashComplete = () => user ? setScreen(ScreenState.DASHBOARD) : setScreen(ScreenState.ONBOARDING);
  const handleOnboardingComplete = () => setScreen(ScreenState.AUTH);
  const handleLogin = (newUser: UserProfile) => { setUser(newUser); setScreen(ScreenState.DASHBOARD); };
  const handleLogout = () => { localStorage.removeItem('lingo_user'); setUser(null); setScreen(ScreenState.SPLASH); };

  useEffect(() => {
    if (screen !== ScreenState.MINI_GAMES) setIsFullScreen(false);
  }, [screen]);

  const addXp = (amount: number) => {
      setUser(prev => {
          if (!prev) return null;
          let newXp = prev.xp + amount;
          let newLevel = prev.level;
          if (newXp >= prev.maxXp) { newLevel += 1; newXp = newXp - prev.maxXp; }
          return { ...prev, xp: newXp, level: newLevel };
      });
  };
  const unlockBadge = (badgeId: string) => {
      setUser(prev => prev ? { ...prev, badges: prev.badges.map(b => b.id === badgeId ? { ...b, earned: true } : b) } : null);
  };
  const addItem = (item: InventoryItem) => {
      setUser(prev => prev ? { ...prev, inventory: [...prev.inventory, item] } : null);
  };
  const unlockGameLevel = (game: string, level: number) => {
      setUser(prev => {
          if (!prev) return null;
          const currentMax = prev.gameProgress[game] || 0;
          if (level > currentMax) {
              return { ...prev, gameProgress: { ...prev.gameProgress, [game]: level } };
          }
          return prev;
      });
  };

  const actions = { addXp, unlockBadge, addItem, unlockGameLevel };
  const handleEnterWorld = (lang: Language) => { if (user) { setUser({ ...user, selectedLanguage: lang }); setScreen(ScreenState.STORY_MAP); } };

  const renderScreen = () => {
    switch(screen) {
      case ScreenState.SPLASH: return <SplashScreen onComplete={handleSplashComplete} />;
      case ScreenState.ONBOARDING: return <Onboarding onComplete={handleOnboardingComplete} />;
      case ScreenState.AUTH: return <Auth onLogin={handleLogin} />;
      case ScreenState.DASHBOARD: return user ? <Dashboard user={user} onNavigate={setScreen} onEnterWorld={handleEnterWorld} /> : null;
      case ScreenState.TANYA_DATU: return user ? <TanyaDatu userLang={user.selectedLanguage || Language.SASAK} onBack={() => setScreen(ScreenState.DASHBOARD)} /> : null;
      case ScreenState.STORY_MAP: return user ? <StoryMode language={user.selectedLanguage || Language.SASAK} onBack={() => setScreen(ScreenState.DASHBOARD)} actions={actions} userProgress={user.gameProgress.story} /> : null;
      case ScreenState.MINI_GAMES: return user ? <MiniGames onBack={() => setScreen(ScreenState.DASHBOARD)} actions={actions} user={user} onPlayStateChange={setIsFullScreen} /> : null;
      case ScreenState.PROFILE: return user ? <Profile user={user} onLogout={handleLogout} /> : null;
      case ScreenState.LEADERBOARD: return user ? <Leaderboard user={user} onNavigate={setScreen} /> : null;
      case ScreenState.COMMUNITY_CHAT: return user ? <CommunityChat user={user} onBack={() => setScreen(ScreenState.LEADERBOARD)} /> : null;
      default: return null;
    }
  };

  return (
    <LiquidBackground>
      {/* Main container with 100dvh for mobile responsiveness */}
      <main className="relative z-10 w-full h-[100dvh] sm:h-[90vh] max-w-md mx-auto shadow-2xl overflow-hidden sm:rounded-[3rem] sm:my-8 sm:border-[8px] sm:border-gray-900 bg-sasambo-red/10 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full flex flex-col"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
        
        {!isFullScreen && 
         ![ScreenState.TANYA_DATU, ScreenState.COMMUNITY_CHAT, ScreenState.SPLASH, ScreenState.ONBOARDING, ScreenState.AUTH].includes(screen) && 
         <Navigation currentScreen={screen} onNavigate={setScreen} />}
      </main>
    </LiquidBackground>
  );
};

export default App;
