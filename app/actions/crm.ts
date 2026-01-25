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

export async function deleteCustomer(id: string) {
    try {
        await prisma.customer.delete({ where: { id } });
        revalidatePath('/admin/customers');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete customer' };
    }
}

// --- BOOKINGS ---

export async function createBooking(data: {
    customerId?: string; // Made optional
    newCustomer?: {
        name: string;
        phone: string;
        email?: string;
        address?: string;
    };
    title: string;
    travelDate: Date;
    duration: string;
    totalAmount: number;
    adults: number;
    kids: number;
    initialPayment?: number;
    paymentMode?: string;
}) {
    try {
        await prisma.$transaction(async (tx) => {
            let customerId = data.customerId;

            // Create new customer if details provided and no ID
            if (!customerId && data.newCustomer) {
                const customer = await tx.customer.create({
                    data: {
                        name: data.newCustomer.name,
                        phone: data.newCustomer.phone,
                        email: data.newCustomer.email || null,
                        address: data.newCustomer.address || null,
                    }
                });
                customerId = customer.id;
            }

            if (!customerId) {
                throw new Error("Customer is required");
            }

            const booking = await tx.booking.create({
                data: {
                    customerId: customerId,
                    title: data.title,
                    travelDate: data.travelDate,
                    duration: data.duration,
                    totalAmount: data.totalAmount,
                    adults: data.adults,
                    kids: data.kids,
                    status: 'CONFIRMED',
                }
            });

            if (data.initialPayment && data.initialPayment > 0) {
                await tx.payment.create({
                    data: {
                        bookingId: booking.id,
                        amount: data.initialPayment,
                        method: data.paymentMode || 'CASH',
                        date: new Date(),
                        notes: 'Initial Advance'
                    }
                });
            }
        });

        revalidatePath('/admin/bookings');
        if (data.customerId) {
            revalidatePath(`/admin/customers/${data.customerId}`);
        }
        return { success: true };
    } catch (error) {
        console.error('Create Booking Error:', error);
        return { success: false, error: 'Failed to create booking' };
    }
}

export async function updateBooking(id: string, data: any) {
    try {
        const booking = await prisma.booking.update({
            where: { id },
            data: {
                customerId: data.customerId,
                title: data.title,
                travelDate: data.travelDate,
                totalAmount: data.totalAmount,
                adults: data.adults,
                kids: data.kids,
                duration: data.duration,
            } // Simplified for now
        });
        revalidatePath('/admin/bookings');
        return { success: true, booking };
    } catch (error) {
        console.error('Update Booking Error:', error);
        return { success: false, error: 'Failed to update booking' };
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

export async function deleteBooking(id: string) {
    try {
        await prisma.booking.delete({ where: { id } });
        revalidatePath('/admin/bookings');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete booking' };
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
