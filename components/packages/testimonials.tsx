'use client';

import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const REVIEWS = [
    {
        name: "Rahul & Priya Sharma",
        location: "Mumbai",
        rating: 5,
        text: "We were worried about safety in Kashmir, but the Himalayan Days team made us feel like family. The centrally heated cab was a lifesaver in -4°C! Best honeymoon ever.",
        date: "Jan 2024"
    },
    {
        name: "Dr. Anjali Gupta",
        location: "Delhi",
        rating: 5,
        text: "Everything was premium as promised. No hidden costs. The driver Javed bhai was so polite and helpful with my elderly parents. Highly recommended for families.",
        date: "Dec 2023"
    },
    {
        name: "Vikram Malhotra",
        location: "Bangalore",
        rating: 5,
        text: "I have traveled to Europe, but the hospitality in Kashmir is unmatched. Staying at the houseboat was magical. The team managed the heavy snow situation perfectly.",
        date: "Jan 2024"
    }
];

export function Testimonials() {
    return (
        <section className="bg-gray-50 py-12 rounded-2xl my-8">
            <div className="container mx-auto px-6">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                        <Star className="w-6 h-6 text-yellow-500 fill-current" />
                        What Our Guests Say
                    </h2>
                    <p className="text-gray-500 mt-2">Real experiences from our recent travelers</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {REVIEWS.map((review, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative"
                        >
                            <Quote className="w-8 h-8 text-primary/10 absolute top-4 right-4" />

                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                                ))}
                            </div>

                            <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">
                                "{review.text}"
                            </p>

                            <div className="mt-auto border-t border-gray-100 pt-4">
                                <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs text-gray-500">{review.location}</span>
                                    <span className="text-[10px] text-gray-400 border border-gray-100 px-2 py-0.5 rounded-full">{review.date}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
