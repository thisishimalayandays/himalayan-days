import { prisma } from "@/lib/prisma";
import { getInquiryAnalytics } from "@/app/actions/inquiries";
import { getDashboardCRMStats } from "@/app/actions/crm";
import { getDashboardStats } from "@/app/actions/dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsChart as Overview } from "@/components/admin/dashboard/analytics-chart";
import { RecentActivity as RecentInquiries } from "@/components/admin/dashboard/recent-activity";
import { UpcomingTrips } from "@/components/admin/upcoming-trips";

export default async function AdminDashboard() {
    const [analyticsData, upcomingTripsData, crmStatsResult] = await Promise.all([
        getInquiryAnalytics(),
        getDashboardCRMStats(),
        getDashboardStats()
    ]);

    const crmStats = crmStatsResult.success ? crmStatsResult.data : {
        leadsToday: 0,
        leadsMonth: 0,
        bookingsToday: 0,
        bookingsMonth: 0,
        paymentBalance: 0
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>

            {/* Business Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Leads Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                            {crmStats.leadsToday}
                        </div>
                        <p className="text-xs text-muted-foreground">New inquiries</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Leads Month</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                            {crmStats.leadsMonth}
                        </div>
                        <p className="text-xs text-muted-foreground">Current month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Bookings Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {crmStats.bookingsToday}
                        </div>
                        <p className="text-xs text-muted-foreground">Confirmed trips</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Bookings Month</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {crmStats.bookingsMonth}
                        </div>
                        <p className="text-xs text-muted-foreground">Current month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Balance Due</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            ₹{crmStats.paymentBalance.toLocaleString('en-IN')}
                        </div>
                        <p className="text-xs text-muted-foreground">Pending payments</p>
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
                    <UpcomingTrips trips={upcomingTripsData.success ? upcomingTripsData.upcomingTrips : []} />
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
