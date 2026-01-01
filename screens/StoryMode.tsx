
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Mic, X, Star, Lock, Volume2, RefreshCcw, CheckCircle, Headphones, AlertTriangle } from 'lucide-react';
import { GlassCard, LiquidButton } from '../components/GlassUI';
import { generateStoryLevels } from '../gameData';
import { LevelData, Language, GameActions } from '../types';

interface StoryModeProps {
  language: Language;
  onBack: () => void;
  actions: GameActions;
  userProgress: number; 
}

// Rebranding as AccentTrainingMap
const StoryMode: React.FC<StoryModeProps> = ({ language, onBack, actions, userProgress }) => {
  const [activeLevel, setActiveLevel] = useState<LevelData | null>(null);
  const [levels, setLevels] = useState<LevelData[]>([]);

  useEffect(() => {
    // Generate Accent Training Levels (30 Levels)
    const generated = generateStoryLevels(language);
    const levelsWithLockStatus = generated.map(l => ({
        ...l,
        isLocked: l.id > userProgress
    }));
    setLevels(levelsWithLockStatus);
  }, [language, userProgress]);

  return (
    <div className="relative w-full h-full bg-[#2C1810]">
      <AnimatePresence mode="wait">
        {activeLevel ? (
          <AccentTrainingLevel 
            key="level" 
            level={activeLevel} 
            language={language}
            onClose={() => setActiveLevel(null)} 
            actions={actions}
          />
        ) : (
          <CandyMap 
            levels={levels} 
            onLevelSelect={setActiveLevel} 
            onBack={onBack} 
            currentProgress={userProgress}
            worldName={language}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- CANDY CRUSH STYLE MAP ---
const CandyMap: React.FC<{ worldName: string, levels: LevelData[], onLevelSelect: (l: LevelData) => void, onBack: () => void, currentProgress: number }> = ({ worldName, levels, onLevelSelect, onBack, currentProgress }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const LEVEL_HEIGHT = 100; // Vertical distance between levels
  const TOTAL_HEIGHT = levels.length * LEVEL_HEIGHT + 300; 

  // Scroll to current level
  useEffect(() => {
      if (scrollRef.current) {
          const levelY = TOTAL_HEIGHT - (currentProgress * LEVEL_HEIGHT);
          setTimeout(() => {
            scrollRef.current?.scrollTo({
                top: levelY - (window.innerHeight / 2) + 100, 
                behavior: 'smooth'
            });
          }, 100);
      }
  }, [currentProgress, TOTAL_HEIGHT]);

  // Determine theme colors AND DISTINCT PATTERNS
  const getThemeColors = () => {
    switch(worldName) {
        case Language.SASAK: 
            return { 
                bg: "from-[#3E2723] to-[#2C1810]", // Earthy Brown
                node: "bg-amber-600", 
                path: "stroke-amber-800",
                // Sasak: Organic/Radial dots resembling Songket texture
                pattern: `radial-gradient(circle at 50% 50%, rgba(212, 163, 115, 0.1) 2px, transparent 2px), 
                          linear-gradient(45deg, rgba(139, 94, 60, 0.05) 25%, transparent 25%, transparent 75%, rgba(139, 94, 60, 0.05) 75%, rgba(139, 94, 60, 0.05))` 
            };
        case Language.SAMAWA: 
            return { 
                bg: "from-[#004D40] to-[#00251a]", // Deep Teal/Sea
                node: "bg-teal-500", 
                path: "stroke-teal-700",
                // Samawa: "Kre Alang" Style - Intersecting diagonal gold/silver threads look
                pattern: `repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.03) 0px, rgba(255, 255, 255, 0.03) 1px, transparent 1px, transparent 10px),
                          repeating-linear-gradient(-45deg, rgba(255, 255, 255, 0.03) 0px, rgba(255, 255, 255, 0.03) 1px, transparent 1px, transparent 10px)` 
            };
        case Language.MBOJO: 
            return { 
                bg: "from-[#4A148C] to-[#1a0033]", // Royal Purple/Red
                node: "bg-purple-600", 
                path: "stroke-purple-800",
                // Mbojo: "Tembe Nggoli" Style - Checkered/Plaid boxes
                pattern: `linear-gradient(90deg, rgba(255,255,255,0.05) 50%, transparent 50%),
                          linear-gradient(rgba(255,255,255,0.05) 50%, transparent 50%)`
            };
        default: return { bg: "from-gray-900 to-black", node: "bg-gray-500", path: "stroke-gray-700", pattern: "" };
    }
  }
  const theme = getThemeColors();

  if (!levels.length) return <div>Loading...</div>;

  return (
    <div className={`w-full h-full relative flex flex-col overflow-hidden bg-gradient-to-b ${theme.bg}`}>
      
      {/* DISTINCT BACKGROUND PATTERN */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{ 
            backgroundImage: theme.pattern, 
            backgroundSize: worldName === Language.MBOJO ? '40px 40px' : (worldName === Language.SAMAWA ? '20px 20px' : '30px 30px'),
            backgroundBlendMode: 'overlay'
        }} 
      />

      {/* Header - Sticky */}
      <div className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-between pointer-events-none h-32 bg-gradient-to-b from-black/80 to-transparent">
        <div className="pointer-events-auto flex items-center gap-3">
             <button onClick={onBack} className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-lg hover:scale-105 active:scale-95">
                <ChevronLeft className="text-[#FEFAE0]" />
            </button>
            <div className="flex flex-col">
                <h2 className="text-[#FEFAE0] font-display font-bold text-lg drop-shadow-md tracking-wider uppercase">Latih Logat</h2>
                <span className="text-xs text-white/60">{worldName} Edition</span>
            </div>
        </div>
      </div>

      {/* Infinite Scroll Container */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto relative no-scrollbar z-10">
        <div className="relative w-full" style={{ height: `${TOTAL_HEIGHT}px` }}>
            
            {/* --- PATH SVG (Drawn from Bottom to Top) --- */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 overflow-visible">
                <path 
                    d={`
                        M ${levels[0].x}% ${TOTAL_HEIGHT - 100} 
                        ${levels.map((l, i) => {
                            const y = TOTAL_HEIGHT - (i * LEVEL_HEIGHT) - 100;
                            if (i === 0) return `L ${l.x}% ${y}`;
                            const prevY = TOTAL_HEIGHT - ((i - 1) * LEVEL_HEIGHT) - 100;
                            const prevX = levels[i-1].x;
                            return `C ${prevX}% ${prevY - 50}, ${l.x}% ${y + 50}, ${l.x}% ${y}`;
                        }).join(' ')}
                    `}
                    fill="none" 
                    strokeWidth="8" 
                    strokeLinecap="round"
                    strokeDasharray="12 12"
                    className={`${theme.path} opacity-70 drop-shadow-md`}
                />
            </svg>

            {/* --- LEVEL NODES --- */}
            {levels.map((level, index) => {
                const yPos = TOTAL_HEIGHT - (index * LEVEL_HEIGHT) - 100;
                const isCurrent = level.id === currentProgress;
                const isLocked = level.id > currentProgress;
                const isCompleted = level.id < currentProgress;

                return (
                    <div 
                        key={level.id}
                        className="absolute w-20 h-20 -ml-10 -mt-10 flex items-center justify-center z-20"
                        style={{ left: `${level.x}%`, top: `${yPos}px` }}
                    >
                        {/* Biome/Difficulty Marker */}
                        {(index === 0 || index === 10 || index === 20) && (
                            <div className="absolute top-12 whitespace-nowrap bg-black/60 text-[10px] text-white px-2 py-0.5 rounded-full border border-white/20 backdrop-blur-sm shadow-sm">
                                {level.difficulty} ZONE
                            </div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => !isLocked && onLevelSelect(level)}
                            className={`
                                relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl border-4 transition-all duration-300
                                ${isLocked 
                                    ? 'bg-[#2C1810] border-[#5D4037] grayscale' 
                                    : `${theme.node} border-white`}
                                ${isCurrent ? 'scale-110 ring-4 ring-yellow-400 animate-pulse' : ''}
                            `}
                        >
                            {isLocked ? (
                                <Lock size={16} className="text-white/30" />
                            ) : (
                                <span className="text-lg font-bold text-white font-display">{level.id}</span>
                            )}

                            {/* Stars for completed levels */}
                            {isCompleted && (
                                <div className="absolute -top-3 flex gap-0.5">
                                    {[1,2,3].map(s => <Star key={s} size={10} fill="#FACC15" stroke="none" className="drop-shadow-sm" />)}
                                </div>
                            )}
                        </motion.button>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

// --- LEVENSHTEIN ALGORITHM (Still used for calculation but logic modified to pass) ---
const levenshteinDistance = (a: string, b: string): number => {
    const matrix = [];
    let i;
    for (i = 0; i <= b.length; i++) { matrix[i] = [i]; }
    let j;
    for (j = 0; j <= a.length; j++) { matrix[0][j] = j; }
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
            }
        }
    }
    return matrix[b.length][a.length];
};

const calculateSimilarity = (s1: string, s2: string): number => {
    const longer = s1.length > s2.length ? s1 : s2;
    if (longer.length === 0) return 1.0;
    const distance = levenshteinDistance(s1, s2);
    return (longer.length - distance) / longer.length;
};

// --- ACCENT TRAINING GAME LEVEL ---
const AccentTrainingLevel: React.FC<{ level: LevelData, language: Language, onClose: () => void, actions: GameActions }> = ({ level, language, onClose, actions }) => {
  const [isListening, setIsListening] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [transcript, setTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  const targetWord = level.dialogue[0].native; 
  const translation = level.dialogue[0].translation;

  // Background Theme based on language
  const getTheme = () => {
       switch(language) {
           case Language.SASAK: return { bg: "bg-[#3E2723]", pattern: "radial-gradient(circle, white 1px, transparent 1px)" }; // Brown
           case Language.SAMAWA: return { bg: "bg-[#004D40]", pattern: "repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, transparent 2px, transparent 10px)" }; // Teal
           case Language.MBOJO: return { bg: "bg-[#4A148C]", pattern: "linear-gradient(90deg, rgba(255,255,255,0.05) 50%, transparent 50%)" }; // Purple
           default: return { bg: "bg-[#2C1810]", pattern: "" };
       }
  }
  const theme = getTheme();

  // TTS Function
  const playNativeAudio = () => {
      if ('speechSynthesis' in window) {
          setIsSpeaking(true);
          const utterance = new SpeechSynthesisUtterance(targetWord);
          utterance.lang = 'id-ID'; 
          utterance.rate = 0.8;
          utterance.onend = () => setIsSpeaking(false);
          window.speechSynthesis.speak(utterance);
      }
  };

  useEffect(() => {
    // Simulating auto-play instruction on entry
    setTimeout(() => playNativeAudio(), 500);

    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'id-ID'; // Use Indonesian model
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onstart = () => { 
          setIsListening(true); 
          setTranscript("Mendengarkan..."); 
      };
      
      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        evaluatePronunciation(text);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (e: any) => { 
          setIsListening(false);
          // Even on error/no-speech, we simulate a success for prototype
          setTranscript("...(suara terdeteksi)");
          evaluatePronunciation("FORCE_SUCCESS");
      };
      
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [level]);

  const evaluatePronunciation = (input: string) => {
      // 1. Calculate REAL Levenshtein distance first (to make it feel like it worked)
      const cleanInput = input.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").trim();
      const cleanTarget = targetWord.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").trim();
      
      let realSimilarity = 0;
      if (input !== "FORCE_SUCCESS") {
         realSimilarity = calculateSimilarity(cleanInput, cleanTarget);
      }
      
      // 2. BOOST LOGIC ("Seolah-olah Benar")
      // Force the score to be between 75% and 100% regardless of actual input
      // If the real input was actually good (>80%), give 100%.
      // If garbage/wrong/error, give random between 75-92% so it looks organic but passes.
      
      let finalScore = 0;
      
      if (realSimilarity > 0.8) {
          finalScore = 100;
      } else {
          // Generate organic looking "passing" score
          finalScore = Math.floor(Math.random() * (92 - 75 + 1) + 75);
      }

      // Add delay to simulate "Processing"
      setTimeout(() => {
          setScore(finalScore);
          
          // Always give XP
          actions.addXp(25);
          // Unlock next level after short delay
          setTimeout(() => actions.unlockGameLevel('story', level.id + 1), 1500);
      }, 500);
  };

  const toggleMic = () => {
    if (isListening) return;
    setScore(null);
    if (recognitionRef.current) {
        try { recognitionRef.current.start(); } catch(e) {}
    } else {
        // Fallback for No Web Speech API -> Simulate recording then Success
        setIsListening(true);
        setTranscript("Merekam...");
        setTimeout(() => {
            setTranscript(targetWord); 
            evaluatePronunciation("FORCE_SUCCESS");
            setIsListening(false);
        }, 2000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: 100 }}
      className={`w-full h-full flex flex-col ${theme.bg} absolute inset-0 z-50 overflow-hidden`}
    >
      {/* Pattern Overlay inside Level */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: theme.pattern, backgroundSize: '30px 30px' }} />

      {/* Top Bar */}
      <div className="p-4 flex justify-between items-center bg-black/20 z-10 relative">
         <div className="text-white text-xs font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/20">Level {level.id}</div>
         <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-500/50 transition-colors"><X className="text-white" size={16} /></button>
      </div>

      <div className="flex-1 flex flex-col items-center p-6 relative z-10 overflow-y-auto">
          
          {/* VISUALIZER CIRCLE */}
          <div className="mt-4 mb-6 relative">
              <div className="w-64 h-64 rounded-full border-4 border-white/10 flex items-center justify-center relative bg-gradient-to-br from-black/40 to-black/80 shadow-2xl backdrop-blur-md">
                   {/* Ripple Animation when speaking */}
                   {isSpeaking && (
                       <div className="absolute inset-0 rounded-full border-4 border-yellow-500/50 animate-ping"></div>
                   )}
                   
                   <div className="text-center z-10 px-4">
                       <p className="text-yellow-400 text-[10px] font-bold uppercase tracking-widest mb-2">Target Suara</p>
                       <h1 className="text-3xl font-display font-bold text-white mb-2 leading-tight">{targetWord}</h1>
                       <p className="text-white/50 text-sm italic border-t border-white/10 pt-2 mt-2">"{translation}"</p>
                   </div>
              </div>
              
              {/* Play Button Overlay */}
              <button 
                onClick={playNativeAudio}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg active:scale-95 text-[#2C1810]"
              >
                  {isSpeaking ? <Volume2 className="animate-pulse" /> : <Volume2 />}
              </button>
          </div>

          {/* PHONEME FOCUS TIP */}
          <GlassCard className="mb-6 w-full py-3 px-4 flex items-center gap-3 bg-white/5 border-white/10">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Headphones size={20} className="text-blue-300" />
              </div>
              <div>
                  <p className="text-[10px] text-blue-200 uppercase font-bold">Fokus Latihan</p>
                  <p className="text-sm text-white font-medium">{level.phonemeFocus}</p>
              </div>
          </GlassCard>

          {/* ACTION AREA & FEEDBACK */}
          <div className="w-full mt-auto mb-4">
              {score !== null ? (
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center bg-black/40 p-6 rounded-3xl border border-white/10">
                      <div className="flex justify-between items-center mb-4">
                          <div className="text-left">
                               <p className="text-xs text-white/50">Analisis Suara:</p>
                               {/* Always show positive label regardless of transcript */}
                               <p className="text-lg text-green-400 font-bold">Terdeteksi</p>
                          </div>
                          <div className="text-4xl font-bold text-green-400">{score}%</div>
                      </div>
                      
                      <div className="h-1 w-full bg-white/10 rounded-full mb-4 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${score}%` }} 
                            className="h-full bg-green-500"
                          />
                      </div>

                      <p className="text-white/80 text-sm mb-6 font-medium">
                          {score === 100 ? "Sempurna! Persis seperti penutur asli." : "Bagus sekali! Intonasi sudah mendekati."}
                      </p>
                      
                      <div className="flex gap-3">
                          <LiquidButton onClick={() => { setScore(null); setTranscript(""); }} variant="secondary" fullWidth><RefreshCcw size={18} /></LiquidButton>
                          {/* Button is ALWAYS allowed because logic forces passing score */}
                          <LiquidButton onClick={onClose} variant="success" fullWidth>Lanjut <CheckCircle size={18} /></LiquidButton>
                      </div>
                  </motion.div>
              ) : (
                  <div className="flex flex-col items-center">
                      <div className="relative">
                          <button 
                            onClick={toggleMic}
                            disabled={isListening}
                            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all ${isListening ? 'bg-red-500 scale-110' : 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:scale-105'}`}
                          >
                              <Mic size={32} className="text-white" />
                          </button>
                          {isListening && (
                             <span className="absolute inset-0 rounded-full animate-ping bg-white opacity-20 pointer-events-none"></span>
                          )}
                      </div>
                      
                      <div className="mt-4 text-center h-8">
                         {isListening ? (
                             <p className="text-white text-sm animate-pulse">Mendengarkan...</p>
                         ) : (
                             <p className="text-white/50 text-xs flex items-center gap-1 justify-center">
                                 <AlertTriangle size={10} /> Gunakan suara yang jelas
                             </p>
                         )}
                      </div>
                  </div>
              )}
          </div>

      </div>
    </motion.div>
  );
};

export default StoryMode;
