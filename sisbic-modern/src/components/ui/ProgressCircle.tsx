import React, { useEffect, useState } from 'react';

const AnimatedNumber = ({ value }: { value: number }) => {
    const [currentValue, setCurrentValue] = useState(0);

    useEffect(() => {
        const animationDuration = 1000; // 1 segundo
        const frameRate = 60; // 60fps
        const totalFrames = animationDuration / (1000 / frameRate);
        const increment = value / totalFrames;

        let frame = 0;
        const counter = setInterval(() => {
            frame++;
            const newAnimatedValue = Math.min(value, frame * increment);
            setCurrentValue(newAnimatedValue);

            if (newAnimatedValue >= value) {
                clearInterval(counter);
            }
        }, 1000 / frameRate);

        return () => clearInterval(counter);
    }, [value]);

    return <span>{Math.round(currentValue)}</span>;
};

const ProgressCircle: React.FC<{ progress: number; size?: number; strokeWidth?: number }> = ({
    progress,
    size = 60,
    strokeWidth = 4
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const getProgressColor = (p: number) => {
        if (p === 100) return 'stroke-green-500';
        if (p >= 70) return 'stroke-blue-500';
        if (p >= 40) return 'stroke-amber-500';
        return 'stroke-red-500';
    };

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    className="stroke-gray-200 dark:stroke-gray-600"
                    fill="transparent"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className={`transition-all duration-1000 ease-out ${getProgressColor(progress)}`}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <AnimatedNumber value={progress} />%
                </span>
            </div>
        </div>
    );
};

export default ProgressCircle; 