import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const PRESET_THEMES = ["Technology", "Fitness", "Business & Marketing", "Lifestyle & Travel", "Comedy", "Education"];

const SUGGESTIONS = {
    "Technology": ["Share a 'Did you know?' about a recent AI development. 🤖", "Post a tutorial solving a common tech problem. 💻", "Review a tool you can't live without. ⚙️"],
    "Fitness": ["Share your favorite 15-minute workout routine. 🏃‍♂️", "Post a myth-busting fact about nutrition. 🥗", "Share a motivational quote. 💪"],
    "Business & Marketing": ["Share a key lesson from a business mistake. 📈", "Post 3 tips for remote productivity. ⚡", "Analyze a brand's recent campaign. 🎯"],
    "Lifestyle & Travel": ["Share a 'day in the life' photo dump. ☕", "Post your top 3 travel essentials. ✈️", "Share a hidden gem spot in your city. 🌆"],
    "Comedy": ["Share a funny relatable meme. 😂", "Post a Behind the Scenes blooper. 🎬", "Write a humorous take on a niche myth. 🤡"],
    "Education": ["Break down a complex topic into 3 bullet points. 📚", "Share a 'How-To' mini-guide. 🎓", "Recommend 3 books that changed your perspective. 📖"]
};

const IdeaChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: "Hey! Need content ideas? Tell me your niche or pick a theme below." }
    ]);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const handleSend = (text, isPreset = false) => {
        const userText = text.trim();
        if (!userText) return;
        setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: userText }]);
        if (!isPreset) setInputText("");

        setTimeout(() => {
            const lower = userText.toLowerCase();
            let matchedTheme = null;
            if (lower.includes('tech') || lower.includes('software') || lower.includes('coding')) matchedTheme = "Technology";
            else if (lower.includes('fit') || lower.includes('health') || lower.includes('gym')) matchedTheme = "Fitness";
            else if (lower.includes('business') || lower.includes('market') || lower.includes('money')) matchedTheme = "Business & Marketing";
            else if (lower.includes('life') || lower.includes('travel') || lower.includes('food')) matchedTheme = "Lifestyle & Travel";
            else if (lower.includes('comedy') || lower.includes('fun') || lower.includes('meme') || lower.includes('joke')) matchedTheme = "Comedy";
            else if (lower.includes('edu') || lower.includes('learn') || lower.includes('study')) matchedTheme = "Education";

            const botReply = matchedTheme
                ? `Here's an idea for ${matchedTheme}:\n\n✨ ${SUGGESTIONS[matchedTheme][Math.floor(Math.random() * SUGGESTIONS[matchedTheme].length)]}`
                : "I'm designed for content ideas! Try topics like Tech, Fitness, Business, or Lifestyle.";

            setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: botReply }]);
        }, 600);
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-20 right-3 sm:right-8 z-[100] flex flex-col shadow-2xl rounded-2xl border border-c-border bg-c-card overflow-hidden"
                        style={{ width: 'min(340px, calc(100vw - 24px))', maxHeight: 'min(480px, calc(100vh - 120px))' }}
                    >
                        {/* Header */}
                        <div className="bg-c-accent text-white p-3.5 flex justify-between items-center flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <Bot className="w-5 h-5" />
                                <span className="font-bold text-sm">Content Assistant</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:opacity-70 p-1 rounded-md transition min-w-[28px] min-h-[28px] flex items-center justify-center">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-3.5 overflow-y-auto bg-c-bg/50 space-y-3">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-wrap shadow-sm ${msg.type === 'user'
                                        ? 'bg-c-accent text-white rounded-tr-none'
                                        : 'bg-c-card text-c-text rounded-tl-none border border-c-border'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Preset Pills */}
                        <div className="p-2.5 bg-c-card border-t border-c-border flex flex-nowrap overflow-x-auto gap-1.5 flex-shrink-0">
                            {PRESET_THEMES.map(theme => (
                                <button
                                    key={theme}
                                    onClick={() => handleSend(`Give me an idea for ${theme}`, true)}
                                    className="whitespace-nowrap px-2.5 py-1.5 bg-c-bg hover:bg-c-border text-c-text text-xs rounded-full font-medium transition min-h-[28px] border border-c-border"
                                >
                                    {theme}
                                </button>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-2.5 bg-c-card border-t border-c-border flex items-center gap-2 flex-shrink-0">
                            <input
                                type="text"
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend(inputText)}
                                placeholder="Ask for ideas..."
                                className="flex-1 bg-c-bg text-c-text text-sm rounded-full px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-c-accent/50 border border-c-border"
                                style={{ fontSize: '16px' }}
                            />
                            <button
                                onClick={() => handleSend(inputText)}
                                className="bg-c-accent text-white p-2 rounded-full transition hover:opacity-90 min-w-[36px] min-h-[36px] flex items-center justify-center"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-3 sm:bottom-8 sm:right-8 bg-c-accent text-white p-3.5 sm:p-4 rounded-full shadow-xl z-[100] transition min-w-[52px] min-h-[52px] flex items-center justify-center"
            >
                {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />}
            </motion.button>
        </>
    );
};

export default IdeaChatbot;
