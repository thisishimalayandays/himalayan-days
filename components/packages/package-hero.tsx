'use client';

import Image from 'next/image';
import { MapPin, Clock } from 'lucide-react';
import { SnowEffect } from '@/components/ui/snow-effect';
import { useState, useEffect } from 'react';

interface PackageHeroProps {
    title: string;
    image: string;
    duration: string;
    location: string;
    price: number;
    priceRange?: string;
    isHighDemand?: boolean; // New prop
}

export function PackageHero({ title, image, duration, location, price, priceRange, isHighDemand }: PackageHeroProps) {
    const isWinter = ['winter', 'snow', 'ski', 'gulmarg', 'frozen'].some(keyword =>
        title.toLowerCase().includes(keyword)
    );

    const [viewerCount, setViewerCount] = useState(14);

    useEffect(() => {
        if (!isHighDemand) return;

        // Randomize count every few seconds
        const interval = setInterval(() => {
            // Random number between 12 and 19
            const newCount = Math.floor(Math.random() * (19 - 12 + 1)) + 12;
            setViewerCount(newCount);
        }, 3500); // 3.5 seconds

        return () => clearInterval(interval);
    }, [isHighDemand]);

    return (
        <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden flex items-end pb-12 md:pb-24">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 100vw"
                    className="object-cover brightness-75"
                    priority
                    quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {isWinter && <SnowEffect />}
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 relative z-10 text-white">
                <div className="max-w-4xl space-y-4 md:space-y-6">
                    <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-medium text-white/90">
                        <span className="bg-primary px-3 py-1 rounded-full text-white">Best Seller</span>
                        <div className="flex items-center gap-1.5 backdrop-blur-md bg-white/10 px-3 py-1 rounded-full border border-white/20">
                            <Clock className="w-4 h-4" /> {duration}
                        </div>
                        <div className="flex items-center gap-1.5 backdrop-blur-md bg-white/10 px-3 py-1 rounded-full border border-white/20">
                            <MapPin className="w-4 h-4" /> {location}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            {title}
                        </h1>

                        {isHighDemand && (
                            <div className="inline-flex items-center gap-2 bg-white/95 border border-red-200 shadow-lg shadow-red-500/10 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                                </span>
                                <span className="text-sm font-bold text-gray-800">
                                    <strong className="text-red-600 tabular-nums">{viewerCount} people</strong> are planning this trip right now
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-baseline gap-2 text-white/90">
                        <span className="text-lg md:text-xl font-light">Starting from</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl md:text-5xl font-bold text-orange-500">
                                ₹18,000 <span className="text-white">-</span> ₹20,500
                            </span>
                            <span className="text-sm md:text-base opacity-80">/ person *</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
