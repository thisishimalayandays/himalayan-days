'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TripCustomizationModal } from './trip-customization-modal';
import { AiTripWizard } from './ai-trip-wizard';
import { Sparkles } from 'lucide-react';

export function Hero() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAiWizardOpen, setIsAiWizardOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            // Set start time to 3 seconds to skip intro text
            videoRef.current.currentTime = 3;
            videoRef.current.play().catch(error => {
                console.error("Autoplay prevented:", error);
            });
        }
    }, []);

    return (
        <section className="relative h-[100vh] w-full overflow-hidden flex items-center justify-center text-center">
            {/* Video Background – portrait video rotated to landscape via CSS */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden bg-black">
                <div className="absolute inset-0 bg-black/50 z-10" />
                {/*
                  The source video is portrait (9:16).
                  We rotate it -90° (270°) so it displays landscape.
                  width  = 100vh  → becomes visual height after rotation (fills viewport height)
                  height = 100vw  → becomes visual width after rotation (fills viewport width)
                  object-cover crops any excess to fill perfectly.
                */}
                <div
                    className="absolute"
                    style={{
                        top: '50%',
                        left: '50%',
                        /* Added scale(1.4) to zoom in and crop out baked-in black bars */
                        transform: 'translate(-50%, -50%) rotate(270deg) scale(1.4)',
                        width: '100vh',
                        height: '100vw',
                    }}
                >
                    <video
                        ref={videoRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src="/Hero2026kashmir.mp4" type="video/mp4" />
                    </video>
                </div>
            </div>

            {/* Gradient at bottom */}
            <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none" />

            {/* Content */}
            <div className="relative z-20 container px-4 space-y-8 max-w-5xl mx-auto">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-gray-100 border border-white/20 text-sm font-medium tracking-wide uppercase"
                >
                    🌸 Kashmir Spring 2026 — Nature in Full Bloom
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-tight"
                >
                    Paradise <span className="text-primary italic font-serif">Awakens</span> <br />This Spring
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed"
                >
                    Kashmir bursts into colour every spring — from the world-famous Tulip Garden to blooming valleys and shimmering lakes. Let us craft your perfect escape.
                </motion.p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 flex-wrap">
                    <button
                        onClick={() => setIsAiWizardOpen(true)}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 font-bold px-8 text-lg h-14 shadow-2xl shadow-indigo-500/30 hover:scale-105 duration-300 gap-2 border border-white/10"
                    >
                        <Sparkles className="w-5 h-5 animate-pulse" />
                        AI Trip Planner
                    </button>

                    <Link
                        href="/packages"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-orange-600 font-semibold px-8 text-lg h-14 shadow-2xl hover:shadow-orange-500/20 hover:scale-105 duration-300"
                    >
                        Explore Packages
                    </Link>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-white/20 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 text-lg h-14 backdrop-blur-sm hover:scale-105 duration-300"
                    >
                        Plan My Trip
                    </button>
                </div>
            </div>

            <TripCustomizationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <AiTripWizard isOpen={isAiWizardOpen} onClose={() => setIsAiWizardOpen(false)} />
        </section>
    );
}
