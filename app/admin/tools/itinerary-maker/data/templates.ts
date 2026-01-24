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
    // --- 2 Days / 1 Night ---
    {
        id: 'tpl-2d-1n-express',
        title: 'Srinagar Express Stopover',
        duration: '2 Days / 1 Night',
        durationDays: 2,
        days: [
            {
                title: 'Arrival & Dal Lake Experience',
                description: 'Arrive at Srinagar Airport. Transfer to a luxury Houseboat. Evening enjoyable Shikara ride on Dal Lake, visiting floating markets, Nehru Park, and Open Lake. Dinner on the houseboat.',
                meals: 'Dinner',
                stay: 'Deluxe Houseboat, Srinagar'
            },
            {
                title: 'Mughal Gardens & Departure',
                description: 'Morning visit the famous Mughal Gardens - Nishat Bagh (Garden of Pleasure) and Shalimar Bagh (Abode of Love). Drive along the lake side. Transfer to airport for departure.',
                meals: 'Breakfast',
                stay: 'N/A'
            }
        ]
    },

    // --- 3 Days / 2 Nights ---
    {
        id: 'tpl-3d-2n-gulmarg',
        title: 'Gulmarg Snow Fantasy',
        duration: '3 Days / 2 Nights',
        durationDays: 3,
        days: [
            {
                title: 'Arrival Srinagar - Houseboat Stay',
                description: 'Welcome to Kashmir. Transfer to your houseboat. Relax and enjoy the scenic views of the Zabarwan mountains reflecting in Dal Lake. Evening Shikara ride.',
                meals: 'Dinner',
                stay: 'Srinagar Houseboat'
            },
            {
                title: 'Day Trip to Gulmarg',
                description: 'Full day excursion to Gulmarg (Meadow of Flowers, 2730m). Enjoy the world\'s highest cable car ride (Gondola) up to Apharwat peak. Skiing and snow activities. Return to Srinagar hotel in the evening.',
                meals: 'Breakfast & Dinner',
                stay: 'Srinagar Hotel'
            },
            {
                title: 'Departure',
                description: 'After breakfast, transfer to Srinagar Airport for your onward journey with beautiful memories.',
                meals: 'Breakfast',
                stay: 'N/A'
            }
        ]
    },

    // --- 4 Days / 3 Nights ---
    {
        id: 'tpl-4d-3n-pahalgam',
        title: 'Valleys of Kashmir (Pahalgam Special)',
        duration: '4 Days / 3 Nights',
        durationDays: 4,
        days: [
            {
                title: 'Arrival Srinagar',
                description: 'Pick up from Srinagar airport. Transfer to Houseboat. Afternoon visit Shankaracharya Temple for a bird\'s eye view of the city. Evening Shikara Ride.',
                meals: 'Dinner',
                stay: 'Srinagar Houseboat'
            },
            {
                title: 'Srinagar to Pahalgam',
                description: 'Scenic drive to Pahalgam (Valley of Shepherds). Visit saffron fields at Pampore and Avantipura ruins. Enjoy the Lidder river side views. Visit Betaab Valley.',
                meals: 'Breakfast & Dinner',
                stay: 'Pahalgam Hotel'
            },
            {
                title: 'Pahalgam to Srinagar + Sightseeing',
                description: 'Morning explore Aru Valley or Baisaran (Mini Switzerland). Drive back to Srinagar in the afternoon. Visit Nishat and Shalimar gardens.',
                meals: 'Breakfast & Dinner',
                stay: 'Srinagar Hotel'
            },
            {
                title: 'Departure',
                description: 'Transfer to Srinagar Airport.',
                meals: 'Breakfast',
                stay: 'N/A'
            }
        ]
    },

    // --- 5 Days / 4 Nights ---
    {
        id: 'tpl-5d-4n-classic',
        title: 'Classic Kashmir Trio (Srinagar-Gulmarg-Pahalgam)',
        duration: '5 Days / 4 Nights',
        durationDays: 5,
        days: [
            {
                title: 'Arrival & Shikara Ride',
                description: 'Arrive Srinagar. Check-in to Houseboat. Sunset Shikara Ride witnessing floating gardens and local life on the lake.',
                meals: 'Dinner',
                stay: 'Srinagar Houseboat'
            },
            {
                title: 'Srinagar to Gulmarg Day Trip',
                description: 'Day trip to Gulmarg. Enjoy snow activities, Gondola ride, and the breathtaking views of Nanga Parbat. Return to Srinagar.',
                meals: 'Breakfast & Dinner',
                stay: 'Srinagar Hotel'
            },
            {
                title: 'Srinagar to Pahalgam',
                description: 'Drive to Pahalgam via Pampore Saffron fields. Visit Betaab Valley and Chandanwari. Enjoy the riverside evening.',
                meals: 'Breakfast & Dinner',
                stay: 'Pahalgam Hotel'
            },
            {
                title: 'Pahalgam to Srinagar Local',
                description: 'Return to Srinagar. Visit Mughal Gardens (Nishat, Shalimar, Cheshma Shahi). Shopping for handicrafts.',
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

    // --- 6 Days / 5 Nights ---
    {
        id: 'tpl-6d-5n-sonamarg',
        title: 'Golden Meadows (Includes Sonamarg Stay)',
        duration: '6 Days / 5 Nights',
        durationDays: 6,
        days: [
            { title: 'Arrival Srinagar', description: 'Airport pickup. Transfer to Houseboat. Shikara Ride.', meals: 'Dinner', stay: 'Srinagar Houseboat' },
            { title: 'Srinagar to Sonamarg', description: 'Drive to Sonamarg (Meadow of Gold). Visit Thajiwas Glacier. Enjoy the pristine natural beauty.', meals: 'Breakfast & Dinner', stay: 'Sonamarg Hotel' },
            { title: 'Sonamarg to Srinagar', description: 'Return to Srinagar. Afternoon local sightseeing of Mughal Gardens.', meals: 'Breakfast & Dinner', stay: 'Srinagar Hotel' },
            { title: 'Srinagar to Gulmarg Day Trip', description: 'Full day excursion to Gulmarg. Gondola ride and snow fun. Return to Srinagar.', meals: 'Breakfast & Dinner', stay: 'Srinagar Hotel' },
            { title: 'Srinagar to Pahalgam Day Trip', description: 'Day trip to Pahalgam. Visit Betaab Valley. Return to Srinagar.', meals: 'Breakfast & Dinner', stay: 'Srinagar Hotel' },
            { title: 'Departure', description: 'Airport Drop.', meals: 'Breakfast', stay: 'N/A' }
        ]
    },

    // --- 7 Days / 6 Nights ---
    {
        id: 'tpl-7d-6n-grand',
        title: 'Grand Kashmir Discovery',
        duration: '7 Days / 6 Nights',
        durationDays: 7,
        days: [
            { title: 'Arrival Srinagar', description: 'Welcome. Houseboat Check-in. Shikara Ride.', meals: 'Dinner', stay: 'Srinagar Houseboat' },
            { title: 'Srinagar - Sonamarg Day Trip', description: 'Full day at Sonamarg. Thajiwas Glacier pony ride. Zero Point visit.', meals: 'B&D', stay: 'Srinagar Hotel' },
            { title: 'Srinagar to Gulmarg', description: 'Drive to Gulmarg. Check-in. Enjoy the evening at leisure in the meadow.', meals: 'B&D', stay: 'Gulmarg Hotel' },
            { title: 'Gulmarg to Pahalgam', description: 'Scenic drive to Pahalgam. Check-in.', meals: 'B&D', stay: 'Pahalgam Hotel' },
            { title: 'Pahalgam Sightseeing', description: 'Visit Aru, Betaab Valley & Chandanwari. Local sightseeing.', meals: 'B&D', stay: 'Pahalgam Hotel' },
            { title: 'Pahalgam to Srinagar', description: 'Return to Srinagar. Visit Shankaracharya Temple and Old City.', meals: 'B&D', stay: 'Srinagar Hotel' },
            { title: 'Departure', description: 'Transfer to Airport.', meals: 'Breakfast', stay: 'N/A' }
        ]
    },

    // --- 8 Days / 7 Nights ---
    {
        id: 'tpl-8d-7n-complete',
        title: 'Complete Kashmir (With Doodhpathri)',
        duration: '8 Days / 7 Nights',
        durationDays: 8,
        days: [
            { title: 'Arrival', description: 'Airport pickup. Houseboat stay. Shikara ride.', meals: 'Dinner', stay: 'Houseboat' },
            { title: 'Srinagar - Sonamarg', description: 'Day trip to Sonamarg. Return to Srinagar.', meals: 'B&D', stay: 'Srinagar Hotel' },
            { title: 'Srinagar - Doodhpathri', description: 'Day trip to Doodhpathri (Valley of Milk). Picnic in the lush meadows.', meals: 'B&D', stay: 'Srinagar Hotel' },
            { title: 'Srinagar - Gulmarg', description: 'Drive to Gulmarg. Overnight stay.', meals: 'B&D', stay: 'Gulmarg Hotel' },
            { title: 'Gulmarg - Pahalgam', description: 'Drive to Pahalgam.', meals: 'B&D', stay: 'Pahalgam Hotel' },
            { title: 'Pahalgam Exploration', description: 'Full day sightseeing in Pahalgam (Aru, Betaab, Chandanwari).', meals: 'B&D', stay: 'Pahalgam Hotel' },
            { title: 'Pahalgam - Srinagar', description: 'Return to Srinagar. Shopping.', meals: 'B&D', stay: 'Srinagar Hotel' },
            { title: 'Departure', description: 'Airport Drop.', meals: 'Breakfast', stay: 'N/A' }
        ]
    },

    // --- 9 Days / 8 Nights ---
    {
        id: 'tpl-9d-8n-explorer',
        title: 'Kashmir Extensive Explorer',
        duration: '9 Days / 8 Nights',
        durationDays: 9,
        days: [
            { title: 'Arrival', description: 'Welcome to Paradise. Houseboat stay.', meals: 'Dinner', stay: 'Houseboat' },
            { title: 'Srinagar Local', description: 'Mughal Gardens, Shankaracharya Temple, Hazratbal Shrine.', meals: 'B&D', stay: 'Srinagar Hotel' },
            { title: 'Srinagar - Sonamarg', description: 'Full day excursion to Sonamarg.', meals: 'B&D', stay: 'Srinagar Hotel' },
            { title: 'Srinagar - Gulmarg', description: 'Drive to Gulmarg. Sunset view.', meals: 'B&D', stay: 'Gulmarg Hotel' },
            { title: 'Gulmarg Activities', description: 'Gondola Phase 1 & 2. Snow biking/skiing.', meals: 'B&D', stay: 'Gulmarg Hotel' },
            { title: 'Gulmarg - Pahalgam', description: 'Transfer to Pahalgam.', meals: 'B&D', stay: 'Pahalgam Hotel' },
            { title: 'Pahalgam Valleys', description: 'Visit Aru, Betaab & Chandanwari.', meals: 'B&D', stay: 'Pahalgam Hotel' },
            { title: 'Pahalgam Leisure & Srinagar Return', description: 'Morning leisure. Afternoon drive back to Srinagar.', meals: 'B&D', stay: 'Srinagar Hotel' },
            { title: 'Departure', description: 'Airport Drop.', meals: 'Breakfast', stay: 'N/A' }
        ]
    },

    // --- 10 Days / 9 Nights ---
    {
        id: 'tpl-10d-9n-royal',
        title: 'Royal Kashmir Odyssey (Includes Yusmarg)',
        duration: '10 Days / 9 Nights',
        durationDays: 10,
        days: [
            { title: 'Arrival', description: 'Welcome to Srinagar. Houseboat stay.', meals: 'Dinner', stay: 'Houseboat' },
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
    },

    // --- 11 Days / 10 Nights ---
    {
        id: 'tpl-11d-10n-hidden-gems',
        title: 'Hidden Gems of Kashmir (Gurez Valley)',
        duration: '11 Days / 10 Nights',
        durationDays: 11,
        days: [
            { title: 'Arrival', description: 'Arrival. Houseboat Stay.', meals: 'Dinner', stay: 'Houseboat' },
            { title: 'Srinagar - Gurez', description: 'Drive to Gurez Valley via Razdan Pass.', meals: 'B&D', stay: 'Gurez Hotel/Camp' },
            { title: 'Gurez Exploration', description: 'Visit Habba Khatoon Peak and Dawar.', meals: 'B&D', stay: 'Gurez Hotel/Camp' },
            { title: 'Gurez - Srinagar', description: 'Return to Srinagar.', meals: 'B&D', stay: 'Srinagar Hotel' },
            { title: 'Srinagar - Gulmarg', description: 'Overnight in Gulmarg.', meals: 'B&D', stay: 'Gulmarg Hotel' },
            { title: 'Gulmarg - Pahalgam', description: 'Transfer to Pahalgam.', meals: 'B&D', stay: 'Pahalgam Hotel' },
            { title: 'Pahalgam Valleys', description: 'Aru & Betaab Valley.', meals: 'B&D', stay: 'Pahalgam Hotel' },
            { title: 'Pahalgam Leisure', description: 'Day at leisure.', meals: 'B&D', stay: 'Pahalgam Hotel' },
            { title: 'Pahalgam - Srinagar', description: 'Return to Srinagar.', meals: 'B&D', stay: 'Srinagar Hotel' },
            { title: 'Srinagar - Doodhpathri', description: 'Day trip to Doodhpathri.', meals: 'B&D', stay: 'Srinagar Hotel' },
            { title: 'Departure', description: 'Fly back home.', meals: 'Breakfast', stay: 'N/A' }
        ]
    },

    // --- 12 Days / 11 Nights ---
    {
        id: 'tpl-12d-11n-ultimate',
        title: 'The Ultimate Kashmir Vacation (All Inclusive)',
        duration: '12 Days / 11 Nights',
        durationDays: 12,
        days: [
            { title: 'Arrival', description: 'Arrival in Srinagar. Houseboat relaxation.', meals: 'Dinner', stay: 'Houseboat' },
            { title: 'Srinagar Local', description: 'Mughal Gardens, Old City Tour.', meals: 'B&D', stay: 'Srinagar Hotel' },
            { title: 'Srinagar - Sonamarg', description: 'Day trip to Sonamarg. Zero Point.', meals: 'B&D', stay: 'Srinagar Hotel' },
            { title: 'Srinagar - Gurez', description: 'Travel to the offbeat Gurez Valley.', meals: 'B&D', stay: 'Gurez Hotel' },
            { title: 'Gurez Sightseeing', description: 'Explore Kishenganga river banks.', meals: 'B&D', stay: 'Gurez Hotel' },
            { title: 'Gurez - Srinagar', description: 'Return to Srinagar.', meals: 'B&D', stay: 'Srinagar Hotel' },
            { title: 'Srinagar - Gulmarg', description: 'Stay in Gulmarg.', meals: 'B&D', stay: 'Gulmarg Hotel' },
            { title: 'Gulmarg Leisure', description: 'Gondola Ride & Snow activities.', meals: 'B&D', stay: 'Gulmarg Hotel' },
            { title: 'Gulmarg - Pahalgam', description: 'Transfer to Pahalgam.', meals: 'B&D', stay: 'Pahalgam Hotel' },
            { title: 'Pahalgam Valleys', description: 'Aru, Betaab, Chandanwari.', meals: 'B&D', stay: 'Pahalgam Hotel' },
            { title: 'Pahalgam - Srinagar via Yusmarg', description: 'Return via Yusmarg.', meals: 'B&D', stay: 'Srinagar Hotel' },
            { title: 'Departure', description: 'Final departure.', meals: 'Breakfast', stay: 'N/A' }
        ]
    }
];
