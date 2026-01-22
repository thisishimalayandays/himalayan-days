import { Metadata } from 'next';
import { Suspense } from 'react';
import { PackagesContent } from './packages-content';
import { getPackages } from '@/app/actions/packages';

export const metadata: Metadata = {
    title: 'Tour Packages',
    description: 'Explore our wide range of curated Kashmir holiday packages. Honeymoon, Family, Adventure, and Luxury tours designed for you.',
};

export const dynamic = 'force-dynamic';

export default async function PackagesPage() {
    const packages = await getPackages();
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
            <PackagesContent packages={packages} />
        </Suspense>
    );
}
