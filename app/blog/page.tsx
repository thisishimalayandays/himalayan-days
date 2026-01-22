import { Metadata } from 'next';
import { PageHeader } from '@/components/layout/page-header';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Construction } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Travel Blog',
    description: 'Stories, tips, and guides from the heart of Kashmir. Discover the best places to visit, eat, and stay.',
};

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-white font-sans">
            <div className="bg-black/90"><Header /></div>

            <PageHeader
                title="Travel Blog"
                description="Stories, tips, and guides from the heart of Kashmir."
                image="https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=2070&auto=format&fit=crop"
            />

            <div className="container mx-auto px-4 py-24 text-center">
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-primary">
                        <Construction className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Coming Soon</h2>
                    <p className="text-gray-600 text-lg">
                        We are currently crafting amazing travel stories for you. Stay tuned for updates on the best places to visit, eat, and stay in Kashmir.
                    </p>
                </div>
            </div>

            <Footer />
        </main>
    )
}
