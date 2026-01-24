import { prisma } from "@/lib/prisma";
import { getInquiryStats, getInquiryAnalytics } from "@/app/actions/inquiries";
import { AnalyticsChart } from "@/components/admin/dashboard/analytics-chart";
import { RecentActivity } from "@/components/admin/dashboard/recent-activity";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export default async function AdminDashboard() {
    const packageCount = await prisma.package.count();
    const destinationCount = await prisma.destination.count();
    const { total: inquiryCount } = await getInquiryStats();

    // Fetch Analytics Data
    const { chartData, recentActivity } = await getInquiryAnalytics();

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
                        <div className="text-2xl font-bold text-purple-600">{inquiryCount}</div>
                        <p className="text-xs text-muted-foreground">Lifetime leads</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                {/* Main Chart Area */}
                <Card className="col-span-1 lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Inquiry Trends</CardTitle>
                        <CardDescription>
                            Leads received over the last 30 days.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <AnalyticsChart data={chartData || []} />
                    </CardContent>
                </Card>

                {/* Recent Activity Sidebar */}
                <Card className="col-span-1 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Latest 5 inquiries received.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RecentActivity activities={recentActivity || []} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
