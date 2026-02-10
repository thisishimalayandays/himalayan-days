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
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>New Inquiry</title>
                    <style>
                        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f7; color: #1d1d1f; -webkit-font-smoothing: antialiased; }
                        .wrapper { width: 100%; padding: 40px 0; background-color: #f5f5f7; }
                        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; box-shadow: 0 4px 24px rgba(0,0,0,0.06); overflow: hidden; }
                        .header { padding: 40px 40px 20px; text-align: left; }
                        .logo { font-size: 18px; font-weight: 600; color: #f97316; letter-spacing: -0.5px; text-transform: uppercase; }
                        .hero { font-size: 32px; font-weight: 700; line-height: 1.1; margin-top: 12px; color: #000; letter-spacing: -0.03em; }
                        .content { padding: 10px 40px 40px; }
                        .section { margin-bottom: 32px; }
                        .label { font-size: 12px; font-weight: 600; color: #86868b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
                        .value { font-size: 17px; line-height: 1.5; color: #1d1d1f; font-weight: 400; }
                        .value.highlight { font-weight: 600; }
                        .message-box { background-color: #f5f5f7; padding: 24px; border-radius: 16px; margin-top: 8px; font-size: 16px; line-height: 1.6; color: #424245; }
                        .tag { display: inline-block; background-color: #f5f5f7; color: #1d1d1f; padding: 6px 12px; border-radius: 8px; font-size: 14px; font-weight: 600; }
                        .btn-container { margin-top: 40px; text-align: left; }
                        .btn { display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 99px; font-size: 16px; font-weight: 500; transition: background-color 0.2s ease; }
                        .btn:hover { background-color: #333333; }
                        .footer { padding: 30px 40px; text-align: center; color: #86868b; font-size: 13px; }
                        .divider { height: 1px; background-color: #f0f0f0; margin: 24px 0; }
                        a { color: #0066cc; text-decoration: none; }
                        a:hover { text-decoration: underline; }
                    </style>
                </head>
                <body>
                    <div class="wrapper">
                        <div class="container">
                            <div class="header">
                                <div class="logo">Himalayan Days</div>
                                <div class="hero">New Inquiry Received.</div>
                            </div>
                            
                            <div class="content">
                                <div class="section">
                                    <div class="label">Customer Details</div>
                                    <div class="value highlight">${data.name}</div>
                                    <div class="value"><a href="tel:${data.phone}" style="color: #1d1d1f; text-decoration: none;">${data.phone}</a></div>
                                    ${data.email ? `<div class="value"><a href="mailto:${data.email}">${data.email}</a></div>` : ''}
                                </div>

                                <div class="divider"></div>

                                <div class="section">
                                    <div class="label">Inquiry Info</div>
                                    <div style="margin-bottom: 8px;">
                                        <span class="tag">${data.type}</span>
                                    </div>
                                    ${data.packageName ? `<div class="value" style="margin-top: 8px;">Interested in: <strong>${data.packageName}</strong></div>` : ''}
                                </div>

                                <div class="section">
                                    <div class="label">Message</div>
                                    <div class="message-box">
                                        ${data.message || 'No specific requirements mentioned.'}
                                    </div>
                                </div>
                                
                                <div class="section" style="margin-bottom: 0;">
                                    <div class="label">Submission Timestamp</div>
                                    <div class="value" style="font-size: 13px; color: #86868b; font-family: monospace;">
                                        ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "full", timeStyle: "medium" })}
                                    </div>
                                </div>

                                <div class="btn-container">
                                    <a href="https://himalayandays.in/admin/inquiries" class="btn">View in Dashboard</a>
                                </div>
                            </div>
                        </div>
                        <div class="footer">
                            <p style="margin: 0;">Sent via Himalayan Days system.</p>
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

export async function sendAuditLogEmail({
    actor,
    action,
    details,
    resourceId,
    timestamp
}: {
    actor: { name: string; email: string; role: string };
    action: string;
    details: string;
    resourceId: string;
    timestamp: Date;
}) {
    if (!process.env.RESEND_API_KEY) return;

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'thisishimalayandays@gmail.com',
            subject: `👮 Audit Log: ${actor.name} ${action}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Audit Log Entry</h2>
                    <p><strong>Time:</strong> ${timestamp.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
                    <hr/>
                    <p><strong>Actor:</strong> ${actor.name} (${actor.email}) - ${actor.role}</p>
                    <p><strong>Action:</strong> ${action}</p>
                    <p><strong>Resource ID:</strong> ${resourceId}</p>
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 10px;">
                        <strong>Details:</strong><br/>
                        ${details}
                    </div>
                </div>
            `
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to send audit email:', error);
        return { success: false, error };
    }
}
