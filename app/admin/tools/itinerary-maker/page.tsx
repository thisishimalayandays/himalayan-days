'use client';

import { useState, useEffect, useMemo } from 'react';
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

    // Memoize Durations to avoid recalculation
    const availableDurations = useMemo(() => {
        return Array.from(new Set(ITINERARY_TEMPLATES.map(t => t.duration)))
            .sort((a, b) => {
                const daysA = parseInt(a.split(' ')[0]) || 0;
                const daysB = parseInt(b.split(' ')[0]) || 0;
                return daysA - daysB;
            });
    }, []);

    // Filter Templates based on Duration
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


    const handleImportTemplate = () => {
        const tpl = ITINERARY_TEMPLATES.find(t => t.id === selectedTemplateId);
        if (!tpl) return;

        setClientInfo(prev => ({
            ...prev,
            pkgTitle: tpl.title,
            duration: tpl.duration,
            totalCost: '', // Templates don't have cost
        }));

        const mappedDays = tpl.days.map((d, idx) => ({
            dayNumber: idx + 1,
            title: d.title,
            description: d.description,
            meals: d.meals,
            stay: d.stay
        }));
        setDays(mappedDays);
    };

    const addDay = () => {
        setDays([...days, {
            dayNumber: days.length + 1,
            title: '',
            description: '',
            meals: 'Breakfast & Dinner',
            stay: ''
        }]);
    };

    const updateDay = (index: number, field: string, value: string) => {
        const newDays = [...days];
        newDays[index] = { ...newDays[index], [field]: value };
        setDays(newDays);
    };

    const removeDay = (index: number) => {
        const newDays = days.filter((_, i) => i !== index).map((d, i) => ({ ...d, dayNumber: i + 1 }));
        setDays(newDays);
    };

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden bg-gray-50">
            {/* Left Panel: Builder Form */}
            <div className="w-full md:w-1/2 p-6 overflow-y-auto border-r border-gray-200">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Itinerary Builder</h1>
                    <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                        <RefreshCw className="w-4 h-4 mr-2" /> Reset
                    </Button>
                </div>

                {/* Template Selection Section */}
                <Card className="p-4 mb-6 bg-orange-50/50 border-orange-100">
                    <Label className="text-orange-800 font-bold mb-3 block flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Select Itinerary Template
                    </Label>
                    <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label className="text-xs text-gray-500 mb-1 block">1. Select Duration</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                                    value={selectedDuration}
                                    onChange={(e) => {
                                        setSelectedDuration(e.target.value);
                                        setSelectedTemplateId(''); // Reset template when duration changes
                                    }}
                                >
                                    <option value="">-- Choose Duration --</option>
                                    {availableDurations.map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <Label className="text-xs text-gray-500 mb-1 block">2. Select Template</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                                    value={selectedTemplateId}
                                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                                    disabled={!selectedDuration}
                                >
                                    <option value="">-- Choose Template --</option>
                                    {filteredTemplates.map(t => (
                                        <option key={t.id} value={t.id}>{t.title}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <Button
                            onClick={handleImportTemplate}
                            disabled={!selectedTemplateId}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                        >
                            Import Template Data
                        </Button>
                    </div>
                </Card>

                {/* Client Details */}
                <div className="space-y-4 mb-8">
                    <h2 className="text-lg font-semibold border-b pb-2">Client Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Client Name</Label>
                            <Input
                                value={clientInfo.clientName}
                                onChange={e => setClientInfo({ ...clientInfo, clientName: e.target.value })}
                                placeholder="e.g. Mr. Sharma"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Quote ID</Label>
                            <Input
                                value={clientInfo.quoteId}
                                onChange={e => setClientInfo({ ...clientInfo, quoteId: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Travel Date</Label>
                            <Input
                                type="date"
                                value={clientInfo.travelDate}
                                onChange={e => setClientInfo({ ...clientInfo, travelDate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Duration</Label>
                            <Input
                                value={clientInfo.duration}
                                onChange={e => setClientInfo({ ...clientInfo, duration: e.target.value })}
                                placeholder="e.g. 5 Days / 4 Nights"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Package Title (for PDF)</Label>
                        <Input
                            value={clientInfo.pkgTitle}
                            onChange={e => setClientInfo({ ...clientInfo, pkgTitle: e.target.value })}
                            placeholder="e.g. Premium Kashmir Honeymoon"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Total Cost (₹)</Label>
                        <Input
                            value={clientInfo.totalCost}
                            onChange={e => setClientInfo({ ...clientInfo, totalCost: e.target.value })}
                            placeholder="e.g. 45,000"
                        />
                    </div>
                </div>

                {/* Itinerary Days */}
                <div className="space-y-4 mb-20">
                    <div className="flex items-center justify-between border-b pb-2">
                        <h2 className="text-lg font-semibold">Itinerary Days</h2>
                        <Button size="sm" onClick={addDay} variant="secondary">
                            <Plus className="w-4 h-4 mr-2" /> Add Day
                        </Button>
                    </div>

                    {days.map((day, idx) => (
                        <Card key={idx} className="p-4 relative hover:shadow-md transition-shadow">
                            <div className="absolute top-4 right-4">
                                <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-700 h-8 w-8" onClick={() => removeDay(idx)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-primary font-bold">Day {day.dayNumber}</Label>
                                <Input
                                    value={day.title}
                                    onChange={e => updateDay(idx, 'title', e.target.value)}
                                    placeholder="Title (e.g. Arrival)"
                                    className="font-semibold"
                                />
                                <Textarea
                                    value={day.description}
                                    onChange={e => updateDay(idx, 'description', e.target.value)}
                                    placeholder="Day description..."
                                    rows={2}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        value={day.meals}
                                        onChange={e => updateDay(idx, 'meals', e.target.value)}
                                        placeholder="Meals (e.g. Dinner)"
                                    />
                                    <Input
                                        value={day.stay}
                                        onChange={e => updateDay(idx, 'stay', e.target.value)}
                                        placeholder="Stay (e.g. Houseboat)"
                                    />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Right Panel: Live Preview */}
            <div className="w-full md:w-1/2 bg-gray-900 border-l border-gray-800 flex flex-col">
                <div className="p-3 bg-gray-800 border-b border-gray-700 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="font-medium text-sm">Live PDF Preview</span>
                    </div>

                    {/* Explicit Download Button - Debounced Data */}
                    <PDFExportButton data={pdfData} />
                </div>
                <div className="flex-1 w-full h-full bg-gray-200 p-4 overflow-hidden">
                    {/* HTML Preview Wrapper */}
                    <div className="h-full w-full overflow-y-auto flex justify-center">
                        <div className="w-[210mm] min-h-[297mm] h-fit bg-white shadow-xl mx-auto">
                            <ItineraryHTMLPreview data={pdfData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
