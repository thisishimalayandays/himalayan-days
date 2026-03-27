'use client';

import { motion } from 'framer-motion';

interface Feature {
    emoji: string;
    label: string;
    sub: string;
}

const defaultFeatures: Feature[] = [
    { emoji: '🌸', label: 'Tulip Festival', sub: "Asia's biggest bloom" },
    { emoji: '🛶', label: 'Shikara Ride', sub: 'Romantic Dal Lake cruise' },
    { emoji: '🎿', label: 'Gulmarg Gondola', sub: 'Himalayan cable car' },
    { emoji: '🏡', label: 'Houseboat Stay', sub: 'Premium lakeside retreat' },
    { emoji: '🌿', label: 'Pahalgam Valley', sub: 'Pristine pine meadows' },
    { emoji: '🍛', label: 'MAP Meal Plan', sub: 'Breakfast & Dinner daily' },
];

export function SpringFeatureStrip({ features }: { features?: string[] }) {
    // Use custom features from DB if available, otherwise use defaults
    const displayFeatures = features && features.length > 0
        ? features.map((f, i) => {
            const emojis = ['🌸', '🛶', '🎿', '🏡', '🌿', '🍛'];
            const subs = ['Included in package', 'Premium experience', 'Unforgettable moment', 'Luxury accommodation', "Nature's finest", 'Daily included'];
            return { emoji: emojis[i] || '✨', label: f, sub: subs[i] || 'Included' };
        })
        : defaultFeatures;

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-emerald-200 to-transparent" />
                <span className="text-sm font-bold text-emerald-700 uppercase tracking-widest">Package Highlights</span>
                <div className="h-px flex-1 bg-gradient-to-l from-emerald-200 to-transparent" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {displayFeatures.map((f, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06 }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition-all cursor-default group"
                    >
                        <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{f.emoji}</div>
                        <p className="text-sm font-bold text-gray-800 leading-snug">{f.label}</p>
                        <p className="text-xs text-gray-400 mt-1 leading-snug">{f.sub}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
