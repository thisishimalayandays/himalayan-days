import { prisma } from "@/lib/prisma";
import DestinationForm from "./destination-form";

export default async function DestinationEditor({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const isNew = id === "new";

    let data = null;
    if (!isNew) {
        data = await prisma.destination.findUnique({
            where: { id }
        });
    }

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">{isNew ? "Add New Destination" : "Edit Destination"}</h1>
            <DestinationForm initialData={data} isNew={isNew} />
        </div>
    )
}
