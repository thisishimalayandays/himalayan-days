'use client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, CheckCircle2, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { createInquiry, InquiryInput } from '@/app/actions/inquiries';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import * as analytics from '@/lib/analytics';
import { useToast } from "@/hooks/use-toast";

export function BookingForm({ packageTitle, packageId }: { packageTitle?: string, packageId?: string }) {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [countryIso, setCountryIso] = useState('IN');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        guests: '',
        budget: ''
    });
    const [errors, setErrors] = useState<{ name?: string, phone?: string, guests?: string, budget?: string }>({});
    const { toast } = useToast();

    const countryCodes = [
        { code: '+91', iso: 'IN', label: 'India' }
    ];

    // Get today's date for min attribute
    const today = new Date().toISOString().split('T')[0];

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

        // Guests
        // Guests
        const guestsNum = parseInt(formData.guests);
        if (isNaN(guestsNum) || guestsNum < 1) {
            newErrors.guests = "At least 1 guest";
            isValid = false;
        } else if (guestsNum > 50) {
            newErrors.guests = "Max 50 guests allowed";
            isValid = false;
        }

        // Budget Validation
        if (!formData.budget) {
            newErrors.budget = "Please select a budget range";
            isValid = false;
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

        // 1. Save to Database
        try {
            const token = await executeRecaptcha('booking_form_submit');

            const inquiryData: InquiryInput = {
                name: formData.name,
                phone: fullPhone,
                startDate: formData.date ? new Date(formData.date).toISOString() : undefined,
                type: "PACKAGE_BOOKING",
                travelers: parseInt(formData.guests) || undefined,
                budget: formData.budget || undefined,
                message: packageTitle ? `Booking Inquiry for Package: ${packageTitle}` : "General Booking Inquiry",
                packageId: packageId,
                captchaToken: token
            };

            const result = await createInquiry(inquiryData);

            if (!result.success) {
                toast({
                    variant: "destructive",
                    title: "Submission Failed",
                    description: result.error || "Please try again."
                });
                setIsSubmitting(false);
                return;
            }

            // Track Lead Event with Value
            const budgetValue = formData.budget.includes('18k') ? 18000
                : formData.budget.includes('25k') ? 25000
                    : formData.budget.includes('40k') ? 40000
                        : 18000;

            analytics.event('Lead', {
                content_name: packageTitle || 'General Inquiry',
                content_category: 'Booking',
                value: budgetValue,
                currency: 'INR'
            });

            toast({
                title: "Request Received! ✅",
                description: "Thank you. Our travel expert will contact you shortly to discuss your plan.",
                duration: 6000,
                className: "bg-green-600 text-white border-none"
            });

            setFormData({
                name: '',
                phone: '',
                date: '',
                guests: '',
                budget: ''
            });

        } catch (error) {
            console.error("Failed to save booking inquiry", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Something went wrong. Please try contacting us directly."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-24">
            <div className="bg-primary/5 p-6 border-b border-primary/10">
                <h3 className="text-xl font-bold text-gray-900">Book This Package</h3>
                <p className="text-sm text-gray-500">Fill the form or call us directly</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        required
                        type="text"
                        placeholder="Full Name"
                        autoComplete="name"
                        value={formData.name}
                        onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                        className={`w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${errors.name ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                    />
                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="flex gap-2">
                        <Select value={countryIso} onValueChange={setCountryIso}>
                            <SelectTrigger className="w-[140px] px-2 h-10 border-gray-200 bg-white">
                                <SelectValue placeholder="Code" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
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
                                            <span>{c.code}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="flex-1">
                            <input
                                required
                                type="tel"
                                placeholder="Phone Number"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                autoComplete="tel"
                                value={formData.phone}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    setFormData({ ...formData, phone: val });
                                    if (errors.phone) setErrors({ ...errors, phone: '' });
                                }}
                                className={`w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${errors.phone ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                            />
                            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Travel Date</label>
                        <input
                            required
                            type="date"
                            min={today}
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Guests</label>
                        <input
                            required
                            type="number"
                            min="1"
                            placeholder="2"
                            value={formData.guests}
                            onChange={(e) => {
                                setFormData({ ...formData, guests: e.target.value });
                                if (errors.guests) setErrors({ ...errors, guests: '' });
                            }}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Budget (Per Person)</label>
                    <div className="relative">
                        <select
                            required
                            value={formData.budget}
                            onChange={(e) => {
                                setFormData({ ...formData, budget: e.target.value });
                                if (errors.budget) setErrors({ ...errors, budget: '' });
                            }}
                            className={`w-full px-4 h-10 rounded-lg border bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer ${errors.budget ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-primary'} ${!formData.budget ? 'text-gray-500' : 'text-gray-900'}`}
                        >
                            <option value="" disabled>Select Range</option>
                            <option value="Standard (18k - 25k)">Standard (₹18k - ₹25k)</option>
                            <option value="Premium (25k - 40k)">Premium (₹25k - ₹40k)</option>
                            <option value="Luxury (Above 40k)">Luxury (Above ₹40k)</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.budget && <p className="text-xs text-red-500">{errors.budget}</p>}
                </div>

                <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 flex gap-2 items-start">
                    <span className="text-orange-600 mt-0.5 text-xs">ℹ️</span>
                    <p className="text-xs text-orange-800 leading-snug">
                        <strong>Note:</strong> Premium packages start from <strong>₹18,000/person</strong>. We prioritize quality experiences over cheap deals.
                    </p>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-orange-600 text-lg font-semibold h-12">
                    {isSubmitting ? 'Processing...' : 'Send Enquiry'}
                </Button>
            </form>
            <div className="px-6 pb-2">
                <p className="text-[10px] text-center text-gray-400">
                    This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" className="underline">Privacy Policy</a> and <a href="https://policies.google.com/terms" className="underline">Terms of Service</a> apply.
                </p>
            </div>

            <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Or call our travel expert</p>
                <a href="tel:+919103901803" className="flex items-center justify-center gap-2 text-primary font-bold text-lg hover:underline">
                    <Phone className="w-5 h-5" /> +91-9103901803
                </a>
            </div>

            <div className="p-4 bg-green-50/50 flex items-start gap-3 border-t border-green-100/50">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div className="text-xs text-green-800">
                    <strong>Best Price Guarantee:</strong> We match any comparable quote to ensure you get the best deal.
                </div>
            </div>
        </div>
    )
}
