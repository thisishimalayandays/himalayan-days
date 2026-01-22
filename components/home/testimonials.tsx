'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: "Rahul & Priya",
        location: "Mumbai",
        rating: 5,
        text: "Our honeymoon in Kashmir was magical! The houseboat stay arranging by Himalayan Days was the highlight. Everything was seamless.",
        image: "https://images.unsplash.com/photo-1621609764095-232d14cfa327?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "Sarah Williams",
        location: "London, UK",
        rating: 5,
        text: "I was a bit apprehensive about traveling solo, but the team made me feel so safe. Gulmarg skiing instructions were excellent!",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Makeen Family",
        location: "Dubai",
        rating: 5,
        text: "We booked the Family Fun package. The driver was very polite and the hotels were exactly as promised. Kids loved Pahalgam!",
        image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 4,
        name: "Arjun Singh",
        location: "Delhi",
        rating: 4,
        text: "Great experience overall. The food in the houseboat was delicious authentic Kashmiri wazwan. Highly recommended.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 5,
        name: "Anita Desai",
        location: "Bangalore",
        rating: 5,
        text: "It was a dream come true to see the Tulips. Himalayan Days ensured we beat the rush and had a great time. Thank you!",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"
    }
];

export function Testimonials() {
    return (
        <section className="py-20 bg-orange-50/50 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 space-y-4">
                    <span className="text-primary font-medium tracking-wider uppercase text-sm">Guest Stories</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Memories We Helped <span className="text-primary font-serif italic">Create</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Don't just take our word for it. Here is what our travelers say about their journey through paradise.
                    </p>
                </div>

                <div className="relative w-full overflow-hidden">
                    {/* Gradient Masks */}
                    <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-orange-50/50 via-orange-50/50 to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-orange-50/50 via-orange-50/50 to-transparent z-10 pointer-events-none" />

                    {/* Infinite Scroll Track */}
                    <div className="flex">
                        <motion.div
                            className="flex gap-6 py-4"
                            animate={{ x: "-50%" }}
                            transition={{
                                repeat: Infinity,
                                ease: "linear",
                                duration: 25 // Adjust speed here
                            }}
                            style={{ width: "max-content" }}
                        >
                            {[...testimonials, ...testimonials].map((item, idx) => (
                                <div
                                    key={`${item.id}-${idx}`}
                                    className="w-[300px] md:w-[350px] bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex-shrink-0"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < item.rating ? "fill-orange-400 text-orange-400" : "fill-gray-200 text-gray-200"}`}
                                                />
                                            ))}
                                        </div>
                                        <Quote className="w-8 h-8 text-orange-100 fill-orange-50" />
                                    </div>

                                    <p className="text-gray-700 italic mb-6 line-clamp-3 text-sm leading-relaxed">
                                        "{item.text}"
                                    </p>

                                    <div className="flex items-center gap-3">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                                            <p className="text-xs text-gray-500">{item.location}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
