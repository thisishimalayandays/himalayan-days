'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ItineraryDocument } from './itinerary-document';
import { ItineraryData } from '@/app/admin/tools/itinerary-maker/page';

import React from 'react';

const PDFExportButton = React.memo(({ data, onGenerate }: { data: ItineraryData; onGenerate?: () => boolean }) => {
    const [isGenerating, setIsGenerating] = React.useState(false);

    // Reset generation when data changes so user gets fresh PDF
    React.useEffect(() => {
        setIsGenerating(false);
    }, [data]);

    if (!isGenerating) {
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
                    setIsGenerating(true);
                }}
            >
                <Download className="w-4 h-4 mr-2" /> Generate PDF
            </Button>
        );
    }

    return (
        <PDFDownloadLink
            document={<ItineraryDocument data={data} />}
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
