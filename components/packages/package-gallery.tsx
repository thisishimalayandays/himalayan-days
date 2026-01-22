'use client';

import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';

interface PackageGalleryProps {
    images?: string[];
    title: string;
}

export function PackageGallery({ images, title }: PackageGalleryProps) {
    if (!images || images.length === 0) return null;

    // If only 1 image (or none), we likely showed it in the hero, so we can hide this section
    // OR we can decide to show it if it's explicitly passed.
    // Given the requirement "for homepage one image is sufficient but for tour details, let there be gallery",
    // and the data migration strategy where we might not populate gallery for everyone yet,
    // let's safe guard:
    if (images.length === 1) return null;

    return (
        <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-primary" />
                Tour Gallery
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className={`relative rounded-2xl overflow-hidden shadow-sm group h-64 ${index === 0 ? 'md:col-span-2 md:h-full' : ''
                            }`}
                    >
                        <img
                            src={img}
                            alt={`${title} - Image ${index + 1}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-300" />
                    </div>
                ))}
            </div>
        </section>
    );
}
