import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PackageHero } from '@/components/packages/package-hero';
import { PackageGallery } from '@/components/packages/package-gallery';
import { ItineraryTimeline } from '@/components/packages/itinerary';
import { BookingForm } from '@/components/packages/booking-form';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Check, X } from 'lucide-react';
import { SimilarPackages } from "@/components/packages/similar-packages";
import { TrustBadges } from '@/components/packages/trust-badges';
import { WinterFAQ } from '@/components/packages/winter-faq';
import { MobileBookingBar } from '@/components/packages/mobile-booking-bar';

// generateStaticParams removed to allow build on empty database

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const pkg = await prisma.package.findUnique({
        where: { slug: resolvedParams.slug }
    });

    if (!pkg) {
        return {
            title: 'Package Not Found',
        };
    }

    return {
        title: pkg.title,
        description: pkg.overview.slice(0, 160),
        openGraph: {
            title: pkg.title,
            description: pkg.overview.slice(0, 160),
            images: [pkg.image],
        },
    };
}

export default async function PackagePage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const pkgRaw = await prisma.package.findUnique({
        where: { slug: resolvedParams.slug }
    });

    if (!pkgRaw) {
        return notFound();
    }

    // Parse JSON fields
    const pkg = {
        ...pkgRaw,
        gallery: JSON.parse(pkgRaw.gallery) as string[],
        features: JSON.parse(pkgRaw.features) as string[],
        itinerary: JSON.parse(pkgRaw.itinerary) as { day: number; title: string; desc: string }[],
        inclusions: JSON.parse(pkgRaw.inclusions) as string[],
        exclusions: JSON.parse(pkgRaw.exclusions) as string[],
        priceRange: (pkgRaw as any).priceRange as string | null // Explicit cast to avoid type error if client out of sync
    };

    return (
        <main className="min-h-screen font-sans bg-white">
            <div className="bg-black/80"><Header /></div> {/* Dark header for contrast */}

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        "name": pkg.title,
                        "description": pkg.overview,
                        "image": pkg.image,
                        "offers": {
                            "@type": "Offer",
                            "priceCurrency": "INR",
                            "price": pkg.startingPrice,
                            "availability": "https://schema.org/InStock"
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "reviewCount": "150"
                        }
                    })
                }}
            />

            <PackageHero
                title={pkg.title}
                image={pkg.image}
                duration={pkg.duration}
                location={pkg.location}
                price={pkg.startingPrice}
                priceRange={pkg.priceRange || undefined}
            />

            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">


                        {/* Trust Badges */}
                        {pkg.title.toLowerCase().includes('winter') && (
                            <TrustBadges />
                        )}

                        {/* Overview */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Overview</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">{pkg.overview}</p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                                {pkg.features.map((feature, i) => (
                                    <div key={i} className="bg-orange-50 text-orange-800 px-4 py-2 rounded-lg text-sm font-medium border border-orange-100 text-center">
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Gallery */}
                        <PackageGallery images={pkg.gallery} title={pkg.title} />

                        {/* Itinerary */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Itinerary</h2>
                            <ItineraryTimeline days={pkg.itinerary} />
                        </section>

                        {/* Winter FAQ */}
                        {pkg.title.toLowerCase().includes('winter') && (
                            <WinterFAQ />
                        )}

                        {/* Inclusions & Exclusions */}
                        <section className="grid md:grid-cols-2 gap-8 p-8 bg-gray-50 rounded-2xl">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-green-500 rounded-full" /> Inclusions
                                </h3>
                                <ul className="space-y-3">
                                    {pkg.inclusions.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                            <Check className="w-5 h-5 text-green-500 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-red-500 rounded-full" /> Exclusions
                                </h3>
                                <ul className="space-y-3">
                                    {pkg.exclusions.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                            <X className="w-5 h-5 text-red-500 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <BookingForm packageTitle={pkg.title} />
                    </div>
                </div>
            </div>

            <SimilarPackages currentId={pkg.id} duration={pkg.duration} />
            <MobileBookingBar
                price={pkg.startingPrice}
                onBook={() => {
                    // Scroll to booking form
                    const form = document.querySelector('form');
                    form?.scrollIntoView({ behavior: 'smooth' });
                }}
            />
            <Footer />
        </main>
    );
}
