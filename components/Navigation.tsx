import React from 'react';
import { Home, Gamepad2, BookOpen, Trophy, User } from 'lucide-react';
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
    <div className="absolute bottom-0 left-0 w-full p-4 z-50">
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="bg-black/20 backdrop-blur-2xl border border-white/10 rounded-full px-6 py-4 flex justify-between items-center shadow-2xl"
      >
        {items.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 transition-colors duration-300 relative ${isActive ? 'text-white' : 'text-white/50'}`}
            >
              {isActive && (
                <motion.div 
                  layoutId="nav-glow"
                  className="absolute -top-10 w-12 h-12 bg-sasambo-red blur-xl opacity-50 rounded-full"
                />
              )}
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Navigation;