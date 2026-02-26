import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewsletterForm } from './newsletter-form';

export function Footer() {
    return (
        <>
            <Script
                src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
                strategy="lazyOnload"
            />
            <Script id="google-translate-config" strategy="lazyOnload">
                {`
                    function googleTranslateElementInit() {
                        new window.google.translate.TranslateElement({
                            pageLanguage: 'en',
                            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
                        }, 'google_translate_element');
                    }
                `}
            </Script>
            <footer className="bg-gray-950 text-gray-300 pt-16 pb-8">
                {/* Content */}
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        {/* <h3 className="text-2xl font-bold text-white">Himalayan<span className="text-primary">Days</span></h3> */}
                        <Link href="/" className="inline-block relative h-16 w-48">
                            <Image
                                src="/logo.png"
                                alt="Himalayan Days"
                                fill
                                sizes="192px"
                                className="object-contain"
                            />
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Your trusted partner for exploring the paradise of Kashmir. We curate the best experiences, from luxury houseboats to mountain adventures.
                        </p>
                        {/* Registrations */}
                        <div className="space-y-3">
                            {/* J&K Tourism */}
                            <div className="flex items-center gap-3 bg-gray-900/50 p-2.5 rounded-lg border border-gray-800">
                                <div className="bg-white p-1 rounded shrink-0 relative h-8 w-12">
                                    <Image src="/tourismlogo.png" alt="JK Tourism" fill className="object-contain" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold leading-tight">Recognized by</p>
                                    <p className="text-xs text-white font-medium">J&K Tourism</p>
                                    <p className="text-[10px] text-gray-400 font-mono">Reg: JKEA00004452</p>
                                </div>
                            </div>

                            {/* Udyam Registration */}
                            <div className="flex items-center gap-3 bg-gray-900/50 p-2.5 rounded-lg border border-gray-800">
                                <div className="bg-white p-1 rounded shrink-0 relative h-8 w-12">
                                    <Image src="/msmelogo.png" alt="Udyam Registration" fill className="object-contain" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold leading-tight">Registered with</p>
                                    <p className="text-xs text-white font-medium">MSME Udyam</p>
                                    <p className="text-[10px] text-gray-400 font-mono">Reg: UDYAM-JK-21-0061335</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <a href="https://www.facebook.com/profile.php?id=61555414211720" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors bg-gray-900 p-2 rounded-full"><Facebook className="w-4 h-4" /></a>
                            <a href="https://www.instagram.com/himalyan_days_" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors bg-gray-900 p-2 rounded-full"><Instagram className="w-4 h-4" /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            <li><Link href="/about" className="hover:text-primary transition-colors text-sm">About Us</Link></li>
                            <li><Link href="/careers" className="hover:text-primary transition-colors text-sm">Careers</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors text-sm">Contact Us</Link></li>
                            <li><Link href="/blog" className="hover:text-primary transition-colors text-sm">Travel Blog</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors text-sm">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Packages */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-6">Tour Packages</h4>
                        <ul className="space-y-3">
                            <li><Link href="/packages?category=Honeymoon" className="hover:text-primary transition-colors text-sm">Honeymoon Specials</Link></li>
                            <li><Link href="/packages?category=Family" className="hover:text-primary transition-colors text-sm">Family Vacations</Link></li>
                            <li><Link href="/packages?category=Adventure" className="hover:text-primary transition-colors text-sm">Adventure Tours</Link></li>
                            <li><Link href="/packages?category=Luxury" className="hover:text-primary transition-colors text-sm">Luxury Houseboats</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-6">Get Updates</h4>
                        <p className="text-sm mb-4 text-gray-400">Subscribe for exclusive offers and travel guides.</p>
                        <NewsletterForm />
                        <div className="mt-8 space-y-3">
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <Phone className="w-4 h-4 text-primary" /> +91-9103901803
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <Mail className="w-4 h-4 text-primary" /> thisishimalayandays@gmail.com
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <MapPin className="w-4 h-4 text-primary" /> Srinagar, Kashmir, India
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-900 pt-8 flex flex-col items-center md:flex-row md:justify-between text-sm text-gray-600 container mx-auto px-4">
                    <p>&copy; {new Date().getFullYear()} Himalayan Days. All rights reserved.</p>

                    {/* Google Translate Dropdown Container */}
                    <div className="mt-4 md:mt-0 relative z-50">
                        <div id="google_translate_element" className="bg-white/10 p-1 rounded-md overflow-hidden"></div>
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            /* Hide Google Translate Top Bar */
                            .skiptranslate.goog-te-banner-frame {
                                display: none !important;
                            }
                            body {
                                top: 0px !important;
                            }
                            /* Style the dropdown slightly */
                            .goog-te-combo {
                                outline: none;
                                border: 1px solid #4ade80;
                                border-radius: 4px;
                                padding: 4px;
                                font-size: 14px;
                                color: #1e293b;
                            }
                        `
                        }} />
                    </div>
                </div>
            </footer>
        </>
    );
}
