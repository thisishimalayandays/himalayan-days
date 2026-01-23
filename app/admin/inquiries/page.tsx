import { getInquiries, getTrashedInquiries } from '@/app/actions/inquiries';
import { InquiriesManager } from '@/components/admin/inquiries-manager';

export const dynamic = 'force-dynamic';

export default async function InquiriesPage() {
    // Parallel fetching for performance
    const [activeRes, trashRes] = await Promise.all([
        getInquiries(),
        getTrashedInquiries()
    ]);

    const activeInquiries = activeRes.success ? activeRes.data : [];
    const trashedInquiries = trashRes.success ? trashRes.data : [];

    // Simple error handling for UI display if needed, but we pass empty arrays on fail
    if (!activeRes.success) console.error("Failed to load active inquiries:", activeRes.error);
    if (!trashRes.success) console.error("Failed to load trash:", trashRes.error);

    return (
        <InquiriesManager
            initialInquiries={activeInquiries || []}
            trashedInquiries={trashedInquiries || []}
        />
    );
}
