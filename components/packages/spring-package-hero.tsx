'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, Users, ChevronDown } from 'lucide-react';

interface SpringPackageHeroProps {
    title: string;
    image: string;
    duration: string;
    location: string;
    price: number;
    priceRange?: string;
    rating?: number;
    reviews?: number;
}

export function SpringPackageHero({ title, image, duration, location, price, priceRange, rating = 4.9, reviews = 128 }: SpringPackageHeroProps) {
    return (
        <section className="relative h-[92vh] w-full overflow-hidden flex items-end">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority
                    quality={90}
                />
                {/* Multi-layer gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/10" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
            </div>

            {/* Floating Spring badge */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute top-28 left-6 md:left-12 z-20"
            >
                <span className="inline-flex items-center gap-2 bg-emerald-500/90 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-emerald-500/30 border border-emerald-400/20">
                    🌸 Spring Special 2026
                </span>
            </motion.div>

            {/* Bestseller badge */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute top-28 right-6 md:right-12 z-20"
            >
                <span className="inline-flex items-center gap-1.5 bg-amber-500/90 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full border border-amber-400/30">
                    🏆 Best Seller
                </span>
            </motion.div>

            {/* Content */}
            <div className="relative z-10 w-full pb-14 md:pb-20 px-6 md:px-12 lg:px-20">
                <div className="max-w-5xl space-y-5">

                    {/* Stats row */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap items-center gap-3 text-sm"
                    >
                        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-white">
                            <Clock className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-white">
                            <MapPin className="w-3.5 h-3.5 text-rose-400" />
                            <span>{location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-white">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-bold text-amber-400">{rating}</span>
                            <span className="text-white/60">({reviews} reviews)</span>
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight"
                    >
                        {title}
                    </motion.h1>

                    {/* Price */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-end gap-4 flex-wrap"
                    >
                        <div>
                            <p className="text-white/60 text-sm mb-0.5">Starting from</p>
                            <p className="text-4xl md:text-5xl font-black text-emerald-400">
                                {priceRange ? (
                                    <>₹{priceRange.replace(/₹/g, '').split('-')[0]?.trim()}</>
                                ) : (
                                    <>₹{price.toLocaleString()}</>
                                )}
                                <span className="text-base text-white/60 font-normal ml-1">/ person</span>
                            </p>
                        </div>

                        {/* Live viewer badge */}
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                            </span>
                            <span className="text-sm text-white"><strong className="text-red-400">16 people</strong> are viewing this right now</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll cue */}
            <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white/40"
            >
                <ChevronDown className="w-6 h-6" />
            </motion.div>
        </section>
    );
}
