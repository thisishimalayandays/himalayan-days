'use server'

import { prisma } from '@/lib/prisma';

export async function getDashboardStats() {
    try {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [
            leadsToday,
            leadsMonth,
            bookingsToday,
            bookingsMonth,
            totalBookingValue,
            totalCollectedAmount
        ] = await Promise.all([
            // Leads Today
            prisma.inquiry.count({
                where: {
                    createdAt: { gte: startOfToday },
                    isDeleted: false
                }
            }),
            // Leads This Month
            prisma.inquiry.count({
                where: {
                    createdAt: { gte: startOfMonth },
                    isDeleted: false
                }
            }),
            // Bookings Today
            prisma.booking.count({
                where: {
                    createdAt: { gte: startOfToday },
                    isDeleted: false
                }
            }),
            // Bookings This Month
            prisma.booking.count({
                where: {
                    createdAt: { gte: startOfMonth },
                    isDeleted: false
                }
            }),
            // Total Confirmed Booking Value (All time for balance? Or active?)
            // "Payment balance with customers" usually means (Total Booking Value - Total Paid) for ALL active bookings.
            // Let's assume all active (non-deleted) bookings.
            prisma.booking.aggregate({
                _sum: { totalAmount: true },
                where: {
                    isDeleted: false,
                    status: 'CONFIRMED' // Only count confirmed bookings for balance
                }
            }),
            // Total Copllected Amount (All time)
            prisma.payment.aggregate({
                _sum: { amount: true },
                where: {
                    booking: { isDeleted: false }
                }
            }),
            // Revenue History (Last 6 Months)
            prisma.payment.groupBy({
                by: ['date'],
                _sum: { amount: true },
                where: {
                    date: {
                        gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
                    },
                    booking: { isDeleted: false }
                }
            }),
            // Lead Source Distribution
            prisma.inquiry.groupBy({
                by: ['type'],
                _count: { _all: true },
                where: { isDeleted: false }
            }),
            // Total Inquiries (All Time) for Conversion Rate
            prisma.inquiry.count({ where: { isDeleted: false } }),
            // Total Bookings (All Time) for Conversion Rate
            prisma.booking.count({ where: { isDeleted: false, status: 'CONFIRMED' } })
        ]);

        const totalRevenue = totalBookingValue._sum.totalAmount || 0;
        const totalCollected = totalCollectedAmount._sum.amount || 0;
        const paymentBalance = totalRevenue - totalCollected;

        // Process Revenue History
        const revenueMap: Record<string, number> = {};
        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const monthKey = d.toLocaleString('default', { month: 'short' });
            revenueMap[monthKey] = 0;
        }

        // Fill with actual data (group by month manually since Prisma date grouping is limited)
        // Note: The groupBy above returns date objects. We need to aggregate them by month in JS.
        // Actually, prisma groupBy date returns distinct dates. We need a raw query or JS processing.
        // Let's use JS processing on the groupBy result (which might be large if many payments? No, payments are few for now).
        // A better approach for scalability is raw query, but for now JS is fine.
        // Wait, groupBy by 'date' (datetime) will return one entry per unique timestamp. That's too granular.
        // It's better to fetch payments and aggregate in JS for this scale.

        // Refetching payments for graph to be safe and accurate
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const paymentsForGraph = await prisma.payment.findMany({
            where: {
                date: { gte: sixMonthsAgo },
                booking: { isDeleted: false }
            },
            select: { date: true, amount: true }
        });

        // Aggregate per month
        paymentsForGraph.forEach(p => {
            const monthKey = p.date.toLocaleString('default', { month: 'short' });
            if (revenueMap[monthKey] !== undefined) {
                revenueMap[monthKey] += p.amount;
            }
        });

        const revenueData = Object.entries(revenueMap).map(([name, total]) => ({ name, total }));


        // Process Source Data
        // Prisma groupBy result: [{ type: 'GENERAL', _count: { _all: 10 } }, ...]
        // Map types to readable names
        // Index 7 is sourceGroups
        const sourceGroups = await prisma.inquiry.groupBy({
            by: ['type'],
            _count: { _all: true },
            where: { isDeleted: false }
        });

        const sourceData = sourceGroups.map(g => ({
            name: g.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
            value: g._count._all
        }));

        // Calculate Conversion Rate
        // Index 8 is totalInquiriesAllTime, Index 9 is totalBookingsAllTime
        const totalInquiriesAllTime = await prisma.inquiry.count({ where: { isDeleted: false } });
        const totalBookingsAllTime = await prisma.booking.count({ where: { isDeleted: false, status: 'CONFIRMED' } });

        const conversionRate = totalInquiriesAllTime > 0
            ? ((totalBookingsAllTime / totalInquiriesAllTime) * 100).toFixed(1)
            : 0;

        return {
            success: true,
            data: {
                leadsToday,
                leadsMonth,
                bookingsToday,
                bookingsMonth,
                paymentBalance,
                revenueData,
                sourceData,
                conversionRate: Number(conversionRate)
            }
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return {
            success: false,
            error: "Failed to fetch dashboard stats",
            data: {
                leadsToday: 0,
                leadsMonth: 0,
                bookingsToday: 0,
                bookingsMonth: 0,
                paymentBalance: 0,
                revenueData: [],
                sourceData: [],
                conversionRate: 0
            }
        };
    }
}
