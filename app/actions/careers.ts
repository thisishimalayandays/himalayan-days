'use server'

import { saveApplication, updateJobStatus, deleteApplication } from "@/lib/careers-db"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { logActivity } from "./audit"

export type ApplicationState = {
    success: boolean
    message: string
    errors?: {
        [key: string]: string[]
    }
}

export async function submitApplication(prevState: ApplicationState, formData: FormData): Promise<ApplicationState> {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const coverLetter = formData.get("coverLetter") as string
    const resume = formData.get("resume") as File
    const honeyPot = formData.get("website_url") as string // Hidden field
    const jobSlug = formData.get("jobSlug") as string || "general"

    // 1. Spam Check (Honeypot)
    if (honeyPot) {
        return {
            success: true,
            message: "Application submitted successfully! We will contact you shortly."
        }
    }

    if (!name || !email || !phone) {
        return {
            success: false,
            message: "Please fill in all required fields.",
        }
    }

    // 2. Handle File Upload (Buffer)
    let resumeData: Buffer | undefined
    let resumeName: string | undefined
    let resumeType: string | undefined

    if (resume && resume.size > 0) {
        try {
            const bytes = await resume.arrayBuffer()
            resumeData = Buffer.from(bytes)
            resumeName = resume.name
            resumeType = resume.type
        } catch (err) {
            console.error("Resume read failed:", err)
            return {
                success: false,
                message: "Failed to read resume file. Please try again."
            }
        }
    }

    // 3. Save to DB
    try {
        await saveApplication({
            name,
            email,
            phone,
            coverLetter,
            resumeData,
            resumeName,
            resumeType,
            jobSlug
        })

        revalidatePath('/admin/careers')
        return {
            success: true,
            message: "Application submitted successfully! We will contact you shortly.",
        }
    } catch (err) {
        console.error("Failed to save application:", err)
        return {
            success: false,
            message: "Something went wrong. Please try again."
        }
    }
}

export async function updateJobStatusAction(slug: string, status: 'OPEN' | 'CLOSED' | 'ON_HOLD') {
    await updateJobStatus(slug, status)
    revalidatePath('/careers/sales-executive')
    revalidatePath('/admin/careers')
    await logActivity("UPDATE_JOB_STATUS", "Job", slug, `Updated job status to ${status}`)
    revalidatePath('/careers') // Also revalidate index page
}

export async function deleteApplicationAction(id: string) {
    await deleteApplication(id)
    await logActivity("DELETE_APPLICATION", "Application", id, "Deleted job application")
    revalidatePath('/admin/careers')
}

export async function markApplicationAsRead(id: string) {
    await prisma.jobApplication.update({
        where: { id },
        data: { isRead: true }
    })
    revalidatePath('/admin/careers')
}
