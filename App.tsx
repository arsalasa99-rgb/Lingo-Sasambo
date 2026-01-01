
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LiquidBackground from './components/LiquidBackground';
import Navigation from './components/Navigation';
import { ScreenState, UserProfile, Language, InventoryItem, Badge } from './types';
import { APP_NAME, LANGUAGE_INFO, MOCK_BADGES, MOCK_INVENTORY } from './constants';
import { LiquidButton, GlassCard } from './components/GlassUI';
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
    <div className="flex flex-col items-center justify-center h-full text-center z-50 p-6 relative">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/20 blur-[100px] rounded-full pointer-events-none"></div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 1, type: "spring", stiffness: 100 }}
        className="relative z-10"
      >
        {/* Frame / Container Logo - INCREASED SIZE, REMOVED PADDING */}
        <div className="w-64 h-64 mx-auto bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-2xl flex items-center justify-center p-0 mb-8 relative overflow-hidden group">
            {/* Inner Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50"></div>
            
            {/* Logo Image - FULL BLEED */}
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
         <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-wide drop-shadow-lg">{APP_NAME}</h1>
         <p className="text-sasambo-cream/80 text-sm uppercase tracking-[0.2em] font-medium bg-black/20 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/5 inline-block">
            Gamified Language Guardian
         </p>
      </motion.div>
    </div>
  );
};

