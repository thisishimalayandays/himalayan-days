'use client';

import { pdf } from '@react-pdf/renderer';
import { BookingPDF } from './booking-pdf';
import { PaymentReceiptPDF } from './payment-receipt-pdf';
import { Button } from "@/components/ui/button";
import { Download, FileText, Loader2 } from "lucide-react";
import { useState } from 'react';
import { toast } from "sonner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface DownloadActionProps {
    booking: any;
    menuItem?: boolean;
}

export function DownloadInvoiceBtn({ booking, menuItem = false }: DownloadActionProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        if (isLoading) return;

        setIsLoading(true);
        const toastId = toast.loading("Generating invoice...");

        try {
            const fileName = `Invoice_${booking.customer?.name?.replace(/\s+/g, '_') || 'Invoice'}.pdf`;
            const blob = await pdf(<BookingPDF booking={booking} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast.success("Invoice downloaded", { id: toastId });
        } catch (error) {
            console.error("PDF Generation Error:", error);
            toast.error("Failed to generate invoice", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    if (menuItem) {
        return (
            <DropdownMenuItem onSelect={handleDownload} disabled={isLoading} className="cursor-pointer">
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Download className="mr-2 h-4 w-4" />
                )}
                Download Invoice
            </DropdownMenuItem>
        );
    }

    return (
        <Button variant="outline" size="sm" onClick={handleDownload} disabled={isLoading}>
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Download className="mr-2 h-4 w-4" />
            )}
            Download Invoice
        </Button>
    );
}

export function DownloadReceiptBtn({ booking, menuItem = false }: DownloadActionProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async (e: any) => {
        e.preventDefault();
        e.stopPropagation();

        if (isLoading) return;

        setIsLoading(true);
        const toastId = toast.loading("Generating receipt...");

        try {
            const fileName = `Receipt_${booking.customer?.name?.replace(/\s+/g, '_') || 'Receipt'}.pdf`;
            const blob = await pdf(<PaymentReceiptPDF booking={booking} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast.success("Receipt downloaded", { id: toastId });
        } catch (error) {
            console.error("PDF Generation Error:", error);
            toast.error("Failed to generate receipt", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    if (menuItem) {
        return (
            <DropdownMenuItem onSelect={handleDownload} disabled={isLoading} className="cursor-pointer">
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <FileText className="mr-2 h-4 w-4" />
                )}
                Download Receipt
            </DropdownMenuItem>
        );
    }

    return (
        <Button variant="outline" size="sm" onClick={handleDownload} disabled={isLoading}>
            {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <FileText className="mr-2 h-4 w-4" />
            )}
            Download Receipt
        </Button>
    );
}
