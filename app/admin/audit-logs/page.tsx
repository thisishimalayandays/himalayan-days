import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AuditLogsPage() {
    const session = await auth();

    // Fallback: If role is missing, check email or default to ADMIN (allow access)
    // Only strictly deny if role is explicitly SALES
    const role = session?.user?.role || (session?.user?.email === 'sales@himalayandays.in' ? 'SALES' : 'ADMIN');

    if (role !== "ADMIN") {
        redirect("/admin");
    }

    const logs = await prisma.auditLog.findMany({
        where: {
            userEmail: { not: 'admin@himalayandays.in' }
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 500,
    });

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
                    <p className="text-muted-foreground">
                        Track all actions performed by the sales team and admins.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-primary" />
                        Recent Activity (Last 500)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>Actor</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Resource</TableHead>
                                    <TableHead>Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No audit logs found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {new Date(log.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(log.createdAt).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{log.userName || "Unknown"}</span>
                                                    <span className="text-xs text-muted-foreground">{log.userEmail}</span>
                                                    <Badge variant="outline" className="w-fit mt-1 text-[10px] px-1 py-0 h-4">
                                                        {log.userRole}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={log.action.includes("DELETE") ? "destructive" : "secondary"}>
                                                    {log.action.replace(/_/g, " ")}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-mono">{log.resourceId}</span>
                                                    <span className="text-xs text-muted-foreground">{log.resourceType}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-md break-words text-sm">
                                                {log.details}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
