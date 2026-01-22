import { prisma } from "@/lib/prisma";
import PackageForm from "./package-form";

export default async function PackageEditor({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const isNew = id === "new";

    let packageData = null;
    if (!isNew) {
        const p = await prisma.package.findUnique({
            where: { id }
        });

        if (p) {
            packageData = {
                ...p,
                gallery: JSON.parse(p.gallery),
                features: JSON.parse(p.features),
                itinerary: JSON.parse(p.itinerary),
                inclusions: JSON.parse(p.inclusions),
                exclusions: JSON.parse(p.exclusions),
            };
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">{isNew ? "Create New Package" : "Edit Package"}</h1>
            <PackageForm initialData={packageData} isNew={isNew} />
        </div>
    )
}
