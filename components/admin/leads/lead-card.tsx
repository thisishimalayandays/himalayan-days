"use client";

import { useDraggable } from "@dnd-kit/core";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { GripVertical, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { CSS } from "@dnd-kit/utilities";

interface Lead {
    id: string;
    name: string;
    phone: string;
    destination?: string | null;
    budget?: string | null;
    status: string;
    createdAt: Date;
    type: string;
}

export function LeadCard({ lead }: { lead: Lead }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: lead.id,
        data: { status: lead.status }, // Useful for finding parent container if needed
    });

    const style = transform
        ? {
            transform: CSS.Translate.toString(transform),
        }
        : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="touch-none mb-3">
            <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
                <CardHeader className="p-3 pb-0 flex flex-row justify-between items-start space-y-0">
                    <div>
                        <h4 className="font-semibold text-sm line-clamp-1">{lead.name}</h4>
                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}</p>
                    </div>
                    <GripVertical className="h-4 w-4 text-gray-300" />
                </CardHeader>
                <CardContent className="p-3 pt-2 space-y-2">

                    {lead.destination && (
                        <div className="flex items-center text-xs text-gray-600 gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-[150px]">{lead.destination}</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                        <Badge variant="secondary" className="text-[10px] px-1.5 h-5 font-normal">
                            {lead.type === 'PLAN_MY_TRIP' ? 'Custom' : 'Package'}
                        </Badge>
                        <Link href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`} target="_blank" className="text-green-600 hover:text-green-700">
                            <Phone className="h-4 w-4" />
                        </Link>
                    </div>

                    {lead.budget && (
                        <div className="text-xs font-medium text-gray-900 mt-1">
                            Budget: {lead.budget}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
