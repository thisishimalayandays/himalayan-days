import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getSubscribers, unsubscribe } from "@/app/actions/newsletter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Copy, Mail } from "lucide-react";
import { SubscribersClient } from "./subscribers-client";
import { prisma } from "@/lib/prisma";

export default async function SubscribersPage() {
    const session = await auth();
    if (!session?.user) redirect("/api/auth/signin");

    const { data: subscribers = [] } = await getSubscribers();

    // Mark all as read when viewing the list
    await prisma.subscriber.updateMany({
        where: { isRead: false },
        data: { isRead: true }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Subscribers</h2>
                    <p className="text-muted-foreground mt-1">Manage your newsletter audience.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-card text-card-foreground px-4 py-2 rounded-lg border shadow-sm text-sm font-medium">
                        Total: {subscribers.length}
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Email List</CardTitle>
                    <CardDescription>
                        Users who have opted in for updates.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <SubscribersClient subscribers={subscribers} />
                </CardContent>
            </Card>
        </div>
    );
}
