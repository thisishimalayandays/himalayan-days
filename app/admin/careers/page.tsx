import { getApplications, getJobStatus } from "@/lib/careers-db"
import { updateJobStatusAction, deleteApplicationAction } from "@/app/actions/careers"
import { Download, FileText, User, Briefcase, Lock, Unlock, Trash2, PauseCircle, PlayCircle, CheckCircle } from "lucide-react"

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

                {applications.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                        <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p>No applications received yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/40 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-foreground">Candidate</th>
                                    <th className="px-6 py-4 font-semibold text-foreground">Contact</th>
                                    <th className="px-6 py-4 font-semibold text-foreground">Cover Letter</th>
                                    <th className="px-6 py-4 font-semibold text-foreground">Resume</th>
                                    <th className="px-6 py-4 font-semibold text-foreground">Applied At</th>
                                    <th className="px-6 py-4 font-semibold text-foreground text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {applications.map((app) => (
                                    <tr key={app.id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-foreground">{app.name}</div>
                                            <div className="text-xs text-muted-foreground">ID: {app.id}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-foreground">{app.email}</div>
                                            <div className="text-muted-foreground">{app.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <p className="truncate text-muted-foreground" title={app.coverLetter}>
                                                {app.coverLetter || "-"}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {app.resumeUrl ? (
                                                <a
                                                    href={app.resumeUrl}
                                                    target="_blank"
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-brand-primary rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                    Download
                                                </a>
                                            ) : (
                                                <span className="text-muted-foreground/50 italic">No resume</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {new Date(app.appliedAt).toLocaleDateString()}
                                            <br />
                                            <span className="text-xs">{new Date(app.appliedAt).toLocaleTimeString()}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <form action={async () => {
                                                'use server'
                                                await deleteApplicationAction(app.id)
                                            }}>
                                                <button
                                                    className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Application"
                                                    type="submit"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
