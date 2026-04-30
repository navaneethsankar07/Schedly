import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PRESET_THEMES = [
    "Technology",
    "Fitness",
    "Business & Marketing",
    "Lifestyle & Travel"
];

const SUGGESTIONS = {
    "Technology": [
        "Share a 'Did you know?' about a recent AI development. 🤖",
        "Post a tutorial solving a common tech problem you faced today. 💻",
        "Review a tool or software you can't live without. ⚙️"
    ],
    "Fitness": [
        "Share your favorite 15-minute quick workout routine. 🏃‍♂️",
        "Post a myth-busting fact about nutrition or diets. 🥗",
        "Share a motivational quote overlaying a gym or outdoor picture. 💪"
    ],
    "Business & Marketing": [
        "Share a key lesson from a business mistake you made. 📈",
        "Post 3 tips for improving productivity while working remotely. ⚡",
        "Analyze a brand's recent marketing campaign and why it worked. 🎯"
    ],
    "Lifestyle & Travel": [
        "Share a 'day in the life' photo dump or short video. ☕",
        "Post your top 3 travel essentials you never leave without. ✈️",
        "Share a hidden gem coffee shop or spot in your city. 🌆"
    ]
};

const IdeaChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: "Hey! Need content ideas? Tell me what your niche is, or select a theme below." }
    ]);
    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (text, isPreset = false) => {
        const userText = text.trim();
        if (!userText) return;

        // Add user message
        const newMessages = [...messages, { id: Date.now(), type: 'user', text: userText }];
        setMessages(newMessages);
        if (!isPreset) setInputText("");

        // Simulate bot thinking
        setTimeout(() => {
            let botReply = "Hmm, I don't have specific ideas for that exact topic. Try selecting one of the prominent themes above or asking about Tech, Fitness, Business, or Lifestyle!";

            // Basic free local logic
            const lowerInput = userText.toLowerCase();
            let matchedTheme = null;

            if (lowerInput.includes('tech') || lowerInput.includes('software') || lowerInput.includes('coding')) {
                matchedTheme = "Technology";
            } else if (lowerInput.includes('fit') || lowerInput.includes('health') || lowerInput.includes('gym')) {
                matchedTheme = "Fitness";
            } else if (lowerInput.includes('business') || lowerInput.includes('market') || lowerInput.includes('money')) {
                matchedTheme = "Business & Marketing";
            } else if (lowerInput.includes('life') || lowerInput.includes('travel') || lowerInput.includes('food')) {
                matchedTheme = "Lifestyle & Travel";
            }

            if (matchedTheme) {
                const ideas = SUGGESTIONS[matchedTheme];
                const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
                botReply = `Here's an idea for ${matchedTheme}:\n\n✨ ${randomIdea}`;
            }

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
                        className="fixed bottom-20 right-4 sm:right-8 w-[350px] max-h-[500px] bg-base-100 shadow-2xl rounded-2xl border border-base-300 flex flex-col z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-primary text-primary-content p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Bot className="w-6 h-6" />
                                <span className="font-bold">Content Assistant</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-primary-focus p-1 rounded-md transition">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 p-4 overflow-y-auto bg-base-200/50 space-y-4 max-h-[300px]">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-wrap shadow-sm ${msg.type === 'user' ? 'bg-primary text-primary-content rounded-tr-none' : 'bg-base-100 text-base-content rounded-tl-none border border-base-300'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Presets */}
                        <div className="p-3 bg-base-100 border-t border-base-200 flex flex-nowrap overflow-x-auto gap-2 no-scrollbar">
                            {PRESET_THEMES.map(theme => (
                                <button
                                    key={theme}
                                    onClick={() => handleSend(`Give me an idea for ${theme}`, true)}
                                    className="whitespace-nowrap px-3 py-1.5 bg-base-200 hover:bg-base-300 text-base-content text-xs rounded-full font-medium transition"
                                >
                                    {theme}
                                </button>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-3 bg-base-100 border-t border-base-200 flex items-center gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend(inputText)}
                                placeholder="Ask for ideas..."
                                className="flex-1 bg-base-200 text-base-content text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                            <button
                                onClick={() => handleSend(inputText)}
                                className="bg-primary hover:primary-focus text-primary-content p-2 rounded-full transition shadow-sm"
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
                className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 bg-primary hover:brightness-110 text-primary-content p-4 rounded-full shadow-xl shadow-primary/30 z-50 transition"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
            </motion.button>
        </>
    );
};

export default IdeaChatbot;
