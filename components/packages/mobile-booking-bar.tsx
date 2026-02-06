'use client';
import * as analytics from '@/lib/analytics';

export function MobileBookingBar({ price }: { price: number }) {
    // Rely purely on DB price now that Admin Panel has "Price Range" text override for Hero
    // For Mobile Bar, we just show the "Starting From" price which comes from DB
    const displayPrice = price;

    if (!displayPrice) return null;

    const handleBook = () => {
        analytics.event('InitiateCheckout', {
            value: price,
            currency: 'INR'
        });
        const form = document.querySelector('form');
        if (form) {
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Optional: Focus the first input
            const input = form.querySelector('input');
            if (input) (input as HTMLElement).focus();
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40 md:hidden flex items-center justify-between gap-3 safe-area-bottom">
            <div className="flex-none flex flex-col justify-center">
                <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Starting from</p>
                <div className="flex items-baseline gap-1">
                    <p className="text-xl font-bold text-primary">₹{displayPrice.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 font-medium">/ person</p>
                </div>
            </div>
            <button
                onClick={handleBook}
                className="bg-primary hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg shadow-orange-500/20 flex-1 flex flex-col items-center justify-center"
            >
                <span className="text-base">Check Availability</span>
                <span className="text-[10px] bg-white/20 px-2 rounded-full mt-0.5 font-medium flex items-center gap-1">
                    🛡️ No Upfront Payment
                </span>
            </button>
        </div>
    );
}
