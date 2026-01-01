
import React from 'react';
import { Home, Gamepad2, Trophy, User } from 'lucide-react';
import { ScreenState } from '../types';
import { motion } from 'framer-motion';

interface NavigationProps {
  currentScreen: ScreenState;
  onNavigate: (screen: ScreenState) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentScreen, onNavigate }) => {
  // Only show nav on main screens
  const showNav = [
    ScreenState.DASHBOARD,
    ScreenState.MINI_GAMES,
    ScreenState.LEADERBOARD,
    ScreenState.PROFILE
  ].includes(currentScreen);

  if (!showNav) return null;

  const items = [
    { id: ScreenState.DASHBOARD, icon: Home, label: 'Home' },
    { id: ScreenState.MINI_GAMES, icon: Gamepad2, label: 'Games' },
    { id: ScreenState.LEADERBOARD, icon: Trophy, label: 'Rank' },
    { id: ScreenState.PROFILE, icon: User, label: 'Profile' },
  ];

  return (
    // Moved up to bottom-6 and added bottom-safe class from index.html style
    <div className="absolute bottom-6 bottom-safe left-0 w-full px-6 z-50 pointer-events-none">
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="bg-[#1a0f0a]/80 backdrop-blur-xl border border-white/10 rounded-3xl px-6 py-4 flex justify-between items-center shadow-2xl max-w-[340px] mx-auto pointer-events-auto"
      >
        {items.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1.5 transition-colors duration-300 relative ${isActive ? 'text-white' : 'text-white/40'}`}
            >
              {isActive && (
                <motion.div 
                  layoutId="nav-glow"
                  className="absolute -top-10 w-10 h-10 bg-sasambo-accent blur-xl opacity-40 rounded-full"
                />
              )}
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[9px] font-bold tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Navigation;
