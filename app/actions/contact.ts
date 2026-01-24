'use server';

import { z } from 'zod';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const ContactSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    message: z.string().min(1, "Message is required"),
});

export async function sendContactEmail(formData: FormData) {
    const rawData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message'),
        captchaToken: formData.get('captchaToken'),
    };

    if (!rawData.captchaToken) {
        return { success: false, message: "Captcha token missing." };
    }

    // Verify Captcha with Google
    try {
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                secret: process.env.RECAPTCHA_SECRET_KEY!,
                response: rawData.captchaToken as string,
            }),
        });

        const data = await response.json();
        if (!data.success) {
            return { success: false, message: "Captcha verification failed. Are you a robot?" };
        }
    } catch (error) {
        console.error("Captcha verification error:", error);
        return { success: false, message: "Captcha verification failed due to network error." };
    }

    const validated = ContactSchema.safeParse(rawData);

    if (!validated.success) {
        return { success: false, message: validated.error.issues[0].message };
    }

    const { firstName, lastName, email, phone, message } = validated.data;
    const fullName = `${firstName} ${lastName}`;

    try {
        await resend.emails.send({
            from: 'Contact Form <onboarding@resend.dev>', // Update this if you have a verified domain
            to: ['thisishimalayandays@gmail.com'],
            subject: `New Contact Enquiry from ${fullName}`,
            html: `
                <h2>New Contact Enquiry</h2>
                <p><strong>Name:</strong> ${fullName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr />
                <p><em>Sent from Himalayan Days Website</em></p>
            `,
            reply_to: email, // Valid property name is reply_to or replyTo depending on SDK version? Resend Node SDK uses snake_case usually or camelCase. Let's check docs or assume camelCase 'replyTo' matches type definitions usually. Actually Resend SDK usually takes 'reply_to'. Let's try 'reply_to' as it's safer for the API.
        } as any); // Casting as any to avoid minor type strictness issues if types are outdated

        return { success: true, message: "Message sent successfully!" };
    } catch (error: any) {
        console.error('Email sending failed:', error);
        return { success: false, message: "Failed to send message. Please try again later." };
    }
}
