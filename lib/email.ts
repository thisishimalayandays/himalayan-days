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
            to: 'thisishimalayandays@gmail.com', // Agency email
            subject: `🔔 New Lead: ${data.name} - ${data.type}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
                        .header { background-color: #f97316; padding: 20px; text-align: center; color: white; }
                        .content { padding: 30px; background-color: #ffffff; }
                        .field { margin-bottom: 15px; border-bottom: 1px solid #f0f0f0; padding-bottom: 10px; }
                        .label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
                        .value { font-size: 16px; margin-top: 5px; color: #000; }
                        .btn { display: inline-block; background-color: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
                        .footer { background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; color: #999; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 style="margin:0; font-size: 24px;">New Website Inquiry</h1>
                        </div>
                        <div class="content">
                            <div class="field">
                                <div class="label">Customer Name</div>
                                <div class="value">${data.name}</div>
                            </div>
                            
                            <div class="field">
                                <div class="label">Phone Number</div>
                                <div class="value"><a href="tel:${data.phone}" style="color: #f97316; text-decoration: none;">${data.phone}</a></div>
                            </div>

                            <div class="field">
                                <div class="label">Inquiry Type</div>
                                <div class="value" style="display: inline-block; background: #fff7ed; color: #c2410c; padding: 4px 12px; rounded: 4px; font-size: 14px; border-radius: 999px;">${data.type}</div>
                            </div>

                            ${data.email ? `
                            <div class="field">
                                <div class="label">Email Address</div>
                                <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
                            </div>` : ''}

                            ${data.packageName ? `
                            <div class="field">
                                <div class="label">Interested Package</div>
                                <div class="value" style="font-weight: bold;">${data.packageName}</div>
                            </div>` : ''}

                            <div class="field" style="border-bottom: none;">
                                <div class="label">Message</div>
                                <div class="value" style="background: #f8f8f8; padding: 15px; border-radius: 6px;">${data.message || 'No specific message provided.'}</div>
                            </div>

                            <div style="text-align: center; margin-top: 30px;">
                                <a href="https://himalayandays.in/admin/inquiries" class="btn">Manage in Dashboard</a>
                            </div>
                        </div>
                        <div class="footer">
                            Sent automatically from Himalayan Days Website
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        // 2. Auto-reply to Customer (Only works if we have their email)
        if (data.email) {
            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: data.email,
                subject: 'We successfully received your inquiry! 🏔️',
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
