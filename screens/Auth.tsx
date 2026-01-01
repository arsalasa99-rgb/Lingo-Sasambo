
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, User, Shield } from 'lucide-react';
import { LiquidButton, GlassCard } from '../components/GlassUI';
import { UserProfile, Language } from '../types';
import { MOCK_BADGES, MOCK_INVENTORY } from '../constants';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [guild, setGuild] = useState('Petualang Baru');

  const handleLogin = () => {
    if (!name.trim()) return;

    // --- SIMULASI STREAK 3 HARI ---
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today); twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const newUser: UserProfile = {
      name: name,
      level: 1,
      xp: 0,
      maxXp: 1000,
      selectedLanguage: Language.SASAK,
      badges: MOCK_BADGES, 
      inventory: MOCK_INVENTORY,
      // Set Streak ke 3 Hari
      streak: 3,
      lastLoginDate: today.toISOString(),
      // Isi history untuk kalender visual
      streakHistory: [
          { date: twoDaysAgo.toDateString(), active: true },
          { date: yesterday.toDateString(), active: true },
          { date: today.toDateString(), active: true }
      ],
      gameProgress: {
        story: 1,
        // GameType_Language
        pasarKata_Sasak: 1,
        pasarKata_Samawa: 1,
        pasarKata_Mbojo: 1,
        tebakBahasa_Sasak: 1,
        tebakBahasa_Samawa: 1,
        tebakBahasa_Mbojo: 1,
        legenda_Sasak: 1,
        legenda_Samawa: 1,
        legenda_Mbojo: 1,
        misteriSasambo: 1,
        pantunHype: 1
      }
    };

    // Save to Local Storage
    localStorage.setItem('lingo_user', JSON.stringify(newUser));
    onLogin(newUser);
  };

  return (
    <div className="h-full flex flex-col justify-center items-center p-6 relative z-20 overflow-y-auto">
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-sm mb-6 flex flex-col items-center"
      >
        {/* Frame Logo centered and better spaced - INCREASED SIZE */}
        <div className="w-56 h-56 bg-white/5 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-xl flex items-center justify-center p-0 mb-6 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-30"></div>
             {/* Logo URL - FULL BLEED */}
             <img 
                src="https://image2url.com/r2/bucket1/images/1766542008319-1ba46b07-5417-4c7c-aec6-4e8a39b40eb0.png" 
                alt="Logo" 
                className="w-full h-full object-contain drop-shadow-2xl relative z-10" 
             />
        </div>

        <h1 className="text-3xl font-display font-bold text-white mb-2 text-center">Selamat Datang</h1>
        <p className="text-white/60 text-center text-sm">Siapkan dirimu menjadi Penjaga Bahasa.</p>
      </motion.div>

      <GlassCard className="w-full max-w-sm p-6 space-y-6 bg-black/20 border-white/10">
        <div>
          <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 block ml-1">Nama Pahlawan</label>
          <div className="bg-white/10 rounded-xl flex items-center px-4 py-3 border border-white/10 focus-within:border-yellow-500/50 transition-colors">
            <User className="text-white/40 mr-3" size={20} />
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan namamu..."
              className="bg-transparent border-none outline-none text-white placeholder:text-white/20 flex-1 font-medium"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 block ml-1">Pilih Guild Awal</label>
          <div className="grid grid-cols-2 gap-2">
            {['Petualang Baru', 'Cendekia Sasak', 'Pelaut Samawa', 'Ksatria Mbojo'].map((g) => (
              <button
                key={g}
                onClick={() => setGuild(g)}
                className={`p-3 rounded-xl text-xs font-bold border transition-all ${
                  guild === g 
                  ? 'bg-yellow-500/20 border-yellow-500 text-yellow-200' 
                  : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <LiquidButton onClick={handleLogin} fullWidth className="mt-4">
          Mulai Petualangan <ArrowRight size={20} />
        </LiquidButton>
      </GlassCard>

      <p className="text-center text-white/20 text-[10px] mt-6">
        Data permainan akan tersimpan di perangkat ini.
      </p>
    </div>
  );
};

export default Auth;
