'use client';
import { Button } from '@/components/ui/button';
import { Phone, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export function BookingForm({ packageTitle }: { packageTitle?: string }) {
    const [countryCode, setCountryCode] = useState('+91');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        guests: ''
    });

    const countryCodes = [
        { code: '+91', label: '🇮🇳 India (+91)' },
        { code: '+1', label: '🇺🇸 USA (+1)' },
        { code: '+44', label: '🇬🇧 UK (+44)' },
        { code: '+971', label: '🇦🇪 UAE (+971)' },
        { code: '+61', label: '🇦🇺 Australia (+61)' },
        { code: '+1', label: '🇨🇦 Canada (+1)' },
        { code: '+65', label: '🇸🇬 Singapore (+65)' },
        { code: '+60', label: '🇲🇾 Malaysia (+60)' },
        { code: '+81', label: '🇯🇵 Japan (+81)' },
        { code: '+49', label: '🇩🇪 Germany (+49)' },
        { code: '+33', label: '🇫🇷 France (+33)' },
        { code: '+966', label: '🇸🇦 Saudi Arabia (+966)' },
        { code: '+974', label: '🇶🇦 Qatar (+974)' },
        { code: '+965', label: '🇰🇼 Kuwait (+965)' },
        { code: '+968', label: '🇴🇲 Oman (+968)' },
        { code: '+973', label: '🇧🇭 Bahrain (+973)' },
        { code: '+880', label: '🇧🇩 Bangladesh (+880)' },
        { code: '+94', label: '🇱🇰 Sri Lanka (+94)' },
        { code: '+977', label: '🇳🇵 Nepal (+977)' },
        { code: '+66', label: '🇹🇭 Thailand (+66)' },
        { code: '+62', label: '🇮🇩 Indonesia (+62)' },
        { code: '+63', label: '🇵🇭 Philippines (+63)' },
        { code: '+84', label: '🇻🇳 Vietnam (+84)' },
        { code: '+86', label: '🇨🇳 China (+86)' },
        { code: '+852', label: '🇭🇰 Hong Kong (+852)' },
        { code: '+82', label: '🇰🇷 South Korea (+82)' },
        { code: '+39', label: '🇮🇹 Italy (+39)' },
        { code: '+34', label: '🇪🇸 Spain (+34)' },
        { code: '+31', label: '🇳🇱 Netherlands (+31)' },
        { code: '+41', label: '🇨🇭 Switzerland (+41)' },
        { code: '+46', label: '🇸🇪 Sweden (+46)' },
        { code: '+47', label: '🇳🇴 Norway (+47)' },
        { code: '+45', label: '🇩🇰 Denmark (+45)' },
        { code: '+353', label: '🇮🇪 Ireland (+353)' },
        { code: '+32', label: '🇧🇪 Belgium (+32)' },
        { code: '+43', label: '🇦🇹 Austria (+43)' },
        { code: '+48', label: '🇵🇱 Poland (+48)' },
        { code: '+351', label: '🇵🇹 Portugal (+351)' },
        { code: '+30', label: '🇬🇷 Greece (+30)' },
        { code: '+90', label: '🇹🇷 Turkey (+90)' },
        { code: '+7', label: '🇷🇺 Russia (+7)' },
        { code: '+20', label: '🇪🇬 Egypt (+20)' },
        { code: '+27', label: '🇿🇦 South Africa (+27)' },
        { code: '+254', label: '🇰🇪 Kenya (+254)' },
        { code: '+55', label: '🇧🇷 Brazil (+55)' },
        { code: '+52', label: '🇲🇽 Mexico (+52)' },
        { code: '+54', label: '🇦🇷 Argentina (+54)' },
        { code: '+64', label: '🇳🇿 New Zealand (+64)' },
        { code: '+92', label: '🇵🇰 Pakistan (+92)' },
        { code: '+93', label: '🇦🇫 Afghanistan (+93)' },
        { code: '+95', label: '🇲🇲 Myanmar (+95)' },
        { code: '+960', label: '🇲🇻 Maldives (+960)' },
        { code: '+975', label: '🇧🇹 Bhutan (+975)' },
        { code: '+98', label: '🇮🇷 Iran (+98)' },
        { code: '+964', label: '🇮🇶 Iraq (+964)' },
        { code: '+972', label: '🇮🇱 Israel (+972)' },
    ];

    // Get today's date for min attribute
    const today = new Date().toISOString().split('T')[0];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fullPhone = `${countryCode} ${formData.phone}`;
        const packageNameText = packageTitle ? `\nPackage: *${packageTitle}*` : '';
        const message = `Hello, I am interested in booking a package.${packageNameText}\n\nName: ${formData.name}\nPhone: ${fullPhone}\nDate: ${formData.date}\nGuests: ${formData.guests}`;
        const whatsappUrl = `https://wa.me/918825039323?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
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
                        <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="w-[140px] px-2 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-white"
                        >
                            {countryCodes.map((c, i) => (
                                <option key={i} value={c.code}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
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

                <Button type="submit" className="w-full bg-primary hover:bg-orange-600 text-lg font-semibold h-12">
                    Send Enquiry
                </Button>
            </form>

            <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Or call our travel expert</p>
                <a href="tel:+918825039323" className="flex items-center justify-center gap-2 text-primary font-bold text-lg hover:underline">
                    <Phone className="w-5 h-5" /> +91-8825039323
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
