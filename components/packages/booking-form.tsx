'use client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { createInquiry, InquiryInput } from '@/app/actions/inquiries';

export function BookingForm({ packageTitle, packageId }: { packageTitle?: string, packageId?: string }) {
    const [countryIso, setCountryIso] = useState('IN');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        guests: ''
    });

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

    // Get today's date for min attribute
    const today = new Date().toISOString().split('T')[0];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const selectedCountry = countryCodes.find(c => c.iso === countryIso);
        const code = selectedCountry?.code || '+91';
        const fullPhone = `${code} ${formData.phone}`;

        // 1. Save to Database
        try {
            const inquiryData: InquiryInput = {
                name: formData.name,
                phone: fullPhone,
                startDate: formData.date ? new Date(formData.date).toISOString() : undefined,
                type: "PACKAGE_BOOKING",
                travelers: parseInt(formData.guests) || undefined,
                message: packageTitle ? `Booking Inquiry for Package: ${packageTitle}` : "General Booking Inquiry",
                packageId: packageId
            };
            await createInquiry(inquiryData);
        } catch (error) {
            console.error("Failed to save booking inquiry", error);
        }

        // 2. WhatsApp Redirect
        const packageNameText = packageTitle ? `\nPackage: *${packageTitle}*` : '';
        const message = `Hello, I am interested in booking a package.${packageNameText}\n\nName: ${formData.name}\nPhone: ${fullPhone}\nDate: ${formData.date}\nGuests: ${formData.guests}`;
        const whatsappUrl = `https://wa.me/919103901803?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        setIsSubmitting(false);
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
                        placeholder="John Doe"
                        pattern="^[a-zA-Z\s\.]+$"
                        title="Name should only contain letters"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all [&:not(:placeholder-shown):invalid]:border-red-500 [&:not(:placeholder-shown):invalid]:text-red-600 focus:invalid:ring-red-500/20"
                    />
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
                        <input
                            required
                            type="tel"
                            placeholder="9999999999"
                            pattern="^[0-9]{10}$"
                            title="Please enter exactly 10 digits"
                            maxLength={10}
                            minLength={10}
                            value={formData.phone}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                if (val.length <= 10) {
                                    setFormData({ ...formData, phone: val });
                                }
                            }}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all [&:not(:placeholder-shown):invalid]:border-red-500 [&:not(:placeholder-shown):invalid]:text-red-600 focus:invalid:ring-red-500/20"
                        />
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
                            onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all [&:not(:placeholder-shown):invalid]:border-red-500 [&:not(:placeholder-shown):invalid]:text-red-600 focus:invalid:ring-red-500/20"
                        />
                    </div>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-orange-600 text-lg font-semibold h-12">
                    {isSubmitting ? 'Processing...' : 'Send Enquiry'}
                </Button>
            </form>

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
