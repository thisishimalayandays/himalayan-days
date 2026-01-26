'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { EnquiryModal } from './enquiry-modal';

export function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Packages', href: '/packages' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", scrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5")}>
            <div className="container mx-auto px-4 flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
                {/* Logo */}
                {/* Logo */}
                <Link href="/" className="flex items-center md:justify-self-start">
                    <div className="relative h-12 w-40">
                        <Image
                            src="/Himalayan Days Logo.png"
                            alt="Himalayan Days"
                            fill
                            sizes="160px"
                            className="object-contain object-left"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center md:justify-self-center">
                    <ul className="flex items-center gap-8">
                        {navLinks.map(link => (
                            <li key={link.name}>
                                <Link href={link.href} className={cn("text-sm font-medium hover:text-primary transition-colors", scrolled ? "text-gray-700" : "text-white/90 hover:text-white")}>
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-6 md:justify-self-end">
                    <a href="tel:+919103901803" className={cn("flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors", scrolled ? "text-gray-700" : "text-white")}>
                        <Phone className="w-4 h-4" />
                        +91-9103901803
                    </a>
                    <Button
                        variant="default"
                        className="bg-primary hover:bg-orange-600 text-white font-semibold shadow-lg"
                        onClick={() => setIsEnquiryOpen(true)}
                    >
                        Enquire Now
                    </Button>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                    {isOpen ? <X className={cn("w-6 h-6", scrolled ? "text-gray-900" : "text-white")} /> : <Menu className={cn("w-6 h-6", scrolled ? "text-gray-900" : "text-white")} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="absolute top-full left-0 right-0 bg-white shadow-xl border-t overflow-hidden md:hidden"
                    >
                        <div className="flex flex-col p-4 gap-4">
                            {navLinks.map(link => (
                                <Link key={link.name} href={link.href} className="text-gray-700 font-medium py-2 border-b border-gray-50 flex justify-between" onClick={() => setIsOpen(false)}>
                                    {link.name}
                                </Link>
                            ))}
                            <div className="flex flex-col gap-3 mt-2">
                                <a href="tel:+919103901803" className="flex items-center justify-center gap-2 text-gray-700 font-medium py-2 bg-gray-50 rounded-md">
                                    <Phone className="w-4 h-4" /> +91-9103901803
                                </a>
                                <Button
                                    className="w-full bg-primary text-white"
                                    onClick={() => {
                                        setIsOpen(false);
                                        setIsEnquiryOpen(true);
                                    }}
                                >
                                    Enquire Now
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <EnquiryModal isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
        </header >
    );
}
