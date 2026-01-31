'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Phone, Wallet, Map, Clock, Plane, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createInquiry, InquiryInput } from '@/app/actions/inquiries';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import * as analytics from '@/lib/analytics';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TripCustomizationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TripCustomizationModal({ isOpen, onClose }: TripCustomizationModalProps) {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [mounted, setMounted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [countryIso, setCountryIso] = useState('IN');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        duration: '',
        budget: 'Standard',
        type: 'Family'
    });
    const [errors, setErrors] = useState<{ name?: string, phone?: string }>({});
    const { toast } = useToast();

    const countryCodes = [
        { code: '+91', iso: 'IN', label: 'India' },
        { code: '+1', iso: 'US', label: 'USA' },
        { code: '+44', iso: 'GB', label: 'UK' },
        { code: '+971', iso: 'AE', label: 'UAE' },
        { code: '+61', iso: 'AU', label: 'Australia' },
        { code: '+1', iso: 'CA', label: 'Canada' },
        { code: '+65', iso: 'SG', label: 'Singapore' },
        { code: '+60', iso: 'MY', label: 'Malaysia' },
        { code: '+81', iso: 'JP', label: 'Japan' },
        { code: '+49', iso: 'DE', label: 'Germany' },
        { code: '+33', iso: 'FR', label: 'France' },
        { code: '+966', iso: 'SA', label: 'Saudi Arabia' },
        { code: '+974', iso: 'QA', label: 'Qatar' },
        { code: '+965', iso: 'KW', label: 'Kuwait' },
        { code: '+968', iso: 'OM', label: 'Oman' },
        { code: '+973', iso: 'BH', label: 'Bahrain' },
        { code: '+880', iso: 'BD', label: 'Bangladesh' },
        { code: '+94', iso: 'LK', label: 'Sri Lanka' },
        { code: '+977', iso: 'NP', label: 'Nepal' },
        { code: '+66', iso: 'TH', label: 'Thailand' },
        { code: '+62', iso: 'ID', label: 'Indonesia' },
        { code: '+63', iso: 'PH', label: 'Philippines' },
        { code: '+84', iso: 'VN', label: 'Vietnam' },
        { code: '+86', iso: 'CN', label: 'China' },
        { code: '+852', iso: 'HK', label: 'Hong Kong' },
        { code: '+82', iso: 'KR', label: 'South Korea' },
        { code: '+39', iso: 'IT', label: 'Italy' },
        { code: '+34', iso: 'ES', label: 'Spain' },
        { code: '+31', iso: 'NL', label: 'Netherlands' },
        { code: '+41', iso: 'CH', label: 'Switzerland' },
        { code: '+46', iso: 'SE', label: 'Sweden' },
        { code: '+47', iso: 'NO', label: 'Norway' },
        { code: '+45', iso: 'DK', label: 'Denmark' },
        { code: '+353', iso: 'IE', label: 'Ireland' },
        { code: '+32', iso: 'BE', label: 'Belgium' },
        { code: '+43', iso: 'AT', label: 'Austria' },
        { code: '+48', iso: 'PL', label: 'Poland' },
        { code: '+351', iso: 'PT', label: 'Portugal' },
        { code: '+30', iso: 'GR', label: 'Greece' },
        { code: '+90', iso: 'TR', label: 'Turkey' },
        { code: '+7', iso: 'RU', label: 'Russia' },
        { code: '+20', iso: 'EG', label: 'Egypt' },
        { code: '+27', iso: 'ZA', label: 'South Africa' },
        { code: '+254', iso: 'KE', label: 'Kenya' },
        { code: '+55', iso: 'BR', label: 'Brazil' },
        { code: '+52', iso: 'MX', label: 'Mexico' },
        { code: '+54', iso: 'AR', label: 'Argentina' },
        { code: '+64', iso: 'NZ', label: 'New Zealand' },
        { code: '+93', iso: 'AF', label: 'Afghanistan' },
        { code: '+95', iso: 'MM', label: 'Myanmar' },
        { code: '+960', iso: 'MV', label: 'Maldives' },
        { code: '+975', iso: 'BT', label: 'Bhutan' },
        { code: '+98', iso: 'IR', label: 'Iran' },
        { code: '+964', iso: 'IQ', label: 'Iraq' },
    ];

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setErrors({});
        } else {
            document.body.style.overflow = 'unset';
            setIsSubmitting(false); // Reset submitting state on close
        }
        return () => {
            document.body.style.overflow = 'unset';
            // clean up just in case
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

        if (countryIso === 'IN') {
            if (cleanPhone.length !== 10) {
                newErrors.phone = "Indian numbers must be exactly 10 digits";
                isValid = false;
            } else if (!/^[6-9]/.test(cleanPhone)) {
                newErrors.phone = "Invalid Indian mobile number";
                isValid = false;
            }
        } else {
            if (cleanPhone.length < 10 || cleanPhone.length > 15) {
                newErrors.phone = "Enter valid phone (10-15 digits)";
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        if (!validate()) return;

        if (!executeRecaptcha) {
            console.error("ReCAPTCHA not ready");
            return;
        }

        setIsSubmitting(true);

        const selectedCountry = countryCodes.find(c => c.iso === countryIso);
        const code = selectedCountry?.code || '+91';
        const fullPhone = `${code} ${formData.phone}`;

        try {
            const token = await executeRecaptcha('trip_customization_submit');

            // 1. Save to Database
            const inquiryData: InquiryInput = {
                name: formData.name,
                phone: fullPhone,
                startDate: formData.date ? new Date(formData.date).toISOString() : undefined,
                budget: formData.budget,
                type: "PLAN_MY_TRIP",
                // Construct a message with extra details not directly mapped
                message: `Duration: ${formData.duration} days, Type: ${formData.type}`,
                travelers: undefined,
                captchaToken: token
            };

            const result = await createInquiry(inquiryData);

            if (!result.success) {
                toast({
                    variant: "destructive",
                    title: "Submission Failed",
                    description: result.error || "Spam detected. Please try again."
                });
                setIsSubmitting(false);
                return;
            }

            // Track Lead Event
            analytics.event('Lead', {
                content_name: 'Trip Customization',
                value: 0,
                currency: 'INR'
            });

            // Success - No Redirect
            toast({
                title: "Trip Request Sent! ✈️",
                description: "Our experts are reviewing your plan. Expect a call shortly!",
                className: "bg-green-50 border-green-200 text-green-800"
            });

            setFormData({
                name: '', phone: '', date: '', duration: '', budget: 'Standard', type: 'Family'
            });
            onClose();

        } catch (error) {
            console.error("Failed to save inquiry", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Something went wrong."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (e.target.name === 'phone') {
            const val = e.target.value.replace(/\D/g, '');
            setFormData(prev => ({ ...prev, phone: val }));
        } else {
            setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        }
        // Clear error on type
        if (errors[e.target.name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
        }
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
                                            placeholder="Full Name"
                                            autoComplete="name"
                                            className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400 ${errors.name ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                                        />
                                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                            <Phone className="w-4 h-4 text-primary" /> Phone
                                        </label>
                                        <div className="flex gap-3">
                                            <Select value={countryIso} onValueChange={setCountryIso}>
                                                <SelectTrigger className="w-[110px] px-3 h-[46px] border border-gray-200 rounded-xl bg-white focus:ring-1 focus:ring-primary/20">
                                                    <SelectValue placeholder="Code" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[250px] z-[10000]">
                                                    {countryCodes.map((c) => (
                                                        <SelectItem key={c.iso} value={c.iso}>
                                                            <div className="flex items-center gap-2">
                                                                <img
                                                                    src={`https://flagcdn.com/w20/${c.iso.toLowerCase()}.png`}
                                                                    srcSet={`https://flagcdn.com/w40/${c.iso.toLowerCase()}.png 2x`}
                                                                    width="20"
                                                                    alt={c.iso}
                                                                    className="object-contain"
                                                                />
                                                                <span className="text-xs text-muted-foreground">{c.code}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <div className="flex-1 relative">
                                                <input
                                                    required
                                                    type="tel"
                                                    name="phone"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="Phone Number"
                                                    autoComplete="tel"
                                                    className={`w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400 ${errors.phone ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                                                />
                                            </div>
                                        </div>
                                        {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
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
                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold h-12 rounded-xl shadow-lg hover:shadow-xl hover:shadow-orange-600/20 transition-all text-lg flex items-center justify-center gap-2 mt-2"
                                >
                                    <Plane className="w-5 h-5 fill-current" />
                                    {isSubmitting ? 'Processing...' : 'Submit Trip Request'}
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
