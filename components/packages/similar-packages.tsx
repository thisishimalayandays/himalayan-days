import { getSimilarPackages } from "@/app/actions/packages";
import { PackageCard } from "@/components/home/package-card";

export async function SimilarPackages({ currentId, duration }: { currentId: string, duration: string }) {
    const similarPackages = await getSimilarPackages(currentId, duration);

    if (similarPackages.length === 0) return null;

    return (
        <section className="py-12 bg-gray-50/50">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {similarPackages.map((pkg) => (
                        <PackageCard
                            key={pkg.id}
                            packageData={{
                                id: pkg.id,
                                slug: pkg.slug,
                                title: pkg.title,
                                duration: pkg.duration,
                                startingPrice: pkg.startingPrice,
                                image: pkg.image,
                                category: pkg.category,
                                location: pkg.location || "Kashmir",
                                features: JSON.parse(pkg.features)
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
