import { getInquiries, getTrashedInquiries } from '@/app/actions/inquiries';
import { InquiriesManager } from '@/components/admin/inquiries-manager';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export default async function InquiriesPage() {
    // Parallel fetching for performance
    const [activeRes, trashRes] = await Promise.all([
        getInquiries(),
        getTrashedInquiries()
    ]);

    const activeInquiries = activeRes.success ? activeRes.data : [];
    const trashedInquiries = trashRes.success ? trashRes.data : [];

    const session = await auth();
    // Fallback: Check email if role is missing
    const role = session?.user?.role || (session?.user?.email === 'sales@himalayandays.in' ? 'SALES' : 'ADMIN');

    // Type casting to bypass TS error if prisma client is stale
    const inquiriesData: any[] = activeInquiries || [];
    const trashData: any[] = trashedInquiries || [];

    return (
        <InquiriesManager
            initialInquiries={inquiriesData}
            trashedInquiries={trashData}
            role={role}
            userEmail={session?.user?.email || ''}
        />
    );
}
