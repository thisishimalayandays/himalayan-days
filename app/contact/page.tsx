'use client';
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/layout/page-header';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

function ContactForm() {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!executeRecaptcha) {
            toast.error("Captcha not ready yet. Please try again.");
            return;
        }

        setIsSubmitting(true);

        try {
            const token = await executeRecaptcha('contact_form_submit');

            const formDataObj = new FormData();
            formDataObj.append('firstName', formData.firstName);
            formDataObj.append('lastName', formData.lastName);
            formDataObj.append('email', formData.email);
            formDataObj.append('phone', formData.phone);
            formDataObj.append('message', formData.message);
            formDataObj.append('captchaToken', token);

            const { sendContactEmail } = await import('@/app/actions/contact');
            const result = await sendContactEmail(formDataObj);

            if (result.success) {
                toast.success("Message sent successfully!", {
                    description: "We'll get back to you shortly."
                });
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    message: ''
                });
            } else {
                toast.error(result.message || "Something went wrong.");
            }
        } catch (error) {
            toast.error("Failed to send message. Please try again.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">First Name</label>
                    <input
                        required
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="John"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        required
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="Doe"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="john@example.com"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="+91 99999 99999"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Message</label>
                <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="Tell us about your travel plans..."
                />
            </div>

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-orange-600 text-lg font-bold h-14"
            >
                {isSubmitting ? 'Sending Message...' : 'Send Message'}
            </Button>
            <p className="text-xs text-center text-gray-400 mt-2">
                Protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" className="underline">Privacy Policy</a> and <a href="https://policies.google.com/terms" className="underline">Terms of Service</a> apply.
            </p>
        </form>
    );
}

export default function ContactPage() {
    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            scriptProps={{
                async: false,
                defer: false,
                appendTo: "head",
                nonce: undefined,
            }}
        >
            <main className="min-h-screen bg-white font-sans">
                <div className="bg-black/90"><Header /></div>

                <PageHeader
                    title="Contact Us"
                    description="Get in touch with our travel experts to plan your dream Kashmir vacation."
                    image="/Destinations/Srinagar.jpeg"
                />

                <div className="container mx-auto px-4 py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Contact Info */}
                        <div className="space-y-12">
                            <div>
                                <span className="text-primary font-bold uppercase tracking-widest text-sm">Get in Touch</span>
                                <h2 className="text-4xl font-bold text-gray-900 mt-2">Ready to Start Your Journey?</h2>
                                <p className="text-gray-600 mt-4 text-lg leading-relaxed">
                                    Whether you have a question about packages, pricing, or need a custom itinerary, our team is ready to answer all your questions.
                                </p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-start gap-6">
                                    <div className="bg-primary/10 p-4 rounded-full text-primary">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Phone Support</h3>
                                        <p className="text-gray-600 mb-2">24/7 Support for your travel needs.</p>
                                        <a href="tel:+919103901803" className="text-lg font-bold text-gray-900 hover:text-primary transition-colors block">+91-9103901803</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6">
                                    <div className="bg-primary/10 p-4 rounded-full text-primary">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Email Us</h3>
                                        <p className="text-gray-600 mb-2">We usually reply within 24 hours.</p>
                                        <a href="mailto:thisishimalayandays@gmail.com" className="text-lg font-bold text-gray-900 hover:text-primary transition-colors">thisishimalayandays@gmail.com</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6">
                                    <div className="bg-primary/10 p-4 rounded-full text-primary">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Our Office</h3>
                                        <p className="text-gray-600 text-lg">
                                            Himalayan Days/Kashmir Tour and Travel Agency,<br />
                                            Malabagh, Naseem bagh, Omer Colony B, Lal Bazar,<br />
                                            Srinagar, Jammu and Kashmir 190006
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6">
                                    <div className="bg-primary/10 p-4 rounded-full text-primary">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Business Hours</h3>
                                        <p className="text-gray-600 text-lg">
                                            Mon - Sat: 09:00 AM - 08:00 PM<br />
                                            Sunday: Closed
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-gray-50 p-8 md:p-12 rounded-3xl border border-gray-100">
                            <ContactForm />
                        </div>
                    </div>

                    {/* Map Embed */}
                    <div className="mt-24 w-full h-[400px] rounded-2xl overflow-hidden bg-gray-200 grayscale hover:grayscale-0 transition-all duration-500">
                        <iframe
                            src="https://maps.google.com/maps?q=34.144059,74.828131&t=&z=16&ie=UTF8&iwloc=B&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>

                <Footer />
            </main>
        </GoogleReCaptchaProvider>
    )
}
