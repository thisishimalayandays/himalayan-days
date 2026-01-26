'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export function Intro() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <span className="text-primary font-bold uppercase tracking-widest text-xs md:text-sm pl-4 border-l-4 border-primary">About Himalayan Days</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-[1.1]">We Organize the <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Best Kashmir Tours</span></h2>
                    </div>

                    <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                        <p>
                            Himalayan Days is your trusted local partner for exploring the enchanting valleys of Kashmir. With over a decade of experience, we specialize in crafting personalized itineraries that showcase the true essence of 'Paradise on Earth'.
                        </p>
                        <p>
                            From luxury houseboat stays in Dal Lake to thrilling treks in the Himalayas, we ensure every moment of your journey is magical and hassle-free. We treat our guests not just as tourists, but as family returning home.
                        </p>
                    </div>

                    <div className="pt-2">
                        <Link href="/about">
                            <Button size="lg" className="h-14 px-10 rounded-full text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                                Read More About Us
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute -inset-4 bg-orange-100 rounded-3xl transform rotate-3" />
                    <div className="absolute -inset-4 bg-emerald-50 rounded-3xl transform -rotate-2 scale-95" />
                    <div className="relative rounded-2xl shadow-2xl w-full h-[500px] overflow-hidden bg-gray-100 flex items-center justify-center group">
                        {/* Background Image */}
                        <Image
                            src="/Destinations/Pahalgham.jpeg"
                            alt="Background"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Overlay for contrast */}
                        <div className="absolute inset-0 bg-black/20" />

                        {/* Centered Logo */}
                        <div className="relative w-64 h-64 opacity-90 transition-transform duration-500 group-hover:scale-105">
                            <Image
                                src="/Himalayan Days Logo.png"
                                alt="Himalayan Days Logo"
                                fill
                                sizes="256px"
                                className="object-contain drop-shadow-2xl"
                            />
                        </div>
                    </div>

                    {/* Floating Badge */}
                    <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl flex items-center gap-4 animate-bounce-slow">
                        <div className="bg-green-100 p-3 rounded-full">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">100%</div>
                            <div className="text-sm text-gray-500 font-medium">Verified Reviews</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
