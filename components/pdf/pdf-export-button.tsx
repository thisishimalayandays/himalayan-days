'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ItineraryDocument, ItineraryData } from './itinerary-document';

export default function PDFExportButton({ data }: { data: ItineraryData }) {
    return (
        <PDFDownloadLink
            document={<ItineraryDocument data={data} />}
            fileName={`${data.clientName || 'Guest'} _ ${data.duration.replace(/\//g, '-')} _ Itinerary.pdf`}
        >
            {({ blob, url, loading, error }) => (
                <Button size="sm" variant="default" className="bg-orange-600 hover:bg-orange-700 text-white" disabled={loading}>
                    <Download className="w-4 h-4 mr-2" />
                    {loading ? 'Preparing...' : 'Download PDF'}
                </Button>
            )}
        </PDFDownloadLink>
    );
}
