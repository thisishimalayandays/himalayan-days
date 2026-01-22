'use client';

import { ShieldCheck, PhoneCall, Wallet, Sliders, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureConfig {
    icon: LucideIcon;
    title: string;
    description: string;
    color: string;
}

const features: FeatureConfig[] = [
    {
        icon: ShieldCheck,
        title: "Verified Local Experts",
        description: "Guided by locals who know every hidden gem and story of the valley.",
        color: "text-blue-600 bg-blue-50"
    },
    {
        icon: PhoneCall,
        title: "24/7 On-Ground Support",
        description: "We are always just a call away to ensure a seamless experience.",
        color: "text-green-600 bg-green-50"
    },
    {
        icon: Wallet,
        title: "Best Price Guarantee",
        description: "Premium experiences at honest, transparent and unbeatable prices.",
        color: "text-orange-600 bg-orange-50"
    },
    {
        icon: Sliders,
        title: "100% Customized Trips",
        description: "Your trip, your way. We tailor every detail to fit your preferences.",
        color: "text-purple-600 bg-purple-50"
    }
];

export function WhyChooseUs() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                    <span className="text-primary font-bold tracking-wider uppercase text-sm">Why Choose Himalayan Days</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Your Trusted Travel Partner</h2>
                    <p className="text-gray-600">
                        We don't just book trips; we craft unforgettable memories with our deep local expertise and commitment to quality.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={feature.title}
                            className="p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${feature.color}`}>
                                <feature.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
