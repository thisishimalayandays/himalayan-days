'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash, GripVertical, Loader2 } from 'lucide-react';
import { createPackage, updatePackage } from '@/app/actions/packages';
import { ImageUpload } from '@/components/ui/image-upload';

interface ItineraryItem {
    day: number;
    title: string;
    desc: string;
}

interface PackageData {
    id?: string;
    title: string;
    slug: string;
    startingPrice: number;
    duration: string;
    category: string;
    image: string;
    overview: string;
    location: string;
    gallery: string[];
    features: string[];
    inclusions: string[];
    exclusions: string[];
    itinerary: ItineraryItem[];
}

export default function PackageForm({ initialData, isNew }: { initialData?: PackageData | null, isNew: boolean }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State for dynamic fields
    const [image, setImage] = useState(initialData?.image || '');
    const [gallery, setGallery] = useState<string[]>(initialData?.gallery || []);
    const [features, setFeatures] = useState<string[]>(initialData?.features || []);
    const [inclusions, setInclusions] = useState<string[]>(initialData?.inclusions || []);
    const [exclusions, setExclusions] = useState<string[]>(initialData?.exclusions || []);
    const [itinerary, setItinerary] = useState<ItineraryItem[]>(initialData?.itinerary || []);

    // Handlers for Gallery
    const addGalleryImage = () => setGallery([...gallery, '']);
    const removeGalleryImage = (index: number) => setGallery(gallery.filter((_, i) => i !== index));
    const updateGalleryImage = (index: number, value: string) => {
        const newGallery = [...gallery];
        newGallery[index] = value;
        setGallery(newGallery);
    };

    // Generic handler for simple string arrays (Features, Inclusions, Exclusions)
    const addStringItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, current: string[]) => setter([...current, '']);
    const removeStringItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, current: string[], index: number) => setter(current.filter((_, i) => i !== index));
    const updateStringItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, current: string[], index: number, value: string) => {
        const newItems = [...current];
        newItems[index] = value;
        setter(newItems);
    };

    // Handlers for Itinerary
    const addItineraryDay = () => setItinerary([...itinerary, { day: itinerary.length + 1, title: '', desc: '' }]);
    const removeItineraryDay = (index: number) => {
        const newItinerary = itinerary.filter((_, i) => i !== index).map((item, i) => ({ ...item, day: i + 1 })); // Re-index days
        setItinerary(newItinerary);
    };
    const updateItineraryItem = (index: number, field: keyof ItineraryItem, value: string | number) => {
        const newItinerary = [...itinerary];
        newItinerary[index] = { ...newItinerary[index], [field]: value };
        setItinerary(newItinerary);
    };

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);

        // Append JSON fields to FormData
        formData.set('gallery', JSON.stringify(gallery.filter(i => i.trim() !== '')));
        formData.set('features', JSON.stringify(features.filter(i => i.trim() !== '')));
        formData.set('inclusions', JSON.stringify(inclusions.filter(i => i.trim() !== '')));
        formData.set('exclusions', JSON.stringify(exclusions.filter(i => i.trim() !== '')));
        formData.set('itinerary', JSON.stringify(itinerary));

        try {
            if (isNew) {
                await createPackage(formData);
            } else if (initialData?.id) {
                await updatePackage(initialData.id, formData);
            }
        } catch (error: any) {
            // Ignore/re-throw redirect errors so Next.js handles navigation
            if (error.message === 'NEXT_REDIRECT' || error.message?.includes('NEXT_REDIRECT') || error.digest?.includes('NEXT_REDIRECT')) {
                return; // Or throw error, but returning lets the redirect happen
            }
            console.error("Failed to save:", error);
            alert("Failed to save package. Please try again.");
            setIsSubmitting(false); // Only reset if it's a real error
        }
    }

    return (
        <form action={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border space-y-8">

            {/* Basic Info Section */}
            <section className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Package Title</label>
                        <input
                            name="title"
                            defaultValue={initialData?.title}
                            required
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border"
                            onChange={(e) => {
                                const title = e.target.value;
                                if (isNew) {
                                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                                    const slugInput = document.querySelector('input[name="slug"]') as HTMLInputElement;
                                    if (slugInput) slugInput.value = slug;
                                }
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                        <input name="slug" defaultValue={initialData?.slug} required className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border" />
                        <p className="text-xs text-gray-500 mt-1">Unique ID for the URL (e.g. majestic-kashmir)</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                        <input name="price" type="number" defaultValue={initialData?.startingPrice} required className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input name="duration" defaultValue={initialData?.duration} required className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border" placeholder="e.g. 5 Nights / 6 Days" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select name="category" defaultValue={initialData?.category} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border">
                            <option value="Honeymoon">Honeymoon</option>
                            <option value="Family">Family</option>
                            <option value="Adventure">Adventure</option>
                            <option value="Luxury">Luxury</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Main Image</label>
                        <input type="hidden" name="image" value={image} />
                        <ImageUpload
                            value={image}
                            onChange={setImage}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Overview</label>
                        <textarea name="overview" defaultValue={initialData?.overview} rows={3} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border" />
                    </div>
                </div>
            </section>

            {/* Itinerary Section */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-semibold text-gray-800">Itinerary</h3>
                    <button type="button" onClick={addItineraryDay} className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 flex items-center gap-1">
                        <Plus size={16} /> Add Day
                    </button>
                </div>
                <div className="space-y-4">
                    {itinerary.map((item, index) => (
                        <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg border">
                            <div className="flex-none pt-2 cursor-grab text-gray-400"><GripVertical size={20} /></div>
                            <div className="flex-none w-16">
                                <label className="text-xs font-bold text-gray-500 uppercase">Day</label>
                                <input value={item.day} readOnly className="w-full bg-white border border-gray-300 rounded p-1 text-center font-bold" />
                            </div>
                            <div className="flex-1 space-y-2">
                                <input
                                    value={item.title}
                                    onChange={(e) => updateItineraryItem(index, 'title', e.target.value)}
                                    placeholder="Day Title (e.g. Arrival in Srinagar)"
                                    className="w-full border-gray-300 rounded p-2 border shadow-sm"
                                />
                                <textarea
                                    value={item.desc}
                                    onChange={(e) => updateItineraryItem(index, 'desc', e.target.value)}
                                    placeholder="Detailed description for the day..."
                                    rows={2}
                                    className="w-full border-gray-300 rounded p-2 border shadow-sm"
                                />
                            </div>
                            <button type="button" onClick={() => removeItineraryDay(index)} className="text-red-500 hover:text-red-700 p-2"><Trash size={18} /></button>
                        </div>
                    ))}
                    {itinerary.length === 0 && <p className="text-gray-400 italic text-sm text-center py-4">No itinerary days added yet.</p>}
                </div>
            </section>

            {/* Gallery Section */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-semibold text-gray-800">Photo Gallery</h3>
                    <button type="button" onClick={addGalleryImage} className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 flex items-center gap-1">
                        <Plus size={16} /> Add Image
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {gallery.map((url, index) => (
                        <div key={index} className="border-b border-gray-100 pb-2 mb-2 last:border-0 last:mb-0 last:pb-0">
                            <div className="flex gap-2 items-center">
                                <ImageUpload
                                    value={url}
                                    onChange={(newUrl) => updateGalleryImage(index, newUrl)}
                                    className="flex-1"
                                />
                                <button type="button" onClick={() => removeGalleryImage(index)} className="text-red-500 hover:text-red-700 p-2 bg-gray-50 rounded-full"><Trash size={18} /></button>
                            </div>
                            <div className="flex justify-end mt-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImage(url);
                                        alert("Image set as Main Thumbnail!");
                                    }}
                                    className="text-xs text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50 flex items-center gap-1"
                                    disabled={!url}
                                >
                                    Set as Thumbnail
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features & Inclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="text-lg font-semibold text-gray-800">Features / Highlights</h3>
                        <button type="button" onClick={() => addStringItem(setFeatures, features)} className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"><Plus size={14} /></button>
                    </div>
                    <div className="space-y-2">
                        {features.map((item, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    value={item}
                                    onChange={(e) => updateStringItem(setFeatures, features, index, e.target.value)}
                                    placeholder="Feature (e.g. Houseboat Stay)"
                                    className="flex-1 border-gray-300 rounded p-2 border shadow-sm text-sm"
                                />
                                <button type="button" onClick={() => removeStringItem(setFeatures, features, index)} className="text-gray-400 hover:text-red-500"><Trash size={16} /></button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="text-lg font-semibold text-gray-800">Inclusions</h3>
                        <button type="button" onClick={() => addStringItem(setInclusions, inclusions)} className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"><Plus size={14} /></button>
                    </div>
                    <div className="space-y-2">
                        {inclusions.map((item, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    value={item}
                                    onChange={(e) => updateStringItem(setInclusions, inclusions, index, e.target.value)}
                                    placeholder="Included item (e.g. Breakfast)"
                                    className="flex-1 border-gray-300 rounded p-2 border shadow-sm text-sm"
                                />
                                <button type="button" onClick={() => removeStringItem(setInclusions, inclusions, index)} className="text-gray-400 hover:text-red-500"><Trash size={16} /></button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="pt-6 border-t flex justify-end gap-3 sticky bottom-0 bg-white/95 backdrop-blur py-4 -mb-8 -mx-8 px-8 border-t-gray-200">
                <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                    Cancel
                </button>
                <button disabled={isSubmitting} type="submit" className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 shadow-sm flex items-center gap-2">
                    {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                    {isNew ? "Create Package" : "Save Changes"}
                </button>
            </div>
        </form>
    );
}
