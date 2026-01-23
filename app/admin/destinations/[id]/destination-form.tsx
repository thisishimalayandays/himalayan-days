'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createDestination, updateDestination } from '@/app/actions/destinations';
import { ImageUpload } from '@/components/ui/image-upload';

interface DestinationData {
    id?: string;
    name: string;
    slug: string;
    image: string;
    description: string;
    rating: number;
    reviews: number;
    wikipediaUrl?: string | null;
}

export default function DestinationForm({ initialData, isNew }: { initialData?: DestinationData | null, isNew: boolean }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [image, setImage] = useState(initialData?.image || '');

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        try {
            if (isNew) {
                await createDestination(formData);
            } else if (initialData?.id) {
                await updateDestination(initialData.id, formData);
            }
        } catch (error: any) {
            // Ignore/re-throw redirect errors so Next.js handles navigation
            if (error.message === 'NEXT_REDIRECT' || error.message?.includes('NEXT_REDIRECT') || error.digest?.includes('NEXT_REDIRECT')) {
                return;
            }
            console.error("Failed to save:", error);
            alert("Failed to save destination. Please try again.");
            setIsSubmitting(false);
        }
    }

    return (
        <form action={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination Name</label>
                    <input
                        name="name"
                        defaultValue={initialData?.name}
                        required
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border"
                        placeholder="e.g. Gulmarg"
                        onChange={(e) => {
                            const val = e.target.value;
                            if (isNew) {
                                const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                                const slugInput = document.querySelector('input[name="slug"]') as HTMLInputElement;
                                if (slugInput) slugInput.value = slug;
                            }
                        }}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                    <input name="slug" defaultValue={initialData?.slug} required className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border" placeholder="e.g. gulmarg" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination Image</label>
                <input type="hidden" name="image" value={image} />
                <ImageUpload
                    value={image}
                    onChange={(url) => setImage(url)}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" defaultValue={initialData?.description} required rows={5} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border" placeholder="About this place..." />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Wikipedia / Explore URL</label>
                <input name="wikipediaUrl" defaultValue={initialData?.wikipediaUrl || ''} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border" placeholder="https://en.wikipedia.org/wiki/..." />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
                    <input name="rating" type="number" step="0.1" max="5" defaultValue={initialData?.rating || 4.5} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Reviews</label>
                    <input name="reviews" type="number" defaultValue={initialData?.reviews || 0} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border" />
                </div>
            </div>

            <div className="pt-4 border-t flex justify-end gap-3">
                <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                    Cancel
                </button>
                <button disabled={isSubmitting} type="submit" className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 shadow-sm flex items-center gap-2">
                    {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                    {isNew ? "Create Destination" : "Save Changes"}
                </button>
            </div>
        </form>
    );
}
