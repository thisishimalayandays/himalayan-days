'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

import { useEffect, useRef } from 'react';

const videos = [
    {
        id: 'vid1',
        src: '/The Ultimate Kashmir Spring Symphony - one.mp4',
        title: 'Spring Blooms & Dal Lake',
        desc: 'Witness the serene beauty of Dal Lake waking up to the Kashmiri spring.'
    },
    {
        id: 'vid2',
        src: '/The Ultimate Kashmir Spring Symphony - 02.mp4',
        title: 'Tulip Garden Symphony',
        desc: "Asia's largest tulip garden in full, breathtaking bloom."
    }
];

function VideoCard({ vid, index }: { vid: any, index: number }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Slight delay to ensure smooth scrolling isn't interrupted by decoding
                    setTimeout(() => {
                        videoRef.current?.play().catch(() => {
                            // Suppress auto-play policy errors cleanly
                        });
                    }, 100);
                } else {
                    videoRef.current?.pause();
                }
            },
            { rootMargin: '250px' } // Preload/play just before entering view
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "100px" }}
            transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
            className="group relative rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 bg-gray-900 aspect-[9/16] max-w-sm mx-auto w-full"
            style={{ transform: 'translateZ(0)' }} // Force GPU acceleration
        >
            <video
                ref={videoRef}
                src={vid.src}
                muted
                loop
                playsInline
                preload="none"
                className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105 will-change-transform"
            />
            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-white font-bold text-xl mb-1">{vid.title}</h3>
                <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {vid.desc}
                </p>
            </div>
        </motion.div>
    );
}

export function SpringVideos() {
    return (
        <section>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-7 rounded-full bg-emerald-500" />
                <h2 className="text-2xl font-bold text-gray-900">Experience the Symphony</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                {videos.map((vid, i) => (
                    <VideoCard key={vid.id} vid={vid} index={i} />
                ))}
            </div>
        </section>
    );
}
