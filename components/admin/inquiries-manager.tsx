'use client';

import { cn } from '@/lib/utils';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatusSelector } from './inquiries/status-selector';
import { InquiryMobileCard } from './inquiries/inquiry-mobile-card';

import { NotesDialog } from './inquiries/notes-dialog';
import { InquiryAvatar } from './inquiries/inquiry-avatar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Mail, Phone, Calendar as CalendarIcon, MapPin, Trash2, RefreshCcw, FileDown, Eye, Users, Wallet, Clock, MessageCircle, Copy, Check, Globe, Smartphone, User } from 'lucide-react';
import { softDeleteInquiry, restoreInquiry, permanentDeleteInquiry, markInquiryAsRead, updateInquiryStatus } from '@/app/actions/inquiries';
import { logActivity } from '@/app/actions/audit';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";

export interface Inquiry {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    type: string;
    status: string;
    startDate: Date | null;
    destination: string | null;
    message: string | null;
    travelers: number | null;
    budget: string | null;
    createdAt: Date;
    isDeleted: boolean;
    deletedAt: Date | null;
    isRead: boolean;
    notes: string | null;
    followUpDate: Date | null;
}

interface InquiriesManagerProps {
    initialInquiries: Inquiry[];
    trashedInquiries: Inquiry[];
    role?: string;
    userEmail?: string;
}

