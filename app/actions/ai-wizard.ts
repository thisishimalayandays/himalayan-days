'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const AiInquirySchema = z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(10, "Phone number is required"),
    travelers: z.string(),
    duration: z.string(),
    budget: z.string(),
    season: z.string().optional(),
});

export async function submitAiInquiry(formData: FormData) {
    const rawData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        travelers: formData.get('travelers'),
        duration: formData.get('duration'),
        budget: formData.get('budget'),
        season: formData.get('season'),
    };

    const validated = AiInquirySchema.safeParse(rawData);

    if (!validated.success) {
        return { success: false, message: "Invalid data provided" };
    }

    const { name, phone, travelers, duration, budget, season } = validated.data;

    try {
        const message = `AI Lead:\nTravel Type: ${travelers}\nDuration: ${duration}\nSeason: ${season || 'Not specified'}`;

        await prisma.inquiry.create({
            data: {
                name,
                phone,
                email: "",
                type: "AI_WIZARD_LEAD",
                budget,
                travelers: parseInt(travelers) || 0,
                message: message,
                status: "PENDING"
            }
        });

        // Send Email Notification
        await resend.emails.send({
            from: 'AI Trip Planner <onboarding@resend.dev>',
            to: ['thisishimalayandays@gmail.com'],
            subject: `🔥 New AI Lead: ${name} (${duration})`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; background: #f9fafb;">
                    <div style="max-w-md margin: 0 auto; background: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                        <h2 style="color: #4f46e5; margin-top: 0;">🪄 New AI Planner Lead</h2>
                        <p style="color: #666; font-size: 14px;">A new high-intent lead has been qualified by the AI Wizard.</p>
                        
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />

                        <div style="margin-bottom: 20px;">
                            <h3 style="margin: 0 0 10px; font-size: 16px; color: #111;">👤 Contact Info</h3>
                            <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
                            <p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:${phone}" style="color: #4f46e5; font-weight: bold; text-decoration: none;">${phone}</a></p>
                        </div>

                        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
                            <h3 style="margin: 0 0 10px; font-size: 16px; color: #111;">🏔️ Trip Details</h3>
                            <p style="margin: 5px 0;"><strong>Group:</strong> ${travelers}</p>
                            <p style="margin: 5px 0;"><strong>Duration:</strong> ${duration}</p>
                            <p style="margin: 5px 0;"><strong>Season:</strong> ${season || 'Flexible'}</p>
                            <p style="margin: 5px 0; margin-top: 10px;">
                                <strong style="display: block; margin-bottom: 4px; font-size: 12px; text-transform: uppercase; color: #666;">Budget Range</strong>
                                <span style="background: #ecfdf5; color: #065f46; padding: 4px 10px; border-radius: 20px; font-size: 14px; font-weight: bold; border: 1px solid #a7f3d0;">
                                    ${budget}
                                </span>
                            </p>
                        </div>
                        
                        <p style="margin-top: 20px; font-size: 12px; color: #999; text-align: center;">
                            Sent from Himalayan Days
                        </p>
                    </div>
                </div>
            `
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to save AI inquiry:", error);
        return { success: false, message: "Failed to save inquiry" };
    }
}
