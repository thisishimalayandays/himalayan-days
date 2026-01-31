import { prisma } from "@/lib/prisma";
import { getInquiryStats, getInquiryAnalytics } from "@/app/actions/inquiries";
import { getDashboardCRMStats } from "@/app/actions/crm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsChart as Overview } from "@/components/admin/dashboard/analytics-chart";
import { RecentActivity as RecentInquiries } from "@/components/admin/dashboard/recent-activity";
import { UpcomingTrips } from "@/components/admin/upcoming-trips";

export default async function AdminDashboard() {
    const packageCount = await prisma.package.count();
    const destinationCount = await prisma.destination.count();
    const [stats, analyticsData, crmStats] = await Promise.all([
        getInquiryStats(),
        getInquiryAnalytics(),
        getDashboardCRMStats()
    ]);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{packageCount}</div>
                        <p className="text-xs text-muted-foreground">Active travel packages</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Destinations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{destinationCount}</div>
                        <p className="text-xs text-muted-foreground">Curated locations</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">Lifetime leads</p>
                    </CardContent>
                </Card>
            </div>

            {/* NEW LAYOUT: Inquiries & Upcoming Trips First */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Inquiries (Takes Priority - Space where graph was) */}
                <div className="col-span-4">
                    <RecentInquiries activities={analyticsData.recentActivity} />
                </div>
                {/* Upcoming Trips (Side) */}
                <div className="col-span-3">
                    <UpcomingTrips trips={crmStats.success ? crmStats.upcomingTrips : []} />
                </div>
            </div>

            {/* Graph at Bottom (Full Width) */}
            <Card className="col-span-full">
                <CardHeader>
                    <CardTitle>Inquiry Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2 h-[350px]">
                    <Overview data={analyticsData.chartData} />
                </CardContent>
            </Card>
        </div>
    )
}
