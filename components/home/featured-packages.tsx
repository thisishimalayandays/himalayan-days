'use client';
import { useState } from 'react';
import { PackageCard } from './package-card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';


const categories = ["All", "Honeymoon", "Family", "Adventure", "Luxury"];

export function FeaturedPackages({ packages }: { packages: any[] }) {
    const [activeTab, setActiveTab] = useState("All");

    const filteredPackages = activeTab === "All"
        ? packages
        : packages.filter(pkg => pkg.category === activeTab || (activeTab === "Luxury" && pkg.startingPrice > 20000));

    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <span className="text-primary font-bold tracking-wider uppercase text-sm bg-orange-50 px-4 py-1.5 rounded-full border border-orange-100">Handpicked Collections</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Trending Tour Packages</h2>
                    <p className="text-gray-600 text-lg leading-relaxed">Choose from our most popular Kashmir holiday packages, customized for your perfect vacation.</p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={cn(
                                "px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 border",
                                activeTab === cat
                                    ? "bg-primary text-white border-primary shadow-lg shadow-orange-500/25 scale-105 transform"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPackages.map((pkg, index) => (
                        <PackageCard key={pkg.id} packageData={pkg} index={index} />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Button size="lg" variant="outline" className="px-10 py-6 text-lg border-gray-300 hover:bg-gray-50 text-gray-700 rounded-full hover:border-primary hover:text-primary transition-all duration-300">
                        View All Packages
                    </Button>
                </div>
            </div>
        </section>
    );
}
