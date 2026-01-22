'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TripCustomizationModal } from './trip-customization-modal';

export function Hero() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section className="relative h-[120vh] w-full overflow-hidden flex items-center justify-center text-center">
            {/* Background Image */}
            {/* Background Video */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay */}
                <iframe
                    src="https://www.youtube.com/embed/S5tGX6o84us?autoplay=1&mute=1&controls=0&loop=1&playlist=S5tGX6o84us&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1"
                    className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>

            {/* Content */}
            <div className="relative z-10 container px-4 space-y-8 max-w-5xl mx-auto">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-gray-100 border border-white/20 text-sm font-medium tracking-wide uppercase"
                >
                    Welcome to Himalayan Days
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-tight"
                >
                    Experience <span className="text-primary italic font-serif">Heaven</span> <br /> on Earth
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed"
                >
                    Discover the breathtaking beauty of Kashmir with our curated tour packages. From serene lakes to majestic mountains, we craft memories that last a lifetime.
                </motion.p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
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

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 1, duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/50"
            >
                <div className="flex flex-col items-center gap-2">
                    <span className="text-xs uppercase tracking-widest text-white/60">Scroll</span>
                    <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center pt-1.5">
                        <div className="w-1 h-2 bg-white/70 rounded-full animate-bounce" />
                    </div>
                </div>
            </motion.div>
            <TripCustomizationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </section>
    );
}
