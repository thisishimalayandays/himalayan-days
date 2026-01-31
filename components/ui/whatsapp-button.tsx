'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import * as analytics from '@/lib/analytics';
import { X, Loader2, MessageCircle, AlertCircle, Phone, User, Send } from 'lucide-react';
import { createInquiry } from '@/app/actions/inquiries';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function WhatsAppButton() {
    const pathname = usePathname();
    const { executeRecaptcha } = useGoogleReCaptcha();

    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [countryIso, setCountryIso] = useState('IN');
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [errors, setErrors] = useState({ name: '', phone: '' });
    const [showTooltip, setShowTooltip] = useState(false);

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

        // Clear previous errors
        setErrors({ name: '', phone: '' });

        if (!validate()) return;
        if (!executeRecaptcha) return;

        setIsSubmitting(true);

        const selectedCountry = countryCodes.find(c => c.iso === countryIso);
        const code = selectedCountry?.code || '+91';
        const fullPhone = `${code} ${formData.phone}`;

        try {
            const token = await executeRecaptcha('whatsapp_quick_chat');

            // 1. Save Lead quietly
            await createInquiry({
                name: formData.name,
                phone: fullPhone,
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
                        className="bg-white p-4 rounded-2xl shadow-xl flex flex-col gap-3 relative w-[320px] origin-bottom-right mb-2"
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
                                <div className="space-y-1">
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                        <Input
                                            placeholder="Full Name"
                                            className={`h-9 pl-9 text-sm ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                            required
                                            autoComplete="name"
                                            value={formData.name}
                                            onChange={(e) => {
                                                setFormData({ ...formData, name: e.target.value });
                                                if (errors.name) setErrors({ ...errors, name: '' });
                                            }}
                                        />
                                    </div>
                                    {errors.name && <p className="text-[10px] text-red-500 ml-1">{errors.name}</p>}
                                </div>

                                <div className="space-y-1">
                                    <div className="flex gap-2">
                                        <Select value={countryIso} onValueChange={setCountryIso}>
                                            <SelectTrigger className="w-[85px] px-2 h-9 border-gray-200 bg-white text-xs">
                                                <SelectValue placeholder="Code" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[200px] w-[200px] z-[9999]">
                                                {countryCodes.map((c) => (
                                                    <SelectItem key={c.iso} value={c.iso} className="text-xs">
                                                        <div className="flex items-center gap-2">
                                                            <img
                                                                src={`https://flagcdn.com/w20/${c.iso.toLowerCase()}.png`}
                                                                srcSet={`https://flagcdn.com/w40/${c.iso.toLowerCase()}.png 2x`}
                                                                width="16"
                                                                alt={c.iso}
                                                                className="object-contain"
                                                            />
                                                            <span>{c.code}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <div className="relative flex-1">
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
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    setFormData({ ...formData, phone: val });
                                                    if (errors.phone) setErrors({ ...errors, phone: '' });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {errors.phone && <p className="text-[10px] text-red-500 ml-1">{errors.phone}</p>}
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
