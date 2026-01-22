'use client';
import { Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface PackageCardProps {
    packageData: {
        id: string;
        slug: string;
        title: string;
        duration: string;
        startingPrice: number;
        image: string;
        category: string;
        location: string;
        features: string[];
    };
    index?: number;
}

export function PackageCard({ packageData, index = 0 }: PackageCardProps) {
    return (
        <div
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col h-full"
        >
            {/* Image Container */}
            <Link href={`/packages/${packageData.slug}`} className="relative h-64 w-full overflow-hidden shrink-0 block">
                <img
                    src={packageData.image}
                    alt={packageData.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-primary uppercase tracking-wide shadow-sm">
                    {packageData.category}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow space-y-4">
                <div className="space-y-2">
                    <Link href={`/packages/${packageData.slug}`} className="block">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{packageData.title}</h3>
                    </Link>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-primary" />
                            {packageData.duration}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="truncate max-w-[100px]">{packageData.location}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-dashed border-gray-100 flex-grow">
                    {packageData.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                            {feature}
                        </div>
                    ))}
                </div>

                <div className="pt-4 flex items-center justify-between mt-auto">
                    <div>
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block mb-0.5">Starting from</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-primary">₹{packageData.startingPrice.toLocaleString()}</span>
                            <span className="text-xs text-gray-400">/ person</span>
                        </div>
                    </div>
                    <Link href={`/packages/${packageData.slug}`}>
                        <Button variant="outline" className="text-primary border-primary/20 hover:bg-primary hover:text-white transition-all rounded-full px-6">
                            View Details
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
