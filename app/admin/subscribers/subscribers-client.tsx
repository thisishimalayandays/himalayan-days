'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Copy, Mail } from "lucide-react";
import { unsubscribe } from "@/app/actions/newsletter";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function SubscribersClient({ subscribers }: { subscribers: any[] }) {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const [isExporting, setIsExporting] = useState(false);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this subscriber?")) return;
        setIsLoading(id);
        await unsubscribe(id);
        router.refresh();
        setIsLoading(null);
        toast({ title: "Subscriber deleted" });
    };

    const handleExport = () => {
        setIsExporting(true);
        try {
            const dataToExport = subscribers.map(sub => ({
                Email: sub.email,
                Status: sub.isActive ? 'Active' : 'Unsubscribed',
                Joined: new Date(sub.createdAt).toLocaleDateString('en-GB'),
            }));

            if (dataToExport.length === 0) {
                toast({ title: "No data to export", variant: "destructive" });
                return;
            }

            const textHeader = Object.keys(dataToExport[0]).join(',') + '\n';
            const textBody = dataToExport.map(row => Object.values(row).map(val => `"${val}"`).join(',')).join('\n');
            const csv = textHeader + textBody;

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('hidden', '');
            a.setAttribute('href', url);
            a.setAttribute('download', `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            toast({ title: "Export successful" });
        } catch (err) {
            console.error("Export failed", err);
            toast({ title: "Failed to export", variant: "destructive" });
        } finally {
            setIsExporting(false);
        }
    };

    const copyEmail = (email: string) => {
        navigator.clipboard.writeText(email);
        toast({ title: "Email copied to clipboard" });
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Button variant="outline" onClick={handleExport} disabled={isExporting || subscribers.length === 0}>
                    {isExporting ? "Exporting..." : "Export CSV"}
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {subscribers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                No subscribers yet.
                            </TableCell>
                        </TableRow>
                    ) : (
                        subscribers.map((sub) => (
                            <TableRow key={sub.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        {sub.email}
                                        <button onClick={() => copyEmail(sub.email)} className="opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity">
                                            <Copy className="w-3 h-3 text-gray-400 hover:text-primary" />
                                        </button>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={sub.isActive ? "default" : "secondary"} className={sub.isActive ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}>
                                        {sub.isActive ? "Active" : "Unsubscribed"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {new Date(sub.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(sub.id)}
                                        disabled={isLoading === sub.id}
                                        className="text-gray-400 hover:text-red-600"
                                        title="Delete Subscriber"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
