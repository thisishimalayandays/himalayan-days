'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon } from 'lucide-react';

interface PackageGalleryProps {
    images?: string[];
    title: string;
}

export function PackageGallery({ images, title }: PackageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) return null;
    if (images.length === 1) return null;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4000); // Change every 4 seconds
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <section className="mb-12 relative group select-none" id="gallery">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-primary" />
                Tour Gallery
            </h2>

            {/* 
               Compact Slider Container 
               Height is fixed to prevent layout shift and save vertical space.
            */}
            <div
                className="relative w-full h-[300px] md:h-[450px] rounded-2xl overflow-hidden bg-gray-100 shadow-inner"
                onContextMenu={(e) => e.preventDefault()} // Disable Right Click
            >
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex]}
                        alt={`${title} - View ${currentIndex + 1}`}
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none" // pointer-events-none prevents dragging
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }} // Slow, dreamy transition
                        onContextMenu={(e) => e.preventDefault()}
                        draggable={false}
                    />
                </AnimatePresence>

                {/* Optional: Subtle Progress Bar or Dots could go here, but user asked for simple auto slider */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                <div className="absolute bottom-4 right-4 flex gap-1 z-10">
                    {images.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
