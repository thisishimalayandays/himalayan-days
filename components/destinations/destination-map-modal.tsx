'use client';

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Tent, Mountain, Camera } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

interface DestinationMapModalProps {
    isOpen: boolean;
    onClose: () => void;
    destinationName: string;
}

// Mock data for Aru Valley "Treasure Hunt" points
const TREASURE_POINTS = [
    { id: 1, x: 20, y: 60, title: "Base Camp", icon: Tent, delay: 0.5 },
    { id: 2, x: 45, y: 45, title: "Lidder River", icon: Camera, delay: 1.2 },
    { id: 3, x: 75, y: 30, title: "Green Meadows", icon: Mountain, delay: 1.9 },
    { id: 4, x: 60, y: 80, title: "Pony Point", icon: MapPin, delay: 2.6 },
];

export function DestinationMapModal({ isOpen, onClose, destinationName }: DestinationMapModalProps) {
    const [activePoint, setActivePoint] = useState<number | null>(null);

    // Only show for Aru Valley for now as requested
    if (destinationName !== "Aru Valley") return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-transparent border-none shadow-none sm:rounded-3xl">
                <div className="relative aspect-video w-full bg-[#E6F3E6] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">

                    {/* Map Background */}
                    <Image
                        src="/aru_valley_treasure_map.png" // We will move the generated image here
                        alt="Aru Valley Treasure Map"
                        fill
                        className="object-cover"
                    />

                    {/* Overlay Gradient for readability */}
                    <div className="absolute inset-0 bg-black/10 pointer-events-none" />

                    {/* Animated Path (SVG Layer) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                        <motion.path
                            d="M 180 350 Q 300 300 400 280 T 650 200 T 550 450" // Approximate path connecting points
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="4"
                            strokeDasharray="10 10"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
                        />
                    </svg>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-50 p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-800" />
                    </button>

                    {/* Title */}
                    <div className="absolute top-6 left-6 z-20">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-full shadow-lg border-2 border-[#8B5CF6]/20"
                        >
                            <h2 className="text-xl font-bold text-[#5B21B6] flex items-center gap-2">
                                <span className="text-2xl">🗺️</span> Explore Aru Valley
                            </h2>
                        </motion.div>
                    </div>

                    {/* Treasure Points */}
                    {TREASURE_POINTS.map((point) => (
                        <motion.div
                            key={point.id}
                            className="absolute z-20 cursor-pointer group"
                            style={{ left: `${point.x}%`, top: `${point.y}%` }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: point.delay, type: "spring" }}
                            onClick={() => setActivePoint(point.id)}
                        >
                            {/* Pulse Effect */}
                            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-50" />

                            {/* Icon Marker */}
                            <div className={`relative w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border-2 transition-colors ${activePoint === point.id ? 'border-orange-500 text-orange-500' : 'border-[#8B5CF6] text-[#8B5CF6]'}`}>
                                <point.icon className="w-5 h-5" />
                            </div>

                            {/* Tooltip */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: point.delay + 0.3 }}
                                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white/95 px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap text-xs font-bold text-gray-700 pointer-events-none"
                            >
                                {point.title}
                            </motion.div>
                        </motion.div>
                    ))}

                    {/* Info Card (Bottom Left) */}
                    <AnimatePresence>
                        {activePoint && (
                            <motion.div
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 100, opacity: 0 }}
                                className="absolute bottom-6 left-6 right-6 md:right-auto md:w-80 bg-white/95 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-white/40 z-30"
                            >
                                <h3 className="font-bold text-lg text-gray-800 mb-1">
                                    {TREASURE_POINTS.find(p => p.id === activePoint)?.title}
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Discover the hidden gems of this location. Perfect for photography and peaceful nature walks.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
}
