import React, { useEffect, useState } from 'react';

const CountUpNumber = ({ value }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = parseInt(value, 10) || 0;
        if (start === end) {
            setCount(end);
            return;
        }

        const duration = 1000;
        const incrementTime = Math.max(duration / end, 20); // max 50 fps
        const timer = setInterval(() => {
            start += Math.ceil(end / (duration / incrementTime));
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, incrementTime);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{count}</span>;
};

export default CountUpNumber;
