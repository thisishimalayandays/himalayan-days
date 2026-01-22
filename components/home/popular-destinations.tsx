'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';
import { Destination } from '@/lib/data'; // Keep interface or move to types

interface PopularDestinationsProps {
    destinations: Destination[];
}

export function PopularDestinations({ destinations }: PopularDestinationsProps) {
    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <span className="text-primary font-bold tracking-wider uppercase text-sm">Explore Kashmir</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Popular Destinations</h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        Discover the breathtaking valleys and meadows that make Kashmir the "Paradise on Earth".
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {destinations.map((dest, idx) => (
                        <div
                            key={dest.id}
                            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <div className="relative h-64 w-full overflow-hidden">
                                <Image
                                    src={dest.image}
                                    alt={dest.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="text-2xl font-bold mb-1">{dest.name}</h3>
                                    <div className="flex items-center gap-1 text-sm text-yellow-400">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="font-medium">{dest.rating}</span>
                                        <span className="text-white/80">({dest.reviews} reviews)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">
                                    {dest.description}
                                </p>
                                {dest.wikipediaUrl ? (
                                    <a
                                        href={dest.wikipediaUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-primary font-medium text-sm group-hover:underline w-fit"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <MapPin className="w-4 h-4 mr-1" />
                                        Explore {dest.name}
                                    </a>
                                ) : (
                                    <div className="flex items-center text-primary font-medium text-sm group-hover:underline">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        Explore {dest.name}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section >
    );
}
