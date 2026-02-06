'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, Download, RefreshCw, FileText, Eye, Save, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// Imports
import { ITINERARY_TEMPLATES, ItineraryTemplate, BLOCKS } from './data/templates';
import { ItineraryHTMLPreview } from '@/components/pdf/itinerary-preview';
import { saveItinerary, getItineraries, deleteItinerary } from "@/app/actions/itineraries";

// Dynamically import PDFExportButton to isolate @react-pdf/renderer
const PDFExportButton = dynamic(
    () => import('@/components/pdf/pdf-export-button'),
    { ssr: false, loading: () => <Button variant="secondary" size="sm" disabled>Loading...</Button> }
);

// Define types shared with PDF/Preview components
export interface Day {
    dayNumber: number;
    title: string;
    description: string;
    meals?: string;
    stay?: string;
}

export interface ItineraryData {
    clientName: string;
    travelDate: string;
    duration: string;
    quoteId: string;
    pkgTitle: string;
    totalCost: string;
    adults: string;
    kids: string;
    vehicleType: string;
    rooms: string;
    upiId: string;
    days: Day[];
}

interface DBItinerary {
    id: string;
    name: string;
    clientName?: string | null;
    date?: string;
    data: {
        clientInfo: any;
        days: Day[];
    };
    createdAt: Date;
}

