'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { TripCustomizationModal } from './trip-customization-modal';
import { AiTripWizard } from './ai-trip-wizard';
import { Sparkles } from 'lucide-react';
import Snowfall from 'react-snowfall';

export function Hero() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAiWizardOpen, setIsAiWizardOpen] = useState(false);

    return (
        <section className="relative h-[100vh] w-full overflow-hidden flex items-center justify-center text-center">
            {/* Background Image - Optimized for Speed */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay */}
                <Image
                    src="/Destinations/Gulmarg.jpeg"
                    alt="Experience Heaven on Earth in Kashmir"
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                    quality={80}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAEAAYDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAr/xAAfEAABAgYDAAAAAAAAAAAAAAABAgMEAAUGEiExQf/EABUBAQEAAAAAAAAAAAAAAAAAAAIH/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECERIxQf/aAAwDAQACEQMRAD8AQ2h1k9s0C26dNa1Y0uRneP/Z"
                />
            </div>

            <Snowfall
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    zIndex: 20
                }}
                snowflakeCount={150}
                radius={[0.5, 2.5]}
                speed={[0.5, 2.0]}
                wind={[-0.5, 1.0]}
                opacity={[0.4, 0.8]}
            />

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
