import { MetadataRoute } from 'next';
import { packages } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
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
    const packageRoutes = packages.map((pkg) => ({
        url: `${baseUrl}/packages/${pkg.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9, // Higher priority for products/packages
    }));

    return [...routes, ...packageRoutes];
}
