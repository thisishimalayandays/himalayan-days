export interface ItineraryTemplate {
    id: string;
    title: string;
    duration: string;
    durationDays: number;
    description?: string;
    days: {
        title: string;
        description: string;
        meals: string;
        stay: string;
    }[];
}

// --- BUILDING BLOCKS (Reusable Days) ---

const BLOCKS = {
    arrivalSrinagar: { title: 'Arrival & Houseboat Check-in', description: 'Arrive at Srinagar Airport. Transfer to luxury houseboat. Welcome drink (Kahwa). Evening Shikara ride on Dal Lake.', meals: 'Dinner', stay: 'Srinagar Houseboat' },
    arrivalSrinagarRomantic: { title: 'Arrival & Romantic Shikara Ride', description: 'Welcome to Paradise. Transfer to honeymoon suite houseboat. Sunset Shikara ride with flower decoration.', meals: 'Dinner', stay: 'Deluxe Heritage Houseboat' },

    srinagarLocal: { title: 'Srinagar Sightseeing', description: 'Visit Mughal Gardens (Nishat, Shalimar), Shankaracharya Temple, and Pari Mahal. Evening at leisure.', meals: 'Breakfast & Dinner', stay: 'Srinagar Hotel' },
    srinagarOldCity: { title: 'Srinagar Heritage Tour', description: 'Walk through Old City (Sheher-e-Khaas). Visit Jamia Masjid, Khanqah-e-Moula, and local markets.', meals: 'Breakfast & Dinner', stay: 'Srinagar Hotel' },

    sonamargDay: { title: 'Sonamarg Day Trip', description: 'Full day excursion to Sonamarg (Meadow of Gold). Visit Thajiwas Glacier and fish point. Return to Srinagar.', meals: 'Breakfast & Dinner', stay: 'Srinagar Hotel' },
    sonamargStay: { title: 'Srinagar to Sonamarg Stay', description: 'Drive to Sonamarg. Check-in to hotel. Enjoy the evening by the Sind river.', meals: 'Breakfast & Dinner', stay: 'Sonamarg Hotel' },

    gulmargDay: { title: 'Gulmarg Day Trip', description: 'Day trip to Gulmarg. Gondola Ride (Phase 1 & 2). Snow activities.', meals: 'Breakfast & Dinner', stay: 'Srinagar Hotel' },
    gulmargStay: { title: 'Srinagar to Gulmarg Stay', description: 'Drive to Gulmarg. Check-in. Enjoy the meadow views and cool breeze.', meals: 'Breakfast & Dinner', stay: 'Gulmarg Hotel' },
    gulmargAdventure: { title: 'Gulmarg Adventure', description: 'Full day skiing or snowboarding lessons. ATV ride in the meadows.', meals: 'Breakfast & Dinner', stay: 'Gulmarg Hotel' },

    pahalgamDay: { title: 'Pahalgam Day Trip', description: 'Day trip to Pahalgam. Visit Betaab Valley. Return to Srinagar.', meals: 'Breakfast & Dinner', stay: 'Srinagar Hotel' },
    pahalgamStay: { title: 'Drive to Pahalgam', description: 'Scenic drive to Pahalgam via Pampore saffron fields and Apple orchards.', meals: 'Breakfast & Dinner', stay: 'Pahalgam Hotel' },
    pahalgamValleys: { title: 'Pahalgam Valley Tour', description: 'Visit Aru Valley, Betaab Valley, and Chandanwari.', meals: 'Breakfast & Dinner', stay: 'Pahalgam Hotel' },
    pahalgamLeisure: { title: 'Pahalgam Leisure', description: 'Day at leisure to explore local market or pony ride to Baisaran (Mini Switzerland).', meals: 'Breakfast & Dinner', stay: 'Pahalgam Hotel' },

    doodhpathriDay: { title: 'Doodhpathri Excursion', description: 'Day trip to Doodhpathri (Valley of Milk). Picnic in the lush green meadows.', meals: 'Breakfast & Dinner', stay: 'Srinagar Hotel' },
    yusmargDay: { title: 'Yusmarg Hidden Gem', description: 'Visit Yusmarg and Nilnag Lake. A quiet and pristine destination.', meals: 'Breakfast & Dinner', stay: 'Srinagar Hotel' },
    gurezTrip: { title: 'Srinagar to Gurez', description: 'Travel to the offbeat Gurez Valley via Razdan Pass.', meals: 'Breakfast & Dinner', stay: 'Gurez Hotel' },

    departure: { title: 'Departure', description: 'Transfer to Srinagar Airport with sweet memories.', meals: 'Breakfast', stay: 'N/A' }
};

// --- HELPER TO GENERATE TEMPLATES ---

