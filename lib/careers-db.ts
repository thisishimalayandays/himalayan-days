import { prisma } from '@/lib/prisma'

export type JobApplication = {
    id: string
    name: string
    email: string
    phone: string
    resumeUrl: string | null
    coverLetter?: string
    appliedAt: string
    status: 'new' | 'reviewed' | 'interviewing' | 'rejected' | 'hired'
    jobSlug?: string
    isRead: boolean
}

export async function getApplications(): Promise<JobApplication[]> {
    try {
        const apps = await prisma.jobApplication.findMany({
            include: { job: true },
            orderBy: { appliedAt: 'desc' }
        })
        return apps.map(app => ({
            id: app.id,
            name: app.name,
            email: app.email,
            phone: app.phone,
            resumeUrl: app.resumeData ? `/api/resumes/${app.id}` : null,
            coverLetter: app.coverLetter || undefined,
            appliedAt: app.appliedAt.toISOString(),
            status: (app.status as any) || 'new',
            jobSlug: app.job.slug,
            isRead: app.isRead
        }))
    } catch (error) {
        console.error("Error reading applications DB:", error)
        return []
    }
}

export type CreateApplicationParams = {
    name: string
    email: string
    phone: string
    coverLetter: string
    resumeData?: Buffer
    resumeName?: string
    resumeType?: string
    jobSlug: string
}

export async function saveApplication(data: CreateApplicationParams): Promise<JobApplication> {

    // Ensure Job exists
    const job = await prisma.job.upsert({
        where: { slug: data.jobSlug },
        update: {},
        create: {
            slug: data.jobSlug,
            title: data.jobSlug.replace(/-/g, ' ').toUpperCase(), // Fallback title
            status: 'OPEN'
        }
    })

    const app = await prisma.jobApplication.create({
        data: {
            jobId: job.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            coverLetter: data.coverLetter,
            resumeData: data.resumeData,
            resumeName: data.resumeName,
            resumeType: data.resumeType,
            status: 'new'
        }
    })

    return {
        id: app.id,
        name: app.name,
        email: app.email,
        phone: app.phone,
        resumeUrl: app.resumeData ? `/api/resumes/${app.id}` : null,
        coverLetter: app.coverLetter || undefined,
        appliedAt: app.appliedAt.toISOString(),
        status: (app.status as any) || 'new',
        jobSlug: data.jobSlug
    }
}

export async function deleteApplication(id: string): Promise<boolean> {
    try {
        await prisma.jobApplication.delete({
            where: { id }
        })
        return true
    } catch (error) {
        console.error("Error deleting application:", error)
        return false
    }
}

export async function getJobStatus(slug: string): Promise<'OPEN' | 'CLOSED' | 'ON_HOLD'> {
    try {
        const job = await prisma.job.findUnique({
            where: { slug }
        })
        return (job?.status as any) || 'OPEN'
    } catch (error) {
        return 'OPEN'
    }
}

export async function updateJobStatus(slug: string, status: 'OPEN' | 'CLOSED' | 'ON_HOLD'): Promise<void> {
    try {
        await prisma.job.upsert({
            where: { slug },
            update: { status },
            create: {
                slug,
                title: slug, // Placeholder
                status
            }
        })
    } catch (error) {
        console.error("Error updating job status:", error)
    }
}
