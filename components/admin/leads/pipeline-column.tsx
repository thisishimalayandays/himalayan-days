"use client";

import { useDroppable } from "@dnd-kit/core";
import { LeadCard } from "./lead-card";

interface PipelineColumnProps {
    id: string; // The status (e.g., 'NEW')
    title: string;
    leads: any[];
}

export function PipelineColumn({ id, title, leads }: PipelineColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    return (
        <div className="flex flex-col h-full min-w-[280px] w-80 bg-gray-50/50 rounded-xl border border-gray-100">
            <div className="p-3 border-b flex items-center justify-between bg-white rounded-t-xl">
                <h3 className="font-semibold text-sm text-gray-700">{title}</h3>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">
                    {leads.length}
                </span>
            </div>

            <div
                ref={setNodeRef}
                className={`flex-1 p-2 overflow-y-auto min-h-[500px] transition-colors ${isOver ? 'bg-orange-50/50 ring-2 ring-inset ring-orange-200' : ''
                    }`}
            >
                {leads.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} />
                ))}
                {leads.length === 0 && (
                    <div className="h-full flex items-center justify-center text-gray-400 text-xs italic">
                        No leads here
                    </div>
                )}
            </div>
        </div>
    );
}
