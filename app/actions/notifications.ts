'use server'

import { prisma } from "@/lib/prisma"

export async function checkNewInquiries(sinceTimestamp: number) {
    try {
        const sinceDate = new Date(sinceTimestamp)

        // Count Inquiries created after the timestamp
        const count = await prisma.inquiry.count({
            where: {
                createdAt: {
                    gt: sinceDate
                }
            }
        })

        // Also check Job Applications if needed, but user specifically asked for "every inquiery"
        // Let's include Jobs too for completeness or stick to inquiries as requested?
        // "is it possible for every inquiery we recieve... we get alert"
        // I will do inquiries.

        return {
            hasNew: count > 0,
            count,
            timestamp: Date.now()
        }
    } catch (error) {
        console.error("Failed to check notifications:", error)
        return { hasNew: false, count: 0, timestamp: Date.now() }
    }
}
