'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
    {
        question: "What is the best time to visit Kashmir?",
        answer: "Kashmir is a year-round destination. April to October is perfect for pleasant weather and sightseeing. December to March is ideal for snow lovers and winter sports in Gulmarg."
    },
    {
        question: "Is it safe to travel to Kashmir?",
        answer: "Yes, Kashmir is very safe for tourists. Thousands of travelers visit every day. We ensure your stay is in safe, tourist-friendly zones and provide 24/7 support throughout your trip."
    },
    {
        question: "Do you include flights in your packages?",
        answer: "Our standard packages exclude flights to give you flexibility. However, we can book flights for you upon request at the best available market rates."
    },
    {
        question: "Can we customize the tour itinerary?",
        answer: "Absolutely! All our packages are 100% customizable. You can add or remove days, change hotels, or include specific activities based on your preferences."
    },
    {
        question: "What documents are required for the trip?",
        answer: "Indian citizens need a valid photo ID (Aadhar/Voter ID/Driving License). Foreign nationals need a valid Passport and Visa. Permits for certain border areas are arranged by us."
    }
];

export function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <span className="text-primary font-bold tracking-wider uppercase text-sm">Common Queries</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
                    <p className="text-gray-600">Everything you need to know before your trip to paradise.</p>
                </div>

                {/* Accordion */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={cn(
                                "border rounded-xl transition-all duration-300 overflow-hidden",
                                openIndex === index ? "border-primary/20 bg-orange-50/30 ring-1 ring-primary/20" : "border-gray-200 hover:border-gray-300"
                            )}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className={cn("font-semibold text-lg", openIndex === index ? "text-primary" : "text-gray-800")}>
                                    {faq.question}
                                </span>
                                <span className={cn("p-2 rounded-full transition-colors", openIndex === index ? "bg-primary text-white" : "bg-gray-100 text-gray-500")}>
                                    {openIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                </span>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
