'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Phone, Wallet, Clock, Plane, ArrowRight, CheckCircle2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createInquiry, InquiryInput } from '@/app/actions/inquiries';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import * as analytics from '@/lib/analytics';
import { useToast } from '@/hooks/use-toast';

interface TripCustomizationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TripCustomizationModal({ isOpen, onClose }: TripCustomizationModalProps) {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [mounted, setMounted] = useState(false);
    const [step, setStep] = useState(1); // 1: Details, 2: Contact
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        duration: '',
        budget: 'Standard',
        type: 'Family'
    });
    const [errors, setErrors] = useState<{ name?: string, phone?: string, duration?: string, date?: string }>({});
    const { toast } = useToast();

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setErrors({});
            setStep(1); // Reset to step 1
        } else {
            document.body.style.overflow = 'unset';
            setIsSubmitting(false);
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const validateStep1 = () => {
        let isValid = true;
        const newErrors: any = {};

        if (!formData.date) {
            newErrors.date = "Please select a date";
            isValid = false;
        }
        if (!formData.duration || parseInt(formData.duration) < 2) {
            newErrors.duration = "Min 2 days";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const validateStep2 = () => {
        let isValid = true;
        const newErrors: any = {};

        if (formData.name.trim().length < 2) {
            newErrors.name = "Name too short";
            isValid = false;
        }
        const cleanPhone = formData.phone.replace(/\D/g, '');
        if (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
            newErrors.phone = "Valid 10-digit number required";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (step === 1) {
            if (validateStep1()) setStep(2);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if (!validateStep2()) return;
        if (!executeRecaptcha) return;

        setIsSubmitting(true);
        try {
            const token = await executeRecaptcha('trip_customization_submit');
            const fullPhone = `+91 ${formData.phone}`;

            const inquiryData: InquiryInput = {
                name: formData.name,
                phone: fullPhone,
                startDate: new Date(formData.date).toISOString(),
                budget: formData.budget,
                type: "PLAN_MY_TRIP",
                message: `Duration: ${formData.duration} days, Type: ${formData.type}`,
                travelers: undefined,
                captchaToken: token
            };

            const result = await createInquiry(inquiryData);

            if (!result.success) {
                toast({ variant: "destructive", title: "Error", description: result.error || "Please try again." });
                setIsSubmitting(false);
                return;
            }

            // Track Lead
            const budgetMap: Record<string, number> = { 'Standard': 18000, 'Premium': 25000, 'Luxury': 40000 };
            analytics.event('Lead', {
                content_name: 'Trip Customization',
                value: budgetMap[formData.budget] || 18000,
                currency: 'INR'
            });

            toast({
                title: "Request Received! ✈️",
                description: "Our travel expert will call you shortly.",
                className: "bg-green-600 text-white border-none"
            });

            setFormData({ name: '', phone: '', date: '', duration: '', budget: 'Standard', type: 'Family' });
            onClose();

        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Error", description: "Something went wrong." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            const numeric = value.replace(/\D/g, '').slice(0, 10);
            setFormData(prev => ({ ...prev, phone: numeric }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
                    />
                    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white pointer-events-auto rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col h-auto max-h-[85vh]"
                        >
                            {/* Header */}
                            <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Plan Your Trip</h3>
                                    <div className="flex items-center gap-1 mt-1">
                                        <div className={`h-1 rounded-full transition-all duration-300 ${step === 1 ? 'w-8 bg-primary' : 'w-2 bg-gray-200'}`} />
                                        <div className={`h-1 rounded-full transition-all duration-300 ${step === 2 ? 'w-8 bg-primary' : 'w-2 bg-gray-200'}`} />
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                <AnimatePresence mode="wait">
                                    {step === 1 ? (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            {/* Trip Type */}
                                            <div className="space-y-3">
                                                <label className="text-sm font-semibold text-gray-800">Trip Style</label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {['Family', 'Honeymoon', 'Adventure', 'Group'].map((type) => (
                                                        <button
                                                            key={type}
                                                            onClick={() => setFormData(prev => ({ ...prev, type }))}
                                                            className={`p-3 rounded-xl border text-sm font-medium transition-all ${formData.type === type
                                                                    ? 'border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary/20'
                                                                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                                                }`}
                                                            type="button"
                                                        >
                                                            {type}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Date & Duration */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                                                        <Calendar className="w-4 h-4 text-primary" /> Start Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        name="date"
                                                        value={formData.date}
                                                        onChange={handleChange}
                                                        className={`w-full px-3 py-2.5 rounded-xl border bg-gray-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-primary/20 ${errors.date ? 'border-red-500' : 'border-gray-200'}`}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                                                        <Clock className="w-4 h-4 text-primary" /> Days
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="duration"
                                                        placeholder="e.g. 5"
                                                        value={formData.duration}
                                                        onChange={handleChange}
                                                        className={`w-full px-3 py-2.5 rounded-xl border bg-gray-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-primary/20 ${errors.duration ? 'border-red-500' : 'border-gray-200'}`}
                                                    />
                                                </div>
                                            </div>

                                            {/* Budget */}
                                            <div className="space-y-3">
                                                <label className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                                                    <Wallet className="w-4 h-4 text-primary" /> Budget (Per Person)
                                                </label>
                                                <div className="flex flex-col gap-2">
                                                    {[
                                                        { label: 'Standard', sub: '₹18k - ₹25k', desc: 'Best Basics' },
                                                        { label: 'Premium', sub: '₹25k - ₹40k', desc: 'Most Popular' },
                                                        { label: 'Luxury', sub: '₹40k+', desc: 'All Inclusive' },
                                                    ].map((opt) => (
                                                        <button
                                                            key={opt.label}
                                                            onClick={() => setFormData(prev => ({ ...prev, budget: opt.label }))}
                                                            className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left group ${formData.budget === opt.label
                                                                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                                }`}
                                                            type="button"
                                                        >
                                                            <div>
                                                                <div className={`font-semibold text-sm ${formData.budget === opt.label ? 'text-primary' : 'text-gray-900'}`}>{opt.label}</div>
                                                                <div className="text-xs text-gray-500">{opt.desc}</div>
                                                            </div>
                                                            <div className={`text-xs font-medium px-2 py-1 rounded-md ${formData.budget === opt.label ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                                                                {opt.sub}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="space-y-6 py-4"
                                        >
                                            <div className="text-center space-y-2 mb-6">
                                                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                                                </div>
                                                <h4 className="text-xl font-bold text-gray-900">Almost Done!</h4>
                                                <p className="text-sm text-gray-500">Where should we send your custom itinerary?</p>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700">Full Name</label>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            placeholder="Enter your name"
                                                            value={formData.name}
                                                            onChange={handleChange}
                                                            className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-primary/20 ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold text-gray-700">Phone Number (WhatsApp)</label>
                                                    <div className="relative flex">
                                                        <div className="px-3 flex items-center justify-center bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-sm font-medium text-gray-600">
                                                            🇮🇳 +91
                                                        </div>
                                                        <input
                                                            type="tel"
                                                            name="phone"
                                                            placeholder="99999 99999"
                                                            value={formData.phone}
                                                            onChange={handleChange}
                                                            className={`w-full px-4 py-3 rounded-r-xl border bg-gray-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-primary/20 ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                                {step === 2 && (
                                    <button
                                        onClick={() => setStep(1)}
                                        className="px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-100 transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                )}
                                <Button
                                    onClick={handleNext}
                                    disabled={isSubmitting}
                                    className="flex-1 bg-primary hover:bg-orange-600 text-white font-bold h-12 rounded-xl shadow-lg shadow-orange-500/20 text-lg flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        'Sending...'
                                    ) : step === 1 ? (
                                        <>Next <ArrowRight className="w-5 h-5" /></>
                                    ) : (
                                        'Get My Free Quote'
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
