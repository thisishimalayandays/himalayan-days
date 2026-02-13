
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { ItineraryData } from '@/app/admin/tools/itinerary-maker/page';

import { toast } from 'sonner';

interface WhatsAppItineraryShareProps {
    data: ItineraryData;
}

export function WhatsAppItineraryShare({ data }: WhatsAppItineraryShareProps) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        const { clientName, pkgTitle, travelDate, duration, adults, kids, totalCost } = data;

        // Format date from YYYY-MM-DD to DD Month YYYY
        const formattedDate = travelDate ? new Date(travelDate).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }) : 'TBD';

        const message = `Hello ${clientName} \uD83D\uDC4B

Greetings from Himalayan Days – Kashmir Tour & Travel Experts.

Please find your detailed tour itinerary attached for your upcoming Kashmir holiday.

\uD83D\uDCCC Package: ${pkgTitle}
\uD83D\uDCC5 Travel Date: ${formattedDate}
\uD83D\uDDD3 Duration: ${duration}
\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66 Guests: ${adults} Adults & ${kids} Kids
\uD83D\uDCB0 Total Tour Cost: ₹${totalCost} (all taxes included)

Kindly review the attached itinerary and let us know if you would like any changes or customization. We will be happy to assist you.

Looking forward to your confirmation.
Warm regards,
Himalayan Days
\uD83D\uDCDE +91-9103901803`;

        navigator.clipboard.writeText(message).then(() => {
            setIsCopied(true);
            toast.success("Greeting copied!", {
                description: "You can now paste it into WhatsApp along with the PDF."
            });
            setTimeout(() => setIsCopied(false), 2000);
        }).catch(err => {
            toast.error("Failed to copy", {
                description: "Please try again."
            });
            console.error(err);
        });
    };

    return (
        <Button
            size="sm"
            variant="outline"
            className={`
                text-white border-0 transition-all duration-300
                ${isCopied
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }
            `}
            onClick={handleCopy}
            disabled={isCopied}
        >
            {isCopied ? (
                <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                </>
            ) : (
                <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Greeting Message
                </>
            )}
        </Button>
    );
}
