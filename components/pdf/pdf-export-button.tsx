'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { ItineraryDocument } from './itinerary-document';
import { ItineraryData } from '@/app/admin/tools/itinerary-maker/page';
import React from 'react';

const PDFExportButton = React.memo(({ data, onGenerate, language = 'en' }: {
    data: ItineraryData;
    onGenerate?: () => boolean;
    language?: 'en' | 'ar';
}) => {
    const [state, setState] = React.useState<'idle' | 'preparing' | 'downloading'>('idle');

    // Helper: Convert URL to Base64
    const urlToBase64 = async (url: string): Promise<string | null> => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Failed to load image for PDF:', url, error);
            return null;
        }
    };

    const handleClick = async () => {
        if (onGenerate) {
            const isValid = onGenerate();
            if (!isValid) return;
        }

        setState('preparing');

        try {
            const newData = JSON.parse(JSON.stringify(data)); // Deep clone

            // Convert day images to base64 so the PDF renderer can embed them
            await Promise.all(
                newData.days.map(async (day: any) => {
                    if (day.image) {
                        const imgUrl = day.image.startsWith('/')
                            ? `${window.location.origin}${day.image}`
                            : day.image;
                        const base64 = await urlToBase64(imgUrl);
                        if (base64) day.image = base64;
                    }
                })
            );

            setState('downloading');

            // Generate the PDF blob programmatically — most reliable cross-browser method
            const blob = await pdf(
                <ItineraryDocument data={newData} language={language} />
            ).toBlob();

            // Trigger browser download
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${data.clientName || 'Guest'}_Itinerary${language === 'ar' ? '_AR' : '_EN'}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('PDF generation failed:', err);
            alert(`PDF generation failed: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            setState('idle');
        }
    };

    // Reset when itinerary data changes
    React.useEffect(() => {
        setState('idle');
    }, [data]);

    const isAr = language === 'ar';
    const label = {
        idle: isAr ? 'Download PDF (AR)' : 'Download PDF (EN)',
        preparing: 'Preparing…',
        downloading: 'Generating…',
    }[state];

    return (
        <Button
            size="sm"
            variant="default"
            className={state === 'idle'
                ? (isAr ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-orange-600 hover:bg-orange-700 text-white')
                : 'bg-gray-500 text-white'
            }
            disabled={state !== 'idle'}
            onClick={handleClick}
        >
            <Download className="w-4 h-4 mr-2" />
            {label}
        </Button>
    );
});

export default PDFExportButton;
