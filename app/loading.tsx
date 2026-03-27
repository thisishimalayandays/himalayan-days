'use client';

import { useState, useEffect } from 'react';
import { Compass } from 'lucide-react';

const LOADING_TEXTS = [
    "Preparing your Kashmir experience...",
    "Finding the best views in Gulmarg...",
    "Brewing fresh Kashmiri Kahwa...",
    "Warming up the Shikara...",
    "Just a moment..."
];

export default function Loading() {
    const [textIndex, setTextIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTextIndex((prev) => (prev + 1) % LOADING_TEXTS.length);
        }, 2200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md">
            <div className="relative flex items-center justify-center w-24 h-24 mb-8">
                {/* Pulsing background glow */}
                <div className="absolute inset-2 bg-primary/20 rounded-full animate-ping opacity-75"></div>
                
                {/* Spinning border */}
                <div className="absolute inset-0 border-[3px] border-primary/10 rounded-full"></div>
                <div className="absolute inset-0 border-[3px] border-primary rounded-full border-t-transparent animate-spin" style={{ animationDuration: '1.2s' }}></div>
                
                {/* Center Icon */}
                <Compass className="w-8 h-8 text-primary animate-pulse" />
            </div>

            <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Himalayan Days</h2>
                <div className="h-5 flex items-center justify-center">
                    <p className="text-sm font-medium text-gray-500 animate-pulse transition-opacity duration-300">
                        {LOADING_TEXTS[textIndex]}
                    </p>
                </div>
            </div>
        </div>
    );
}
