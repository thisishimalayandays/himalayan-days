import { prisma } from "@/lib/prisma";
import { getInquiryStats } from "@/app/actions/inquiries";

export default async function AdminDashboard() {
    const packageCount = await prisma.package.count();
    const destinationCount = await prisma.destination.count();
    const { total: inquiryCount } = await getInquiryStats();

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-gray-500 font-medium mb-2">Total Packages</h3>
                    <p className="text-3xl font-bold text-orange-600">{packageCount}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-gray-500 font-medium mb-2">Total Destinations</h3>
                    <p className="text-3xl font-bold text-blue-600">{destinationCount}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-gray-500 font-medium mb-2">Total Inquiries</h3>
                    <p className="text-3xl font-bold text-purple-600">{inquiryCount}</p>
                </div>
            </div>
        </div>
    )
}
