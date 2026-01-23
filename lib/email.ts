import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailPayload {
    name: string;
    email: string;
    phone: string;
    type: string;
    message?: string;
    packageName?: string;
}

export async function sendInquiryNotification(data: EmailPayload) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY is not set. Email notification skipped.');
        return;
    }

    try {
        // 1. Notify Admin (You)
        await resend.emails.send({
            from: 'onboarding@resend.dev', // Default sender for testing/unverified domains
            to: 'suhailbinfarooq@gmail.com', // Replace with your actual email if different
            subject: `New Inquiry: ${data.name} (${data.type})`,
            html: `
                <h2>New Inquiry Received</h2>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Phone:</strong> ${data.phone}</p>
                <p><strong>Email:</strong> ${data.email || 'Not provided'}</p>
                <p><strong>Type:</strong> ${data.type}</p>
                ${data.packageName ? `<p><strong>Package:</strong> ${data.packageName}</p>` : ''}
                <p><strong>Message:</strong> ${data.message || 'No message'}</p>
                <br />
                <p><a href="https://himalayandays.in/admin/inquiries">View in Dashboard</a></p>
            `,
        });

        // 2. Auto-reply to Customer (Only works if we have their email)
        if (data.email) {
            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: data.email,
                subject: 'Thank you for contacting Himalayan Days',
                html: `
                    <h2>Hello ${data.name},</h2>
                    <p>Thank you for your interest in Himalayan Days! We have received your inquiry.</p>
                    <p>Our travel expert will review your requirements and get back to you shortly (usually within 24 hours).</p>
                    <br />
                    <p>Best Regards,</p>
                    <p><strong>Himalayan Days Team</strong></p>
                    <p><a href="https://himalayandays.in">www.himalayandays.in</a></p>
                `,
            });
        }

        return { success: true };
    } catch (error) {
        console.error('Failed to send email:', error);
        return { success: false, error };
    }
}
