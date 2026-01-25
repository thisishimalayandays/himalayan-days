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
import { Calendar, User, Wallet, CheckCircle, Clock, AlertCircle } from "lucide-react";

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

export function BookingsTable({ bookings }: { bookings: Booking[] }) {
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
                                    No bookings found.
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
                                            <BookingActions booking={booking} />
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

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash, CreditCard } from "lucide-react";
import { BookingDialog } from "./create-booking-dialog";
import { useState } from "react";
import { deleteBooking } from "@/app/actions/crm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AddPaymentDialog } from "./add-payment-dialog";

function BookingActions({ booking }: { booking: Booking }) {
    const [openEdit, setOpenEdit] = useState(false);
    const [openPayment, setOpenPayment] = useState(false);
    const router = useRouter();

    const paidAmount = booking.payments.reduce((sum, p) => sum + p.amount, 0);
    const balance = booking.totalAmount - paidAmount;

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this booking?')) {
            const res = await deleteBooking(booking.id);
            if (res.success) {
                toast.success('Booking deleted');
                router.refresh();
            } else {
                toast.error('Failed to delete');
            }
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
                    <DropdownMenuItem onClick={() => setOpenPayment(true)}>
                        <CreditCard className="mr-2 h-4 w-4" /> Add Payment
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenEdit(true)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <BookingDialog
                mode="edit"
                booking={booking}
                open={openEdit}
                onOpenChange={setOpenEdit}
            />

            <AddPaymentDialog
                bookingId={booking.id}
                bookingTitle={booking.title}
                balance={balance}
                open={openPayment}
                onOpenChange={setOpenPayment}
            />
        </>
    );
}
