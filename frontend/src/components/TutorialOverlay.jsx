import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MascotOrb from './MascotOrb';
import { X } from 'lucide-react';

const steps = [
    { text: "Hi, I'm Nova! I'll guide you around your new intelligent workspace." },
    { text: "First, you can hit 'Create Post' up there to schedule something new." },
    { text: "Check your 'Visual Calendar' here to get a bird's-eye view of your month." },
    { text: "Use your 'Templates' to reuse high-performing formats instantly!" },
    { text: "That's it! Let's get planning. ✨" }
];

const TutorialOverlay = () => {
    const [step, setStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show after a slight delay if it's "first login" (simulate by checking localstorage)
        const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
        if (!hasSeenTutorial) {
            setTimeout(() => setIsVisible(true), 1500);
        }
    }, []);

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(s => s + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        setIsVisible(false);
        localStorage.setItem('hasSeenTutorial', 'true');
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                className="fixed bottom-8 right-8 z-[100] flex items-end drop-shadow-2xl"
            >
                {/* Speech Bubble */}
                <div className="relative bg-white/90 backdrop-blur-xl border border-white/40 p-5 rounded-2xl shadow-xl max-w-sm mb-4 mr-4 glass-card">
                    <button onClick={handleComplete} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 transition">
                        <X size={16} />
                    </button>
                    <p className="text-gray-500 font-medium leading-relaxed pr-6 relative z-10">
                        {steps[step].text}
                    </p>
                    <div className="mt-4 flex justify-end gap-2 relative z-10">
                        <button onClick={handleComplete} className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1 font-medium transition">
                            Skip
                        </button>
                        <button onClick={handleNext} className="bg-c-accent hover:opacity-90 text-white text-xs px-4 py-1.5 rounded-full font-semibold shadow-sm transition transform hover:scale-105 active:scale-95">
                            {step < steps.length - 1 ? 'Next' : 'Got it!'}
                        </button>
                    </div>
                    {/* Bubble Tail pointing to orb */}
                    <div className="absolute -bottom-3 right-8 w-6 h-6 bg-white/90 border-r border-b border-white/40 transform rotate-45 backdrop-blur-xl"></div>
                </div>

                {/* The Mascot */}
                <motion.div
                    className="floating-orb"
                >
                    <MascotOrb className="w-24 h-24" expression={step < steps.length - 1 ? "talk" : "smile"} />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default TutorialOverlay;
