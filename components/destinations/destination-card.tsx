'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import type { Destination } from '@/lib/data';

interface DestinationCardProps {
    destination: Destination;
    index: number;
}

export function DestinationCard({ destination, index }: DestinationCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative h-[400px] w-full overflow-hidden rounded-3xl cursor-pointer"
        >
            <Link href={`/packages?category=${destination.slug}`} className="block h-full w-full">
                {/* Image */}
                <div className="absolute inset-0">
                    <Image
                        src={destination.image}
                        alt={destination.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10">
                    <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                        <div className="flex items-center gap-2 text-orange-400 mb-2">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-sm font-medium">{destination.rating} ({destination.reviews})</span>
                        </div>

                        <h3 className="text-3xl font-bold mb-2">{destination.name}</h3>
                        <p className="text-gray-200 line-clamp-2 mb-4 text-sm opacity-90">
                            {destination.description}
                        </p>

                        <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                            Explore Packages <ArrowRight className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
