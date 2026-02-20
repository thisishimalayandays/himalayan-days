import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getInquiryStats } from "@/app/actions/inquiries";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { NotificationWatcher } from "@/components/admin/notification-watcher";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/api/auth/signin?callbackUrl=/admin");
    }

    // Fallback: If role is missing from session (e.g. recent schema change), check email
    const role = session.user.role || (session.user.email === 'sales@himalayandays.in' ? 'SALES' : 'ADMIN');

    const { pending: pendingInquiries } = await getInquiryStats();
    const unreadSubscribers = await prisma.subscriber.count({
        where: { isRead: false }
    });
    const pendingApplications = await prisma.jobApplication.count({
        where: { isRead: false }
    });

    return (
        <div className="flex h-[111.2vh] bg-muted/40 font-sans overflow-hidden" style={{ zoom: 0.9 }}>
            {/* NotificationWatcher removed to save DB costs. Sales uses Telegram now. */}
            {/* <NotificationWatcher /> */}
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 bg-sidebar shadow-md flex-col border-r h-full" style={{ backgroundColor: 'var(--sidebar)' }}>
                <AdminSidebar
                    pendingInquiries={pendingInquiries}
                    pendingSubscribers={unreadSubscribers}
                    pendingApplications={pendingApplications}
                    className="h-full w-full"
                    role={role}
                />
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Mobile Header with Hamburger */}
                <header className="md:hidden bg-background border-b p-4 flex items-center justify-between sticky top-0 z-10">
                    <h1 className="font-bold text-gray-800">Admin Panel</h1>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-72">
                            {/* Pass a dummy onClick to close sheet? No, simple link navigation usually works but better to use a client wrapper if we want auto-close. 
                                For now, default link behavior + standard Sheet is fine. */}
                            <AdminSidebar
                                pendingInquiries={pendingInquiries}
                                pendingSubscribers={unreadSubscribers}
                                pendingApplications={pendingApplications}
                                role={role}
                            />
                        </SheetContent>
                    </Sheet>
                </header>

                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
