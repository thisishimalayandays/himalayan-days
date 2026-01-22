import { Metadata } from 'next';
import Image from 'next/image';
import { PageHeader } from '@/components/layout/page-header';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ShieldCheck, Users, Heart, Award } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About Us',
    description: 'Learn about Himalayan Days, your trusted partner for authentic Kashmir travel experiences since 2012.',
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white font-sans">
            <div className="bg-black/90"><Header /></div>

            <PageHeader
                title="About Us"
                description="Your trusted partner for authentic Kashmir experiences since 2012."
                image="https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=2070&auto=format&fit=crop"
            />

            <div className="container mx-auto px-4 py-24 space-y-24">

                {/* Our Story */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <span className="text-primary font-bold uppercase tracking-widest text-sm">Our Story</span>
                        <h2 className="text-4xl font-bold text-gray-900">Experience Kashmir Like Never Before</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Welcome to <strong>Himalayan Days</strong>, a premier travel agency dedicated to showcasing the breathtaking beauty of Kashmir to the world. Founded with a passion for hospitality and a deep love for our homeland, we have been crafting unforgettable journeys for over a decade.
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            We believe that travel is not just about visiting places, but about feeling them. From the serene shikara rides on Dal Lake to the adrenaline-pumping slopes of Gulmarg, we ensure every moment of your trip is curated with care, authenticity, and comfort.
                        </p>
                    </div>
                    <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl bg-white p-12">
                        <Image
                            src="/Himalayan Days Logo.png"
                            alt="Himalayan Days Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                </section>

                {/* Why Choose Us */}
                <section>
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Himalayan Days?</h2>
                        <p className="text-gray-600">We go the extra mile to ensure your vacation is perfect in every way.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-gray-50 p-8 rounded-xl text-center hover:-translate-y-2 transition-transform duration-300">
                            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Registered & Trusted</h3>
                            <p className="text-gray-600">Recognized by J&K Tourism. Reg No: JKEA00004452.</p>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-xl text-center hover:-translate-y-2 transition-transform duration-300">
                            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                                <Users className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Local Experts</h3>
                            <p className="text-gray-600">Our team consists of locals who know every hidden gem of the valley.</p>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-xl text-center hover:-translate-y-2 transition-transform duration-300">
                            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                                <Heart className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Personalized Care</h3>
                            <p className="text-gray-600">24/7 on-trip support to ensure you are safe and happy.</p>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-xl text-center hover:-translate-y-2 transition-transform duration-300">
                            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                                <Award className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Best Price Guarantee</h3>
                            <p className="text-gray-600">Luxury experiences at the most competitive prices in the market.</p>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    )
}