export function InquiriesManager({ initialInquiries, trashedInquiries, role = 'ADMIN', userEmail }: InquiriesManagerProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isExporting, setIsExporting] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    const handleSoftDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to move this inquiry to trash?')) return;
        const result = await softDeleteInquiry(id);
        if (result.success) {
            router.refresh();
        } else {
            toast({
                variant: "destructive",
                title: "Deletion Failed",
                description: result.error || "Could not delete inquiry"
            });
        }
    };

    const handleRestore = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const result = await restoreInquiry(id);
        if (result.success) {
            router.refresh();
        } else {
            toast({
                variant: "destructive",
                title: "Restore Failed",
                description: result.error || "Could not restore inquiry"
            });
        }
    };

    const handlePermanentDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('WARNING: This will permanently delete this inquiry. This action cannot be undone. Are you sure?')) return;
        const result = await permanentDeleteInquiry(id);
        if (result.success) {
            router.refresh();
        } else {
            toast({
                variant: "destructive",
                title: "Deletion Failed",
                description: result.error || "Could not delete inquiry permanently"
            });
        }
    };

    const handleMarkAsRead = async (id: string, currentStatus: boolean) => {
        if (currentStatus) return; // Already read
        await markInquiryAsRead(id);
        router.refresh();
    };

    const handleExport = () => {
        console.log("Export button clicked");
        setIsExporting(true);
        try {
            console.log("Data to export:", initialInquiries.length);

            if (!initialInquiries || initialInquiries.length === 0) {
                alert("No active inquiries to export.");
                return;
            }

            const dataToExport = initialInquiries.map(inq => ({
                Date: new Date(inq.createdAt).toLocaleDateString('en-GB'),
                Name: inq.name || '-',
                Phone: inq.phone || '-',
                Type: inq.type || '-',
                Status: inq.status || '-',
                'Travel Date': inq.startDate ? new Date(inq.startDate).toLocaleDateString('en-GB') : '-',
                Destination: inq.destination || '-',
                Budget: inq.budget || '-',
                Guests: inq.travelers || '-',
                Message: inq.message ? inq.message.replace(/[\n\r]+/g, ' ').replace(/"/g, "'") : '-'
            }));

            // Generate CSV
            const headers = Object.keys(dataToExport[0]);
            const csvContent = [
                headers.join(','),
                ...dataToExport.map(row => headers.map(header => {
                    const cell = row[header as keyof typeof row] as string;
                    return `"${(cell || '').toString().replace(/"/g, '""')}"`;
                }).join(','))
            ].join('\n');

            // Download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `leads_export_${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast({
                title: "Export Successful",
                description: `Downloaded ${dataToExport.length} leads to CSV.`
            });

        } catch (err) {
            console.error("Export failed", err);
            alert("Export failed. Please check console for details.");
        } finally {
            setIsExporting(false);
        }
    };



    const TypeBadge = ({ type }: { type: string }) => {
        const isPlanMyTrip = type === 'PLAN_MY_TRIP';
        const isPackage = type === 'PACKAGE_BOOKING';
        return (
            <Badge variant={isPackage ? 'default' : isPlanMyTrip ? 'secondary' : 'outline'} className="capitalize whitespace-nowrap">
                {type.replace(/_/g, ' ').toLowerCase()}
            </Badge>
        );
    };

    // Filter inquiries for the selected date
    const calendarInquiries = selectedDate
        ? initialInquiries.filter(inq => {
            const inqDate = new Date(inq.createdAt);
            return inqDate.getDate() === selectedDate.getDate() &&
                inqDate.getMonth() === selectedDate.getMonth() &&
                inqDate.getFullYear() === selectedDate.getFullYear();
        })
        : [];

    const CopyButton = ({ inquiry }: { inquiry: Inquiry }) => {
        const [copied, setCopied] = useState(false);

        const handleCopy = (e: React.MouseEvent) => {
            e.stopPropagation();
            const text = `*Lead Details* 📋\nName: ${inquiry.name}\nPhone: ${inquiry.phone}\n${inquiry.startDate ? `Travel: ${new Date(inquiry.startDate).toLocaleDateString('en-GB')}` : ''}\n${inquiry.travelers ? `Guests: ${inquiry.travelers}` : ''}\n${inquiry.budget ? `Budget: ${inquiry.budget}` : ''}\n${inquiry.message ? `Note: ${inquiry.message}` : ''}`;
            navigator.clipboard.writeText(text);
            logActivity('COPIED_LEAD', 'Inquiry', inquiry.id, `Copied lead details for ${inquiry.name}`);
            setCopied(true);
            toast({
                title: "Copied!",
                description: "Lead details copied to clipboard."
            });
            setTimeout(() => setCopied(false), 2000);
        };

        return (
            <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                title="Copy Details"
                className={`h-8 w-8 transition-all ${copied ? 'text-green-600 bg-green-50 scale-110' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}
            >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
        );
    };

    const InquiriesTable = ({ data, isTrash = false }: { data: Inquiry[], isTrash?: boolean }) => (
        <>
            {/* Mobile View */}
            <div className="md:hidden">
                {data.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground p-4 bg-muted/20 rounded-lg">
                        {isTrash ? "Trash is empty" : "No active inquiries found"}
                    </div>
                ) : (
                    data.map((inquiry) => (
                        <InquiryMobileCard
                            key={inquiry.id}
                            inquiry={inquiry}
                            isTrash={isTrash}
                            onMarkAsRead={handleMarkAsRead}
                            onSoftDelete={handleSoftDelete}
                            onRestore={handleRestore}
                            onPermanentDelete={handlePermanentDelete}
                            userEmail={userEmail}
                            role={role}
                        />
                    ))
                )}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b-2 border-border/60">
                            <TableHead className="w-[80px]">Source</TableHead>
                            <TableHead className="w-[300px]">Contact</TableHead>
                            <TableHead className="w-[120px]">Date</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead className="w-[80px]">Notes</TableHead>
                            <TableHead className="w-[140px]">Status</TableHead>
                            <TableHead className="text-right w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                    {isTrash ? "Trash is empty" : "No active inquiries found"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((inquiry) => {
                                const isUnread = !isTrash && !inquiry.isRead;
                                return (
                                    <TableRow
                                        key={inquiry.id}
                                        className={`
                                            cursor-pointer transition-all group
                                            ${isTrash ? "opacity-75 bg-muted/30" : "hover:bg-muted/30"}
                                            ${isUnread ? "bg-orange-50/10 dark:bg-orange-950/10" : ""}
                                        `}
                                        onClick={() => !isTrash && handleMarkAsRead(inquiry.id, inquiry.isRead)}
                                    >
                                        <TableCell>
                                            <div className="flex justify-center" title={inquiry.type}>
                                                {inquiry.type === 'GENERAL' ? (
                                                    <div className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 p-2 rounded-full">
                                                        <Globe className="w-4 h-4" />
                                                    </div>
                                                ) : inquiry.type === 'PLAN_MY_TRIP' ? (
                                                    <div className="bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300 p-2 rounded-full">
                                                        <Globe className="w-4 h-4" />
                                                    </div>
                                                ) : (
                                                    <div className="bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300 p-2 rounded-full">
                                                        <Smartphone className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <InquiryAvatar name={inquiry.name} className="h-9 w-9 text-[10px]" />
                                                <div className="flex flex-col min-w-0">
                                                    <div className={cn("font-medium truncate flex items-center gap-2", isUnread && "font-bold text-foreground")}>
                                                        {inquiry.name}
                                                        {isUnread && (
                                                            <span className="h-2 w-2 rounded-full bg-brand-primary animate-pulse" />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                                        <a href={`tel:${inquiry.phone}`} onClick={e => e.stopPropagation()} className="hover:text-primary flex items-center gap-1">
                                                            <Phone className="w-3 h-3" /> {inquiry.phone}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex flex-col text-xs text-muted-foreground">
                                                <span className="font-medium text-foreground">{new Date(inquiry.createdAt).toLocaleDateString('en-GB')}</span>
                                                <span>{new Date(inquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </TableCell>

                                        <TableCell className="min-w-[350px]">
                                            <div className="space-y-1.5">
                                                {(inquiry.startDate || inquiry.travelers || inquiry.budget) && (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {inquiry.startDate && (
                                                            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-normal bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 rounded hover:bg-blue-100">
                                                                {new Date(inquiry.startDate).toLocaleDateString('en-GB')}
                                                            </Badge>
                                                        )}
                                                        {!!inquiry.travelers && (
                                                            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-normal bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300 rounded hover:bg-orange-100">
                                                                {inquiry.travelers} G
                                                            </Badge>
                                                        )}
                                                        {!!inquiry.budget && (
                                                            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-normal bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300 rounded hover:bg-green-100">
                                                                {inquiry.budget}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Message Preview - Always visible fully */}
                                                {inquiry.message && (
                                                    <div className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed whitespace-pre-wrap">
                                                        {inquiry.message.replace('Booking Inquiry for Package:', '').trim()}
                                                    </div>
                                                )}

                                                {/* Action Buttons - Always Visible */}
                                                <div className="flex items-center gap-3 mt-2">
                                                    <a
                                                        href={`https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            logActivity('CLICKED_WHATSAPP', 'Inquiry', inquiry.id, `Clicked WhatsApp for ${inquiry.name}`);
                                                        }}
                                                        className="text-[10px] font-medium text-green-600 flex items-center gap-1 hover:underline bg-green-50 px-2 py-1 rounded-full border border-green-100"
                                                    >
                                                        <MessageCircle className="w-3 h-3" /> WhatsApp
                                                    </a>
                                                    {inquiry.email && (
                                                        <a href={`mailto:${inquiry.email}`} onClick={e => {
                                                            e.stopPropagation();
                                                            logActivity('CLICKED_EMAIL', 'Inquiry', inquiry.id, `Clicked Email for ${inquiry.name}`);
                                                        }} className="text-[10px] font-medium text-blue-600 flex items-center gap-1 hover:underline bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                                                            <Mail className="w-3 h-3" /> Email
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            {!isTrash && (
                                                <NotesDialog
                                                    inquiryId={inquiry.id}
                                                    existingNotes={inquiry.notes}
                                                    customerName={inquiry.name}
                                                    userEmail={userEmail}
                                                />
                                            )}
                                            {inquiry.notes && !isTrash && (
                                                <div className="text-[10px] text-gray-500 mt-1 truncate max-w-[80px]">
                                                    {inquiry.notes.split('\n')[0]}
                                                </div>
                                            )}
                                        </TableCell>

                                        <TableCell onClick={e => e.stopPropagation()}>
                                            <StatusSelector id={inquiry.id} status={inquiry.status} isTrash={isTrash} />
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex justify-end gap-1">
                                                {isTrash ? (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={(e) => handleRestore(inquiry.id, e)}
                                                            className="h-8 w-8 text-green-600"
                                                            title="Restore"
                                                        >
                                                            <RefreshCcw className="w-3.5 h-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={(e) => handlePermanentDelete(inquiry.id, e)}
                                                            className="h-8 w-8 text-red-600"
                                                            title="Permanently Delete"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <CopyButton inquiry={inquiry} />
                                                        {role !== 'SALES' && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={(e) => handleSoftDelete(inquiry.id, e)}
                                                                className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </Button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table >
            </div>
        </>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Inquiries</h2>
                    <p className="text-muted-foreground mt-1">Manage your customer leads and bookings.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handleExport} disabled={isExporting}>
                        <FileDown className="w-4 h-4 mr-2" />
                        {isExporting ? 'Exporting...' : 'Export CSV'}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <TabsList className="bg-card border shadow-sm h-auto p-1 flex-wrap justify-start">
                        <TabsTrigger value="all" className="px-4 py-2">
                            All Active <Badge variant="secondary" className="ml-2 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">{initialInquiries.length}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="package" className="px-4 py-2">
                            Packages <Badge variant="secondary" className="ml-2 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{initialInquiries.filter(i => i.type === 'PACKAGE_BOOKING').length}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="whatsapp" className="px-4 py-2">
                            WhatsApp <Badge variant="secondary" className="ml-2 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">{initialInquiries.filter(i => i.type === 'GENERAL').length}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="ai_wizard" className="px-4 py-2">
                            AI Wizard <Badge variant="secondary" className="ml-2 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">{initialInquiries.filter(i => i.type === 'AI_WIZARD_LEAD').length}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="custom" className="px-4 py-2">
                            Plan My Trip <Badge variant="secondary" className="ml-2 bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">{initialInquiries.filter(i => i.type === 'PLAN_MY_TRIP').length}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="calendar" className="px-4 py-2 gap-2">
                            <CalendarIcon className="w-4 h-4" /> Calendar
                        </TabsTrigger>
                        {role !== 'SALES' && (
                            <TabsTrigger value="trash" className="px-4 py-2 gap-2 data-[state=active]:bg-red-50 text-red-600">
                                <Trash2 className="w-4 h-4" /> Trash ({trashedInquiries.length})
                            </TabsTrigger>
                        )}
                    </TabsList>
                </div>

                <div className="space-y-4">
                    {/* ALL ACTIVE */}
                    <TabsContent value="all" className="mt-0">
                        <Card>
                            <CardHeader className="pb-3 border-b bg-slate-50/40 dark:bg-slate-900/40">
                                <CardTitle className="text-lg font-semibold text-slate-800 dark:!text-slate-100">All Active Leads</CardTitle>
                                <CardDescription className="dark:text-slate-400">Complete list of all incoming inquiries from every source.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <InquiriesTable data={initialInquiries} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* PACKAGES */}
                    <TabsContent value="package" className="mt-0">
                        <Card>
                            <CardHeader className="pb-3 border-b bg-blue-50/30 dark:bg-blue-950/20">
                                <CardTitle className="text-lg font-semibold text-blue-800 dark:!text-blue-100">📦 Package Bookings</CardTitle>
                                <CardDescription className="dark:text-blue-300/70">Direct booking requests for specific tour packages.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <InquiriesTable data={initialInquiries.filter(i => i.type === 'PACKAGE_BOOKING')} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* WHATSAPP */}
                    <TabsContent value="whatsapp" className="mt-0">
                        <Card>
                            <CardHeader className="pb-3 border-b bg-green-50/30 dark:bg-green-950/20">
                                <CardTitle className="text-lg font-semibold text-green-800 dark:!text-green-100">💬 WhatsApp Quick Chats</CardTitle>
                                <CardDescription className="dark:text-green-300/70">Leads initiated via the floating WhatsApp button.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <InquiriesTable data={initialInquiries.filter(i => i.type === 'GENERAL')} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* AI WIZARD */}
                    <TabsContent value="ai_wizard" className="mt-0">
                        <Card>
                            <CardHeader className="pb-3 border-b bg-purple-50/30 dark:bg-purple-950/20">
                                <CardTitle className="text-lg font-semibold text-purple-800 dark:!text-purple-100">🤖 AI Trip Wizard</CardTitle>
                                <CardDescription className="dark:text-purple-300/70">Personalized itineraries generated by the AI tool.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <InquiriesTable data={initialInquiries.filter(i => i.type === 'AI_WIZARD_LEAD')} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* CUSTOM / PLAN MY TRIP */}
                    <TabsContent value="custom" className="mt-0">
                        <Card>
                            <CardHeader className="pb-3 border-b bg-orange-50/30 dark:bg-orange-950/20">
                                <CardTitle className="text-lg font-semibold text-orange-800 dark:!text-orange-100">✨ Plan My Trip</CardTitle>
                                <CardDescription className="dark:text-orange-300/70">Custom trip customization requests.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <InquiriesTable data={initialInquiries.filter(i => i.type === 'PLAN_MY_TRIP')} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* CALENDAR */}
                    <TabsContent value="calendar" className="mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start">
                            <Card>
                                <CardContent className="p-4">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={setSelectedDate}
                                        className="rounded-md border shadow-sm"
                                        modifiers={{
                                            hasInquiry: initialInquiries.map(inq => new Date(inq.createdAt))
                                        }}
                                        modifiersClassNames={{
                                            hasInquiry: "font-bold text-orange-600 bg-orange-50 relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-orange-600 after:rounded-full"
                                        }}
                                    />
                                    <div className="mt-4 text-xs text-gray-500 text-center">
                                        <span className="inline-block w-2 h-2 bg-orange-600 rounded-full mr-1"></span>
                                        Dates with inquiries
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="h-full min-h-[400px]">
                                <CardHeader>
                                    <CardTitle>
                                        {selectedDate
                                            ? `Inquiries for ${selectedDate.toLocaleDateString('en-GB')}`
                                            : 'Select a date'}
                                    </CardTitle>
                                    <CardDescription>
                                        {calendarInquiries.length} inquiry(s) found.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <InquiriesTable data={calendarInquiries} />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* TRASH */}
                    {role !== 'SALES' && (
                        <TabsContent value="trash" className="mt-0">
                            <Card className="border-red-100">
                                <CardHeader className="pb-3 bg-red-50/30 dark:bg-red-950/20">
                                    <CardTitle className="text-red-900 dark:!text-red-100 flex items-center gap-2">
                                        <Trash2 className="w-5 h-5" /> Trash
                                    </CardTitle>
                                    <CardDescription className="text-red-700/80 dark:text-red-200/80">
                                        Deleted inquiries. You can restore them or permanently delete them.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <InquiriesTable data={trashedInquiries} isTrash={true} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    )}
                </div>
            </Tabs>
        </div>
    );
}
