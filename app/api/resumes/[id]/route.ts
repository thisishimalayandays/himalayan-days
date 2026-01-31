
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const app = await prisma.jobApplication.findUnique({
            where: { id },
            select: {
                resumeData: true,
                resumeName: true,
                resumeType: true
            }
        })

        if (!app || !app.resumeData) {
            return new NextResponse('Resume not found', { status: 404 })
        }

        const buffer = app.resumeData
        const type = app.resumeType || 'application/pdf'
        const filename = app.resumeName || 'resume.pdf'

        // Convert Buffer to Uint8Array/ArrayBuffer if needed, or pass directly
        // Update: Prisma Bytes is Buffer. Next Response init body accepts Buffer.

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': type,
                'Content-Disposition': `inline; filename="${filename}"`
            }
        })

    } catch (error) {
        console.error("Error serving resume:", error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
