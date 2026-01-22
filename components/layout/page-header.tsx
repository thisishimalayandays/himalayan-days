import Image from 'next/image';

interface PageHeaderProps {
    title: string;
    description?: string;
    image: string;
}

export function PageHeader({ title, description, image }: PageHeaderProps) {
    return (
        <section className="relative h-[40vh] w-full overflow-hidden flex items-center justify-center">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover brightness-50"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center text-white space-y-4">
                <h1
                    className="text-4xl md:text-5xl font-bold tracking-tight"
                >
                    {title}
                </h1>

                {description && (
                    <p
                        className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
                    >
                        {description}
                    </p>
                )}
            </div>
        </section>
    )
}
