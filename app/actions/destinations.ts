'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const DestinationSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    image: z.string().url(),
    description: z.string().min(1),
    rating: z.coerce.number().min(0).max(5).default(0),
    reviews: z.coerce.number().min(0).default(0),
    wikipediaUrl: z.string().url().optional().or(z.literal("")),
});

export async function createDestination(formData: FormData) {
    const rawData = {
        name: formData.get("name"),
        slug: formData.get("slug"),
        image: formData.get("image"),
        description: formData.get("description"),
        rating: formData.get("rating"),
        reviews: formData.get("reviews"),
        wikipediaUrl: formData.get("wikipediaUrl"),
    };

    const validatedData = DestinationSchema.parse(rawData);

    await prisma.destination.create({
        data: {
            name: validatedData.name,
            slug: validatedData.slug,
            image: validatedData.image,
            description: validatedData.description,
            rating: validatedData.rating,
            reviews: validatedData.reviews,
            wikipediaUrl: validatedData.wikipediaUrl || null,
        },
    });

    revalidatePath("/admin/destinations");
    revalidatePath("/");
    redirect("/admin/destinations");
}

export async function updateDestination(id: string, formData: FormData) {
    const rawData = {
        name: formData.get("name"),
        slug: formData.get("slug"),
        image: formData.get("image"),
        description: formData.get("description"),
        rating: formData.get("rating"),
        reviews: formData.get("reviews"),
        wikipediaUrl: formData.get("wikipediaUrl"),
    };

    const validatedData = DestinationSchema.parse(rawData);

    await prisma.destination.update({
        where: { id },
        data: {
            name: validatedData.name,
            slug: validatedData.slug,
            image: validatedData.image,
            description: validatedData.description,
            rating: validatedData.rating,
            reviews: validatedData.reviews,
            wikipediaUrl: validatedData.wikipediaUrl || null,
        },
    });

    revalidatePath("/admin/destinations");
    revalidatePath("/");
    redirect("/admin/destinations");
}

export async function deleteDestination(id: string) {
    await prisma.destination.delete({
        where: { id },
    });
    revalidatePath("/admin/destinations");
    revalidatePath("/");
}

export async function getDestinations() {
    return await prisma.destination.findMany({
        orderBy: { name: 'asc' }
    });
}

export async function getDestinationBySlug(slug: string) {
    return await prisma.destination.findUnique({
        where: { slug }
    });
}
