import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Home, Map, Package, Settings, LogOut } from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/api/auth/signin?callbackUrl=/admin");
    }

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
                    <p className="text-sm text-gray-500">Himalayan Days</p>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">
                        <Home className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link href="/admin/packages" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">
                        <Package className="w-5 h-5" />
                        Packages
                    </Link>
                    <Link href="/admin/destinations" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">
                        <Map className="w-5 h-5" />
                        Destinations
                    </Link>
                </nav>
                <div className="p-4 border-t">
                    <Link href="/api/auth/signout" className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </Link>
                </div>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