const Onboarding = ({ onComplete }: { onComplete: () => void }) => {
  const slides: { title: string; desc: string; image?: string; emoji?: string }[] = [
    { 
      title: "Satu Aplikasi, Tiga Dunia", 
      desc: "Jelajahi Kerajaan Sasak, Pelabuhan Samawa, dan Pegunungan Mbojo dalam satu genggaman.", 
      image: "https://image2url.com/images/1765783758328-976564dd-5c11-45bc-ab75-ea578467e1cd.png" 
    },
    { 
      title: "Latih Suaramu", 
      desc: "Bicara seperti warga lokal dengan teknologi pengenalan suara pintar.", 
      image: "https://image2url.com/images/1765784074485-0bc7578a-0be7-4783-8153-1a2a52dd163e.png"
    },
    { 
      title: "Jaga Warisan", 
      desc: "Kumpulkan artefak budaya dan jadilah Penjaga Bahasa NTB.", 
      image: "https://image2url.com/images/1765784724464-a509f5fb-c448-4c42-9e66-56e4dd801239.png" 
    }
  ];
  const [idx, setIdx] = useState(0);

  const next = () => {
    if (idx < slides.length - 1) setIdx(idx + 1);
    else onComplete();
  };

  return (
    <div className="h-full flex flex-col justify-between p-8 pt-20">
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="text-center w-full"
          >
            {/* Conditional Rendering: Image Frame vs Emoji */}
            {slides[idx].image ? (
               <div className="w-56 h-56 mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl flex items-center justify-center p-6 mb-8 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50"></div>
                  <img 
                    src={slides[idx].image} 
                    alt="Ilustrasi Onboarding" 
                    className="w-full h-full object-contain drop-shadow-2xl relative z-10"
                  />
               </div>
            ) : (
               <div className="text-9xl mb-8 filter drop-shadow-2xl animate-float">{slides[idx].emoji}</div>
            )}

            <h2 className="text-3xl font-display font-bold text-white mb-4">{slides[idx].title}</h2>
            <p className="text-white/70 leading-relaxed text-lg">{slides[idx].desc}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex justify-center gap-2">
            {slides.map((_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === idx ? 'w-8 bg-white' : 'w-2 bg-white/30'}`} />
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

  // Check Local Storage on Mount & Handle Streak Logic
  useEffect(() => {
    const savedUserStr = localStorage.getItem('lingo_user');
    if (savedUserStr) {
        let savedUser = JSON.parse(savedUserStr);
        
        // --- STREAK LOGIC ---
        const today = new Date();
        const todayStr = today.toDateString();
        const lastLogin = savedUser.lastLoginDate ? new Date(savedUser.lastLoginDate).toDateString() : null;
        
        // Initialize history if undefined
        if (!savedUser.streakHistory) savedUser.streakHistory = [];

        if (lastLogin !== todayStr) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastLogin === yesterday.toDateString()) {
                // Continued Streak
                savedUser.streak = (savedUser.streak || 0) + 1;
            } else {
                // Streak Broken (unless new user/first time logic handled elsewhere)
                // If last login wasn't yesterday, reset to 1 (for today)
                savedUser.streak = 1;
                // Clear history if broken? Or keep last 7 days visual? 
                // Let's reset visual history for simplicity in this MVP logic or just append
                // If broken, previous days become inactive in our tracking window
            }
            
            savedUser.lastLoginDate = new Date().toISOString();
        }

        // Update History Array for Visualization (Last 7 days)
        // Simple logic: Ensure today is marked active
        const historyEntry = { date: todayStr, active: true };
        // Remove if today already exists (re-login same day)
        savedUser.streakHistory = savedUser.streakHistory.filter((h: any) => h.date !== todayStr);
        savedUser.streakHistory.push(historyEntry);
        
        // Keep only last 7 entries
        if (savedUser.streakHistory.length > 7) {
            savedUser.streakHistory.shift();
        }

        // Update storage immediately
        localStorage.setItem('lingo_user', JSON.stringify(savedUser));
        setUser(savedUser);
    }
  }, []);

  // Update Local Storage whenever User updates
  useEffect(() => {
    if (user) {
        localStorage.setItem('lingo_user', JSON.stringify(user));
    }
  }, [user]);

  // Handle Splash Complete logic
  const handleSplashComplete = () => {
      if (user) {
          setScreen(ScreenState.DASHBOARD);
      } else {
          setScreen(ScreenState.ONBOARDING);
      }
  };

  const handleOnboardingComplete = () => {
      setScreen(ScreenState.AUTH);
  };

  const handleLogin = (newUser: UserProfile) => {
      setUser(newUser);
      setScreen(ScreenState.DASHBOARD);
  };

  const handleLogout = () => {
      localStorage.removeItem('lingo_user');
      setUser(null);
      setScreen(ScreenState.SPLASH);
  };

  // Reset full screen mode when changing screens mainly via nav
  useEffect(() => {
    if (screen !== ScreenState.MINI_GAMES) {
        setIsFullScreen(false);
    }
  }, [screen]);

  // --- Global Game Actions (passed down to screens) ---
  const addXp = (amount: number) => {
      setUser(prev => {
          if (!prev) return null;
          let newXp = prev.xp + amount;
          let newLevel = prev.level;
          // Simple level up logic
          if (newXp >= prev.maxXp) {
              newLevel += 1;
              newXp = newXp - prev.maxXp;
              // alert(`Level Up! You are now Level ${newLevel}`); // Removed native alert for smoother feel
          }
          return { ...prev, xp: newXp, level: newLevel };
      });
  };

  const unlockBadge = (badgeId: string) => {
      setUser(prev => {
          if (!prev) return null;
          return {
            ...prev,
            badges: prev.badges.map(b => b.id === badgeId ? { ...b, earned: true } : b)
          }
      });
  };

  const addItem = (item: InventoryItem) => {
      setUser(prev => {
          if (!prev) return null;
          return {
             ...prev,
             inventory: [...prev.inventory, item]
          }
      });
  };

  const unlockGameLevel = (game: 'pasarKata' | 'tebakBahasa' | 'legenda' | 'story', level: number) => {
      setUser(prev => {
          if (!prev) return null;
          const currentMax = prev.gameProgress[game];
          if (level > currentMax) {
              return {
                  ...prev,
                  gameProgress: {
                      ...prev.gameProgress,
                      [game]: level
                  }
              };
          }
          return prev;
      });
  };

  const actions = { addXp, unlockBadge, addItem, unlockGameLevel };

  const handleEnterWorld = (lang: Language) => {
    if (user) {
        setUser({ ...user, selectedLanguage: lang });
        setScreen(ScreenState.STORY_MAP);
    }
  };

  const renderScreen = () => {
    switch(screen) {
      case ScreenState.SPLASH:
        return <SplashScreen onComplete={handleSplashComplete} />;
      case ScreenState.ONBOARDING:
        return <Onboarding onComplete={handleOnboardingComplete} />;
      case ScreenState.AUTH:
        return <Auth onLogin={handleLogin} />;
      case ScreenState.DASHBOARD:
        return user ? <Dashboard user={user} onNavigate={setScreen} onEnterWorld={handleEnterWorld} /> : null;
      case ScreenState.TANYA_DATU:
        return user ? <TanyaDatu userLang={user.selectedLanguage || Language.SASAK} onBack={() => setScreen(ScreenState.DASHBOARD)} /> : null;
      case ScreenState.STORY_MAP:
        return user ? <StoryMode 
            language={user.selectedLanguage || Language.SASAK} 
            onBack={() => setScreen(ScreenState.DASHBOARD)} 
            actions={actions}
            userProgress={user.gameProgress.story}
        /> : null;
      case ScreenState.MINI_GAMES:
        return user ? <MiniGames 
            onBack={() => setScreen(ScreenState.DASHBOARD)} 
            actions={actions} 
            user={user}
            onPlayStateChange={setIsFullScreen} 
        /> : null;
      case ScreenState.PROFILE:
        return user ? <Profile user={user} onLogout={handleLogout} /> : null;
      case ScreenState.LEADERBOARD:
        return user ? <Leaderboard user={user} onNavigate={setScreen} /> : null;
      case ScreenState.COMMUNITY_CHAT:
        return user ? <CommunityChat user={user} onBack={() => setScreen(ScreenState.LEADERBOARD)} /> : null;
      default:
        return <div className="p-10 text-white text-center">Screen Not Found <br/><button onClick={() => setScreen(ScreenState.DASHBOARD)}>Back</button></div>;
    }
  };

  return (
    <LiquidBackground>
      <main className="flex-1 relative z-10 w-full h-full max-w-md mx-auto shadow-2xl overflow-hidden sm:rounded-[3rem] sm:my-8 sm:h-[90vh] sm:border-[8px] sm:border-gray-900 bg-sasambo-red/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation is hidden for TANYA_DATU and COMMUNITY_CHAT because they are not in the check list */}
        {!isFullScreen && 
         screen !== ScreenState.TANYA_DATU && 
         screen !== ScreenState.COMMUNITY_CHAT && 
         screen !== ScreenState.SPLASH && 
         screen !== ScreenState.ONBOARDING && 
         screen !== ScreenState.AUTH && 
         <Navigation currentScreen={screen} onNavigate={setScreen} />}
      </main>
    </LiquidBackground>
  );
};

export default App;
