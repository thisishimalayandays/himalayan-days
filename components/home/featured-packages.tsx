'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PackageCard } from './package-card';
import { ArrowRight } from 'lucide-react';

const sections = [
    {
        id: "popular",
        title: "Traveler Favorites",
        subtitle: "Most loved experiences by our guests",
        filter: (pkg: any) => pkg.reviews > 100 || pkg.category === 'Bestseller',
        limit: 12
    },
    {
        id: "honeymoon",
        title: "Romantic Getaways",
        subtitle: "Crafted for love, privacy, and unforgettable moments",
        filter: (pkg: any) => pkg.category === 'Honeymoon',
        limit: 12
    },
    {
        id: "adventure",
        title: "Adventure & Thrills",
        subtitle: "Trekking, Cycling, Camping and more for the adrenaline seekers",
        filter: (pkg: any) => pkg.category === 'Adventure',
        limit: 12
    },
    {
        id: "offbeat",
        title: "Hidden Gems & Culture",
        subtitle: "Explore the unexplored and rich heritage of Kashmir",
        filter: (pkg: any) => ['Offbeat', 'Culture', 'Religious'].includes(pkg.category),
        limit: 12
    }
];

export function FeaturedPackages({ packages }: { packages: any[] }) {
    // Seasonal score: positively uprank Spring/Summer, downrank Winter
    const getSeasonScore = (pkg: any) => {
        const text = (pkg.title + ' ' + pkg.category + ' ' + (pkg.overview || '')).toLowerCase();
        
        // High priority for current active season (Spring/Summer)
        if (['spring', 'summer', 'tulip', 'bloom', 'garden', 'shikara', 'dal lake', 'meadow', 'symphony'].some(k => text.includes(k))) return 2;
        
        // Low priority for off-season (Winter)
        if (['winter', 'snow', 'ski', 'gondola', 'frozen', 'snowfall', 'december', 'january', 'february'].some(k => text.includes(k))) return -1;
        
        // Default priority
        return 1;
    };

    return (
        <div id="packages" className="py-20 space-y-24 bg-gray-50/30">
            {sections.map((section) => {
                let filteredPackages = packages.filter(section.filter);

                // Sort ALL sections to prioritize Spring/Summer over Winter packages
                filteredPackages.sort((a, b) => getSeasonScore(b) - getSeasonScore(a));

                filteredPackages = filteredPackages.slice(0, section.limit);

                if (filteredPackages.length === 0) return null;

                return (
                    <section key={section.id} className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                            <div className="space-y-2 max-w-2xl">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                                    {section.title}
                                </h2>
                                <p className="text-gray-600 text-lg">
                                    {section.subtitle}
                                </p>
                            </div>
                            <Link href={`/packages?category=${section.id === 'popular' ? '' : section.id}`} className="hidden md:block">
                                <Button variant="outline" className="rounded-full border-primary/20 hover:bg-primary hover:text-white transition-colors">
                                    View All {section.id !== 'popular' ? section.title : 'Packages'}
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {filteredPackages.map((pkg, index) => (
                                <PackageCard key={pkg.id} packageData={pkg} index={index} />
                            ))}
                        </div>

                        <div className="mt-12 md:hidden text-center">
                            <Link href={`/packages?category=${section.id === 'popular' ? '' : section.id}`} className="block w-full">
                                <Button variant="outline" className="w-full rounded-full">
                                    View All {section.id !== 'popular' ? section.title : 'Packages'}
                                </Button>
                            </Link>
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
