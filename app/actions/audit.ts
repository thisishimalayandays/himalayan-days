'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function logActivity(
    action: string,
    resourceType: string,
    resourceId: string | null,
    details: string
) {
    try {
        const session = await auth();

        // Even if session is null, we might want to log it as "Anonymous" or "System", 
        // but for Sales Team tracking, we expect a session.
        if (!session?.user) {
            console.warn(`Audit Log attempted without session: ${action}`);
            return;
        }

        // Prevent logging for super admin to keep logs clean for sales tracking
        if (session.user.email === 'admin@himalayandays.in') {
            return;
        }

        await prisma.auditLog.create({
            data: {
                action,
                resourceType,
                resourceId,
                details,
                userId: session.user.id,
                userEmail: session.user.email,
                userName: session.user.name,
                userRole: session.user.role,
            }
        });
    } catch (error) {
        console.error('Failed to create audit log:', error);
        // We don't throw here to avoid breaking the user flow if logging fails
    }
}
