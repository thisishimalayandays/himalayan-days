'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// --- CUSTOMERS ---

export async function createCustomer(data: { name: string; phone: string; email?: string; address?: string; notes?: string }) {
    try {
        const customer = await prisma.customer.create({
            data: {
                name: data.name,
                phone: data.phone,
                email: data.email,
                address: data.address,
                notes: data.notes
            }
        });
        revalidatePath('/admin/customers');
        return { success: true, customer };
    } catch (error) {
        console.error('Create Customer Error:', error);
        return { success: false, error: 'Failed to create customer' };
    }
}

export async function getCustomers() {
    try {
        const customers = await prisma.customer.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                bookings: {
                    select: { id: true, status: true, totalAmount: true }
                }
            }
        });
        return { success: true, data: customers };
    } catch (error) {
        console.error('Get Customers Error:', error);
        return { success: false, error: 'Failed to fetch customers' };
    }
}

// --- BOOKINGS ---

export async function createBooking(data: {
    customerId: string;
    title: string;
    travelDate: Date;
    totalAmount: number;
    adults: number;
    kids: number;
    duration?: string;
    vehicleType?: string; // We didn't add this to schema yet, let's stick to schema
    status?: string;
}) {
    try {
        const booking = await prisma.booking.create({
            data: {
                customerId: data.customerId,
                title: data.title,
                travelDate: data.travelDate,
                totalAmount: data.totalAmount,
                adults: data.adults,
                kids: data.kids,
                duration: data.duration,
                status: data.status || 'CONFIRMED'
            }
        });
        revalidatePath('/admin/bookings');
        revalidatePath(`/admin/customers/${data.customerId}`);
        return { success: true, booking };
    } catch (error) {
        console.error('Create Booking Error:', error);
        return { success: false, error: 'Failed to create booking' };
    }
}

export async function getBookings() {
    try {
        const bookings = await prisma.booking.findMany({
            orderBy: { travelDate: 'asc' }, // Upcoming first? Or created desc?
            include: {
                customer: true,
                payments: true
            }
        });
        return { success: true, data: bookings };
    } catch (error) {
        console.error('Get Bookings Error:', error);
        return { success: false, error: 'Failed to fetch bookings' };
    }
}

// --- PAYMENTS ---

export async function addPayment(data: { bookingId: string; amount: number; method: string; date: Date; notes?: string }) {
    try {
        const payment = await prisma.payment.create({
            data: {
                bookingId: data.bookingId,
                amount: data.amount,
                method: data.method,
                date: data.date,
                notes: data.notes
            }
        });
        revalidatePath('/admin/bookings');
        return { success: true, payment };
    } catch (error) {
        console.error('Add Payment Error:', error);
        return { success: false, error: 'Failed to record payment' };
    }
}

// --- DASHBOARD STATS ---

export async function getDashboardCRMStats() {
    try {
        const today = new Date();
        const thirtyDaysLater = new Date();
        thirtyDaysLater.setDate(today.getDate() + 30);

        // Upcoming Trips (Next 30 days)
        const upcomingTrips = await prisma.booking.findMany({
            where: {
                travelDate: {
                    gte: today,
                    lte: thirtyDaysLater
                },
                status: 'CONFIRMED'
            },
            include: { customer: true },
            orderBy: { travelDate: 'asc' },
            take: 5
        });

        return { success: true, upcomingTrips };
    } catch (error) {
        console.error('CRM Stats Error:', error);
        return { success: false, upcomingTrips: [] };
    }
}
