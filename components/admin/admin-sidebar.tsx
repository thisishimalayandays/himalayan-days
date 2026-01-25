'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, MapPin, Users, Calculator, FileText, LogOut, MessageSquare, Mail, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

import { ModeToggle } from "@/components/mode-toggle";

interface AdminSidebarProps {
    pendingInquiries: number;
    className?: string;
    onItemClick?: () => void;
}

export function AdminSidebar({ pendingInquiries, className, onItemClick }: AdminSidebarProps) {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`);

    const links = [
        {
            label: "Main",
            items: [
                { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
                { href: "/admin/packages", label: "Packages", icon: Package },
                { href: "/admin/destinations", label: "Destinations", icon: MapPin },
                { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
            ]
        },
        {
            label: "CRM",
            items: [

                { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
                { href: "/admin/customers", label: "Customers", icon: Users },
            ]
        },
        {
            label: "Tools",
            items: [
                { href: "/admin/tools/calculator", label: "Calculator", icon: Calculator },
                { href: "/admin/tools/itinerary-maker", label: "Itinerary Maker", icon: FileText },
            ]
        },
    ];

    return (
        <div className={cn("flex flex-col h-full bg-sidebar border-r border-border", className)}>
            <div className="p-6 border-b border-sidebar-border flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-sidebar-foreground">Admin Panel</h1>
                    <p className="text-sm text-muted-foreground">Himalayan Days</p>
                </div>
                <ModeToggle />
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {links.map((category, index) => (
                    <div key={category.label || `category-${index}`} className="space-y-1">
                        {category.label && (
                            <h3 className="px-4 py-2 text-xs font-semibold uppercase text-muted-foreground">
                                {category.label}
                            </h3>
                        )}
                        {category.items.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={onItemClick}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                    isActive(link.href) && link.href !== '/admin' || (link.href === '/admin' && pathname === '/admin')
                                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                )}
                            >
                                <link.icon className="w-5 h-5" />
                                {link.label}
                            </Link>
                        ))}
                    </div>
                ))}

                <Link
                    href="/admin/inquiries"
                    onClick={onItemClick}
                    className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-lg transition-colors",
                        isActive("/admin/inquiries")
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5" />
                        Inquiries
                    </div>
                    {pendingInquiries > 0 && (
                        <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                            {pendingInquiries}
                        </span>
                    )}
                </Link>
            </nav>
            <div className="p-4 border-t">
                <Link href="/api/auth/signout" className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </Link>
            </div>
        </div>
    );
}
