'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const SubscriberSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export async function subscribeToNewsletter(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;

    const validated = SubscriberSchema.safeParse({ email });

    if (!validated.success) {
        return { success: false, message: validated.error.issues?.[0]?.message || "Invalid input" };
    }

    try {
        // Check if already subscribed
        const existing = await prisma.subscriber.findUnique({
            where: { email: validated.data.email },
        });

        if (existing) {
            if (!existing.isActive) {
                // Reactivate if previously unsubscribed
                await prisma.subscriber.update({
                    where: { email: validated.data.email },
                    data: { isActive: true },
                });
                return { success: true, message: "Welcome back! You've been resubscribed." };
            }
            return { success: false, message: "You are already subscribed!" };
        }

        await prisma.subscriber.create({
            data: { email: validated.data.email },
        });

        revalidatePath('/admin/subscribers');
        return { success: true, message: "Successfully subscribed to our newsletter!" };
    } catch (error: any) {
        console.error('Newsletter error:', error);
        return { success: false, message: `Debug Error: ${error.message || 'Unknown error'}` };
    }
}

export async function getSubscribers() {
    try {
        const subscribers = await prisma.subscriber.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return { success: true, data: subscribers };
    } catch (error) {
        return { success: false, error: 'Failed to fetch subscribers' };
    }
}

export async function unsubscribe(id: string) {
    try {
        await prisma.subscriber.delete({
            where: { id }
        });
        revalidatePath('/admin/subscribers');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to unsubscribe' };
    }
}
