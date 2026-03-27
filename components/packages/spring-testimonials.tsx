'use client';

import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const REVIEWS = [
    {
        name: "Aarti & Dinesh Patel",
        location: "Ahmedabad",
        rating: 5,
        text: "Visiting the Tulip Garden in full bloom was a dream come true! The colors were mesmerizing, and our kids loved the Shikara ride on Dal Lake in the pleasant spring weather.",
        date: "April 2025"
    },
    {
        name: "Neha & Rohan Mehra",
        location: "Pune",
        rating: 5,
        text: "Kashmir in spring is literally heaven! The valleys of Pahalgam were incredibly green. The Himalayan Days team perfectly timed everything so we could see the vibrant mustard fields too.",
        date: "May 2025"
    },
    {
        name: "Karan Singhania",
        location: "Delhi",
        rating: 5,
        text: "Top-notch hospitality! We escaped the Delhi heat for the cool, breezy Kashmir spring. The houseboat stay was so tranquil, waking up to the sound of chirping birds on the lake.",
        date: "April 2025"
    }
];

export function SpringTestimonials() {
    return (
        <section className="bg-emerald-50/50 py-12 rounded-2xl my-8">
            <div className="container mx-auto px-6">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                        <Star className="w-6 h-6 text-emerald-500 fill-current" />
                        Spring Travelers' Tales
                    </h2>
                    <p className="text-gray-500 mt-2">Real spring stories from our recent guests</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {REVIEWS.map((review, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 relative"
                        >
                            <Quote className="w-8 h-8 text-emerald-500/10 absolute top-4 right-4" />

                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-emerald-500 fill-current" />
                                ))}
                            </div>

                            <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">
                                "{review.text}"
                            </p>

                            <div className="mt-auto border-t border-gray-100 pt-4">
                                <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs text-gray-500">{review.location}</span>
                                    <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">{review.date}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
