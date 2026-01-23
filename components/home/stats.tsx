const statistics = [
    { label: "Happy Travelers", value: "1,500+" },
    { label: "Destinations", value: "50+" },
    { label: "Years Experience", value: "12+" },
    { label: "4.9/5 Rating", value: "Google Reviews" }
];
import { motion } from 'framer-motion';

export function StatsSection() {
    return (
        <section className="py-24 bg-gray-950 text-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 text-center">
                    {statistics.map((stat, idx) => (
                        <div
                            key={idx}
                            className="p-4 relative group"
                        >
                            <div className="text-4xl md:text-6xl font-black text-white mb-3 group-hover:text-primary transition-colors duration-300">{stat.value}</div>
                            <div className="text-gray-400 font-medium uppercase tracking-widest text-xs md:text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
