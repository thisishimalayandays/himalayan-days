'use client';

import Link from "next/link";
import { Home, Map, Package, LogOut, MessageSquare, Mail, Calculator } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
    pendingInquiries: number;
    className?: string;
    onItemClick?: () => void;
}

export function AdminSidebar({ pendingInquiries, className, onItemClick }: AdminSidebarProps) {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`);

    const links = [
        { href: "/admin", label: "Dashboard", icon: Home },
        { href: "/admin/packages", label: "Packages", icon: Package },
        { href: "/admin/destinations", label: "Destinations", icon: Map },
        { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
        { href: "/admin/tools/calculator", label: "Calculator", icon: Calculator },
    ];

    return (
        <div className={cn("flex flex-col h-full bg-white", className)}>
            <div className="p-6 border-b">
                <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
                <p className="text-sm text-gray-500">Himalayan Days</p>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={onItemClick}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                            isActive(link.href) && link.href !== '/admin' || (link.href === '/admin' && pathname === '/admin')
                                ? "bg-orange-50 text-orange-600 font-medium"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <link.icon className="w-5 h-5" />
                        {link.label}
                    </Link>
                ))}

                <Link
                    href="/admin/inquiries"
                    onClick={onItemClick}
                    className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-lg transition-colors",
                        isActive("/admin/inquiries")
                            ? "bg-orange-50 text-orange-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
