'use client';

export function MobileBookingBar({ price }: { price: number }) {
    if (!price) return null;

    const handleBook = () => {
        const form = document.querySelector('form');
        if (form) {
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Optional: Focus the first input
            const input = form.querySelector('input');
            if (input) (input as HTMLElement).focus();
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 md:hidden flex items-center justify-between gap-4">
            <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">Starting from</p>
                <p className="text-xl font-bold text-primary">₹{price.toLocaleString()}</p>
            </div>
            <button
                onClick={handleBook}
                className="bg-primary hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg flex-1"
            >
                Book Now
            </button>
        </div>
    );
}
