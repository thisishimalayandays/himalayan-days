'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Phone, Wallet, Map, Clock, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createInquiry, InquiryInput } from '@/app/actions/inquiries';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

interface TripCustomizationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TripCustomizationModal({ isOpen, onClose }: TripCustomizationModalProps) {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        duration: '',
        budget: 'Standard',
        type: 'Family'
    });

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setIsSubmitting(false); // Reset submitting state on close
        }
        return () => {
            document.body.style.overflow = 'unset';
            // clean up just in case
        };
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!executeRecaptcha) {
            console.error("ReCAPTCHA not ready");
            return;
        }

        setIsSubmitting(true);

        try {
            const token = await executeRecaptcha('trip_customization_submit');

            // 1. Save to Database
            const inquiryData: InquiryInput = {
                name: formData.name,
                phone: formData.phone,
                startDate: formData.date ? new Date(formData.date).toISOString() : undefined,
                budget: formData.budget,
                type: "PLAN_MY_TRIP",
                // Construct a message with extra details not directly mapped
                message: `Duration: ${formData.duration} days, Type: ${formData.type}`,
                travelers: undefined, // Not explicitly asked in this form, maybe infer or leave blank
                captchaToken: token
            };

            // We don't await this to block the user, or maybe we should? 
            // Better to try save, but ensure redirect happens regardless.
            await createInquiry(inquiryData);

        } catch (error) {
            console.error("Failed to save inquiry", error);
        }

        // 2. Construct WhatsApp Message
        const message = `*New Trip Enquiry via Website* \n\n` +
            `*Name:* ${formData.name}\n` +
            `*Phone:* ${formData.phone}\n` +
            `*Travel Date:* ${formData.date}\n` +
            `*Duration:* ${formData.duration} Days\n` +
            `*Budget:* ${formData.budget}\n` +
            `*Trip Type:* ${formData.type}\n\n` +
            `Please provide a quote.`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/919103901803?text=${encodedMessage}`, '_blank');

        setIsSubmitting(false);
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white pointer-events-auto rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Header */}
                            <div className="bg-primary px-6 py-5 flex items-center justify-between shrink-0">
                                <div className="text-white">
                                    <h3 className="text-xl font-bold">Plan Your Dream Trip</h3>
                                    <p className="text-orange-100 text-sm">Tell us your preferences & get a quote</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                            <User className="w-4 h-4 text-primary" /> Name
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Your full name"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                            <Phone className="w-4 h-4 text-primary" /> Phone
                                        </label>
                                        <input
                                            required
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+91 XXXXX XXXXX"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                                        />
                                    </div>

                                    {/* Date */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4 text-primary" /> Travel Date
                                        </label>
                                        <input
                                            required
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-gray-600"
                                        />
                                    </div>

                                    {/* Duration */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                            <Clock className="w-4 h-4 text-primary" /> Duration (Days)
                                        </label>
                                        <input
                                            required
                                            type="number"
                                            min="2"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleChange}
                                            placeholder="e.g. 5"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>

                                {/* Budget */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                        <Wallet className="w-4 h-4 text-primary" /> Budget Preference
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {['Economy', 'Standard', 'Luxury', 'Premium'].map((option) => (
                                            <label
                                                key={option}
                                                className={`
                                                    cursor-pointer text-center text-sm py-2.5 rounded-xl border transition-all font-medium
                                                    ${formData.budget === option
                                                        ? 'bg-orange-50 border-primary text-primary shadow-sm'
                                                        : 'border-gray-200 text-gray-600 hover:border-orange-200 hover:bg-orange-50/50'}
                                                `}
                                            >
                                                <input
                                                    type="radio"
                                                    name="budget"
                                                    value={option}
                                                    checked={formData.budget === option}
                                                    onChange={handleChange}
                                                    className="hidden"
                                                />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Trip Type */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                        <Plane className="w-4 h-4 text-primary" /> Trip Type
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Family', 'Honeymoon', 'Adventure', 'Group'].map((option) => (
                                            <label
                                                key={option}
                                                className={`
                                                    cursor-pointer flex items-center justify-center gap-2 text-sm py-3 rounded-xl border transition-all font-medium
                                                    ${formData.type === option
                                                        ? 'bg-orange-50 border-primary text-primary shadow-sm'
                                                        : 'border-gray-200 text-gray-600 hover:border-orange-200 hover:bg-orange-50/50'}
                                                `}
                                            >
                                                <input
                                                    type="radio"
                                                    name="type"
                                                    value={option}
                                                    checked={formData.type === option}
                                                    onChange={handleChange}
                                                    className="hidden"
                                                />
                                                {option}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold h-12 rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#25D366]/20 transition-all text-lg flex items-center justify-center gap-2 mt-2"
                                >
                                    <Phone className="w-5 h-5 fill-current" />
                                    {isSubmitting ? 'Processing...' : 'Get Quote on WhatsApp'}
                                </Button>

                                <p className="text-xs text-center text-gray-400 mt-2">
                                    Our travel experts will create a custom itinerary for you instantly.
                                </p>
                            </form>
                            <p className="text-[10px] text-center text-gray-400 pb-4 px-6 -mt-2">
                                This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" className="underline">Privacy Policy</a> and <a href="https://policies.google.com/terms" className="underline">Terms of Service</a> apply.
                            </p>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
