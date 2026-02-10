import { getApplications, getJobStatus } from "@/lib/careers-db"
import { updateJobStatusAction } from "@/app/actions/careers"
import { JobApplicationsTable } from "@/components/admin/job-applications-table"
import { Briefcase, Lock, PauseCircle, PlayCircle, User } from "lucide-react"

export const metadata = {
    title: "Admin | Job Applications",
}

export default async function AdminCareersPage() {
    const applications = await getApplications()
    const status = await getJobStatus("sales-executive")

    const isOpen = status === 'OPEN'
    const isClosed = status === 'CLOSED'
    const isOnHold = status === 'ON_HOLD'

    let statusColor = "text-green-600"
    let statusText = "HIRING"
    if (isClosed) { statusColor = "text-red-600"; statusText = "CLOSED" }
    if (isOnHold) { statusColor = "text-yellow-600"; statusText = "ON HOLD" }

    return (
        <div className="p-8 space-y-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Careers Dashboard</h1>
                    <p className="text-muted-foreground">Manage jobs and candidates.</p>
                </div>
            </div>

            {/* Stats / Job Management */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50/10 text-brand-primary rounded-xl flex items-center justify-center">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground">Sales Executive</h3>
                            <p className={`text-sm font-bold ${statusColor}`}>
                                Status: {statusText}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {/* Open Button */}
                        <form action={async () => { 'use server'; await updateJobStatusAction('sales-executive', 'OPEN') }}>
                            <button
                                disabled={isOpen}
                                className={`px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-colors ${isOpen
                                    ? "bg-green-100 text-green-700 cursor-default opacity-50"
                                    : "bg-card border border-green-200 text-green-700 hover:bg-green-50"
                                    }`}
                            >
                                <PlayCircle className="w-4 h-4" /> Set Open
                            </button>
                        </form>

                        {/* On Hold Button */}
                        <form action={async () => { 'use server'; await updateJobStatusAction('sales-executive', 'ON_HOLD') }}>
                            <button
                                disabled={isOnHold}
                                className={`px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-colors ${isOnHold
                                    ? "bg-yellow-100 text-yellow-700 cursor-default opacity-50"
                                    : "bg-card border border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                                    }`}
                            >
                                <PauseCircle className="w-4 h-4" /> Set On Hold
                            </button>
                        </form>

                        {/* Close Button */}
                        <form action={async () => { 'use server'; await updateJobStatusAction('sales-executive', 'CLOSED') }}>
                            <button
                                disabled={isClosed}
                                className={`px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-colors ${isClosed
                                    ? "bg-red-100 text-red-700 cursor-default opacity-50"
                                    : "bg-card border border-red-200 text-red-700 hover:bg-red-50"
                                    }`}
                            >
                                <Lock className="w-4 h-4" /> Set Closed
                            </button>
                        </form>
                    </div>
                </div>

                <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted text-muted-foreground rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground">Total Applications</h3>
                        <p className="text-2xl font-bold text-brand-primary">{applications.length}</p>
                    </div>
                </div>
            </div>

            {/* Applications Table */}
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-muted/40">
                    <h2 className="font-semibold text-foreground">Recent Applications</h2>
                </div>

                <JobApplicationsTable applications={applications} />
            </div>
        </div>
    )
}
