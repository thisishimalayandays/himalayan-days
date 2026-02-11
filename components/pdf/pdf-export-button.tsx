'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ItineraryDocument } from './itinerary-document';
import { ItineraryData } from '@/app/admin/tools/itinerary-maker/page';

import React from 'react';

const PDFExportButton = React.memo(({ data, onGenerate }: { data: ItineraryData; onGenerate?: () => boolean }) => {
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [pdfData, setPdfData] = React.useState<ItineraryData | null>(null);

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
            console.error("Failed to load image for PDF:", url, error);
            return null;
        }
    };

    const prepareData = async () => {
        const newData = JSON.parse(JSON.stringify(data)); // Deep clone

        // Process days
        await Promise.all(newData.days.map(async (day: any) => {
            if (day.image) {
                // Ensure absolute URL if relative
                const imgUrl = day.image.startsWith('/')
                    ? `${window.location.origin}${day.image}`
                    : day.image;

                const base64 = await urlToBase64(imgUrl);
                if (base64) {
                    day.image = base64;
                }
            }
        }));

        setPdfData(newData);
        setIsGenerating(true);
    };

    // Reset generation when data changes so user gets fresh PDF
    React.useEffect(() => {
        setIsGenerating(false);
        setPdfData(null);
    }, [data]);

    if (!isGenerating || !pdfData) {
        return (
            <Button
                size="sm"
                variant="default"
                className="bg-orange-600 hover:bg-orange-700 text-white"
                onClick={() => {
                    if (onGenerate) {
                        const isValid = onGenerate();
                        if (!isValid) return;
                    }
                    prepareData();
                }}
            >
                <Download className="w-4 h-4 mr-2" /> Generate PDF
            </Button>
        );
    }

    return (
        <PDFDownloadLink
            document={<ItineraryDocument data={pdfData} />}
            fileName={`${data.clientName || 'Guest'} _ ${data.duration.replace(/\//g, '-')} _ Itinerary.pdf`}
        >
            {({ blob, url, loading, error }) => (
                <Button size="sm" variant="secondary" className="bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
                    <Download className="w-4 h-4 mr-2" />
                    {loading ? 'Generating...' : 'Download Ready'}
                </Button>
            )}
        </PDFDownloadLink>
    );
});

export default PDFExportButton;
