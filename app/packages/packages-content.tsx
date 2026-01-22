'use client';
import { useState } from 'react';
import { PackageCard } from '@/components/home/package-card';
import { PageHeader } from '@/components/layout/page-header';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';

// Define interface locally or import from types if available
interface Package {
    id: string;
    slug: string;
    title: string;
    duration: string;
    startingPrice: number;
    image: string;
    gallery: string[];
    category: string;
    location: string;
    features: string[];
    overview: string;
    itinerary: { day: number; title: string; desc: string }[];
    inclusions: string[];
    exclusions: string[];
}

const categories = ["All", "Family", "Honeymoon", "Adventure", "Luxury", "Bestseller"];
const locations = ["Srinagar", "Gulmarg", "Pahalgam", "Sonmarg", "Gurez"];

export function PackagesContent({ packages }: { packages: Package[] }) {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category') || "All";
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

    // Filter Logic
    const filteredPackages = packages.filter(pkg => {
        const matchesCategory = selectedCategory === "All" || pkg.category === selectedCategory || (selectedCategory === "Bestseller" && pkg.category === "Bestseller");

        const matchesLocation = selectedLocations.length === 0 || selectedLocations.some(loc => pkg.location.includes(loc));

        return matchesCategory && matchesLocation;
    });

    const toggleLocation = (loc: string) => {
        setSelectedLocations(prev =>
            prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]
        );
    };

    return (
        <main className="min-h-screen bg-gray-50 font-sans">
            <div className="bg-black/90"><Header /></div>

            <PageHeader
                title="Our Tour Packages"
                description="Explore our wide range of curated Kashmir holiday packages designed for every traveler."
                image="https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=2070&auto=format&fit=crop"
            />

            <div className="container mx-auto px-4 py-16">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filter */}
                    <aside className="lg:w-1/4 space-y-8 h-fit lg:sticky lg:top-24">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                            <div>
                                <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
                                <div className="space-y-2">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={cn(
                                                "w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between",
                                                selectedCategory === cat ? "bg-primary/10 text-primary font-medium" : "text-gray-600 hover:bg-gray-50"
                                            )}
                                        >
                                            {cat}
                                            {selectedCategory === cat && <Check className="w-4 h-4" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="font-bold text-gray-900 mb-4">Destinations</h3>
                                <div className="space-y-3">
                                    {locations.map(loc => (
                                        <label key={loc} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={cn(
                                                "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                                selectedLocations.includes(loc) ? "bg-primary border-primary" : "border-gray-300 group-hover:border-primary"
                                            )}>
                                                {selectedLocations.includes(loc) && <Check className="w-3.5 h-3.5 text-white" />}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={selectedLocations.includes(loc)}
                                                onChange={() => toggleLocation(loc)}
                                            />
                                            <span className={cn("text-sm", selectedLocations.includes(loc) ? "text-gray-900 font-medium" : "text-gray-600")}>{loc}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full text-sm"
                                onClick={() => {
                                    setSelectedCategory("All");
                                    setSelectedLocations([]);
                                }}
                            >
                                Reset Filters
                            </Button>
                        </div>
                    </aside>

                    {/* Results Grid */}
                    <div className="lg:w-3/4">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">
                                Showing {filteredPackages.length} Packages
                            </h2>
                        </div>

                        {filteredPackages.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {filteredPackages.map((pkg, index) => (
                                    <PackageCard key={pkg.id} packageData={pkg} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white rounded-xl border border-dashed border-gray-200">
                                <p className="text-gray-500 text-lg">No packages match your criteria.</p>
                                <Button
                                    variant="link"
                                    className="text-primary mt-2"
                                    onClick={() => {
                                        setSelectedCategory("All");
                                        setSelectedLocations([]);
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
