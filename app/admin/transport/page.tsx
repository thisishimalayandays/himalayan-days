"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Car, Pencil, Trash2, Users } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { getTransports, deleteTransport } from "@/app/actions/transport";
import { TransportForm } from "@/components/admin/transport-form";
import { toast } from "sonner";
import Image from "next/image";

export default function TransportPage() {
    const [transports, setTransports] = useState<any[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTransport, setEditingTransport] = useState<any>(null);

    const loadTransports = async () => {
        const res = await getTransports();
        if (res.success && res.transports) {
            setTransports(res.transports);
        }
    };

    useEffect(() => {
        loadTransports();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this vehicle?")) {
            const res = await deleteTransport(id);
            if (res.success) {
                toast.success("Vehicle deleted");
                loadTransports();
            } else {
                toast.error("Failed to delete");
            }
        }
    };

    const handleEdit = (transport: any) => {
        setEditingTransport(transport);
        setIsDialogOpen(true);
    };

    const handleDialogChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) setEditingTransport(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Transport Management</h1>
                    <p className="text-muted-foreground">Manage your vehicle fleet and rates.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Vehicle
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingTransport ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
                        </DialogHeader>
                        <TransportForm
                            initialData={editingTransport}
                            onSuccess={() => {
                                setIsDialogOpen(false);
                                loadTransports();
                            }}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {transports.map((transport) => (
                    <Card key={transport.id} className="overflow-hidden">
                        <div className="relative h-48 w-full bg-muted">
                            {transport.image ? (
                                <Image
                                    src={transport.image}
                                    alt={transport.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                    <Car className="h-12 w-12" />
                                </div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-2">
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="h-8 w-8"
                                    onClick={() => handleEdit(transport)}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    className="h-8 w-8"
                                    onClick={() => handleDelete(transport.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-semibold text-lg">{transport.name}</h3>
                                    <p className="text-sm text-muted-foreground">{transport.type}</p>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-lg">₹{transport.rate}</span>
                                    <span className="text-xs text-muted-foreground">per day</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                                <Users className="h-4 w-4" />
                                <span>Updates capacity: {transport.capacity} Pax</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {transports.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-lg">
                        <Car className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No vehicles added yet</h3>
                        <p className="text-muted-foreground mb-4">Start by adding your first vehicle to the fleet.</p>
                        <Button onClick={() => setIsDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Add Vehicle
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
