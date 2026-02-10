'use client';

import { useState } from 'react';
import { Download, Trash2, User } from 'lucide-react';
import { deleteApplicationAction, markApplicationAsRead } from '@/app/actions/careers';
import { useRouter } from 'next/navigation';

interface JobApplication {
    id: string;
    jobId?: string;
    name: string;
    email: string;
    phone: string;
    resumeData?: any;
    resumeName?: string | null;
    resumeType?: string | null;
    coverLetter?: string;
    status: string;
    isRead: boolean;
    appliedAt: string; // Changed to string to match serialized Date from server
    updatedAt?: Date | string;
    resumeUrl?: string | null;
}

interface JobApplicationsTableProps {
    applications: JobApplication[];
}

export function JobApplicationsTable({ applications }: JobApplicationsTableProps) {
    const router = useRouter();

    const handleMarkAsRead = async (id: string, isRead: boolean) => {
        if (isRead) return;

        // Optimistic update could be done here, but for now we rely on revalidatePath
        await markApplicationAsRead(id);
        router.refresh();
    };

    if (applications.length === 0) {
        return (
            <div className="p-12 text-center text-muted-foreground">
                <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No applications received yet.</p>
            </div>
        );
    }

    return (
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
                        <tr
                            key={app.id}
                            className={`
                                transition-colors cursor-pointer
                                ${!app.isRead ? "bg-orange-50/10 dark:bg-orange-950/20 hover:bg-orange-50/20" : "hover:bg-muted/50"}
                            `}
                            onClick={() => handleMarkAsRead(app.id, app.isRead)}
                        >
                            <td className="px-6 py-4">
                                <div className={`font-medium ${!app.isRead ? "text-foreground font-bold" : "text-foreground"}`}>
                                    {app.name}
                                    {!app.isRead && (
                                        <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" title="New Application"></span>
                                    )}
                                </div>
                                <div className="text-xs text-muted-foreground">ID: {app.id}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className={`${!app.isRead ? "font-semibold" : ""}`}>{app.email}</div>
                                <div className="text-muted-foreground">{app.phone}</div>
                            </td>
                            <td className="px-6 py-4 max-w-xs">
                                <p className="truncate text-muted-foreground" title={app.coverLetter || ""}>
                                    {app.coverLetter || "-"}
                                </p>
                            </td>
                            <td className="px-6 py-4">
                                {app.resumeUrl ? (
                                    <a
                                        href={app.resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Don't trigger row click if just downloading
                                            handleMarkAsRead(app.id, app.isRead); // But normally downloading implies reading? let's keep it safe.
                                        }}
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
                                <button
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        if (confirm("Are you sure you want to delete this application?")) {
                                            await deleteApplicationAction(app.id);
                                            // router.refresh(); // Action handles revalidation
                                        }
                                    }}
                                    className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Application"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
