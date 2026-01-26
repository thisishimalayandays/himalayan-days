'use client';
import Image from 'next/image';
import { MapPin, Clock } from 'lucide-react';

interface PackageHeroProps {
    title: string;
    image: string;
    duration: string;
    location: string;
    price: number;
}

import Snowfall from 'react-snowfall';

export function PackageHero({ title, image, duration, location, price }: PackageHeroProps) {
    const isWinter = ['winter', 'snow', 'ski', 'gulmarg', 'frozen'].some(keyword =>
        title.toLowerCase().includes(keyword)
    );

    return (
        <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden flex items-end pb-12 md:pb-24">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover brightness-75"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {isWinter && (
                    <Snowfall
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            zIndex: 10
                        }}
                        snowflakeCount={100}
                        radius={[0.5, 2.0]}
                        speed={[0.5, 1.5]}
                        opacity={[0.4, 0.8]}
                    />
                )}
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

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                        {title}
                    </h1>

                    <div className="flex items-end gap-2">
                        <span className="text-lg md:text-xl text-gray-300 mb-1">Starting from</span>
                        <span className="text-3xl md:text-5xl font-bold text-primary">₹{price.toLocaleString()}</span>
                        <span className="text-sm md:text-base text-gray-400 mb-2">/ person *</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
