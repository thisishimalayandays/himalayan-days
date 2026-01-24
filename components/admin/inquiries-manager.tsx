'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Mail, Phone, Calendar as CalendarIcon, MapPin, Trash2, RefreshCcw, FileDown, Eye } from 'lucide-react';
import { softDeleteInquiry, restoreInquiry, permanentDeleteInquiry, markInquiryAsRead, updateInquiryStatus } from '@/app/actions/inquiries';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Inquiry {
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
    createdAt: Date;
    isDeleted: boolean;
    deletedAt: Date | null;
    isRead: boolean;
}

interface InquiriesManagerProps {
    initialInquiries: Inquiry[];
    trashedInquiries: Inquiry[];
}

export function InquiriesManager({ initialInquiries, trashedInquiries }: InquiriesManagerProps) {
    const router = useRouter();
    const [isExporting, setIsExporting] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    const handleSoftDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to move this inquiry to trash?')) return;
        await softDeleteInquiry(id);
        router.refresh();
    };

    const handleRestore = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await restoreInquiry(id);
        router.refresh();
    };

    const handlePermanentDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('WARNING: This will permanently delete this inquiry. This action cannot be undone. Are you sure?')) return;
        await permanentDeleteInquiry(id);
        router.refresh();
    };

    const handleMarkAsRead = async (id: string, currentStatus: boolean) => {
        if (currentStatus) return; // Already read
        await markInquiryAsRead(id);
        router.refresh();
    };

    const handleExport = () => {
        setIsExporting(true);
        try {
            const dataToExport = initialInquiries.map(inq => ({
                Date: new Date(inq.createdAt).toLocaleDateString('en-GB'),
                Name: inq.name,
                Phone: inq.phone,
                Email: inq.email || '',
                Type: inq.type,
                Status: inq.status,
                Destination: inq.destination || '',
                TravelDate: inq.startDate ? new Date(inq.startDate).toLocaleDateString('en-GB') : '',
                Travelers: inq.travelers || '',
                Message: inq.message || ''
            }));

            const textHeader = Object.keys(dataToExport[0]).join(',') + '\n';
            const textBody = dataToExport.map(row => Object.values(row).map(val => `"${val}"`).join(',')).join('\n');
            const csv = textHeader + textBody;

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('hidden', '');
            a.setAttribute('href', url);
            a.setAttribute('download', `inquiries_export_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

        } catch (err) {
            console.error("Export failed", err);
            alert("Failed to export data");
        } finally {
            setIsExporting(false);
        }
    };

    const StatusSelector = ({ id, status, isTrash }: { id: string, status: string, isTrash: boolean }) => {
        if (isTrash) {
            return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 capitalize">{status.toLowerCase()}</Badge>;
        }

        const handleStatusChange = async (newStatus: string) => {
            // Optimistic update could go here, but router.refresh() is safer for now
            const result = await updateInquiryStatus(id, newStatus);
            if (result.success) {
                toast.success(`Status updated to ${newStatus.toLowerCase()}`)
                router.refresh();
            } else {
                toast.error("Failed to update status");
            }
        };

        const variants: any = {
            'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'CONTACTED': 'bg-blue-100 text-blue-800 border-blue-200',
            'INTERESTED': 'bg-purple-100 text-purple-800 border-purple-200',
            'BOOKED': 'bg-green-100 text-green-800 border-green-200',
            'CLOSED': 'bg-gray-100 text-gray-800 border-gray-200',
        };

        return (
            <div onClick={e => e.stopPropagation()}>
                <Select defaultValue={status} onValueChange={handleStatusChange}>
                    <SelectTrigger className={`h-8 w-[130px] text-xs font-medium border-0 focus:ring-0 focus:ring-offset-0 capitalize ${variants[status] || ''}`}>
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="CONTACTED">Contacted</SelectItem>
                        <SelectItem value="INTERESTED">Interested</SelectItem>
                        <SelectItem value="BOOKED">Booked</SelectItem>
                        <SelectItem value="CLOSED">Closed/Lost</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        );
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

    const InquiriesTable = ({ data, isTrash = false }: { data: Inquiry[], isTrash?: boolean }) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                            {isTrash ? "Trash is empty" : "No active inquiries found"}
                        </TableCell>
                    </TableRow>
                ) : (
                    data.map((inquiry) => (
                        <TableRow
                            key={inquiry.id}
                            className={`
                                cursor-pointer transition-colors
                                ${isTrash ? "opacity-75 bg-gray-50/50" : "hover:bg-gray-50"}
                                ${!isTrash && !inquiry.isRead ? "bg-orange-50/30" : "opacity-90"}
                            `}
                            onClick={() => !isTrash && handleMarkAsRead(inquiry.id, inquiry.isRead)}
                        >
                            <TableCell className="whitespace-nowrap w-[120px]">
                                <div className={`font-medium ${!isTrash && !inquiry.isRead ? "text-gray-900 font-bold" : "text-gray-600"}`}>
                                    {new Date(inquiry.createdAt).toLocaleDateString('en-GB')}
                                </div>
                                <div className={`text-xs ${!isTrash && !inquiry.isRead ? "text-gray-700 font-semibold" : "text-gray-500"}`} suppressHydrationWarning>
                                    {new Date(inquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </TableCell>
                            <TableCell className="w-[140px]">
                                <TypeBadge type={inquiry.type} />
                                {!isTrash && !inquiry.isRead && (
                                    <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" title="New Inquiry"></span>
                                )}
                            </TableCell>
                            <TableCell className="min-w-[200px]">
                                <div className={`font-semibold ${!isTrash && !inquiry.isRead ? "text-gray-900" : "text-gray-700"}`}>
                                    {inquiry.name}
                                </div>
                                <div className="flex flex-col gap-1 mt-1">
                                    <a href={`tel:${inquiry.phone}`} onClick={e => e.stopPropagation()} className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-primary transition-colors">
                                        <Phone className="w-3 h-3" /> {inquiry.phone}
                                    </a>
                                    {inquiry.email && (
                                        <a href={`mailto:${inquiry.email}`} onClick={e => e.stopPropagation()} className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-primary transition-colors">
                                            <Mail className="w-3 h-3" /> {inquiry.email}
                                        </a>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="max-w-[300px]">
                                <div className="space-y-1.5 text-sm text-gray-600">
                                    {inquiry.startDate && (
                                        <div className="flex items-center gap-1.5">
                                            <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="font-medium">Travel: {new Date(inquiry.startDate).toLocaleDateString('en-GB')}</span>
                                        </div>
                                    )}
                                    {inquiry.destination && (
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                            <span>{inquiry.destination}</span>
                                        </div>
                                    )}
                                    {inquiry.message && (
                                        <p className="text-xs bg-gray-50 p-2 rounded-md border text-gray-700 italic line-clamp-2" title={inquiry.message}>
                                            "{inquiry.message}"
                                        </p>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="w-[140px]" onClick={e => e.stopPropagation()}>
                                <StatusSelector id={inquiry.id} status={inquiry.status} isTrash={isTrash} />
                            </TableCell>
                            <TableCell className="text-right w-[100px]">
                                <div className="flex justify-end gap-2">
                                    {isTrash ? (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={(e) => handleRestore(inquiry.id, e)}
                                                title="Restore"
                                                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                            >
                                                <RefreshCcw className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={(e) => handlePermanentDelete(inquiry.id, e)}
                                                title="Delete Permanently"
                                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => handleSoftDelete(inquiry.id, e)}
                                            title="Move to Trash"
                                            className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
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

            <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid w-full max-w-lg grid-cols-3 mb-6 bg-white border shadow-sm">
                    <TabsTrigger value="active">
                        Active ({initialInquiries.length})
                    </TabsTrigger>
                    <TabsTrigger value="calendar">
                        Calendar
                    </TabsTrigger>
                    <TabsTrigger value="trash" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-900">
                        Trash ({trashedInquiries.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="active">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle>Active Leads</CardTitle>
                            <CardDescription>
                                Click on a row to mark it as read. Unread items are highlighted.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <InquiriesTable data={initialInquiries} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="calendar">
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

                <TabsContent value="trash">
                    <Card className="border-red-100">
                        <CardHeader className="pb-3 bg-red-50/30">
                            <CardTitle className="text-red-900 flex items-center gap-2">
                                <Trash2 className="w-5 h-5" /> Trash
                            </CardTitle>
                            <CardDescription className="text-red-700/80">
                                Deleted inquiries. You can restore them or permanently delete them.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <InquiriesTable data={trashedInquiries} isTrash={true} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
