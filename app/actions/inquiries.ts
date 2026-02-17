'use server';

import { sendInquiryNotification } from '@/lib/email';
import { auth } from '@/auth';
import { sendTelegramNotification, escapeHtml } from '@/lib/telegram';
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
    duration: z.string().optional(), // NEW: Duration of stay
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
            // Bypass for Development/Localhost to prevent "Spam Detected" during testing
            // Bypass for Development/Localhost to prevent "Spam Detected" during testing
            if (process.env.NODE_ENV === 'development') {
                // Skipping verification in dev
            } else if (!process.env.RECAPTCHA_SECRET_KEY) {
                console.warn("⚠️ RECAPTCHA_SECRET_KEY is missing! Bypassing verification to allow lead submission.");
            } else {
                try {
                    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({
                            secret: process.env.RECAPTCHA_SECRET_KEY,
                            response: validated.captchaToken,
                        }),
                    });
                    const data = await response.json();

                    // Lowered threshold to 0.3 to prevent blocking legitimate mobile/VPN users
                    if (!data.success || (data.score !== undefined && data.score < 0.3)) {
                        console.error("Spam detected:", data);
                        return { success: false, error: "Spam detected. Please try again later." };
                    }
                } catch (error) {
                    console.error("Captcha verification failed:", error);
                    // Decide whether to block or allow on error. 
                    // Fail open for now to avoid losing business leads due to technical glitches?
                    // return { success: false, error: "Security check failed." };
                }
            }
        }

        // Append Duration to Message since DB doesn't have a column for it yet
        let finalMessage = validated.message || '';
        if (validated.duration) {
            finalMessage = `[Duration: ${validated.duration}] ${finalMessage}`;
        }

        const inquiryData = {
            name: validated.name,
            email: validated.email,
            phone: validated.phone,
            destination: validated.destination,
            startDate: validated.startDate ? new Date(validated.startDate) : null,
            travelers: validated.travelers,
            budget: validated.budget,
            message: finalMessage,
            type: validated.type,
            packageId: validated.packageId
        };

        // Anti-Spam: Check for duplicate inquiries from same phone in last 15 minutes
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        const existingInquiry = await prisma.inquiry.findFirst({
            where: {
                phone: validated.phone,
                createdAt: { gte: fifteenMinutesAgo },
                isDeleted: false
            }
        });

        if (existingInquiry) {
            return { success: false, error: "You have already submitted a request recently. We will contact you soon!" };
        }

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

        // Send Telegram Notification (Fire and forget)
        const telegramMessage = `
<b>🔔 New Lead Received!</b>

<b>Name:</b> ${escapeHtml(validated.name)}
<b>Phone:</b> ${escapeHtml(validated.phone)}
<b>Type:</b> ${escapeHtml(validated.type)}
<b>Budget:</b> ${escapeHtml(validated.budget || 'N/A')}
<b>Travelers:</b> ${validated.travelers || 'N/A'}
<b>Date:</b> ${validated.startDate ? escapeHtml(new Date(validated.startDate).toLocaleDateString()) : 'N/A'}
<b>Message:</b> ${escapeHtml(validated.message || 'No message')}
${packageTitle ? `<b>Package:</b> ${escapeHtml(packageTitle)}` : ''}
`;
        sendTelegramNotification(telegramMessage).catch(err => console.error('Background Telegram failed:', err));

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
        const session = await auth();

        await prisma.inquiry.update({
            where: { id },
            data: { status, isRead: true },
        });

        // Audit Log (DB)
        if (session?.user) {
            await prisma.auditLog.create({
                data: {
                    action: 'UPDATED_STATUS',
                    resourceId: id,
                    resourceType: 'Inquiry',
                    details: `Changed status to ${status}`,
                    userId: session.user.id,
                    userEmail: session.user.email,
                    userName: session.user.name,
                    userRole: session.user.role,
                }
            });
        }

        revalidatePath('/admin/inquiries');
        revalidatePath('/admin/layout');
        return { success: true };
    } catch (error) {
        console.error('Error updating inquiry status:', error);
        return { success: false, error: 'Failed to update status' };
    }
}

export async function updateInquiryNotes(id: string, notes: string) {
    try {
        const session = await auth();

        await prisma.inquiry.update({
            where: { id },
            data: { notes },
        });

        // Audit Log (DB)
        if (session?.user) {
            await prisma.auditLog.create({
                data: {
                    action: 'ADDED_NOTE',
                    resourceId: id,
                    resourceType: 'Inquiry',
                    details: `Note: ${notes}`,
                    userId: session.user.id,
                    userEmail: session.user.email,
                    userName: session.user.name,
                    userRole: session.user.role,
                }
            });
        }

        revalidatePath('/admin/inquiries');
        return { success: true };
    } catch (error) {
        console.error('Error updating inquiry notes:', error);
        return { success: false, error: 'Failed to update notes' };
    }
}

export async function updateFollowUpDate(id: string, date: Date | null) {
    try {
        await prisma.inquiry.update({
            where: { id },
            data: { followUpDate: date },
        });
        revalidatePath('/admin/inquiries');
        return { success: true };
    } catch (error) {
        console.error('Error updating follow-up date:', error);
        return { success: false, error: 'Failed to update follow-up date' };
    }
}

export async function softDeleteInquiry(id: string) {
    try {
        const session = await auth();
        const role = session?.user?.role || (session?.user?.email === 'sales@himalayandays.in' ? 'SALES' : 'ADMIN');

        if (role !== 'ADMIN') {
            return { success: false, error: 'Unauthorized: Only Admins can delete inquiries.' };
        }

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
        const session = await auth();
        const role = session?.user?.role || (session?.user?.email === 'sales@himalayandays.in' ? 'SALES' : 'ADMIN');

        if (role !== 'ADMIN') {
            return { success: false, error: 'Unauthorized: Only Admins can restore inquiries.' };
        }

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
        const session = await auth();
        const role = session?.user?.role || (session?.user?.email === 'sales@himalayandays.in' ? 'SALES' : 'ADMIN');

        if (role !== 'ADMIN') {
            return { success: false, error: 'Unauthorized: Only Admins can permanently delete inquiries.' };
        }

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

export async function getInquiryAnalytics() {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const inquiries = await prisma.inquiry.findMany({
            where: {
                createdAt: {
                    gte: thirtyDaysAgo
                },
                isDeleted: false
            },
            select: {
                createdAt: true,
                type: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        // Group by date
        const grouped = inquiries.reduce((acc, curr) => {
            const date = curr.createdAt.toISOString().split('T')[0];
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date]++;
            return acc;
        }, {} as Record<string, number>);

        // Fill in missing dates
        const data = [];
        for (let i = 0; i < 30; i++) {
            const d = new Date();
            d.setDate(d.getDate() - (29 - i));
            const dateStr = d.toISOString().split('T')[0];

            // Format for display (e.g., "Jan 24")
            const displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            data.push({
                date: displayDate,
                count: grouped[dateStr] || 0
            });
        }

        // Get Recent Activity (Top 5)
        const recentInquiries = await prisma.inquiry.findMany({
            where: { isDeleted: false },
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                type: true,
                createdAt: true,
                status: true
            }
        });

        return { success: true, chartData: data, recentActivity: recentInquiries };
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return { success: false, chartData: [], recentActivity: [] };
    }
}
