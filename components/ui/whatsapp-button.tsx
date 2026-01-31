'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import * as analytics from '@/lib/analytics';
import { X, Loader2, MessageCircle, AlertCircle } from 'lucide-react';
import { createInquiry } from '@/app/actions/inquiries';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function WhatsAppButton() {
    const pathname = usePathname();
    const { executeRecaptcha } = useGoogleReCaptcha();

    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [errors, setErrors] = useState({ name: '', phone: '' });
    const [showTooltip, setShowTooltip] = useState(false);

    // Initial nudge
    useEffect(() => {
        const timer = setTimeout(() => setShowTooltip(true), 15000);
        return () => clearTimeout(timer);
    }, []);

    if (pathname?.startsWith('/admin') || pathname?.startsWith('/careers')) {
        return null;
    }

    const isPackageDetail = pathname?.startsWith('/packages/') && pathname !== '/packages';

    const validate = () => {
        let isValid = true;
        const newErrors = { name: '', phone: '' };

        // Name Validation
        if (formData.name.trim().length < 2) {
            newErrors.name = "Name is too short";
            isValid = false;
        } else if (/\d/.test(formData.name)) {
            newErrors.name = "Name cannot contain numbers";
            isValid = false;
        }

        // Phone Validation (Strip spaces/dashes)
        const cleanPhone = formData.phone.replace(/\D/g, '');
        if (cleanPhone.length < 10 || cleanPhone.length > 15) {
            newErrors.phone = "Enter a valid phone number (10-15 digits)";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous errors
        setErrors({ name: '', phone: '' });

        if (!validate()) return;
        if (!executeRecaptcha) return;

        setIsSubmitting(true);
        try {
            const token = await executeRecaptcha('whatsapp_quick_chat');

            // 1. Save Lead quietly
            await createInquiry({
                name: formData.name,
                phone: formData.phone,
                message: "Started Quick Chat via WhatsApp Button",
                type: "GENERAL",
                captchaToken: token
            });

            // 2. Open WhatsApp
            const phoneNumber = '919103901803';
            const text = `Hi, I am ${formData.name}. I want to plan a trip with Himalayan Days.`;
            const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;

            window.open(url, '_blank');

            // 3. Close & Reset
            setIsOpen(false);
            setFormData({ name: '', phone: '' });
            analytics.event('Lead', { content_name: 'WhatsApp Quick Chat' });

        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`fixed right-6 z-50 flex items-end justify-end gap-3 ${isPackageDetail ? 'bottom-24 md:bottom-6' : 'bottom-6'}`}>

            {/* Quick Chat Form */}
            <AnimatePresence>
                {(isOpen || showTooltip) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="bg-white p-4 rounded-2xl shadow-xl flex flex-col gap-3 relative w-[280px] origin-bottom-right mb-2"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Chat with Expert
                            </h3>
                            <button
                                onClick={() => { setIsOpen(false); setShowTooltip(false); }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {isOpen ? (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-1">
                                <div>
                                    <Input
                                        placeholder="Your Name"
                                        className={`h-9 text-sm ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                        required
                                        autoComplete="name"
                                        value={formData.name}
                                        onChange={(e) => {
                                            setFormData({ ...formData, name: e.target.value });
                                            if (errors.name) setErrors({ ...errors, name: '' });
                                        }}
                                    />
                                    {errors.name && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <Input
                                        placeholder="Phone Number"
                                        className={`h-9 text-sm ${errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                        type="tel"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        autoComplete="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => {
                                            setFormData({ ...formData, phone: e.target.value });
                                            if (errors.phone) setErrors({ ...errors, phone: '' });
                                        }}
                                    />
                                    {errors.phone && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.phone}</p>}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white h-9 text-sm font-semibold"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            Start Chat <MessageCircle size={14} className="fill-current" />
                                        </div>
                                    )}
                                </Button>
                                <p className="text-[10px] text-gray-400 text-center">
                                    Secure by ReCaptcha
                                </p>
                            </form>
                        ) : (
                            // Tooltip Mode (Initial Nudge)
                            <div
                                className="cursor-pointer"
                                onClick={() => { setShowTooltip(false); setIsOpen(true); }}
                            >
                                <p className="text-sm text-gray-600 leading-relaxed mb-2">
                                    Hi! 👋 I'm online. Fill your details to start a quick chat on WhatsApp!
                                </p>
                                <div className="text-primary text-xs font-bold hover:underline">
                                    Start Chat &rarr;
                                </div>
                            </div>
                        )}

                        {/* Arrow */}
                        <div className="absolute -right-2 bottom-6 w-4 h-4 bg-white transform rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Button */}
            <motion.button
                onClick={() => {
                    if (isOpen) {
                        setIsOpen(false);
                    } else {
                        setShowTooltip(false);
                        setIsOpen(true);
                    }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center justify-center group appearance-none border-none outline-none bg-transparent"
            >
                {/* Glowing Effect */}
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl group-hover:bg-green-500/30 transition-colors" />

                <div className="relative w-12 h-12 md:w-14 md:h-14 transition-all duration-300 drop-shadow-lg hover:drop-shadow-xl">
                    <Image
                        src="/whatsappicon.png"
                        alt="WhatsApp"
                        fill
                        sizes="56px"
                        className="object-contain"
                    />
                </div>

                {/* Badge if closed */}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-bounce">
                        1
                    </span>
                )}
            </motion.button>
        </div>
    );
}
