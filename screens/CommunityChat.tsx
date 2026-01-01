import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, MessageCircle, Send, Smile } from 'lucide-react';
import { UserProfile } from '../types';

interface CommunityChatProps {
    user: UserProfile;
    onBack: () => void;
}

const INITIAL_CHATS = [
    { id: 1, name: "Lalu Wira", msg: "Level 5 Sasak susah banget ya! Ada tips?", avatar: "https://picsum.photos/100/100?random=2", isMe: false, time: "09:00" },
    { id: 2, name: "Baiq Sari", msg: "Kuncinya di intonasi 'e' pepet sama 'e' taling. Dengerin audio ulang-ulang aja.", avatar: "https://picsum.photos/100/100?random=1", isMe: false, time: "09:02" },
    { id: 3, name: "Dae Nggampo", msg: "Mbojo Pride! Siapa yang udah sampai Doro Ncanga?", avatar: "https://picsum.photos/100/100?random=4", isMe: false, time: "09:05" },
    { id: 4, name: "SumbawaBoy", msg: "Saya baru unlock item Keris Sasak nih, keren abis efeknya!", avatar: "https://picsum.photos/100/100?random=5", isMe: false, time: "09:10" },
    { id: 5, name: "Rinjani_Girl", msg: "Ada yang mau mabar Pantun Hype nanti malam? Butuh partner nih.", avatar: "https://picsum.photos/100/100?random=6", isMe: false, time: "09:15" },
    { id: 6, name: "Amaq Kangkung", msg: "Jangan lupa klaim daily reward di Tanya Datu. Lumayan XP nya.", avatar: "https://picsum.photos/100/100?random=7", isMe: false, time: "09:20" },
    { id: 7, name: "Inaq Tegining", msg: "Setuju! Itemnya lumayan buat nambah koleksi museum.", avatar: "https://picsum.photos/100/100?random=8", isMe: false, time: "09:22" },
    { id: 8, name: "Lalu Wira", msg: "Oke siap, makasih infonya semeton!", avatar: "https://picsum.photos/100/100?random=2", isMe: false, time: "09:25" },
    { id: 9, name: "GasingMaster", msg: "Sabalong Samalewa! Salam dari Taliwang.", avatar: "https://picsum.photos/100/100?random=9", isMe: false, time: "09:30" },
    { id: 10, name: "Putri Mandalika", msg: "Ayo kejar rank 1, jangan mau kalah sama bot! Hahaha", avatar: "https://picsum.photos/100/100?random=10", isMe: false, time: "09:35" },
    { id: 11, name: "Kuda Liar", msg: "Game Takdir Bebas endingnya plot twist banget!", avatar: "https://picsum.photos/100/100?random=11", isMe: false, time: "09:40" },
    { id: 12, name: "Mbojo Warrior", msg: "Lembo ade... santai saja mainnya.", avatar: "https://picsum.photos/100/100?random=12", isMe: false, time: "09:45" },
];

const CommunityChat: React.FC<CommunityChatProps> = ({ user, onBack }) => {
    const [chats, setChats] = useState(INITIAL_CHATS);
    const [chatInput, setChatInput] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);

    const handleSendChat = () => {
        if (!chatInput.trim()) return;
        const newChat = {
            id: Date.now(),
            name: user.name,
            msg: chatInput,
            avatar: "https://picsum.photos/100/100?random=99",
            isMe: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChats([...chats, newChat]);
        setChatInput("");
        
        // Auto scroll
        setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#1E1E1E] flex flex-col h-full w-full">
            {/* Header Chat */}
            <div className="p-4 pt-8 bg-[#2C1810] border-b border-white/10 flex items-center gap-4 shadow-xl z-20">
                <button 
                    onClick={onBack} 
                    className="p-2 rounded-full bg-white/5 border border-white/10 active:scale-95 hover:bg-white/10 transition-colors"
                >
                    <ChevronLeft className="text-white" />
                </button>
                <div className="flex-1">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <MessageCircle size={18} className="text-green-400" /> Teras Komunitas
                    </h2>
                    <div className="flex items-center gap-1.5 text-xs text-green-400/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        1,204 Online
                    </div>
                </div>
            </div>

            {/* Chat Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#1E1E1E] relative z-0 scroll-smooth pb-4" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")', backgroundBlendMode: 'overlay'}}>
                {chats.map((chat) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={chat.id} 
                        className={`flex gap-3 ${chat.isMe ? 'flex-row-reverse' : ''}`}
                    >
                        <div className="w-8 h-8 rounded-full bg-gray-700 border border-white/20 flex-shrink-0 overflow-hidden shadow-md">
                            <img src={chat.avatar} className="w-full h-full object-cover" />
                        </div>
                        <div className={`flex flex-col max-w-[80%] ${chat.isMe ? 'items-end' : 'items-start'}`}>
                            {!chat.isMe && <span className="text-[10px] text-white/50 mb-1 ml-1">{chat.name}</span>}
                            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-sm ${
                                chat.isMe 
                                ? 'bg-gradient-to-br from-amber-600 to-orange-700 text-white rounded-tr-none border border-white/10' 
                                : 'bg-[#3E3E3E] text-white/90 border border-white/5 rounded-tl-none'
                            }`}>
                                {chat.msg}
                            </div>
                            <span className="text-[9px] text-white/30 mt-1 mx-1">{chat.time}</span>
                        </div>
                    </motion.div>
                ))}
                <div ref={chatEndRef} className="h-1" />
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-[#2C1810] border-t border-white/10 z-20 pb-6">
                <div className="flex gap-2 items-center bg-black/30 border border-white/10 rounded-full p-1.5 pl-4 transition-all focus-within:border-amber-500/50 focus-within:bg-black/40">
                    <Smile size={20} className="text-white/30 cursor-pointer hover:text-amber-400 transition-colors" />
                    <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Kirim pesan ke komunitas..."
                        className="flex-1 bg-transparent py-2 text-sm text-white focus:outline-none placeholder:text-white/20"
                        onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                    />
                    <button 
                        onClick={handleSendChat}
                        disabled={!chatInput.trim()}
                        className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                    >
                        <Send size={16} fill="currentColor" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CommunityChat;