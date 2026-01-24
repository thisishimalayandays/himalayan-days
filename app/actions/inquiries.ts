'use server';

import { sendInquiryNotification } from '@/lib/email';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const InquirySchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().min(10, "Phone number is required"),
    destination: z.string().optional(),
    startDate: z.string().optional(), // We'll receive date as string
    travelers: z.coerce.number().optional(), // Coerce string input to number
    budget: z.string().optional(),
    message: z.string().optional(),
    type: z.enum(["GENERAL", "PACKAGE_BOOKING", "PLAN_MY_TRIP"]),
    packageId: z.string().optional(),
    captchaToken: z.string().optional(),
});

export type InquiryInput = z.infer<typeof InquirySchema>;

export async function createInquiry(data: InquiryInput) {
    try {
        const validated = InquirySchema.parse(data);

        // Verify ReCAPTCHA if token is provided (or enforce it if you want strict security)
        if (validated.captchaToken) {
            try {
                const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        secret: process.env.RECAPTCHA_SECRET_KEY!,
                        response: validated.captchaToken,
                    }),
                });
                const data = await response.json();
                if (!data.success || (data.score !== undefined && data.score < 0.5)) {
                    console.error("Spam detected:", data);
                    return { success: false, error: "Spam detected. Please try again later." };
                }
            } catch (error) {
                console.error("Captcha verification failed:", error);
                return { success: false, error: "Security check failed." };
            }
        } else {
            // Optional: Return error if you want to force captcha for all inquiries
            // return { success: false, error: "Security check missing." };
        }

        const inquiryData = {
            name: validated.name,
            email: validated.email,
            phone: validated.phone,
            destination: validated.destination,
            startDate: validated.startDate ? new Date(validated.startDate) : null,
            travelers: validated.travelers,
            budget: validated.budget,
            message: validated.message,
            type: validated.type,
            packageId: validated.packageId
        };

        // Rate Limiting Removed

        const inquiry = await prisma.inquiry.create({
            data: inquiryData,
        });

        // Send Email Notification (Fire and forget, don't block response)
        const packageTitle = validated.packageId ?
            (await prisma.package.findUnique({ where: { id: validated.packageId }, select: { title: true } }))?.title
            : undefined;

        sendInquiryNotification({
            name: validated.name,
            email: validated.email || '',
            phone: validated.phone,
            type: validated.type,
            message: validated.message,
            packageName: packageTitle
        }).catch(err => console.error('Background email failed:', err));

        return { success: true, inquiryId: inquiry.id };
    } catch (error) {
        console.error('Error creating inquiry:', error);
        return { success: false, error: 'Failed to create inquiry' };
    }
}

export async function getInquiries() {
    try {
        // Only fetch active (non-deleted) inquiries by default
        const inquiries = await prisma.inquiry.findMany({
            where: { isDeleted: false },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return { success: true, data: inquiries };
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        return { success: false, error: 'Failed to fetch inquiries' };
    }
}

export async function updateInquiryStatus(id: string, status: string) {
    try {
        await prisma.inquiry.update({
            where: { id },
            data: { status },
        });
        revalidatePath('/admin/inquiries');
        return { success: true };
    } catch (error) {
        console.error('Error updating inquiry status:', error);
        return { success: false, error: 'Failed to update status' };
    }
}

export async function softDeleteInquiry(id: string) {
    try {
        await prisma.inquiry.update({
            where: { id },
            data: { isDeleted: true, deletedAt: new Date() },
        });
        revalidatePath('/admin/inquiries');
        return { success: true };
    } catch (error) {
        console.error('Error deleting inquiry:', error);
        return { success: false, error: 'Failed to delete inquiry' };
    }
}

export async function restoreInquiry(id: string) {
    try {
        await prisma.inquiry.update({
            where: { id },
            data: { isDeleted: false, deletedAt: null },
        });
        revalidatePath('/admin/inquiries');
        return { success: true };
    } catch (error) {
        console.error('Error restoring inquiry:', error);
        return { success: false, error: 'Failed to restore inquiry' };
    }
}

export async function permanentDeleteInquiry(id: string) {
    try {
        await prisma.inquiry.delete({
            where: { id },
        });
        revalidatePath('/admin/inquiries');
        return { success: true };
    } catch (error) {
        console.error('Error permanently deleting inquiry:', error);
        return { success: false, error: 'Failed to permanently delete inquiry' };
    }
}

export async function getTrashedInquiries() {
    try {
        const inquiries = await prisma.inquiry.findMany({
            where: { isDeleted: true },
            orderBy: { deletedAt: 'desc' },
        });
        return { success: true, data: inquiries };
    } catch (error) {
        console.error('Error fetching trashed inquiries:', error);
        return { success: false, error: 'Failed to fetch trashed inquiries' };
    }
}

export async function getInquiryStats() {
    try {
        const [total, pending] = await Promise.all([
            prisma.inquiry.count({ where: { isDeleted: false } }),
            prisma.inquiry.count({ where: { isDeleted: false, isRead: false } }) // Pending now tracks Unread
        ]);
        return { success: true, total, pending };
    } catch (error) {
        console.error('Error fetching inquiry stats:', error);
        return { success: false, total: 0, pending: 0 };
    }
}

export async function markInquiryAsRead(id: string) {
    try {
        await prisma.inquiry.update({
            where: { id },
            data: { isRead: true },
        });
        revalidatePath('/admin/inquiries');
        revalidatePath('/admin/layout'); // Update sidebar count
        return { success: true };
    } catch (error) {
        console.error('Error marking inquiry as read:', error);
        return { success: false, error: 'Failed to mark inquiry as read' };
    }
}
