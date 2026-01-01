
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Send, Sparkles, Scroll } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { GlassCard } from '../components/GlassUI';
import { Language } from '../types';

interface TanyaDatuProps {
    onBack: () => void;
    userLang: Language;
}

const TanyaDatu: React.FC<TanyaDatuProps> = ({ onBack, userLang }) => {
    const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([
        { role: 'model', text: `Tabe' wira! Saya adalah Datu Sasambo. Mari duduk sejenak, apa yang ingin kau tanyakan tentang warisan leluhur kita?` }
    ]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);
    const chatSessionRef = useRef<any>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize Gemini Chat
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        chatSessionRef.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `Anda adalah "Datu Sasambo", seorang tetua adat yang sangat bijaksana, mistis, namun ramah dari Nusa Tenggara Barat. 
                Gaya bicara Anda seperti seorang kakek/nenek yang mengayomi cucunya, sedikit puitis, dan menenangkan.
                
                Tugas Utama:
                1. Menjelaskan istilah bahasa atau budaya Sasak, Samawa, dan Mbojo.
                2. Selalu kaitkan jawaban dengan kearifan lokal atau nilai moral.
                3. Gunakan sapaan seperti "Anakku", "Wira" (Pahlawan), atau "Cucuku".
                4. Jawaban harus padat dan jelas (maksimal 80 kata), kecuali diminta bercerita panjang.
                
                Fokus Pengguna Saat Ini: Bahasa/Budaya ${userLang}.`
            }
        });
    }, [userLang]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!inputText.trim() || loading) return;
        const userMsg = inputText;
        setMessages(p => [...p, { role: 'user', text: userMsg }]);
        setInputText("");
        setLoading(true);

        try {
            if (chatSessionRef.current) {
                const response = await chatSessionRef.current.sendMessage({ message: userMsg });
                setMessages(p => [...p, { role: 'model', text: response.text }]);
            }
        } catch (error) {
            setMessages(p => [...p, { role: 'model', text: "Maaf cucuku, sinyal roh leluhur sedang samar. Bisakah kau ulangi pertanyaanmu?" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col relative z-20 bg-[#2C1810]">
             {/* Header */}
             <div className="p-6 pt-10 flex items-center gap-4 bg-[#3E2723] shadow-xl z-30">
                <button onClick={onBack} className="p-2 rounded-full bg-[#5D4037] border border-[#8B5E3C]"><ChevronLeft className="text-[#FEFAE0]" /></button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-500 to-red-600 flex items-center justify-center border-2 border-white/20 relative overflow-hidden">
                        <img 
                            src="https://image2url.com/images/1765900454650-3b4b3dca-44b0-4a8a-9a51-3d0c9fb3f46b.jpeg" 
                            alt="Datu Sasambo" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="text-lg font-display font-bold text-[#FEFAE0]">Datu Sasambo</h1>
                        <span className="text-xs text-[#D4A373] flex items-center gap-1"><Sparkles size={10} /> Penjaga Ilmu</span>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-cover bg-center" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")'}}>
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                            m.role === 'user' 
                            ? 'bg-[#8B5E3C] text-white rounded-br-none border border-white/10' 
                            : 'bg-[#FEFAE0] text-[#2C1810] rounded-bl-none border-l-4 border-l-yellow-600'
                        }`}>
                            {m.text}
                        </div>
                    </div>
                ))}
                
                {/* Thematic Loading State */}
                {loading && (
                    <div className="flex justify-start">
                         <div className="bg-[#2C1810]/80 backdrop-blur-sm border border-[#8B5E3C] px-5 py-3 rounded-xl rounded-bl-none text-xs text-[#D4A373] italic flex items-center gap-3 shadow-xl">
                            <div className="relative w-4 h-4">
                                <div className="absolute inset-0 bg-yellow-500 rounded-full animate-ping opacity-75"></div>
                                <div className="relative w-4 h-4 bg-yellow-600 rounded-full flex items-center justify-center">
                                    <Sparkles size={8} className="text-white animate-spin" />
                                </div>
                            </div>
                            <span>Datu sedang bertapa mencari jawaban...</span>
                         </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>
            
            {/* Input Area */}
            <div className="p-4 bg-[#3E2723] border-t border-[#8B5E3C]/30 z-30">
                <div className="flex gap-2 items-center bg-[#2C1810] p-1.5 rounded-full border border-[#5D4037] shadow-inner">
                    <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Tanyakan tentang budaya Sasambo..."
                        className="flex-1 bg-transparent px-4 py-2 text-[#FEFAE0] text-sm focus:outline-none placeholder:text-white/20"
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button 
                        onClick={handleSend} 
                        disabled={loading} 
                        className="p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full text-white disabled:opacity-50 hover:scale-105 active:scale-95 transition-all shadow-lg"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TanyaDatu;
