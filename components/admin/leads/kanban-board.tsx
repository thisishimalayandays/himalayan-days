"use client";

import { useEffect, useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { PipelineColumn } from "./pipeline-column";
import { LeadCard } from "./lead-card";
import { updateInquiryStatus } from "@/app/actions/inquiries";
import { toast } from "sonner";

// Define the columns and their titles
const COLUMNS = [
    { id: 'PENDING', title: 'New Leads' },
    { id: 'CONTACTED', title: 'Contacted' },
    { id: 'INTERESTED', title: 'Interested' },
    { id: 'BOOKED', title: 'Booked' },
    { id: 'CLOSED', title: 'Closed/Lost' },
];

export function KanbanBoard({ initialLeads }: { initialLeads: any[] }) {
    const [leads, setLeads] = useState<any[]>(initialLeads);
    const [activeId, setActiveId] = useState<string | null>(null);

    // Update local state if initialLeads changes (e.g. revalidation)
    useEffect(() => {
        setLeads(initialLeads);
    }, [initialLeads]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require 8px movement implies drag, preventing accidental clicks
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const leadId = active.id as string;
        const newStatus = over.id as string;

        // Find the dragged lead
        const lead = leads.find((l) => l.id === leadId);
        if (!lead) return;

        // If status hasn't changed, do nothing
        if (lead.status === newStatus) return;

        // OPTIMISTIC UPDATE
        const previousStatus = lead.status;
        setLeads((prev) =>
            prev.map((l) =>
                l.id === leadId ? { ...l, status: newStatus } : l
            )
        );

        // Call Server Action
        const result = await updateInquiryStatus(leadId, newStatus);

        if (!result.success) {
            toast.error("Failed to move lead");
            // Revert optimism
            setLeads((prev) =>
                prev.map((l) =>
                    l.id === leadId ? { ...l, status: previousStatus } : l
                )
            );
        } else {
            toast.success(`Moved to ${newStatus.toLowerCase().replace('_', ' ')}`);
        }
    };

    const activeLead = activeId ? leads.find(l => l.id === activeId) : null;

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex h-full gap-4 overflow-x-auto pb-4 items-start">
                {COLUMNS.map((col) => (
                    <PipelineColumn
                        key={col.id}
                        id={col.id}
                        title={col.title}
                        leads={leads.filter((l) => l.status === col.id)}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeLead ? (
                    <div className="rotate-3 scale-105 opacity-90 cursor-grabbing">
                        <LeadCard lead={activeLead} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
