'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Wallet, CheckCircle, Clock, AlertCircle, Banknote } from "lucide-react";

interface Booking {
    id: string;
    title: string;
    status: string;
    travelDate: Date;
    totalAmount: number;
    payments: {
        amount: number;
    }[];
    customer: {
        name: string;
        phone: string;
    };
}

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash, CreditCard, RotateCcw, AlertTriangle, Download, FileText } from "lucide-react";
import { BookingDialog } from "./create-booking-dialog";
import { useState } from "react";
import { deleteBooking, restoreBooking, permanentDeleteBooking } from "@/app/actions/crm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AddPaymentDialog } from "./add-payment-dialog";
import dynamic from "next/dynamic";
import { DownloadInvoiceBtn, DownloadReceiptBtn } from "./pdf-download-actions";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function BookingActions({ booking, isTrash }: { booking: Booking, isTrash?: boolean }) {
    const router = useRouter();
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    const paidAmount = booking.payments.reduce((sum, p) => sum + p.amount, 0);
    const balance = booking.totalAmount - paidAmount;

    const handleDelete = async () => {
        // Soft delete
        const res = await deleteBooking(booking.id);
        if (res.success) {
            toast.success('Booking moved to trash');
            router.refresh();
        } else {
            toast.error('Failed to delete');
        }
    };

    const handleRestore = async () => {
        const res = await restoreBooking(booking.id);
        if (res.success) {
            toast.success('Booking restored');
            router.refresh();
        } else {
            toast.error('Failed to restore');
        }
    };

    const handlePermanentDelete = async () => {
        const res = await permanentDeleteBooking(booking.id);
        if (res.success) {
            toast.success('Booking permanently deleted');
            router.refresh();
        } else {
            toast.error('Failed to delete permanently');
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    {!isTrash ? (
                        <>
                            <DownloadInvoiceBtn booking={booking} menuItem={true} />
                            <DownloadReceiptBtn booking={booking} menuItem={true} />
                            <DropdownMenuItem onClick={() => router.push(`/admin/bookings/${booking.id}/payment`)}>
                                <CreditCard className="mr-2 h-4 w-4" /> Add Payment
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/bookings/${booking.id}`)}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/bookings/${booking.id}/expenses`)}>
                                <Banknote className="w-4 h-4 mr-2" /> Manage Expenses
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                                <Trash className="mr-2 h-4 w-4" /> Move to Trash
                            </DropdownMenuItem>
                        </>
                    ) : (
                        <>
                            <DropdownMenuItem onClick={handleRestore}>
                                <RotateCcw className="mr-2 h-4 w-4" /> Restore
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setShowDeleteAlert(true)} className="text-red-600 font-bold bg-red-50 focus:bg-red-100">
                                <AlertTriangle className="mr-2 h-4 w-4" /> Delete Forever
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the booking and all associated payment records from the database.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handlePermanentDelete} className="bg-red-600 hover:bg-red-700">Delete Forever</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


        </>
    );
}

export function BookingsTable({ bookings, isTrash }: { bookings: Booking[], isTrash?: boolean }) {
    // ... existing table code ...
    // Pass isTrash to BookingActions

    // REDEFINING THE COMPONENT START TO INCLUDE isTrash prop usage
    const getStatusParams = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return { label: 'Confirmed', icon: CheckCircle, class: 'bg-green-100 text-green-800' };
            case 'PENDING': return { label: 'Pending', icon: Clock, class: 'bg-yellow-100 text-yellow-800' };
            case 'CANCELLED': return { label: 'Cancelled', icon: AlertCircle, class: 'bg-red-100 text-red-800' };
            case 'COMPLETED': return { label: 'Completed', icon: CheckCircle, class: 'bg-blue-100 text-blue-800' };
            default: return { label: status, icon: Clock, class: 'bg-gray-100 text-gray-800' };
        }
    };

    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Trip Details</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Travel Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Payment</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                    {isTrash ? "Trash is empty." : "No bookings found."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            bookings.map((booking) => {
                                const status = getStatusParams(booking.status);
                                const paidAmount = booking.payments.reduce((sum, p) => sum + p.amount, 0);
                                const balance = booking.totalAmount - paidAmount;
                                const isFullyPaid = balance <= 0;

                                return (
                                    <TableRow key={booking.id} className="cursor-pointer hover:bg-muted/50">
                                        <TableCell>
                                            <div className="font-medium text-foreground">{booking.title}</div>
                                            <div className="text-xs text-muted-foreground">ID: {booking.id.slice(-6)}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <User className="w-3.5 h-3.5 text-muted-foreground" />
                                                <span>{booking.customer.name}</span>
                                            </div>
                                            <div className="text-xs text-muted-foreground ml-5.5">{booking.customer.phone}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                                <span>{new Date(booking.travelDate).toLocaleDateString('en-GB')}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`border-0 ${status.class} flex w-fit items-center gap-1`}>
                                                <status.icon className="w-3 h-3" />
                                                {status.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="font-medium">Total: ₹{booking.totalAmount.toLocaleString()}</div>
                                            <div className="text-xs text-muted-foreground">
                                                Paid: ₹{paidAmount.toLocaleString()}
                                            </div>
                                            <div className={`text-xs font-medium ${isFullyPaid ? 'text-green-600' : 'text-orange-600'}`}>
                                                {isFullyPaid ? 'Fully Paid' : `Bal: ₹${balance.toLocaleString()}`}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <BookingActions booking={booking} isTrash={isTrash} />
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
