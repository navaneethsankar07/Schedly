import React from 'react';

const MascotOrb = ({ className = '', expression = 'smile' }) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 pulsing-glow opacity-80 blur-[2px]"></div>
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-indigo-100 via-white to-cyan-100 shadow-inner flex flex-col items-center justify-center overflow-hidden border border-white/60">
                <div className="absolute top-[15%] left-[20%] w-[30%] h-[30%] bg-white/60 rounded-full blur-md"></div>
                
                {/* Face Container */}
                <div className="relative z-10 w-[60%] flex space-x-2 items-center justify-center mt-2">
                    {/* Eyes */}
                    <div className="w-3 h-3 rounded-full bg-indigo-900 shadow-[0_0_8px_rgba(49,46,129,0.6)] animate-pulse"></div>
                    <div className="w-3 h-3 rounded-full bg-indigo-900 shadow-[0_0_8px_rgba(49,46,129,0.6)] animate-pulse" style={{animationDelay: '0.2s'}}></div>
                </div>
                
                {/* Mouth depends on expression */}
                <div className="relative z-10 mt-1">
                    {expression === 'smile' && (
                        <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
                            <path d="M2 2 Q10 12 18 2" stroke="#312E81" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    )}
                    {expression === 'talk' && (
                        <div className="w-4 h-2 bg-indigo-900 rounded-full mx-auto animate-bounce"></div>
                    )}
                    {expression === 'think' && (
                        <div className="w-2 h-2 bg-indigo-900 rounded-full mx-auto"></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MascotOrb;
