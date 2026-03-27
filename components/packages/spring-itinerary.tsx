'use client';

import { motion } from 'framer-motion';
import { Star, Utensils, Car, Hotel, Mountain, Sunrise, Sunset, Leaf } from 'lucide-react';

interface Day {
    day: number;
    title: string;
    desc: string;
}

const dayIcons = [Sunrise, Mountain, Star, Leaf, Leaf, Sunset];
const dayThemes = [
    { color: 'from-rose-500 to-orange-400', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' },
    { color: 'from-emerald-500 to-teal-400', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
    { color: 'from-violet-500 to-purple-400', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700' },
    { color: 'from-amber-500 to-yellow-400', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
    { color: 'from-sky-500 to-cyan-400', bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-700' },
    { color: 'from-pink-500 to-rose-400', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700' },
];

const dayAmenities = [
    ['🏡 Houseboat Stay', '🛶 Shikara Ride', '🍛 Dinner Included'],
    ['🌸 Tulip Garden', '🏛️ Mughal Gardens', '🍛 Dinner Included'],
    ['🎿 Gulmarg Gondola', '❄️ Snow Activities', '🍛 Dinner Included'],
    ['🏔️ Scenic Drive', '🌊 Lidder River', '🍛 Dinner Included'],
    ['🌿 Betaab Valley', '🐴 Pony Ride Option', '🍛 Dinner Included'],
    ['✈️ Airport Drop', '📸 Final Memories', ''],
];

export function SpringItinerary({ days }: { days: Day[] }) {
    return (
        <div className="space-y-6">
            {days.map((day, index) => {
                const theme = dayThemes[index % dayThemes.length];
                const DayIcon = dayIcons[index % dayIcons.length];

                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.07 }}
                        className={`rounded-2xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ${theme.border}`}
                    >
                        {/* Header */}
                        <div className={`w-full text-left flex items-center gap-4 p-5 ${theme.bg} border-b ${theme.border}`}>
                            {/* Day number bubble */}
                            <div className={`bg-gradient-to-br ${theme.color} text-white rounded-xl w-14 h-14 flex flex-col items-center justify-center shrink-0 shadow-md`}>
                                <span className="text-[10px] font-semibold uppercase opacity-80">Day</span>
                                <span className="text-xl font-black leading-tight">{day.day}</span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <DayIcon className={`w-4 h-4 ${theme.text}`} />
                                    <span className={`text-xs font-bold uppercase tracking-wide ${theme.text}`}>
                                        {index === 0 ? 'Arrival Day' : index === days.length - 1 ? 'Departure' : 'Exploration'}
                                    </span>
                                </div>
                                <h3 className="text-base md:text-lg font-bold text-gray-900">{day.title}</h3>
                            </div>
                        </div>

                        {/* Body (Always open) */}
                        <div className="p-5 space-y-4">
                            <p className="text-gray-600 leading-relaxed text-sm md:text-base">{day.desc}</p>

                            {dayAmenities[index] && (
                                <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                                    {dayAmenities[index].filter(Boolean).map((amenity, i) => (
                                        <span key={i} className={`text-xs px-3 py-1.5 rounded-full font-medium ${theme.bg} ${theme.text} border ${theme.border}`}>
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