export default function ItineraryMakerPage() {
    // Template Selection State
    const [selectedDuration, setSelectedDuration] = useState('');
    const [selectedTemplateId, setSelectedTemplateId] = useState('');

    // Save/Load State
    const [savedItineraries, setSavedItineraries] = useState<DBItinerary[]>([]);
    const [itineraryName, setItineraryName] = useState("");
    const [clientName, setClientName] = useState(""); // NEW
    const [isSaveOpen, setIsSaveOpen] = useState(false);
    const [isLoadOpen, setIsLoadOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Load DB
    const loadItinerariesFromDB = async () => {
        setIsLoading(true);
        const data = await getItineraries();
        setSavedItineraries(data as any[]);
        setIsLoading(false);
    };

    useEffect(() => {
        loadItinerariesFromDB();
    }, []);

    const [clientInfo, setClientInfo] = useState({
        clientTitle: 'Mr.',
        clientName: '',
        travelDate: '',
        duration: '',
        quoteId: `QT-${Math.floor(Math.random() * 10000)}`,
        pkgTitle: '',
        totalCost: '',
        adults: '',
        kids: '',
        vehicleType: '',
        rooms: '',
        upiId: 'mweb5890@okhdfcbank', // Default UPI ID
    });

    const [days, setDays] = useState<Day[]>([
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

    // Live Preview Data
    const previewData: ItineraryData = {
        ...clientInfo,
        clientName: `${clientInfo.clientTitle} ${clientInfo.clientName}`,
        days
    };

    // ... handlers ...

    // --- Sticky Context State ---
    const [stickyContext, setStickyContext] = useState<any>(null);

    // Load Calculator Draft on Mount
    useEffect(() => {
        const storedDraft = localStorage.getItem('calculatorDraft');
        if (storedDraft) {
            try {
                const draft = JSON.parse(storedDraft);
                setStickyContext(draft);

                // Optional: Auto-populate if query param exists (indicating redirect)
                // const urlParams = new URLSearchParams(window.location.search);
                // if (urlParams.get('import') === 'true') {
                //      // Could auto-trigger something here, but sticking to "Template Import" override for now
                //      toast.info("Calculator data linked. It will be applied to any template you select.");
                // }
            } catch (e) {
                console.error("Failed to parse sticky context", e);
            }
        }
    }, []);

    // Helper: Apply Sticky Context to Days
    const applyStickyContext = (daysToProcess: Day[], context: any) => {
        if (!context || !context.hotels) return daysToProcess;

        // 1. Flatten Calculator Hotels into a "Timeline of Stays" based on nights
        const stayQueue: string[] = [];

        context.hotels.forEach((h: any) => {
            if (h.name && h.nights > 0) {
                let stayName = h.name.trim();
                const type = h.type || "Hotel"; // e.g. "Hotel", "Houseboat"

                // Check if name already implies type
                // e.g. "Radisson" -> "Radisson Hotel"
                // e.g. "Harmukh Houseboat" -> "Harmukh Houseboat" (no change)
                const lowerName = stayName.toLowerCase();
                const typeKeywords = ['hotel', 'resort', 'cottage', 'camp', 'houseboat', 'homestay', 'guest house'];

                const hasKeyword = typeKeywords.some(keyword => lowerName.includes(keyword));

                if (!hasKeyword) {
                    stayName = `${stayName} ${type}`;
                }

                // Append Location
                const location = h.location?.trim();
                // Avoid double location if name already contains it
                if (location && !stayName.toLowerCase().includes(location.toLowerCase())) {
                    stayName = `${stayName} - ${location}`;
                }

                // Add entry for each night
                for (let i = 0; i < h.nights; i++) {
                    stayQueue.push(stayName);
                }
            }
        });

        // 2. Map sequentially to days
        // We iterate through the days. If the timeline has a stay for this "night", we apply it.
        // Usually Day 1 needs Night 1, Day 2 needs Night 2, etc.
        // The last day typically doesn't have a night stay, so it naturally falls off if queue is empty.

        return daysToProcess.map((day, idx) => {
            const newStay = stayQueue[idx] || day.stay || '';

            // "meals data will also be filled"
            // If template has meals, keep them. If empty/missing and we have a calculator context,
            // assume standard "Breakfast & Dinner" (MAP) could be a safe default if user desires automagical filling,
            // but for now let's respect the template unless it's empty.
            // User query: "meals data will also be filled... even though i import different template... meals remain unchanged"
            // This might mean "Unchanged from the STICKY context" (if we had sticky meals) or "Unchanged from Template".
            // Given the context "fills" data, I'll ensure it's not empty.
            const newMeals = day.meals || 'Breakfast & Dinner';

            return {
                ...day,
                stay: newStay,
                meals: newMeals
            };
        });
    };

    const handleImportTemplate = () => {
        const tpl = ITINERARY_TEMPLATES.find(t => t.id === selectedTemplateId);
        if (!tpl) return;

        let mappedDays: Day[] = tpl.days.map((d, idx) => ({
            dayNumber: idx + 1,
            title: d.title,
            description: d.description,
            meals: d.meals || '',
            stay: '' // User requested blank stays by default for "Normal" usage
        }));

        // APPLY STICKY CONTEXT
        if (stickyContext) {
            mappedDays = applyStickyContext(mappedDays, stickyContext);
            setClientInfo(prev => ({
                ...prev,
                totalCost: stickyContext.grandTotal ? `${stickyContext.grandTotal.toLocaleString('en-IN')}` : '',
                // Maybe map adults/kids too if present in context?
            }));
            toast.success("Template imported with Calculator Data applied!");
        } else {
            toast.success("Template imported.");
        }

        setClientInfo(prev => ({
            ...prev,
            pkgTitle: tpl.title,
            duration: tpl.duration,
            // totalCost handled above if context exists
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

    const updateDay = (index: number, field: keyof Day, value: string) => {
        const newDays = [...days];
        newDays[index] = { ...newDays[index], [field]: value };
        setDays(newDays);
    };

    const removeDay = (index: number) => {
        const newDays = days.filter((_, i) => i !== index).map((d, i) => ({ ...d, dayNumber: i + 1 }));
        setDays(newDays);
    };

    // --- Save/Load Handlers ---
    const handleSaveItinerary = async () => {
        if (!itineraryName.trim()) {
            toast.error("Please enter a name.");
            return;
        }

        const itineraryData = { clientInfo, days };
        const res = await saveItinerary(itineraryName, clientName, itineraryData);

        if (res.success) {
            toast.success("Itinerary saved to Database!");
            setItineraryName("");
            setClientName("");
            setIsSaveOpen(false);
            loadItinerariesFromDB();
        } else {
            toast.error("Failed to save.");
        }
    };

    const handleLoadItinerary = (save: DBItinerary) => {
        if (confirm(`Load "${save.name}"? Unsaved changes will be lost.`)) {
            const data = save.data;
            if (data) {
                setClientInfo(data.clientInfo);
                setDays(data.days);
                toast.success("Itinerary loaded successfully.");
                setIsLoadOpen(false);
            }
        }
    };

    const handleDeleteItinerary = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Delete this saved itinerary?")) {
            await deleteItinerary(id);
            toast.success("Deleted.");
            loadItinerariesFromDB();
        }
    };

    // --- Draft Import Logic ---
    const [draftData, setDraftData] = useState<any>(null);

    useEffect(() => {
        const stored = localStorage.getItem('calculatorDraft');
        if (stored) {
            try {
                setDraftData(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse draft", e);
            }
        }
    }, []);

    const handleImportDraft = (tripType: 'Family' | 'Honeymoon' | 'Friends' | 'Corporate') => {
        if (!draftData) return;

        // 1. Basic Info
        const totalRooms = draftData.hotels.reduce((acc: number, h: any) => acc + h.rooms, 0);
        const vehicle = draftData.transport[0]?.type || '';

        setClientInfo(prev => ({
            ...prev,
            totalCost: draftData.grandTotal.toLocaleString("en-IN"),
            rooms: `${totalRooms} Rooms`,
            vehicleType: vehicle,
            pkgTitle: `Magical Kashmir ${tripType} Special`,
            adults: '2', // Default assumption, editable
            kids: '0'
        }));

        // 2. Helper to find best block
        // Import BLOCKS from data/templates (Need to add import at top)
        // For now, I will use a local logic or assume BLOCKS is imported. 
        // Note: I will need to update imports in the next step. 

        const getPayloadDay = (location: string, dayIndex: number, isArrival: boolean): { title: string, description: string, meals?: string, stay?: string } => {
            // Dynamic import workaround or assume global access if I was in same file. 
            // Since I am in page.tsx, I need to fetch from the imported BLOCKS.
            // I will modify the Import logic to depend on the BLOCKS object being available.

            // MAPPING LOGIC
            // SRINAGAR
            if (location === 'Srinagar') {
                if (isArrival) {
                    return tripType === 'Honeymoon' ? BLOCKS.arrivalSrinagarRomantic : BLOCKS.arrivalSrinagar;
                }
                // Subsequent Days in Srinagar
                if (dayIndex === 0) return BLOCKS.srinagarLocal; // Day 1 (after arrival)
                if (dayIndex === 1) return BLOCKS.srinagarOldCity;
                if (dayIndex === 2) return BLOCKS.springsDay;
                return BLOCKS.doodhpathriDay; // Fallback filler
            }

            // GULMARG
            if (location === 'Gulmarg') {
                if (dayIndex === 0) return BLOCKS.gulmargStay; // Transfer & Stay
                if (dayIndex === 1) return tripType === 'Friends' ? BLOCKS.gulmargAdventure : BLOCKS.gulmargDay; // Gondola/Activities
                return BLOCKS.gulmargAdventure;
            }

            // PAHALGAM
            if (location === 'Pahalgam') {
                if (dayIndex === 0) return BLOCKS.pahalgamStay; // Transfer & Stay
                if (dayIndex === 1) return BLOCKS.pahalgamValleys; // ABC Valleys
                if (dayIndex === 2) return BLOCKS.pahalgamLeisure; // Pony Ride/Mini Swiss
                return BLOCKS.pahalgamValleys;
            }

            // SONMARG
            if (location === 'Sonmarg') {
                if (dayIndex === 0) return BLOCKS.sonamargStay;
                return BLOCKS.sonamargDay;
            }

            return { title: `Explore ${location}`, description: `Enjoy your stay in ${location}.` };
        };

        const newDays: Day[] = [];
        let dayCount = 1;
        let isFirstHotel = true;

        draftData.hotels.forEach((hotel: any) => {
            const nights = hotel.nights;
            const location = hotel.location || 'Srinagar';
            const stayName = hotel.name || `${location} ${hotel.type}`;

            let nightsToPlan = nights;

            // Special handling for First Hotel (Arrival)
            if (isFirstHotel) {
                // Day 1 is ALWAYS Arrival
                let day1Block = BLOCKS.arrivalSrinagar; // Default to Srinagar arrival

                if (location === 'Srinagar' && tripType === 'Honeymoon') {
                    day1Block = BLOCKS.arrivalSrinagarRomantic;
                } else if (location !== 'Srinagar') {
                    // If landing SXR but staying elsewhere (e.g., Pahalgam)
                    day1Block = {
                        title: `Arrival & Transfer to ${location}`,
                        description: `Arrive at Srinagar Airport. Our representative will greet you and drive you directly to ${location}. Enjoy the scenic drive. Check into your hotel.`,
                        meals: 'Dinner',
                        stay: stayName
                    };
                }

                newDays.push({
                    dayNumber: dayCount++,
                    title: day1Block.title,
                    description: day1Block.description,
                    meals: day1Block.meals || 'Dinner',
                    stay: day1Block.stay || stayName
                });

                nightsToPlan--; // We used 1 night for arrival
                isFirstHotel = false;
            }

            // Remaining Nights at this hotel
            for (let i = 0; i < nightsToPlan; i++) {
                const block = getPayloadDay(location, i, false);

                newDays.push({
                    dayNumber: dayCount++,
                    title: block.title,
                    description: block.description,
                    meals: 'meals' in block ? block.meals : 'Breakfast & Dinner',
                    stay: stayName // FORCE use of Calculator Hotel Name
                });
            }
        });

        // C. Departure
        newDays.push({
            dayNumber: dayCount,
            title: BLOCKS.departure.title,
            description: BLOCKS.departure.description,
            meals: 'Breakfast',
            stay: 'N/A'
        });

        setDays(newDays);
        toast.success(`Generated ${tripType} Itinerary!`);
        localStorage.removeItem('calculatorDraft');
        setDraftData(null);
    };

    // Mobile Tab State
    const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');
    // Desktop Preview Toggle
    const [showPreview, setShowPreview] = useState(false);

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden bg-background relative">
            {/* Mobile Tab Switcher */}
            <div className="md:hidden flex border-b border-gray-200 bg-background p-2 gap-2 absolute top-0 left-0 right-0 z-20 h-14 items-center">
                <Button
                    variant={mobileTab === 'editor' ? "default" : "secondary"}
                    className="flex-1 text-xs"
                    onClick={() => setMobileTab('editor')}
                    size="sm"
                >
                    <FileText className="w-3 h-3 mr-2" /> Editor
                </Button>
                <Button
                    variant={mobileTab === 'preview' ? "default" : "secondary"}
                    className="flex-1 text-xs"
                    onClick={() => setMobileTab('preview')}
                    size="sm"
                >
                    <Download className="w-3 h-3 mr-2" /> Preview
                </Button>
            </div>

            {/* Left Panel: Builder Form */}
            <div className={`
                ${showPreview ? 'w-full md:w-1/2' : 'w-full'} 
                p-6 overflow-y-auto border-r border-border pt-16 md:pt-6 transition-all duration-300
                ${mobileTab === 'preview' ? 'hidden md:block' : 'block'}
            `}>
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-foreground">Itinerary Builder</h1>
                    <div className="flex gap-2">
                        <Dialog open={isSaveOpen} onOpenChange={setIsSaveOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Save className="w-4 h-4 mr-2" /> Save
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Save Itinerary</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label>Client Name</Label>
                                        <Input
                                            placeholder="e.g. Rahul DB"
                                            value={clientName}
                                            onChange={(e) => setClientName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Itinerary Name</Label>
                                        <Input
                                            placeholder="e.g. 5 Days Kashmir"
                                            value={itineraryName}
                                            onChange={(e) => setItineraryName(e.target.value)}
                                        />
                                    </div>
                                    <Button onClick={handleSaveItinerary} className="w-full">Save to Database</Button>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={isLoadOpen} onOpenChange={setIsLoadOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <FolderOpen className="w-4 h-4 mr-2" /> Load
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Team Itineraries</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-2 pt-4">
                                    {isLoading ? <p>Loading...</p> : savedItineraries.length === 0 ? (
                                        <p className="text-center text-muted-foreground py-8">No saved itineraries.</p>
                                    ) : (
                                        savedItineraries.map(item => (
                                            <div
                                                key={item.id}
                                                onClick={() => handleLoadItinerary(item)}
                                                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer group transition-colors"
                                            >
                                                <div>
                                                    <div className="font-semibold">{item.name}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {item.clientName ? `${item.clientName} • ` : ''}
                                                        {new Date(item.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={(e) => handleDeleteItinerary(item.id, e)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>

                        <div className="hidden md:flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowPreview(!showPreview)}
                            >
                                {showPreview ? <Eye className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                                {showPreview ? 'Hide Preview' : 'Show Preview'}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                                <RefreshCw className="w-4 h-4 mr-2" /> Reset
                            </Button>
                        </div>
                    </div>
                </div>



                {/* Template Selection Section */}
                <Card className="p-4 mb-6 bg-orange-50/50 dark:bg-orange-950/20 border-orange-100 dark:border-orange-900/50">
                    <Label className="text-orange-800 dark:text-orange-400 font-bold mb-3 block flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Select Itinerary Template
                    </Label>
                    <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label className="text-xs text-muted-foreground mb-1 block">1. Select Duration</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
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
                                <Label className="text-xs text-muted-foreground mb-1 block">2. Select Template</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                                    value={selectedTemplateId}
                                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                                    disabled={!selectedDuration}
                                >
                                    <option value="">-- Choose Template --</option>
                                    {filteredTemplates.map(t => (
                                        <option key={t.id} value={t.id}>
                                            {t.type ? `[${t.type}] ` : ''}{t.title}
                                        </option>
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
                            <div className="flex gap-2">
                                <select
                                    className="flex h-10 w-20 rounded-md border border-input bg-background px-2 py-2 text-sm focus:ring-2 focus:ring-orange-500"
                                    value={clientInfo.clientTitle}
                                    onChange={(e) => setClientInfo({ ...clientInfo, clientTitle: e.target.value })}
                                >
                                    <option value="Mr.">Mr.</option>
                                    <option value="Ms.">Ms.</option>
                                    <option value="Mrs.">Mrs.</option>
                                    <option value="Dr.">Dr.</option>
                                    <option value="Prof.">Prof.</option>
                                </select>
                                <Input
                                    value={clientInfo.clientName}
                                    onChange={e => setClientInfo({ ...clientInfo, clientName: e.target.value })}
                                    placeholder="e.g. Sharma"
                                    className="flex-1"
                                />
                            </div>
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
                        {/* New Fields */}
                        <div className="space-y-2">
                            <Label>Start Date (Pax)</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={clientInfo.adults}
                                    onChange={e => setClientInfo({ ...clientInfo, adults: e.target.value })}
                                    placeholder="Adults"
                                />
                                <Input
                                    value={clientInfo.kids}
                                    onChange={e => setClientInfo({ ...clientInfo, kids: e.target.value })}
                                    placeholder="Kids"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Vehicle Type</Label>
                            <Input
                                value={clientInfo.vehicleType}
                                onChange={e => setClientInfo({ ...clientInfo, vehicleType: e.target.value })}
                                placeholder="e.g. Innova Crysta"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Rooms</Label>
                            <Input
                                value={clientInfo.rooms}
                                onChange={e => setClientInfo({ ...clientInfo, rooms: e.target.value })}
                                placeholder="e.g. 2 Double Rooms"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>UPI ID (Payment)</Label>
                            <Input
                                value={clientInfo.upiId}
                                onChange={e => setClientInfo({ ...clientInfo, upiId: e.target.value })}
                                placeholder="e.g. mweb5890@okhdfcbank"
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
            <div className={`
                w-full md:w-1/2 bg-gray-900 border-l border-gray-800 flex flex-col pt-14 md:pt-0 transition-all duration-300
                ${mobileTab === 'editor' ? 'hidden' : 'flex'}
                ${showPreview ? 'md:flex' : 'md:hidden'}
            `}>
                <div className="p-3 bg-gray-800 border-b border-gray-700 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="font-medium text-sm">Live PDF Preview</span>
                    </div>

                    {/* Explicit Download Button - Lazy Generation ensures performance */}
                    <PDFExportButton data={previewData} />
                </div>
                <div className="flex-1 w-full h-full bg-gray-200 p-2 md:p-8 overflow-hidden relative">
                    {/* HTML Preview Wrapper */}
                    <div className="h-full w-full overflow-auto flex justify-center pt-4 md:pt-8 custom-scrollbar">
                        <div className={`w-[210mm] min-w-[210mm] min-h-[297mm] h-fit bg-white shadow-xl origin-top transition-transform duration-200 mb-20 shrink-0
                            scale-[0.35] sm:scale-75 md:scale-[0.4] lg:scale-[0.55] xl:scale-[0.7] 2xl:scale-[0.85]
                        `}>
                            <ItineraryHTMLPreview data={previewData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
