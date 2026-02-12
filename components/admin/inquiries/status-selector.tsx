'use client';

import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateInquiryStatus } from '@/app/actions/inquiries';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

interface StatusSelectorProps {
    id: string;
    status: string;
    isTrash: boolean;
}

export function StatusSelector({ id, status, isTrash }: StatusSelectorProps) {
    const router = useRouter();
    const { toast } = useToast();

    if (isTrash) {
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 capitalize">{status.toLowerCase()}</Badge>;
    }

    const handleStatusChange = async (newStatus: string) => {
        const result = await updateInquiryStatus(id, newStatus);
        if (result.success) {
            toast({
                title: "Status Updated",
                description: `Status updated to ${newStatus.toLowerCase()}`,
                className: "bg-green-50 border-green-200 text-green-800"
            });
            router.refresh();
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update status"
            });
        }
    };

    const variants: Record<string, string> = {
        'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'CONTACTED': 'bg-blue-100 text-blue-800 border-blue-200',
        'INTERESTED': 'bg-purple-100 text-purple-800 border-purple-200',
        'BOOKED': 'bg-green-100 text-green-800 border-green-200',
        'CLOSED': 'bg-gray-100 text-gray-800 border-gray-200',
        'SPAM': 'bg-red-100 text-red-800 border-red-200',
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
                    <SelectItem value="SPAM">Spam</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
