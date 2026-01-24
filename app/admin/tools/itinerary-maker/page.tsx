'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Download, RefreshCw, FileText } from 'lucide-react';
// Imports
import { ITINERARY_TEMPLATES, ItineraryTemplate } from './data/templates';
import { ItineraryHTMLPreview } from '@/components/pdf/itinerary-preview';

// Dynamically import PDFExportButton to isolate @react-pdf/renderer
const PDFExportButton = dynamic(
    () => import('@/components/pdf/pdf-export-button'),
    { ssr: false, loading: () => <Button variant="secondary" size="sm" disabled>Loading...</Button> }
);

export default function ItineraryMakerPage() {
    // const [packages, setPackages] = useState<any[]>([]); // Removed: Using Templates now

    // Template Selection State
    const [selectedDuration, setSelectedDuration] = useState('');
    const [selectedTemplateId, setSelectedTemplateId] = useState('');

    const [clientInfo, setClientInfo] = useState({
        clientName: '',
        travelDate: '',
        duration: '',
        quoteId: `QT-${Math.floor(Math.random() * 10000)}`,
        pkgTitle: '',
        totalCost: '',
    });

    const [days, setDays] = useState([
        { dayNumber: 1, title: 'Arrival in Srinagar', description: 'Welcome to Kashmir.', meals: 'Dinner', stay: 'Srinagar Houseboat' }
    ]);

    // Memoize Durations and Templates
    const availableDurations = useMemo(() => {
        return Array.from(new Set(ITINERARY_TEMPLATES.map(t => t.duration)))
            .sort((a, b) => {
                const daysA = parseInt(a.split(' ')[0]) || 0;
                const daysB = parseInt(b.split(' ')[0]) || 0;
                return daysA - daysB;
            });
    }, []);

    const filteredTemplates = useMemo(() => {
        return ITINERARY_TEMPLATES.filter(t => t.duration === selectedDuration);
    }, [selectedDuration]);

    // Debounce Data for PDF Generation
    const [pdfData, setPdfData] = useState({ ...clientInfo, days });

    useEffect(() => {
        const handler = setTimeout(() => {
            setPdfData({ ...clientInfo, days });
        }, 1000); // 1-second delay before regenerating PDF

        return () => clearTimeout(handler);
    }, [clientInfo, days]);

    // ... handlers ...

    return (
        // ...
        {/* Explicit Download Button - Dynamic Import to prevent build errors */ }
        < PDFExportButton data = { pdfData } />
        // ...
    );
                </div >
        <div className="flex-1 w-full h-full bg-gray-200 p-4 overflow-hidden">
            {/* HTML Preview Wrapper to center it and act like a document viewer */}
            <div className="h-full w-full overflow-y-auto flex justify-center">
                <div className="w-[210mm] min-h-[297mm] h-fit bg-white shadow-xl mx-auto">
                    <ItineraryHTMLPreview data={{ ...clientInfo, days }} />
                </div>
            </div>
        </div>
            </div >
        </div >
    );
}
