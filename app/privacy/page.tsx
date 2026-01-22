'use client';
import { PageHeader } from '@/components/layout/page-header';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-white font-sans">
            <div className="bg-black/90"><Header /></div>

            <PageHeader
                title="Privacy Policy"
                description="We care about your privacy and data security."
                image="https://images.unsplash.com/photo-1519681393798-3828fb4090bb?q=80&w=2070&auto=format&fit=crop"
            />

            <div className="container mx-auto px-4 py-24 max-w-4xl">
                <div className="prose prose-lg mx-auto text-gray-600">
                    <p>Last Updated: {new Date().toLocaleDateString()}</p>

                    <h3>1. Introduction</h3>
                    <p>Welcome to Himalayan Days. We respect your privacy and are committed to protecting your personal data.</p>

                    <h3>2. Data Collection</h3>
                    <p>We collect information you provide directly to us, such as when you fill out a contact form, book a trip, or sign up for our newsletter. This includes your name, email address, phone number, and travel preferences.</p>

                    <h3>3. Use of Information</h3>
                    <p>We use your information to provide travel services, communicate with you about your bookings, and send you promotional updates (if you opted in).</p>

                    <h3>4. Data Sharing</h3>
                    <p>We do not sell your personal data. We may share your information with third-party service providers (hotels, transport operators) strictly for the purpose of fulfilling your booking.</p>

                    <h3>5. Contact Us</h3>
                    <p>If you have any questions about this privacy policy, please contact us at info@himalayandays.com.</p>
                </div>
            </div>

            <Footer />
        </main>
    )
}
