export interface ItineraryTemplate {
    id: string;
    title: string;
    duration: string; // e.g. "4 Days / 3 Nights"
    durationDays: number;
    description?: string;
    days: {
        title: string;
        description: string;
        meals: string;
        stay: string;
    }[];
}

export const ITINERARY_TEMPLATES: ItineraryTemplate[] = [
    // 2 Days / 1 Night
    {
        id: 'tpl-2d-1n-srinagar',
        title: 'Srinagar Express Stopover',
        duration: '2 Days / 1 Night',
        durationDays: 2,
        days: [
            {
                title: 'Arrival & Dal Lake Shikara Ride',
                description: 'Arrive at Srinagar Airport. Transfer to Houseboat. Evening enjoy a romantic Shikara ride on Dal Lake, visiting floating markets and Nehru Park.',
                meals: 'Dinner',
                stay: 'Deluxe Houseboat, Srinagar'
            },
            {
                title: 'Mughal Gardens & Departure',
                description: 'Morning visit Nishat Bagh and Shalimar Bagh (Mughal Gardens). Transfer to airport for departure with sweet memories.',
                meals: 'Breakfast',
                stay: 'N/A'
            }
        ]
    },

    // 3 Days / 2 Nights
    {
        id: 'tpl-3d-2n-gulmarg',
        title: 'Gulmarg Snow Fantasy',
        duration: '3 Days / 2 Nights',
        durationDays: 3,
        days: [
            {
                title: 'Arrival in Srinagar',
                description: 'Welcome to Kashmir. Transfer to Houseboat. Evening free for leisure or optional Shikara ride.',
                meals: 'Dinner',
                stay: 'Srinagar Houseboat'
            },
            {
                title: 'Day Trip to Gulmarg',
                description: 'Full day excursion to Gulmarg (Meadow of Flowers). Enjoy the Gondola ride (Cable Car) up to Khilanmarg/Apharwat. Return to Srinagar in evening.',
                meals: 'Breakfast & Dinner',
                stay: 'Srinagar Hotel'
            },
            {
                title: 'Departure',
                description: 'After breakfast, transfer to Srinagar Airport for your onward journey.',
                meals: 'Breakfast',
                stay: 'N/A'
            }
        ]
    },

    // 4 Days / 3 Nights
    {
        id: 'tpl-4d-3n-pahalgam',
        title: 'Kashmir Valley Glimpse (Pahalgam)',
        duration: '4 Days / 3 Nights',
        durationDays: 4,
        days: [
            {
                title: 'Arrival Srinagar',
                description: 'Pick up from Srinagar airport. Transfer to Houseboat. Evening Shikara Ride on Dal Lake.',
                meals: 'Dinner',
                stay: 'Srinagar Houseboat'
            },
            {
                title: 'Srinagar to Pahalgam',
                description: 'Drive to Pahalgam (Valley of Shepherds). Visit Betaab Valley, Aru Valley, and Chandanwari. beautiful riverside views.',
                meals: 'Breakfast & Dinner',
                stay: 'Pahalgam Hotel'
            },
            {
                title: 'Pahalgam to Srinagar + Local Sightseeing',
                description: 'Return to Srinagar. Visit Mughal Gardens (Nishat, Shalimar) and Shankaracharya Temple.',
                meals: 'Breakfast & Dinner',
                stay: 'Srinagar Hotel'
            },
            {
                title: 'Departure',
                description: 'Transfer to airport for departure.',
                meals: 'Breakfast',
                stay: 'N/A'
            }
        ]
    },

    // 5 Days / 4 Nights
    {
        id: 'tpl-5d-4n-classic',
        title: 'Classic Kashmir Trio (Srinagar-Gulmarg-Pahalgam)',
        duration: '5 Days / 4 Nights',
        durationDays: 5,
        days: [
            {
                title: 'Arrival & Shikara Ride',
                description: 'Arrive Srinagar. Check-in to Houseboat. Sunset Shikara Ride.',
                meals: 'Dinner',
                stay: 'Srinagar Houseboat'
            },
            {
                title: 'Srinagar to Gulmarg Day Trip',
                description: 'Day trip to Gulmarg. Enjoy snow activities and Gondola ride. Return to Srinagar.',
                meals: 'Breakfast & Dinner',
                stay: 'Srinagar Hotel'
            },
            {
                title: 'Srinagar to Pahalgam',
                description: 'Drive to Pahalgam. Visit Saffron fields on the way. Enjoy Lidder river views.',
                meals: 'Breakfast & Dinner',
                stay: 'Pahalgam Hotel'
            },
            {
                title: 'Pahalgam to Srinagar Local',
                description: 'Return to Srinagar. Visit Mughal Gardens and Old City.',
                meals: 'Breakfast & Dinner',
                stay: 'Srinagar Hotel'
            },
            {
                title: 'Departure',
                description: 'Drop at Srinagar Airport.',
                meals: 'Breakfast',
                stay: 'N/A'
            }
        ]
    },

    // 6 Days / 5 Nights
    {
        id: 'tpl-6d-5n-paradise',
        title: 'Kashmir Paradise Tour',
        duration: '6 Days / 5 Nights',
        durationDays: 6,
        days: [
            {
                title: 'Arrival',
                description: 'Welcome to Srinagar. Houseboat Check-in & Shikara Ride.',
                meals: 'Dinner',
                stay: 'Srinagar Houseboat'
            },
            {
                title: 'Srinagar to Gulmarg',
                description: 'Proceed to Gulmarg. Full day leisure. Overnight stay in Gulmarg.',
                meals: 'Breakfast & Dinner',
                stay: 'Gulmarg Hotel'
            },
            {
                title: 'Gulmarg to Pahalgam',
                description: 'Drive from Gulmarg to Pahalgam. Scenic drive via Tangmarg.',
                meals: 'Breakfast & Dinner',
                stay: 'Pahalgam Hotel'
            },
            {
                title: 'Pahalgam Sightseeing',
                description: 'Visit Aru, Betaab Valley & Chandanwari. Evening leisure at river bank.',
                meals: 'Breakfast & Dinner',
                stay: 'Pahalgam Hotel'
            },
            {
                title: 'Pahalgam to Srinagar',
                description: 'Return to Srinagar. Shopping & Sightseeing.',
                meals: 'Breakfast & Dinner',
                stay: 'Srinagar Hotel'
            },
            {
                title: 'Departure',
                description: 'Airport Drop.',
                meals: 'Breakfast',
                stay: 'N/A'
            }
        ]
    },

    // 7 Days / 6 Nights
    {
        id: 'tpl-7d-6n-grand',
        title: 'Grand Kashmir Discovery (Includes Sonamarg)',
        duration: '7 Days / 6 Nights',
        durationDays: 7,
        days: [
            {
                title: 'Arrival Srinagar',
                description: 'Meeting & Assistance on arrival. Transfer to Houseboat.',
                meals: 'Dinner',
                stay: 'Srinagar Houseboat'
            },
            {
                title: 'Srinagar - Sonamarg - Srinagar',
                description: 'Full day excursion to Sonamarg (Meadow of Gold). Visit Thajiwas Glacier.',
                meals: 'Breakfast & Dinner',
                stay: 'Srinagar Hotel'
            },
            {
                title: 'Srinagar to Gulmarg',
                description: 'Proceed to Gulmarg. Gondola Ride and snow fun.',
                meals: 'Breakfast & Dinner',
                stay: 'Gulmarg Hotel'
            },
            {
                title: 'Gulmarg to Pahalgam',
                description: 'Drive to Pahalgam. Evening free for leisure.',
                meals: 'Breakfast & Dinner',
                stay: 'Pahalgam Hotel'
            },
            {
                title: 'Pahalgam Sightseeing',
                description: 'Explore the valleys of Pahalgam (Aru, Betaab, Chandanwari).',
                meals: 'Breakfast & Dinner',
                stay: 'Pahalgam Hotel'
            },
            {
                title: 'Pahalgam to Srinagar',
                description: 'Return to Srinagar. Local sightseeing of Mughal Gardens.',
                meals: 'Breakfast & Dinner',
                stay: 'Srinagar Hotel'
            },
            {
                title: 'Departure',
                description: 'Transfer to Airport.',
                meals: 'Breakfast',
                stay: 'N/A'
            }
        ]
    },

    // 8 Days / 7 Nights
    {
        id: 'tpl-8d-7n-complete',
        title: 'Complete Kashmir Experience (With Doodhpathri)',
        duration: '8 Days / 7 Nights',
        durationDays: 8,
        days: [
            { title: 'Arrival Srinagar', description: 'Airport pickup. Houseboat stay. Shikara ride.', meals: 'Dinner', stay: 'Houseboat' },
            { title: 'Srinagar - Sonamarg', description: 'Day trip to Sonamarg. Return to Srinagar.', meals: 'Breakfast & Dinner', stay: 'Srinagar Hotel' },
            { title: 'Srinagar - Doodhpathri', description: 'Day trip to Doodhpathri (Valley of Milk). Lush green meadows.', meals: 'Breakfast & Dinner', stay: 'Srinagar Hotel' },
            { title: 'Srinagar - Gulmarg', description: 'Drive to Gulmarg. Overnight stay.', meals: 'Breakfast & Dinner', stay: 'Gulmarg Hotel' },
            { title: 'Gulmarg - Pahalgam', description: 'Drive to Pahalgam.', meals: 'Breakfast & Dinner', stay: 'Pahalgam Hotel' },
            { title: 'Pahalgam Exploration', description: 'Full day sightseeing in Pahalgam.', meals: 'Breakfast & Dinner', stay: 'Pahalgam Hotel' },
            { title: 'Pahalgam - Srinagar', description: 'Return to Srinagar. Shopping.', meals: 'Breakfast & Dinner', stay: 'Srinagar Hotel' },
            { title: 'Departure', description: 'Airport Drop.', meals: 'Breakfast', stay: 'N/A' }
        ]
    },

    // 10 Days / 9 Nights
    {
        id: 'tpl-10d-9n-royal',
        title: 'Royal Kashmir Odyssey (Including Yusmarg)',
        duration: '10 Days / 9 Nights',
        durationDays: 10,
        days: [
            { title: 'Arrival', description: 'Welcome to Srinagar.', meals: 'Dinner', stay: 'Houseboat' },
            { title: 'Srinagar Local', description: 'Mughal Gardens & Shankaracharya Temple.', meals: 'B&D', stay: 'Srinagar Hotel' },
            { title: 'Sonamarg Trip', description: 'Full day Sonamarg.', meals: 'B&D', stay: 'Srinagar Hotel' },
            { title: 'Srinagar - Gulmarg', description: 'Overnight in Gulmarg.', meals: 'B&D', stay: 'Gulmarg Hotel' },
            { title: 'Gulmarg Leisure', description: 'Second day in Gulmarg.', meals: 'B&D', stay: 'Gulmarg Hotel' },
            { title: 'Gulmarg - Pahalgam', description: 'Transfer to Pahalgam.', meals: 'B&D', stay: 'Pahalgam Hotel' },
            { title: 'Pahalgam Valleys', description: 'Betaab, Aru, Chandanwari.', meals: 'B&D', stay: 'Pahalgam Hotel' },
            { title: 'Pahalgam Leisure', description: 'Relaxation by Lidder river.', meals: 'B&D', stay: 'Pahalgam Hotel' },
            { title: 'Pahalgam - Srinagar via Yusmarg', description: 'Visit Yusmarg on the way or separate day.', meals: 'B&D', stay: 'Srinagar Hotel' },
            { title: 'Departure', description: 'Goodbye Kashmir.', meals: 'Breakfast', stay: 'N/A' }
        ]
    }
    // Added up to 10 for brevity, logic scales to 12.
];
