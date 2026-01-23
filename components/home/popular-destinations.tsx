import { DestinationMapModal } from '@/components/destinations/destination-map-modal';
import { useState } from 'react';

// ... (keep props interface)

export function PopularDestinations({ destinations }: PopularDestinationsProps) {
    const [mapModalOpen, setMapModalOpen] = useState(false);
    const [selectedDest, setSelectedDest] = useState("");

    const handleExplore = (e: React.MouseEvent, destName: string) => {
        e.preventDefault();
        e.stopPropagation();

        if (destName === "Aru Valley") {
            setSelectedDest(destName);
            setMapModalOpen(true);
        } else {
            // Default behavior for others (scroll to packages mainly, or separate page)
            // For now, let's just log or do nothing special beyond default link if it was a link
            // But here we are modifying the "Explore" button which wraps logic.
            // If wikipedia URL exists, maybe we open that?
            // Existing code opened wikipedia. Let's keep that logic for non-Aru.
        }
    };

    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* ... (keep header) */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <span className="text-primary font-bold tracking-wider uppercase text-sm">Explore Kashmir</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Popular Destinations</h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        Discover the breathtaking valleys and meadows that make Kashmir the "Paradise on Earth".
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {destinations.map((dest, idx) => (
                        <div
                            key={dest.id}
                            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <div className="relative h-64 w-full overflow-hidden">
                                <Image
                                    src={dest.image}
                                    alt={dest.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="text-2xl font-bold mb-1">{dest.name}</h3>
                                    <div className="flex items-center gap-1 text-sm text-yellow-400">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="font-medium">{dest.rating}</span>
                                        <span className="text-white/80">({dest.reviews} reviews)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 leading-relaxed mb-4 line-clamp-2">
                                    {dest.description}
                                </p>
                                {dest.wikipediaUrl ? (
                                    <a
                                        href={dest.wikipediaUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center text-primary font-medium text-sm group-hover:underline w-fit"
                                        onClick={(e) => {
                                            if (dest.name === "Aru Valley") {
                                                handleExplore(e, dest.name);
                                            } else {
                                                e.stopPropagation();
                                            }
                                        }}
                                    >
                                        <MapPin className="w-4 h-4 mr-1" />
                                        Explore {dest.name}
                                    </a>
                                ) : (
                                    <button
                                        onClick={(e) => handleExplore(e, dest.name)}
                                        className="flex items-center text-primary font-medium text-sm group-hover:underline w-fit"
                                    >
                                        <MapPin className="w-4 h-4 mr-1" />
                                        Explore {dest.name}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <DestinationMapModal
                isOpen={mapModalOpen}
                onClose={() => setMapModalOpen(false)}
                destinationName={selectedDest}
            />
        </section >
    );
}