const generateTemplates = (): ItineraryTemplate[] => {
    const templates: ItineraryTemplate[] = [];

    // --- 4 NIGHTS / 5 DAYS VARIATIONS ---
    const d5 = '5 Days / 4 Nights';
    const num5 = 5;

    templates.push(
        { id: '5d-classic', title: 'Classic Kashmir (Sxr-Gul-Pah)', duration: d5, durationDays: num5, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargDay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.departure] },
        { id: '5d-skiing', title: 'Winter Skiing Special', duration: d5, durationDays: num5, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '5d-honeymoon', title: 'Romantic Kashmir Honeymoon', duration: d5, durationDays: num5, days: [BLOCKS.arrivalSrinagarRomantic, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '5d-nature', title: 'Nature Lovers (Doodhpathri Special)', duration: d5, durationDays: num5, days: [BLOCKS.arrivalSrinagar, BLOCKS.doodhpathriDay, BLOCKS.pahalgamDay, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '5d-budget', title: 'Budget Friendly Kashmir', duration: d5, durationDays: num5, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargDay, BLOCKS.sonamargDay, BLOCKS.pahalgamDay, BLOCKS.departure] },
        { id: '5d-leisure', title: 'Relaxed Srinagar & Gulmarg', duration: d5, durationDays: num5, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.departure] },
        { id: '5d-spiritual', title: 'Spiritual Kashmir Yatra', duration: d5, durationDays: num5, days: [BLOCKS.arrivalSrinagar, { ...BLOCKS.srinagarLocal, description: 'Shankaracharya, Kheer Bhawani, Hazratbal Ziyarat.' }, BLOCKS.pahalgamDay, BLOCKS.sonamargDay, BLOCKS.departure] },
    );

    // --- 5 NIGHTS / 6 DAYS VARIATIONS ---
    const d6 = '6 Days / 5 Nights';
    const num6 = 6;

    templates.push(
        { id: '6d-allround', title: 'All-Rounder Kashmir', duration: d6, durationDays: num6, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.departure] },
        { id: '6d-leisure', title: 'Leisure Family Vacation', duration: d6, durationDays: num6, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.departure] },
        { id: '6d-adventure', title: 'Kashmir Adventure Week', duration: d6, durationDays: num6, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, { ...BLOCKS.pahalgamValleys, description: 'Trek to Baisaran and nearby trails.' }, BLOCKS.departure] },
        { id: '6d-offbeat', title: 'Offbeat Trails (Yusmarg & Doodhpathri)', duration: d6, durationDays: num6, days: [BLOCKS.arrivalSrinagar, BLOCKS.yusmargDay, BLOCKS.doodhpathriDay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.departure] },
        { id: '6d-honeymoon', title: 'Grand Honeymoon Special', duration: d6, durationDays: num6, days: [BLOCKS.arrivalSrinagarRomantic, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.departure] },
        { id: '6d-gold', title: 'Golden Triangle (Sxr-Son-Gul-Pah)', duration: d6, durationDays: num6, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargStay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.departure] },
        { id: '6d-winter', title: 'Winter Wonderland', duration: d6, durationDays: num6, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '6d-cultural', title: 'Cultural Heritage Tour', duration: d6, durationDays: num6, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarOldCity, BLOCKS.gulmargDay, BLOCKS.pahalgamStay, BLOCKS.srinagarLocal, BLOCKS.departure] },
    );

    // --- 6 NIGHTS / 7 DAYS VARIATIONS ---
    const d7 = '7 Days / 6 Nights';
    const num7 = 7;

    templates.push(
        { id: '7d-complete', title: 'Complete Valley Tour', duration: d7, durationDays: num7, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '7d-relax', title: 'Slow & Relaxed Kashmir', duration: d7, durationDays: num7, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.departure] },
        { id: '7d-trek', title: 'Soft Trekking Special', duration: d7, durationDays: num7, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargDay, BLOCKS.gulmargStay, { ...BLOCKS.gulmargAdventure, title: 'Gulmarg Trek' }, BLOCKS.pahalgamStay, { ...BLOCKS.pahalgamValleys, title: 'Pahalgam Trek' }, BLOCKS.departure] },
        { id: '7d-gurez', title: 'Gurez Valley Discovery', duration: d7, durationDays: num7, days: [BLOCKS.arrivalSrinagar, BLOCKS.gurezTrip, { ...BLOCKS.gurezTrip, title: 'Gurez Exploration', description: 'Explore Tulail Valley.' }, { ...BLOCKS.gurezTrip, title: 'Return from Gurez', stay: 'Srinagar Hotel' }, BLOCKS.gulmargDay, BLOCKS.pahalgamDay, BLOCKS.departure] },
        { id: '7d-3valleys', title: 'Three Valleys Stay', duration: d7, durationDays: num7, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargStay, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.departure] },
        { id: '7d-winter-pro', title: 'Pro Skiing Week', duration: d7, durationDays: num7, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '7d-friends', title: 'Friends Group Trip', duration: d7, durationDays: num7, days: [BLOCKS.arrivalSrinagar, BLOCKS.doodhpathriDay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '7d-family', title: 'Grand Family Reunion', duration: d7, durationDays: num7, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargDay, BLOCKS.gulmargDay, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.srinagarLocal, BLOCKS.departure] },
    );

    // Fillers for other durations to ensure coverage
    // 3 Days
    templates.push(
        { id: '3d-standard', title: 'Standard Weekend', duration: '3 Days / 2 Nights', durationDays: 3, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargDay, BLOCKS.departure] },
        { id: '3d-snow', title: 'Snow Weekend', duration: '3 Days / 2 Nights', durationDays: 3, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargStay, BLOCKS.departure] },
        { id: '3d-city', title: 'City Break', duration: '3 Days / 2 Nights', durationDays: 3, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.departure] }
    );

    // 4 Days
    templates.push(
        { id: '4d-quick', title: 'Quick Peaks', duration: '4 Days / 3 Nights', durationDays: 4, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargDay, BLOCKS.pahalgamDay, BLOCKS.departure] },
        { id: '4d-relax', title: 'Short Retreat', duration: '4 Days / 3 Nights', durationDays: 4, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargStay, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '4d-couple', title: 'Couple Gateway', duration: '4 Days / 3 Nights', durationDays: 4, days: [BLOCKS.arrivalSrinagarRomantic, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.departure] },
    );


    return templates.concat(generateLongDurations());
};

