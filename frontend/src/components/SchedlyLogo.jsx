import React from 'react';

const SchedlyLogo = ({ size = 'md', className = '' }) => {
    const sizes = {
        sm: 'text-lg',
        md: 'text-2xl',
        lg: 'text-4xl'
    };

    return (
        <span
            className={`
                group inline-block font-extrabold tracking-tight select-none
                transition-all duration-300 hover:opacity-80 cursor-pointer
                ${sizes[size] || sizes.md} ${className}
            `}
        >
            <span className="text-c-text">Sched</span>
            <span className="text-c-accent">ly</span>
        </span>
    );
};

export default SchedlyLogo;
