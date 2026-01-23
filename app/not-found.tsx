import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <div className="bg-black/90"><Header /></div>

            <main className="flex-1 flex flex-col items-center justify-center p-4 text-center bg-gray-50">
                <h1 className="text-9xl font-bold text-primary opacity-20 select-none">404</h1>
                <div className="absolute space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Page Not Found</h2>
                    <p className="text-lg text-gray-600 max-w-md mx-auto">
                        Oops! The page you are looking for seems to have wandered off into the mountains.
                    </p>
                    <div className="flex gap-4 justify-center pt-4">
                        <Link href="/">
                            <Button size="lg" className="rounded-full px-8">
                                Return Home
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="lg" variant="outline" className="rounded-full px-8">
                                Contact Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
