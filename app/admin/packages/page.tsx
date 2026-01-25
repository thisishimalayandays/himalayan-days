import Link from "next/link";
import { Plus, Edit, Trash } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { deletePackage } from "@/app/actions/packages";

export default async function PackagesPage() {
    const packages = await prisma.package.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-foreground">Tour Packages</h1>
                <Link href="/admin/packages/new" className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-700 transition-colors shadow-sm">
                    <Plus size={20} />
                    Add New Package
                </Link>
            </div>

            <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-muted/50 border-b">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Starting Price</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {packages.map((pkg) => (
                            <tr key={pkg.id} className="hover:bg-muted/50 transition-colors">
                                <td className="px-6 py-4 text-sm font-medium text-foreground">{pkg.title}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                        {pkg.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">₹{pkg.startingPrice.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right text-sm font-medium flex justify-end gap-3">
                                    <Link href={`/admin/packages/${pkg.id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1">
                                        <Edit size={16} /> Edit
                                    </Link>
                                    <form action={deletePackage.bind(null, pkg.id)}>
                                        <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1">
                                            <Trash size={16} /> Delete
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="p-4 text-xs text-center text-muted-foreground border-t">
                    Showing {packages.length} packages
                </div>
            </div>
        </div>
    );
}
