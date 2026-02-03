'use client';
import * as analytics from '@/lib/analytics';

export function MobileBookingBar({ price }: { price: number }) {
    if (!price) return null;

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
            <div className="flex-none">
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Starting from</p>
                <p className="text-lg font-bold text-primary">₹{price.toLocaleString()}</p>
            </div>
            <button
                onClick={handleBook}
                className="bg-primary hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-orange-500/20 flex-1 text-base flex items-center justify-center"
            >
                Get Custom Quote
            </button>
        </div>
    );
}
