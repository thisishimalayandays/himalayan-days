'use client';
import { motion } from 'framer-motion';
import { Circle, MapPin } from 'lucide-react';

interface ItineraryProps {
    days: { day: number; title: string; desc: string }[];
}

export function ItineraryTimeline({ days }: ItineraryProps) {
    return (
        <div className="relative border-l-2 border-primary/20 ml-3 md:ml-6 space-y-12 py-4">
            {days.map((day, index) => (
                <div
                    key={index}
                    className="relative pl-8 md:pl-12"
                >
                    {/* Dot */}
                    <div className="absolute -left-[9px] top-0 bg-white border-4 border-primary rounded-full w-4 h-4" />

                    {/* Content */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-md text-sm">Day {day.day}</span>
                            <h3 className="text-xl font-bold text-gray-900">{day.title}</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed border-l-2 border-gray-100 pl-4 py-2 bg-gray-50/50 rounded-r-lg">
                            {day.desc}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}
