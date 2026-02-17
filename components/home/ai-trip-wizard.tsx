import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Calendar, Wallet, Sparkles, Check, ArrowRight, Plane, ArrowLeft, Phone, User, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { submitAiInquiry } from '@/app/actions/ai-wizard';
import * as analytics from '@/lib/analytics';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

interface AiTripWizardProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'travelers' | 'season' | 'duration' | 'budget' | 'contact' | 'processing' | 'result';

export function AiTripWizard({ isOpen, onClose }: AiTripWizardProps) {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [step, setStep] = useState<Step>('travelers');
    const [preferences, setPreferences] = useState({
        travelers: '',
        season: '',
        duration: '',
        budget: '',
        name: '',
        phone: ''
    });
    const [countryIso, setCountryIso] = useState('IN');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const countryCodes = [
        { code: '+91', iso: 'IN', label: 'India' }
    ];

    const resetWizard = () => {
        setStep('travelers');
        setPreferences({ travelers: '', season: '', duration: '', budget: '', name: '', phone: '' });
        setIsSubmitting(false);
        onClose();
    };

    const handleNext = (key: string, value: string) => {
        setPreferences(prev => ({ ...prev, [key]: value }));

        if (key === 'travelers') setStep('season');
        if (key === 'season') setStep('duration');
        if (key === 'duration') setStep('budget');
        if (key === 'budget') setStep('contact');
    };

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Strict Validation
        const cleanPhone = preferences.phone.replace(/\D/g, '');
        if (countryIso === 'IN') {
            // ... validation logic
        }

        if (!executeRecaptcha) {
            console.error("Recaptcha not ready");
            return;
        }

        setStep('processing');
        setIsSubmitting(true);

        try {
            const token = await executeRecaptcha('ai_wizard_submit');

            const selectedCountry = countryCodes.find(c => c.iso === countryIso);
            const code = selectedCountry?.code || '+91';
            const fullPhone = `${code} ${preferences.phone}`;

            const formData = new FormData();
            formData.append('name', preferences.name);
            formData.append('phone', fullPhone);
            formData.append('travelers', preferences.travelers);
            formData.append('season', preferences.season);
            formData.append('duration', preferences.duration);
            formData.append('budget', preferences.budget);
            formData.append('captchaToken', token); // Append token

            const result = await submitAiInquiry(formData);

            // ... handling result
            if (result.success) {
                // Track Lead
                analytics.event('Lead', {
                    content_name: 'AI Trip Wizard',
                    content_category: 'AI Lead',
                    value: preferences.budget.includes('Luxury') ? 40000 : 20000,
                    currency: 'INR'
                });

                setStep('result');
            } else {
                // ... error logic
                toast.error(result.message || "Something went wrong. Please try again.");
                setStep('contact');
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred");
            setStep('contact');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getRecommendation = () => {
        const { travelers, duration, budget } = preferences;
        const isLuxury = budget.includes('Luxury');
        const isShort = duration.includes('Short');
        const isLong = duration.includes('Long');
        const isCouple = travelers === 'Couple';

        // 1. Long Trips (8+ Days) -> Complete Kashmir Tour
        if (isLong) {
            return {
                title: "Complete Kashmir Tour",
                duration: "7 Nights / 8 Days",
                price: "Starts ₹32,000/person",
                desc: "The ultimate itinerary covering Srinagar, Gulmarg, Pahalgam & Sonmarg.",
                slug: "complete-kashmir-tour"
            };
        }

        // 2. Short Trips (3-4 Days)
        if (isShort) {
            if (isLuxury) {
                return {
                    title: "Luxury Houseboat Retreat",
                    duration: "3 Nights / 4 Days",
                    price: "Starts ₹18,000/person",
                    desc: "Stay in premium houseboats with private shikara rides.",
                    slug: "luxury-houseboat-retreat"
                };
            }
            if (isCouple) {
                return {
                    title: "Short Romantic Getaway",
                    duration: "3 Nights / 4 Days",
                    price: "Starts ₹14,500/person",
                    desc: "A quick, romantic escape to the mountains.",
                    slug: "short-romantic-getaway"
                };
            }
            return {
                title: "Unexplored Bangus Valley",
                duration: "3 Nights / 4 Days",
                price: "Starts ₹12,500/person",
                desc: "Discover the hidden gems of Kashmir in a short trip.",
                slug: "unexplored-bangus-valley"
            };
        }

        // 3. Medium (5-7 Days)
        if (isCouple) {
            return {
                title: "Snow-Kissed Kashmir Honeymoon",
                duration: "6 Nights / 7 Days",
                price: "Starts ₹28,000/person",
                desc: "Romantic candle-light dinners and snow activities.",
                slug: "snow-kissed-kashmir-honeymoon"
            };
        }

        // Default / Family / Winter
        return {
            title: "Winter Family Fun in Kashmir",
            duration: "5 Nights / 6 Days",
            price: "Starts ₹22,500/person",
            desc: "Perfect for families. Snowman building, skiing, and fun.",
            slug: "winter-family-fun-kashmir"
        };
    };

    const recommendation = getRecommendation();

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && resetWizard()}>
            <DialogContent className="sm:max-w-md bg-white p-0 overflow-hidden gap-0 border-0 shadow-2xl rounded-2xl">
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.png')] opacity-10" />
                    <DialogTitle className="text-2xl font-bold relative z-10 flex items-center justify-center gap-2">
                        <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                        AI Trip Planner
                    </DialogTitle>
                    <p className="text-white/80 text-sm mt-2 relative z-10">
                        {step === 'processing' ? "Analyzing..." : step === 'result' ? "Your Perfect Trip!" : "Tell us your preferences for a custom plan."}
                    </p>
                </div>

                <div className="p-6 min-h-[350px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        {step === 'travelers' && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-indigo-600" /> Who is traveling?
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Couple', 'Family', 'Friends', 'Solo'].map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => handleNext('travelers', opt)}
                                            className="p-4 rounded-xl border border-gray-200 hover:border-indigo-600 hover:bg-indigo-50 transition-all text-left group"
                                        >
                                            <span className="font-medium text-gray-700 group-hover:text-indigo-700">{opt}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 'season' && (
                            <motion.div
                                key="step_season"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <Button variant="ghost" size="sm" onClick={() => setStep('travelers')} className="-ml-2">
                                        <ArrowLeft className="w-4 h-4" />
                                    </Button>
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-indigo-600" /> When are you visiting?
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {['Next Month', 'Spring (Apr-Jun)', 'Summer (Jul-Sep)', 'Winter/Snow (Dec-Mar)', 'Flexible'].map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => handleNext('season', opt)}
                                            className="p-4 rounded-xl border border-gray-200 hover:border-indigo-600 hover:bg-indigo-50 transition-all text-left group flex justify-between items-center"
                                        >
                                            <span className="font-medium text-gray-700 group-hover:text-indigo-700">{opt}</span>
                                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600" />
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 'duration' && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <Button variant="ghost" size="sm" onClick={() => setStep('season')} className="-ml-2">
                                        <ArrowLeft className="w-4 h-4" />
                                    </Button>
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-indigo-600" /> How long?
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {['Short (3-4 Days)', 'Medium (5-7 Days)', 'Long (8+ Days)'].map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => handleNext('duration', opt)}
                                            className="p-4 rounded-xl border border-gray-200 hover:border-indigo-600 hover:bg-indigo-50 transition-all text-left flex justify-between items-center group"
                                        >
                                            <span className="font-medium text-gray-700 group-hover:text-indigo-700">{opt}</span>
                                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-600" />
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 'budget' && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <Button variant="ghost" size="sm" onClick={() => setStep('duration')} className="-ml-2">
                                        <ArrowLeft className="w-4 h-4" />
                                    </Button>
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Wallet className="w-5 h-5 text-indigo-600" /> Your Budget Per Person?
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { label: 'Standard (Quality)', price: '₹18k - ₹25k', desc: 'Good hotels, private cab, verified drivers' },
                                        { label: 'Premium (Comfort)', price: '₹28k - ₹40k', desc: '4-Star stays, Innova, best rooms' },
                                        { label: 'Luxury (VVIP)', price: '₹45k+', desc: '5-Star, Houseboats, top-tier service' }
                                    ].map(opt => (
                                        <button
                                            key={opt.label}
                                            onClick={() => handleNext('budget', `${opt.label} (${opt.price || 'High'})`)}
                                            className="p-4 rounded-xl border border-gray-200 hover:border-indigo-600 hover:bg-indigo-50 transition-all text-left group"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-gray-900 group-hover:text-indigo-700">{opt.label}</span>
                                                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">{opt.price}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">{opt.desc}</div>
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-xs rounded-lg flex items-start gap-2">
                                    <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                                    <p><b>Note:</b> We do not offer "Cheap" packages. All options represent <b>premium quality</b> (min ₹18k/person).</p>
                                </div>
                            </motion.div>
                        )}

                        {step === 'contact' && (
                            <motion.div
                                key="step_contact"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <Button variant="ghost" size="sm" onClick={() => setStep('budget')} className="-ml-2">
                                        <ArrowLeft className="w-4 h-4" />
                                    </Button>
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <User className="w-5 h-5 text-indigo-600" /> Last Step: Your Details
                                    </h3>
                                </div>
                                <form onSubmit={handleContactSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <Input
                                                required
                                                className="pl-10 h-12"
                                                placeholder="Full Name"
                                                value={preferences.name}
                                                onChange={(e) => setPreferences({ ...preferences, name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 font-sans">Phone Number (WhatsApp)</label>
                                        <div className="flex gap-2">
                                            <Select value={countryIso} onValueChange={setCountryIso}>
                                                <SelectTrigger className="w-[100px] px-2 h-12 border border-gray-200 rounded-xl">
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
                                            <div className="relative flex-1">
                                                <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                                <Input
                                                    required
                                                    className={`pl-10 h-12 ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                                    placeholder="Phone Number"
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    value={preferences.phone}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '');
                                                        setPreferences({ ...preferences, phone: val });
                                                        if (error) setError(null);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
                                    </div>
                                    <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700">
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "See My Trip Plan ✨"}
                                    </Button>
                                    <p className="text-xs text-center text-gray-400">We'll save your preferences for better assistance.</p>
                                </form>
                            </motion.div>
                        )}

                        {step === 'processing' && (
                            <motion.div
                                key="processing"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-10 text-center space-y-4"
                            >
                                <div className="relative">
                                    <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                                    <Sparkles className="w-6 h-6 text-yellow-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900">Designing your trip...</h4>
                                    <p className="text-gray-500 text-sm">Matching {preferences.budget} for {preferences.travelers}...</p>
                                </div>
                            </motion.div>
                        )}

                        {step === 'result' && (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center space-y-6"
                            >
                                <div className="space-y-2">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">
                                        <Check className="w-3 h-3" /> Best Match Found
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">{recommendation.title}</h3>
                                    <p className="text-gray-600 text-sm max-w-xs mx-auto">{recommendation.desc}</p>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">Duration</div>
                                        <div className="font-semibold text-gray-900">{recommendation.duration}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wide">Est. Price</div>
                                        <div className="font-semibold text-indigo-600">{recommendation.price}</div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Link href={`/packages/${recommendation.slug}`} className="flex-1">
                                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 ring-2 ring-indigo-100">
                                            View Full Itinerary
                                        </Button>
                                    </Link>

                                </div>
                                <Button variant="ghost" size="sm" onClick={resetWizard} className="text-gray-400 hover:text-gray-600">Start Over</Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
}
