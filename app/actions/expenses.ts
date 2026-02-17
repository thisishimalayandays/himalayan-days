'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addExpense(data: {
    bookingId: string;
    title: string;
    category: string;
    amount: number;
    totalCost?: number;
    paymentMode: string;
    notes?: string;
    date: Date;
}) {
    try {
        const expense = await prisma.bookingExpense.create({
            data: {
                bookingId: data.bookingId,
                title: data.title,
                category: data.category,
                amount: data.amount,
                totalCost: data.totalCost,
                paymentMode: data.paymentMode,
                notes: data.notes,
                date: data.date,
            }
        });

        revalidatePath(`/admin/bookings`);
        return { success: true, expense };
    } catch (error) {
        console.error("Failed to add expense:", error);
        return { success: false, error: "Failed to add expense" };
    }
}

export async function deleteExpense(id: string) {
    try {
        await prisma.bookingExpense.delete({
            where: { id }
        });
        revalidatePath(`/admin/bookings`);
        return { success: true };
    } catch (error) {
        console.error("Failed to delete expense:", error);
        return { success: false, error: "Failed to delete expense" };
    }
}

export async function updateExpense(id: string, data: {
    title?: string;
    category?: string;
    amount?: number;
    totalCost?: number;
    paymentMode?: string;
    notes?: string;
    date?: Date;
}) {
    try {
        const expense = await prisma.bookingExpense.update({
            where: { id },
            data: {
                title: data.title,
                category: data.category,
                amount: data.amount,
                totalCost: data.totalCost,
                paymentMode: data.paymentMode,
                notes: data.notes,
                date: data.date,
            }
        });

        revalidatePath(`/admin/bookings`);
        return { success: true, expense };
    } catch (error) {
        console.error("Failed to update expense:", error);
        return { success: false, error: "Failed to update expense" };
    }
}

export async function getExpenses(bookingId: string) {
    try {
        const expenses = await prisma.bookingExpense.findMany({
            where: { bookingId },
            orderBy: { date: 'desc' }
        });
        return { success: true, expenses };
    } catch (error) {
        console.error("Failed to fetch expenses:", error);
        return { success: false, error: "Failed to fetch expenses" };
    }
}
