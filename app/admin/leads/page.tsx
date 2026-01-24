import { KanbanBoard } from "@/components/admin/leads/kanban-board";
import { getInquiries } from "@/app/actions/inquiries";

export default async function LeadsPage() {
    const { data: inquiries } = await getInquiries();

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex items-center justify-between mb-4 px-1">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Leads Pipeline</h2>
                    <p className="text-sm text-gray-500">
                        Drag and drop leads to update their status.
                    </p>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto min-h-0">
                {/* We pass all inquiries; the board handles filtering by status */}
                <KanbanBoard initialLeads={inquiries || []} />
            </div>
        </div>
    );
}
