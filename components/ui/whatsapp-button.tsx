'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import * as analytics from '@/lib/analytics';
import { X } from 'lucide-react';

export function WhatsAppButton() {
    const pathname = usePathname();
    const phoneNumber = '919103901803';
    const message = 'Hello! I am interested in planning a memorable trip to Kashmir with Himalayan Days. Could you please assist me with packages and details?';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        // Show tooltip after 5 seconds
        const timer = setTimeout(() => setShowTooltip(true), 5000);
        return () => clearTimeout(timer);
    }, []);

    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-end justify-end gap-3 pointer-events-none">
            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="bg-white text-gray-800 p-4 rounded-2xl shadow-xl flex flex-col gap-2 relative max-w-[220px] pointer-events-auto mr-2 mb-2 origin-bottom-right"
                    >
                        <div className="flex justify-between items-start gap-2">
                            <div className="text-sm font-semibold leading-tight">
                                👋 Planning a trip?
                            </div>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowTooltip(false);
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Chat with our local experts for customized packages and best deals!
                        </p>

                        {/* Arrow pointing to button */}
                        <div className="absolute -right-2 bottom-6 w-4 h-4 bg-white transform rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analytics.event('Contact', { content_name: 'WhatsApp Button' })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center justify-center pointer-events-auto group"
                aria-label="Chat on WhatsApp"
            >
                {/* Glowing Effect */}
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl group-hover:bg-green-500/30 transition-colors" />

                <div className="relative w-12 h-12 md:w-14 md:h-14 transition-all duration-300 drop-shadow-lg hover:drop-shadow-xl">
                    <Image
                        src="/whatsappicon.png"
                        alt="WhatsApp"
                        fill
                        sizes="56px"
                        className="object-contain"
                    />
                </div>

                {/* Notification Badge */}
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-bounce">
                    1
                </span>
            </motion.a>
        </div>
    );
}
