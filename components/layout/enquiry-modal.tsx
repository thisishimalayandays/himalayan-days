'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Phone, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createInquiry } from '@/app/actions/inquiries';

interface EnquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function EnquiryModal({ isOpen, onClose }: EnquiryModalProps) {
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setIsSubmitting(false);
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. Save to Database
            await createInquiry({
                name: formData.name,
                phone: formData.phone,
                message: formData.message || "General Enquiry via Website Header",
                type: "GENERAL"
            });
        } catch (error) {
            console.error("Failed to save enquiry", error);
        }

        // 2. WhatsApp Redirect
        const message = `*Quick Enquiry from Website* \n\n` +
            `*Name:* ${formData.name}\n` +
            `*Phone:* ${formData.phone}\n` +
            `*Message:* ${formData.message || "I have a query regarding a package."}\n\n` +
            `Please connect with me.`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/919103901803?text=${encodedMessage}`, '_blank');

        setIsSubmitting(false);
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999]"
                    />

                    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                            exit={{ opacity: 0, scale: 0.9, rotateX: 10 }}
                            className="bg-white pointer-events-auto rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col relative"
                        >
                            {/* Simple Clean Header */}
                            <div className="px-6 pt-6 pb-2 text-center">
                                <h3 className="text-2xl font-bold text-gray-900">Have a Question?</h3>
                                <p className="text-gray-500 text-sm mt-1">We are here to help you 24/7</p>
                            </div>

                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <input
                                            required
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Your Name"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none placeholder:text-gray-400 font-medium"
                                        />
                                    </div>

                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <input
                                            required
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Phone Number"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none placeholder:text-gray-400 font-medium"
                                        />
                                    </div>

                                    <div className="relative">
                                        <MessageCircle className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="What's on your mind?"
                                            rows={3}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none placeholder:text-gray-400 font-medium resize-none"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gray-900 hover:bg-black text-white py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
                                >
                                    <span>{isSubmitting ? 'Processing...' : 'Send Message'}</span>
                                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>

                                <div className="text-center">
                                    <p className="text-xs text-gray-400">
                                        Prefer a call? <a href="tel:+919103901803" className="text-primary hover:underline font-medium">+91-9103901803</a>
                                    </p>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
