'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const PackageSchema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    price: z.coerce.number().min(0),
    duration: z.string().min(1),
    category: z.string().min(1),
    image: z.string().url(),
    overview: z.string().optional(),
    gallery: z.string(), // JSON string
    features: z.string(), // JSON string
    itinerary: z.string(), // JSON string
    inclusions: z.string(), // JSON string
    exclusions: z.string(), // JSON string
});

export async function createPackage(formData: FormData) {
    const rawData = {
        title: formData.get("title"),
        slug: formData.get("slug"),
        price: formData.get("price"),
        duration: formData.get("duration"),
        category: formData.get("category"),
        image: formData.get("image"),
        overview: formData.get("overview"),
        gallery: formData.get("gallery") || "[]",
        features: formData.get("features") || "[]",
        itinerary: formData.get("itinerary") || "[]",
        inclusions: formData.get("inclusions") || "[]",
        exclusions: formData.get("exclusions") || "[]",
    };

    const validatedData = PackageSchema.parse(rawData);

    await prisma.package.create({
        data: {
            title: validatedData.title,
            slug: validatedData.slug,
            startingPrice: validatedData.price,
            duration: validatedData.duration,
            category: validatedData.category,
            image: validatedData.image,
            overview: validatedData.overview || "",
            gallery: validatedData.gallery,
            location: "", // Can add later
            features: validatedData.features,
            itinerary: validatedData.itinerary,
            inclusions: validatedData.inclusions,
            exclusions: validatedData.exclusions,
        },
    });

    revalidatePath("/admin/packages");
    revalidatePath("/packages");
    redirect("/admin/packages");
}

export async function updatePackage(id: string, formData: FormData) {
    const rawData = {
        title: formData.get("title"),
        slug: formData.get("slug"),
        price: formData.get("price"),
        duration: formData.get("duration"),
        category: formData.get("category"),
        image: formData.get("image"),
        overview: formData.get("overview"),
        gallery: formData.get("gallery") || "[]",
        features: formData.get("features") || "[]",
        itinerary: formData.get("itinerary") || "[]",
        inclusions: formData.get("inclusions") || "[]",
        exclusions: formData.get("exclusions") || "[]",
    };

    const validatedData = PackageSchema.parse(rawData);

    await prisma.package.update({
        where: { id },
        data: {
            title: validatedData.title,
            slug: validatedData.slug,
            startingPrice: validatedData.price,
            duration: validatedData.duration,
            category: validatedData.category,
            image: validatedData.image,
            overview: validatedData.overview || "",
            gallery: validatedData.gallery,
            features: validatedData.features,
            itinerary: validatedData.itinerary,
            inclusions: validatedData.inclusions,
            exclusions: validatedData.exclusions,
        },
    });

    revalidatePath("/admin/packages");
    revalidatePath("/packages");
    redirect("/admin/packages");
}

export async function deletePackage(id: string) {
    await prisma.package.delete({
        where: { id },
    });
    revalidatePath("/admin/packages");
    revalidatePath("/packages");
}

export async function getPackages() {
    const packages = await prisma.package.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return packages.map(pkg => ({
        ...pkg,
        gallery: JSON.parse(pkg.gallery) as string[],
        features: JSON.parse(pkg.features) as string[],
        itinerary: JSON.parse(pkg.itinerary) as { day: number; title: string; desc: string }[],
        inclusions: JSON.parse(pkg.inclusions) as string[],
        exclusions: JSON.parse(pkg.exclusions) as string[],
    }));
}

export async function getPackageBySlug(slug: string) {
    try {
        const pkg = await prisma.package.findUnique({
            where: { slug },
        });

        if (!pkg) return null;

        return {
            ...pkg,
            gallery: JSON.parse(pkg.gallery) as string[],
            features: JSON.parse(pkg.features) as string[],
            itinerary: JSON.parse(pkg.itinerary) as { day: number; title: string; desc: string }[],
            inclusions: JSON.parse(pkg.inclusions) as string[],
            exclusions: JSON.parse(pkg.exclusions) as string[],
        };
    } catch (error) {
        console.error("Error fetching package:", error);
        return null;
    }
}

export async function getSimilarPackages(currentId: string, duration: string) {
    try {
        // 1. Try to find packages with the SAME duration first
        const similar = await prisma.package.findMany({
            where: {
                AND: [
                    { id: { not: currentId } }, // Exclude current
                    { duration: duration }      // Match duration
                ]
            },
            take: 3,
            orderBy: { updatedAt: 'desc' } // Fresh ones first
        });

        // 2. If we found fewer than 3, fill the gap with other packages
        if (similar.length < 3) {
            const needed = 3 - similar.length;
            const extra = await prisma.package.findMany({
                where: {
                    AND: [
                        { id: { not: currentId } },
                        { id: { notIn: similar.map(p => p.id) } } // Don't duplicate
                    ]
                },
                take: needed,
                orderBy: { updatedAt: 'desc' }
            });
            return [...similar, ...extra];
        }

        return similar;

    } catch (error) {
        console.error("Error fetching similar packages:", error);
        return [];
    }
}

export async function getPackagesList() {
    const packages = await prisma.package.findMany({
        select: {
            id: true,
            title: true,
            slug: true,
            startingPrice: true,
            duration: true,
            image: true,
            category: true,
            location: true,
            features: true,
            rating: true,
            reviews: true,
            // Exclude heavy JSON fields: itinerary, gallery, inclusions, exclusions
        },
        orderBy: { createdAt: 'desc' }
    });

    return packages.map(pkg => ({
        ...pkg,
        features: JSON.parse(pkg.features) as string[],
    }));
}
