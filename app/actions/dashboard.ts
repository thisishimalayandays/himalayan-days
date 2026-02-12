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
            })
        ]);

        const totalRevenue = totalBookingValue._sum.totalAmount || 0;
        const totalCollected = totalCollectedAmount._sum.amount || 0;
        const paymentBalance = totalRevenue - totalCollected;

        return {
            success: true,
            data: {
                leadsToday,
                leadsMonth,
                bookingsToday,
                bookingsMonth,
                paymentBalance
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
                paymentBalance: 0
            }
        };
    }
}
