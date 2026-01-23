import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://himalayandays.in';

    // Static routes
    const routes = [
        '',
        '/about',
        '/contact',
        '/packages',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic package routes
    const packages = await prisma.package.findMany({
        select: { slug: true, updatedAt: true }
    });

    const packageRoutes = packages.map((pkg) => ({
        url: `${baseUrl}/packages/${pkg.slug}`,
        lastModified: pkg.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    return [...routes, ...packageRoutes];
}
