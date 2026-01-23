export interface Destination {
    id: string;
    name: string;
    image: string;
    description: string;
    slug: string;
    rating: number;
    reviews: number;
    wikipediaUrl?: string | null;
}
