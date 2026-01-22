'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
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
        setIsSubmitting(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const fullName = `${formData.firstName} ${formData.lastName}`;
        const message = `Hello, I have an enquiry from the website.\n\nName: ${fullName}\nPhone: ${formData.phone}\nEmail: ${formData.email}\nMessage: ${formData.message}`;
        const whatsappUrl = `https://wa.me/918825039323?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        setIsSubmitting(false);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            message: ''
        });
    };

    return (
        <main className="min-h-screen bg-white font-sans">
            <div className="bg-black/90"><Header /></div>

            <PageHeader
                title="Contact Us"
                description="Get in touch with our travel experts to plan your dream Kashmir vacation."
                image="https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop"
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
                                    <a href="tel:+918825039323" className="text-lg font-bold text-gray-900 hover:text-primary transition-colors block">+91-8825039323</a>
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
                                        Malabagh Naseem Bagh Srinagar,<br />
                                        190006, Jammu and Kashmir, India
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
                        </form>
                    </div>
                </div>

                {/* Map Embed */}
                <div className="mt-24 w-full h-[400px] rounded-2xl overflow-hidden bg-gray-200 grayscale hover:grayscale-0 transition-all duration-500">
                    <iframe
                        src="https://maps.google.com/maps?q=Mala+bagh+Naseem+bagh+Srinagar&t=&z=16&ie=UTF8&iwloc=B&output=embed"
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
    )
}