const generateLongDurations = (): ItineraryTemplate[] => {
    const templates: ItineraryTemplate[] = [];

    // --- 8 DAYS / 7 NIGHTS ---
    const d8 = '8 Days / 7 Nights';
    const num8 = 8;
    templates.push(
        { id: '8d-complete', title: 'Complete Kashmir (Incl Doodhpathri)', duration: d8, durationDays: num8, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.doodhpathriDay, BLOCKS.departure] },
        { id: '8d-relax', title: 'Relaxed Valley Tour', duration: d8, durationDays: num8, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.pahalgamValleys, BLOCKS.departure] },
        { id: '8d-adventure', title: 'Adventure Week Plus', duration: d8, durationDays: num8, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, { ...BLOCKS.pahalgamValleys, description: 'Trek to Baisaran.' }, BLOCKS.sonamargStay, { ...BLOCKS.sonamargDay, title: 'Thajiwas Trek' }, BLOCKS.departure] },
    );

    // --- 9 DAYS / 8 NIGHTS ---
    const d9 = '9 Days / 8 Nights';
    const num9 = 9;
    templates.push(
        { id: '9d-explorer', title: 'Kashmir Extensive Explorer', duration: d9, durationDays: num9, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.sonamargStay, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.pahalgamLeisure, BLOCKS.departure] },
        { id: '9d-offbeat', title: 'Offbeat Kashmir (Gurez-Yusmarg)', duration: d9, durationDays: num9, days: [BLOCKS.arrivalSrinagar, BLOCKS.gurezTrip, { ...BLOCKS.gurezTrip, title: 'Gurez Exploration' }, { ...BLOCKS.gurezTrip, title: 'Return from Gurez', stay: 'Srinagar' }, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.yusmargDay, BLOCKS.doodhpathriDay, BLOCKS.departure] },
    );

    // --- 10 DAYS / 9 NIGHTS ---
    const d10 = '10 Days / 9 Nights';
    const num10 = 10;
    templates.push(
        { id: '10d-royal', title: 'Royal Kashmir Odyssey', duration: d10, durationDays: num10, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.sonamargStay, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.pahalgamLeisure, BLOCKS.yusmargDay, BLOCKS.departure] },
        { id: '10d-nature', title: 'Nature Lovers Paradise', duration: d10, durationDays: num10, days: [BLOCKS.arrivalSrinagar, BLOCKS.doodhpathriDay, BLOCKS.sonamargStay, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.pahalgamLeisure, BLOCKS.departure] },
    );

    // --- 11 DAYS / 10 NIGHTS ---
    const d11 = '11 Days / 10 Nights';
    const num11 = 11;
    templates.push(
        { id: '11d-gurez', title: 'Hidden Gems (Gurez Special)', duration: d11, durationDays: num11, days: [BLOCKS.arrivalSrinagar, BLOCKS.gurezTrip, { ...BLOCKS.gurezTrip, title: 'Gurez Exploration' }, { ...BLOCKS.gurezTrip, title: 'Return from Gurez', stay: 'Srinagar' }, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.pahalgamLeisure, BLOCKS.doodhpathriDay, BLOCKS.departure] },
    );

    // --- 12 DAYS / 11 NIGHTS ---
    const d12 = '12 Days / 11 Nights';
    const num12 = 12;
    templates.push(
        { id: '12d-ultimate', title: 'The Ultimate Kashmir Vacation', duration: d12, durationDays: num12, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.sonamargStay, BLOCKS.gurezTrip, { ...BLOCKS.gurezTrip, title: 'Gurez Sightseeing' }, { ...BLOCKS.gurezTrip, title: 'Return from Gurez', stay: 'Srinagar' }, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.yusmargDay, BLOCKS.departure] }
    );

    return templates;
};

export const ITINERARY_TEMPLATES: ItineraryTemplate[] = generateTemplates();
