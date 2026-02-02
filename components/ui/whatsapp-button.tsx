'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import * as analytics from '@/lib/analytics';
import { X, Loader2, MessageCircle, AlertCircle, Phone, User, Send, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
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
    const [formData, setFormData] = useState({ name: '', phone: '', budget: '', travelDate: '' });
    const [errors, setErrors] = useState({ name: '', phone: '', budget: '', travelDate: '' });
    const [showTooltip, setShowTooltip] = useState(false);
    const dateInputRef = useRef<HTMLInputElement>(null);

    // Get today's date for min attribute
    const today = new Date().toISOString().split('T')[0];

    const countryCodes = [
        { code: '+91', iso: 'IN', label: 'India' }
    ];

    if (pathname?.startsWith('/admin') || pathname?.startsWith('/careers')) {
        return null;
    }

    const isPackageDetail = pathname?.startsWith('/packages/') && pathname !== '/packages';

    const validate = () => {
        let isValid = true;
        const newErrors = { name: '', phone: '', budget: '', travelDate: '' };

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

        // Travel Date Validation
        if (!formData.travelDate) {
            newErrors.travelDate = "Please select a date";
            isValid = false;
        }

        // Budget Validation
        if (!formData.budget) {
            newErrors.budget = "Please select a budget";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous errors
        setErrors({ name: '', phone: '', budget: '', travelDate: '' });

        if (!validate()) return;
        if (!executeRecaptcha) return;

        setIsSubmitting(true);

        const selectedCountry = countryCodes.find(c => c.iso === countryIso);
        const code = selectedCountry?.code || '+91';
        const fullPhone = `${code} ${formData.phone}`;

        try {
            const token = await executeRecaptcha('whatsapp_quick_chat');

            // 1. Save Lead quietly
            // Format nice date for display
            const niceDate = new Date(formData.travelDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

            await createInquiry({
                name: formData.name,
                phone: fullPhone,
                message: `Started Quick Chat via WhatsApp Button (Budget: ${formData.budget}, Travel: ${niceDate})`,
                type: "GENERAL",
                budget: formData.budget,
                startDate: formData.travelDate, // Pass as string (YYYY-MM-DD)
                captchaToken: token
            });

            // 2. Open WhatsApp
            const phoneNumber = '919103901803';
            const text = `Hi, I am ${formData.name}. I want to plan a trip around ${niceDate}. My budget is ${formData.budget}.`;
            // ... conversion tracking ...
            const budgetValue = formData.budget.includes('18k') ? 18000
                : formData.budget.includes('25k') ? 25000
                    : formData.budget.includes('40k') ? 40000
                        : 18000;

            analytics.event('Lead', {
                content_name: 'WhatsApp Quick Chat',
                value: budgetValue,
                currency: 'INR'
            });

            const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');

            // 3. Close & Reset
            setIsOpen(false);
            setFormData({ name: '', phone: '', budget: '', travelDate: '' });

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
                {isOpen && (
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
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-1">
                            {/* ... Form Content ... */}
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

                            <div className="space-y-1">
                                <div
                                    className="relative group cursor-pointer"
                                    onClick={() => {
                                        if (dateInputRef.current) {
                                            try {
                                                (dateInputRef.current as any).showPicker();
                                            } catch (err) {
                                                dateInputRef.current.focus();
                                            }
                                        }
                                    }}
                                >
                                    <CalendarIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 z-0" />

                                    <div className={`h-9 w-full pl-9 pr-3 py-2 text-sm rounded-md border bg-transparent flex items-center ${errors.travelDate ? 'border-red-500' : 'border-input group-hover:border-green-500'} ${!formData.travelDate ? 'text-gray-500' : 'text-gray-900'}`}>
                                        {formData.travelDate ? new Date(formData.travelDate).toLocaleDateString('en-GB') : "Select Travel Date"}
                                    </div>

                                    <input
                                        ref={dateInputRef}
                                        type="date"
                                        required
                                        min={today}
                                        value={formData.travelDate}
                                        onChange={(e) => {
                                            setFormData({ ...formData, travelDate: e.target.value });
                                            if (errors.travelDate) setErrors({ ...errors, travelDate: '' });
                                        }}
                                        onKeyDown={(e) => e.preventDefault()}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                </div>
                                {errors.travelDate && <p className="text-[10px] text-red-500 ml-1">{errors.travelDate}</p>}
                            </div>

                            <div className="space-y-1">
                                <div className="relative">
                                    <select
                                        required
                                        value={formData.budget}
                                        onChange={(e) => {
                                            setFormData({ ...formData, budget: e.target.value });
                                            if (errors.budget) setErrors({ ...errors, budget: '' });
                                        }}
                                        className={`h-9 w-full pl-3 pr-8 text-sm rounded-md border bg-white focus:ring-2 focus:ring-green-500/20 outline-none transition-all appearance-none cursor-pointer ${errors.budget ? 'border-red-500' : 'border-gray-200 focus:border-green-500'} ${!formData.budget ? 'text-gray-500' : 'text-gray-900'}`}
                                    >
                                        <option value="" disabled>Budget (Per Person)</option>
                                        <option value="Standard (18k - 25k)">Standard (₹18k - ₹25k)</option>
                                        <option value="Premium (25k - 40k)">Premium (₹25k - ₹40k)</option>
                                        <option value="Luxury (Above 40k)">Luxury (Above ₹40k)</option>
                                    </select>
                                    <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                                {errors.budget && <p className="text-[10px] text-red-500 ml-1">{errors.budget}</p>}
                            </div>

                            <div className="bg-orange-50 p-2 rounded border border-orange-100 flex gap-2 items-start">
                                <AlertCircle className="w-3 h-3 text-orange-600 mt-0.5 shrink-0" />
                                <p className="text-[10px] text-orange-800 leading-snug">
                                    <b>Note:</b> We specialize in premium trips. Minimum budget starts at <b>₹18,000/person</b>.
                                </p>
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

                        {/* Arrow */}
                        <div className="absolute -right-2 bottom-6 w-4 h-4 bg-white transform rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
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
