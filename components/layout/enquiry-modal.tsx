'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Phone, Send, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createInquiry } from '@/app/actions/inquiries';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

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
    const [errors, setErrors] = useState<{ name?: string, phone?: string }>({});
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { executeRecaptcha } = useGoogleReCaptcha();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setIsSuccess(false);
            setErrorMessage(null);
            setErrors({});
        } else {
            document.body.style.overflow = 'unset';
            setIsSubmitting(false);
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const validate = () => {
        let isValid = true;
        const newErrors: any = {};

        // Name Validation
        if (formData.name.trim().length < 2) {
            newErrors.name = "Name is too short";
            isValid = false;
        } else if (/\d/.test(formData.name)) {
            newErrors.name = "Name cannot contain numbers";
            isValid = false;
        }

        // Phone Validation
        const cleanPhone = formData.phone.replace(/\D/g, '');
        if (cleanPhone.length < 10 || cleanPhone.length > 15) {
            newErrors.phone = "Enter a valid phone number";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setErrors({});

        if (!validate()) return;

        if (!executeRecaptcha) {
            setErrorMessage("ReCAPTCHA not ready. Please check your connection.");
            return;
        }

        setIsSubmitting(true);

        try {
            const token = await executeRecaptcha('enquiry_modal_submit');

            // 1. Save to Database
            const result = await createInquiry({
                name: formData.name,
                phone: formData.phone,
                message: formData.message || "General Enquiry via Website Header",
                type: "GENERAL",
                captchaToken: token
            });

            if (!result.success) {
                setErrorMessage(result.error || "Spam detected. Please try again.");
                setIsSubmitting(false);
                return;
            }

            // Success - Show In-Modal Success
            setIsSuccess(true);
            setErrorMessage(null);
            setFormData({ name: '', phone: '', message: '' });

        } catch (error) {
            console.error("Failed to save enquiry", error);
            setErrorMessage("Connection failed. Please try again.");
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (errorMessage) setErrorMessage(null);
        // Clear field validation error on change
        if (errors[e.target.name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
        }
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
                            className="bg-white pointer-events-auto rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col relative min-h-[350px]"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {isSuccess ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4 my-auto flex-grow"
                                >
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
                                        <p className="text-gray-500 max-w-[250px] mx-auto">
                                            Thank you for reaching out. Our team will get back to you shortly.
                                        </p>
                                    </div>
                                    <Button onClick={onClose} className="bg-gray-900 text-white mt-4 w-full">
                                        Done
                                    </Button>
                                </motion.div>
                            ) : (
                                <>
                                    <div className="px-6 pt-6 pb-2 text-center">
                                        <h3 className="text-2xl font-bold text-gray-900">Have a Question?</h3>
                                        <p className="text-gray-500 text-sm mt-1">We are here to help you 24/7</p>
                                    </div>

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
                                                    autoComplete="name"
                                                    placeholder="Full Name"
                                                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none placeholder:text-gray-400 font-medium ${errors.name ? 'ring-2 ring-red-500 bg-red-50' : ''}`}
                                                />
                                                {errors.name && <p className="text-[10px] text-red-500 absolute -bottom-4 left-1">{errors.name}</p>}
                                            </div>

                                            <div className="relative pt-1">
                                                <Phone className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                                                <input
                                                    required
                                                    type="tel"
                                                    name="phone"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    autoComplete="tel"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="Phone Number"
                                                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none placeholder:text-gray-400 font-medium ${errors.phone ? 'ring-2 ring-red-500 bg-red-50' : ''}`}
                                                />
                                                {errors.phone && <p className="text-[10px] text-red-500 absolute -bottom-4 left-1">{errors.phone}</p>}
                                            </div>

                                            <div className="relative pt-1">
                                                <MessageCircle className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                                                <textarea
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    placeholder="I want to plan a family trip to Kashmir..."
                                                    rows={3}
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none placeholder:text-gray-400 font-medium resize-none"
                                                />
                                            </div>
                                        </div>

                                        {errorMessage && (
                                            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm border border-red-100 animate-in fade-in slide-in-from-top-1">
                                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                <p>{errorMessage}</p>
                                            </div>
                                        )}

                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-gray-900 hover:bg-black text-white py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group mt-2"
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
                                    <p className="text-[10px] text-center text-gray-400 pb-4 px-6">
                                        This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" className="underline">Privacy Policy</a> and <a href="https://policies.google.com/terms" className="underline">Terms of Service</a> apply.
                                    </p>
                                </>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
