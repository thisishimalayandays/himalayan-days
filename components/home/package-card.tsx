'use client';
import { Clock, MapPin, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

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
        rating?: number;
        reviews?: number;
    };
    index?: number;
}

export function PackageCard({ packageData, index = 0 }: PackageCardProps) {
    const rating = packageData.rating || 4.8;
    const reviews = packageData.reviews || 0;

    return (
        <div
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col h-full"
        >
            {/* Image Container */}
            <Link href={`/packages/${packageData.slug}`} className="relative h-64 w-full overflow-hidden shrink-0 block">
                <Image
                    src={packageData.image}
                    alt={packageData.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-primary uppercase tracking-wide shadow-sm z-10">
                    {packageData.category}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
            </Link>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow space-y-4">
                <div className="space-y-2">
                    <Link href={`/packages/${packageData.slug}`} className="block">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{packageData.title}</h3>
                    </Link>
                    <div className="flex items-center gap-1 mb-3">
                        <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(rating) ? "fill-current" : "fill-current opacity-30 text-gray-300"}`} />
                            ))}
                        </div>
                        <span className="text-xs text-gray-500 font-medium ml-1">{rating} ({reviews} reviews)</span>
                    </div>
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
                    {packageData.features.slice(0, 3).map((feature, i) => (
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
                    <div className="flex gap-3">
                        <Link
                            href={`https://wa.me/919103901803?text=${encodeURIComponent(`Hi, I'm interested in the ${packageData.title} package.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                        >
                            <Button variant="outline" className="w-full rounded-full border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all flex items-center justify-center gap-2 hover:[&_img]:brightness-0 hover:[&_img]:invert">
                                <Image
                                    src="/whatsapp_enquiry.png"
                                    alt="WhatsApp"
                                    width={20}
                                    height={20}
                                    className="object-contain"
                                />
                                Enquire
                            </Button>
                        </Link>
                        <Link href={`/packages/${packageData.slug}`} className="flex-1">
                            <Button variant="outline" className="w-full text-primary border-primary/20 hover:bg-primary hover:text-white transition-all rounded-full">
                                View Details
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
