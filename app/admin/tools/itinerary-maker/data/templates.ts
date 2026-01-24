export interface ItineraryTemplate {
    id: string;
    title: string;
    type: 'Family' | 'Honeymoon' | 'Adventure' | 'Religious' | 'Nature' | 'Budget' | 'Luxury' | 'Winter' | 'General';
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

// ... (BLOCKS remain unchanged) ...

const generateTemplates = (): ItineraryTemplate[] => {
    const templates: ItineraryTemplate[] = [];

    // --- 4 NIGHTS / 5 DAYS VARIATIONS ---
    const d5 = '5 Days / 4 Nights';
    const num5 = 5;

    templates.push(
        { id: '5d-classic', title: 'Classic Kashmir Elegance', type: 'Family', duration: d5, durationDays: num5, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargDay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.departure] },
        { id: '5d-skiing', title: 'Snow Leopard Ski Expedition', type: 'Adventure', duration: d5, durationDays: num5, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '5d-honeymoon', title: 'Enchanted Kashmir Romance', type: 'Honeymoon', duration: d5, durationDays: num5, days: [BLOCKS.arrivalSrinagarRomantic, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '5d-nature', title: 'Meadows & Pines Retreat', type: 'Nature', duration: d5, durationDays: num5, days: [BLOCKS.arrivalSrinagar, BLOCKS.doodhpathriDay, BLOCKS.pahalgamDay, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '5d-budget', title: 'Budget Backpacker\'s Kashmir', type: 'Budget', duration: d5, durationDays: num5, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargDay, BLOCKS.sonamargDay, BLOCKS.pahalgamDay, BLOCKS.departure] },
        { id: '5d-springs', title: 'Saffron & Springs Trail', type: 'Nature', duration: d5, durationDays: num5, days: [BLOCKS.arrivalSrinagar, BLOCKS.pahalgamStay, BLOCKS.springsDay, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '5d-leisure', title: 'Tranquil Srinagar & Gulmarg', type: 'Family', duration: d5, durationDays: num5, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.departure] },
        { id: '5d-spiritual', title: 'Divine Kashmir Pilgrimage', type: 'Religious', duration: d5, durationDays: num5, days: [BLOCKS.arrivalSrinagar, { ...BLOCKS.srinagarLocal, description: 'Shankaracharya, Kheer Bhawani, Hazratbal Ziyarat.' }, BLOCKS.pahalgamDay, BLOCKS.sonamargDay, BLOCKS.departure] },
    );

    // --- 5 NIGHTS / 6 DAYS VARIATIONS ---
    const d6 = '6 Days / 5 Nights';
    const num6 = 6;

    templates.push(
        { id: '6d-allround', title: 'The Complete Kashmir Collection', type: 'General', duration: d6, durationDays: num6, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.departure] },
        { id: '6d-leisure', title: 'Family Bliss in the Valley', type: 'Family', duration: d6, durationDays: num6, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.departure] },
        { id: '6d-adventure', title: 'Himalayan Adventure Quest', type: 'Adventure', duration: d6, durationDays: num6, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, { ...BLOCKS.pahalgamValleys, description: 'Trek to Baisaran and nearby trails.' }, BLOCKS.departure] },
        { id: '6d-offbeat', title: 'Secret Valleys: Yusmarg & Doodhpathri', type: 'Nature', duration: d6, durationDays: num6, days: [BLOCKS.arrivalSrinagar, BLOCKS.yusmargDay, BLOCKS.doodhpathriDay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.departure] },
        { id: '6d-gurez-explorer', title: 'Gurez & Tulail Valley Explorer', type: 'Adventure', duration: d6, durationDays: num6, days: [BLOCKS.arrivalSrinagar, BLOCKS.gurezTrip, { ...BLOCKS.gurezTrip, title: 'Tulail Valley Safari' }, { ...BLOCKS.gurezTrip, title: 'Return to Srinagar', stay: 'Srinagar Hotel' }, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '6d-honeymoon', title: 'Royal Honeymoon Indulgence', type: 'Honeymoon', duration: d6, durationDays: num6, days: [BLOCKS.arrivalSrinagarRomantic, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.departure] },
        { id: '6d-gold', title: 'Golden Triangle of Kashmir', type: 'General', duration: d6, durationDays: num6, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargStay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.departure] },
        { id: '6d-winter', title: 'Frozen Fairytale: Winter Special', type: 'Winter', duration: d6, durationDays: num6, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '6d-cultural', title: 'Heritage & Culture Discovery', type: 'Religious', duration: d6, durationDays: num6, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarOldCity, BLOCKS.gulmargDay, BLOCKS.pahalgamStay, BLOCKS.srinagarLocal, BLOCKS.departure] },
    );

    // --- 6 NIGHTS / 7 DAYS VARIATIONS ---
    const d7 = '7 Days / 6 Nights';
    const num7 = 7;

    templates.push(
        { id: '7d-complete', title: 'Majestic Kashmir Panorama', type: 'General', duration: d7, durationDays: num7, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '7d-sonamarg-lakes', title: 'Kashmir Great Lakes Preview', type: 'Nature', duration: d7, durationDays: num7, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargStay, { ...BLOCKS.sonamargDay, title: 'Thajiwas & Zero Point' }, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '7d-relax', title: 'Unwind in Paradise', type: 'Family', duration: d7, durationDays: num7, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.departure] },
        { id: '7d-trek', title: 'Alpine Trails & Treks', type: 'Adventure', duration: d7, durationDays: num7, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargDay, BLOCKS.gulmargStay, { ...BLOCKS.gulmargAdventure, title: 'Gulmarg Trek' }, BLOCKS.pahalgamStay, { ...BLOCKS.pahalgamValleys, title: 'Pahalgam Trek' }, BLOCKS.departure] },
        { id: '7d-gurez', title: 'Mystic Gurez Valley Expedition', type: 'Adventure', duration: d7, durationDays: num7, days: [BLOCKS.arrivalSrinagar, BLOCKS.gurezTrip, { ...BLOCKS.gurezTrip, title: 'Gurez Exploration', description: 'Explore Tulail Valley.' }, { ...BLOCKS.gurezTrip, title: 'Return from Gurez', stay: 'Srinagar Hotel' }, BLOCKS.gulmargDay, BLOCKS.pahalgamDay, BLOCKS.departure] },
        { id: '7d-3valleys', title: 'Triple Valley Retreat', type: 'General', duration: d7, durationDays: num7, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargStay, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.departure] },
        { id: '7d-winter-pro', title: 'Pro Skiing Alpine Week', type: 'Winter', duration: d7, durationDays: num7, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '7d-friends', title: 'Friends\' Mountain Getaway', type: 'Adventure', duration: d7, durationDays: num7, days: [BLOCKS.arrivalSrinagar, BLOCKS.doodhpathriDay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '7d-family', title: 'Grand Family Himalayan Reunion', type: 'Family', duration: d7, durationDays: num7, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargDay, BLOCKS.gulmargDay, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.srinagarLocal, BLOCKS.departure] },
    );

    // Fillers for other durations
    templates.push(
        { id: '3d-standard', title: 'Kashmir Weekend Escape', type: 'General', duration: '3 Days / 2 Nights', durationDays: 3, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargDay, BLOCKS.departure] },
        { id: '3d-snow', title: 'Alpine Snow Retreat', type: 'Winter', duration: '3 Days / 2 Nights', durationDays: 3, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargStay, BLOCKS.departure] },
        { id: '3d-city', title: 'Srinagar City Lights', type: 'General', duration: '3 Days / 2 Nights', durationDays: 3, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '4d-quick', title: 'Himalayan Glimpse', type: 'General', duration: '4 Days / 3 Nights', durationDays: 4, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargDay, BLOCKS.pahalgamDay, BLOCKS.departure] },
        { id: '4d-relax', title: 'Valley Serenity Break', type: 'Family', duration: '4 Days / 3 Nights', durationDays: 4, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargStay, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '4d-luxury', title: 'Luxury Lakeside Leisure', type: 'Luxury', duration: '4 Days / 3 Nights', durationDays: 4, days: [BLOCKS.arrivalSrinagarRomantic, BLOCKS.srinagarLocal, { ...BLOCKS.arrivalSrinagarRomantic, title: 'Shikara & Chill', description: 'Full day relaxing on the houseboat deck.' }, BLOCKS.departure] },
        { id: '4d-couple', title: 'Romantic Valley Sojourn', type: 'Honeymoon', duration: '4 Days / 3 Nights', durationDays: 4, days: [BLOCKS.arrivalSrinagarRomantic, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.departure] },
    );

    return templates.concat(generateLongDurations());
};

const generateLongDurations = (): ItineraryTemplate[] => {
    const templates: ItineraryTemplate[] = [];

    // --- 8 DAYS / 7 NIGHTS ---
    const d8 = '8 Days / 7 Nights';
    const num8 = 8;
    templates.push(
        { id: '8d-complete', title: 'Grand Kashmir & Doodhpathri', type: 'General', duration: d8, durationDays: num8, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.doodhpathriDay, BLOCKS.departure] },
        { id: '8d-relax', title: 'Serene Valley Dreams', type: 'Family', duration: d8, durationDays: num8, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.pahalgamValleys, BLOCKS.departure] },
        { id: '8d-adventure', title: 'Ultimate Adventure & Trek', type: 'Adventure', duration: d8, durationDays: num8, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, { ...BLOCKS.pahalgamValleys, description: 'Trek to Baisaran.' }, BLOCKS.sonamargStay, { ...BLOCKS.sonamargDay, title: 'Thajiwas Trek' }, BLOCKS.departure] },
        { id: '8d-family', title: 'Joyful Family Fiesta', type: 'Family', duration: d8, durationDays: num8, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.sonamargDay, BLOCKS.gulmargDay, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, { ...BLOCKS.srinagarLocal, title: 'Shopping Day' }, BLOCKS.departure] },
        { id: '8d-nature', title: 'Shutterbug\'s Paradise Tour', type: 'Nature', duration: d8, durationDays: num8, days: [BLOCKS.arrivalSrinagar, BLOCKS.doodhpathriDay, BLOCKS.yusmargDay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.gulmargStay, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '8d-gurez-special', title: 'Gurez & Gulmarg Escape', type: 'Adventure', duration: d8, durationDays: num8, days: [BLOCKS.arrivalSrinagar, BLOCKS.gurezTrip, { ...BLOCKS.gurezTrip, title: 'Tulail Valley' }, { ...BLOCKS.gurezTrip, title: 'Return from Gurez', stay: 'Srinagar Hotel' }, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.srinagarLocal, BLOCKS.departure] },
    );

    // --- 9 DAYS / 8 NIGHTS ---
    const d9 = '9 Days / 8 Nights';
    const num9 = 9;
    templates.push(
        { id: '9d-explorer', title: 'Extensive Himalayan Explorer', type: 'Adventure', duration: d9, durationDays: num9, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.sonamargStay, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.pahalgamLeisure, BLOCKS.departure] },
        { id: '9d-offbeat', title: 'Untouched Kashmir: Gurez & Yusmarg', type: 'Adventure', duration: d9, durationDays: num9, days: [BLOCKS.arrivalSrinagar, BLOCKS.gurezTrip, { ...BLOCKS.gurezTrip, title: 'Gurez Exploration' }, { ...BLOCKS.gurezTrip, title: 'Return from Gurez', stay: 'Srinagar' }, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.yusmargDay, BLOCKS.doodhpathriDay, BLOCKS.departure] },
        { id: '9d-romantic', title: 'Eternal Romance: Extended Honeymoon', type: 'Honeymoon', duration: d9, durationDays: num9, days: [BLOCKS.arrivalSrinagarRomantic, BLOCKS.sonamargStay, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.pahalgamValleys, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '9d-winter', title: 'Winter Snow Safari', type: 'Winter', duration: d9, durationDays: num9, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamStay, BLOCKS.srinagarLocal, BLOCKS.doodhpathriDay, BLOCKS.departure] },
        { id: '9d-springs', title: 'Saffron, Springs & Snow', type: 'Nature', duration: d9, durationDays: num9, days: [BLOCKS.arrivalSrinagar, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.springsDay, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.sonamargDay, BLOCKS.srinagarLocal, BLOCKS.departure] },
    );

    // --- 10 DAYS / 9 NIGHTS ---
    const d10 = '10 Days / 9 Nights';
    const num10 = 10;
    templates.push(
        { id: '10d-royal', title: 'The Royal Kashmir Odyssey', type: 'Luxury', duration: d10, durationDays: num10, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.sonamargStay, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.pahalgamLeisure, BLOCKS.yusmargDay, BLOCKS.departure] },
        { id: '10d-nature', title: 'Verdant Valley Paradise', type: 'Nature', duration: d10, durationDays: num10, days: [BLOCKS.arrivalSrinagar, BLOCKS.doodhpathriDay, BLOCKS.sonamargStay, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.pahalgamLeisure, BLOCKS.departure] },
        { id: '10d-cultural', title: 'Deep Roots: Culture & Heritage', type: 'Religious', duration: d10, durationDays: num10, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarOldCity, BLOCKS.srinagarLocal, BLOCKS.sonamargStay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.yusmargDay, BLOCKS.doodhpathriDay, BLOCKS.departure] },
        { id: '10d-trek', title: 'Summit Seeker\'s Trek', type: 'Adventure', duration: d10, durationDays: num10, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargStay, { ...BLOCKS.sonamargDay, title: 'Thajiwas Trek' }, BLOCKS.gulmargStay, { ...BLOCKS.gulmargAdventure, title: 'Apharwat Hike' }, BLOCKS.pahalgamStay, { ...BLOCKS.pahalgamValleys, title: 'Baisaran Hike' }, { ...BLOCKS.pahalgamValleys, title: 'Aru Valley Trek' }, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '10d-romantic-slow', title: 'Start to End Romance', type: 'Honeymoon', duration: d10, durationDays: num10, days: [BLOCKS.arrivalSrinagarRomantic, BLOCKS.sonamargStay, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.srinagarLocal, BLOCKS.departure] },
    );

    // --- 11 DAYS / 10 NIGHTS ---
    const d11 = '11 Days / 10 Nights';
    const num11 = 11;
    templates.push(
        { id: '11d-gurez', title: 'Hidden Gems of the Himalayas', type: 'Adventure', duration: d11, durationDays: num11, days: [BLOCKS.arrivalSrinagar, BLOCKS.gurezTrip, { ...BLOCKS.gurezTrip, title: 'Gurez Exploration' }, { ...BLOCKS.gurezTrip, title: 'Return from Gurez', stay: 'Srinagar' }, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.pahalgamLeisure, BLOCKS.doodhpathriDay, BLOCKS.departure] },
        { id: '11d-slow', title: 'Mindful Travel: Slow Kashmir', type: 'Family', duration: d11, durationDays: num11, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.sonamargStay, BLOCKS.sonamargStay, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '11d-photo', title: 'Visual Poetry: Photographer\'s Tour', type: 'Nature', duration: d11, durationDays: num11, days: [BLOCKS.arrivalSrinagar, BLOCKS.doodhpathriDay, BLOCKS.yusmargDay, BLOCKS.sonamargStay, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.srinagarOldCity, BLOCKS.departure] },
        { id: '11d-adventure-pro', title: 'Kashmir Odyssey: Valleys & Peaks', type: 'Adventure', duration: d11, durationDays: num11, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargStay, { ...BLOCKS.sonamargDay, description: 'Trek to Vishansar Lake Base.' }, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.yusmargDay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.pahalgamLeisure, BLOCKS.srinagarLocal, BLOCKS.departure] },
    );

    // --- 12 DAYS / 11 NIGHTS ---
    const d12 = '12 Days / 11 Nights';
    const num12 = 12;
    templates.push(
        { id: '12d-ultimate', title: 'The Ultimate Himalayan Vacation', type: 'Luxury', duration: d12, durationDays: num12, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.sonamargStay, BLOCKS.gurezTrip, { ...BLOCKS.gurezTrip, title: 'Gurez Sightseeing' }, { ...BLOCKS.gurezTrip, title: 'Return from Gurez', stay: 'Srinagar' }, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.yusmargDay, BLOCKS.departure] },
        { id: '12d-grand-tour', title: 'Grand Tour of the Vale', type: 'General', duration: d12, durationDays: num12, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.sonamargStay, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.doodhpathriDay, BLOCKS.yusmargDay, BLOCKS.departure] },
        { id: '12d-devotional', title: 'Sacred Sites: Divine Journey', type: 'Religious', duration: d12, durationDays: num12, days: [BLOCKS.arrivalSrinagar, { ...BLOCKS.srinagarLocal, title: 'Shankaracharya & Kheer Bhawani' }, { ...BLOCKS.srinagarLocal, title: 'Hari Parbat & Makhdoom Sahib' }, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.gulmargDay, BLOCKS.pahalgamStay, { ...BLOCKS.pahalgamValleys, title: 'Martand Sun Temple' }, BLOCKS.pahalgamLeisure, BLOCKS.yusmargDay, BLOCKS.doodhpathriDay, BLOCKS.departure] },
        { id: '12d-nature-immersion', title: 'Nature Immersion: The Great Circle', type: 'Nature', duration: d12, durationDays: num12, days: [BLOCKS.arrivalSrinagar, BLOCKS.doodhpathriDay, BLOCKS.yusmargDay, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.sonamargStay, BLOCKS.sonamargDay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.springsDay, BLOCKS.srinagarLocal, BLOCKS.departure] },
    );

    return templates;
};

const generateLongDurations = (): ItineraryTemplate[] => {
    const templates: ItineraryTemplate[] = [];

    // --- 8 DAYS / 7 NIGHTS ---
    const d8 = '8 Days / 7 Nights';
    const num8 = 8;
    templates.push(
        { id: '8d-complete', title: 'Grand Kashmir & Doodhpathri', duration: d8, durationDays: num8, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.doodhpathriDay, BLOCKS.departure] },
        { id: '8d-relax', title: 'Serene Valley Dreams', duration: d8, durationDays: num8, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.pahalgamValleys, BLOCKS.departure] },
        { id: '8d-adventure', title: 'Ultimate Adventure & Trek', duration: d8, durationDays: num8, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, { ...BLOCKS.pahalgamValleys, description: 'Trek to Baisaran.' }, BLOCKS.sonamargStay, { ...BLOCKS.sonamargDay, title: 'Thajiwas Trek' }, BLOCKS.departure] },
        { id: '8d-family', title: 'Joyful Family Fiesta', duration: d8, durationDays: num8, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.sonamargDay, BLOCKS.gulmargDay, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, { ...BLOCKS.srinagarLocal, title: 'Shopping Day' }, BLOCKS.departure] },
        { id: '8d-nature', title: 'Shutterbug\'s Paradise Tour', duration: d8, durationDays: num8, days: [BLOCKS.arrivalSrinagar, BLOCKS.doodhpathriDay, BLOCKS.yusmargDay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.gulmargStay, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '8d-gurez-special', title: 'Gurez & Gulmarg Escape', duration: d8, durationDays: num8, days: [BLOCKS.arrivalSrinagar, BLOCKS.gurezTrip, { ...BLOCKS.gurezTrip, title: 'Tulail Valley' }, { ...BLOCKS.gurezTrip, title: 'Return from Gurez', stay: 'Srinagar Hotel' }, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.srinagarLocal, BLOCKS.departure] },
    );

    // --- 9 DAYS / 8 NIGHTS ---
    const d9 = '9 Days / 8 Nights';
    const num9 = 9;
    templates.push(
        { id: '9d-explorer', title: 'Extensive Himalayan Explorer', duration: d9, durationDays: num9, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.sonamargStay, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.pahalgamLeisure, BLOCKS.departure] },
        { id: '9d-offbeat', title: 'Untouched Kashmir: Gurez & Yusmarg', duration: d9, durationDays: num9, days: [BLOCKS.arrivalSrinagar, BLOCKS.gurezTrip, { ...BLOCKS.gurezTrip, title: 'Gurez Exploration' }, { ...BLOCKS.gurezTrip, title: 'Return from Gurez', stay: 'Srinagar' }, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.yusmargDay, BLOCKS.doodhpathriDay, BLOCKS.departure] },
        { id: '9d-romantic', title: 'Eternal Romance: Extended Honeymoon', duration: d9, durationDays: num9, days: [BLOCKS.arrivalSrinagarRomantic, BLOCKS.sonamargStay, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.pahalgamValleys, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '9d-winter', title: 'Winter Snow Safari', duration: d9, durationDays: num9, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamStay, BLOCKS.srinagarLocal, BLOCKS.doodhpathriDay, BLOCKS.departure] },
        { id: '9d-springs', title: 'Saffron, Springs & Snow', duration: d9, durationDays: num9, days: [BLOCKS.arrivalSrinagar, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.springsDay, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.sonamargDay, BLOCKS.srinagarLocal, BLOCKS.departure] },
    );

    // --- 10 DAYS / 9 NIGHTS ---
    const d10 = '10 Days / 9 Nights';
    const num10 = 10;
    templates.push(
        { id: '10d-royal', title: 'The Royal Kashmir Odyssey', duration: d10, durationDays: num10, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.sonamargStay, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.pahalgamLeisure, BLOCKS.yusmargDay, BLOCKS.departure] },
        { id: '10d-nature', title: 'Verdant Valley Paradise', duration: d10, durationDays: num10, days: [BLOCKS.arrivalSrinagar, BLOCKS.doodhpathriDay, BLOCKS.sonamargStay, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.pahalgamLeisure, BLOCKS.departure] },
        { id: '10d-cultural', title: 'Deep Roots: Culture & Heritage', duration: d10, durationDays: num10, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarOldCity, BLOCKS.srinagarLocal, BLOCKS.sonamargStay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.yusmargDay, BLOCKS.doodhpathriDay, BLOCKS.departure] },
        { id: '10d-trek', title: 'Summit Seeker\'s Trek', duration: d10, durationDays: num10, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargStay, { ...BLOCKS.sonamargDay, title: 'Thajiwas Trek' }, BLOCKS.gulmargStay, { ...BLOCKS.gulmargAdventure, title: 'Apharwat Hike' }, BLOCKS.pahalgamStay, { ...BLOCKS.pahalgamValleys, title: 'Baisaran Hike' }, { ...BLOCKS.pahalgamValleys, title: 'Aru Valley Trek' }, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '10d-romantic-slow', title: 'Start to End Romance', duration: d10, durationDays: num10, days: [BLOCKS.arrivalSrinagarRomantic, BLOCKS.sonamargStay, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.srinagarLocal, BLOCKS.departure] },
    );

    // --- 11 DAYS / 10 NIGHTS ---
    const d11 = '11 Days / 10 Nights';
    const num11 = 11;
    templates.push(
        { id: '11d-gurez', title: 'Hidden Gems of the Himalayas', duration: d11, durationDays: num11, days: [BLOCKS.arrivalSrinagar, BLOCKS.gurezTrip, { ...BLOCKS.gurezTrip, title: 'Gurez Exploration' }, { ...BLOCKS.gurezTrip, title: 'Return from Gurez', stay: 'Srinagar' }, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.pahalgamLeisure, BLOCKS.doodhpathriDay, BLOCKS.departure] },
        { id: '11d-slow', title: 'Mindful Travel: Slow Kashmir', duration: d11, durationDays: num11, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.sonamargStay, BLOCKS.sonamargStay, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '11d-photo', title: 'Visual Poetry: Photographer\'s Tour', duration: d11, durationDays: num11, days: [BLOCKS.arrivalSrinagar, BLOCKS.doodhpathriDay, BLOCKS.yusmargDay, BLOCKS.sonamargStay, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.srinagarOldCity, BLOCKS.departure] },
        { id: '11d-adventure-pro', title: 'Kashmir Odyssey: Valleys & Peaks', duration: d11, durationDays: num11, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargStay, { ...BLOCKS.sonamargDay, description: 'Trek to Vishansar Lake Base.' }, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.yusmargDay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.pahalgamLeisure, BLOCKS.srinagarLocal, BLOCKS.departure] },
    );

    // --- 12 DAYS / 11 NIGHTS ---
    const d12 = '12 Days / 11 Nights';
    const num12 = 12;
    templates.push(
        { id: '12d-ultimate', title: 'The Ultimate Himalayan Vacation', duration: d12, durationDays: num12, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.sonamargStay, BLOCKS.gurezTrip, { ...BLOCKS.gurezTrip, title: 'Gurez Sightseeing' }, { ...BLOCKS.gurezTrip, title: 'Return from Gurez', stay: 'Srinagar' }, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.yusmargDay, BLOCKS.departure] },
        { id: '12d-grand-tour', title: 'Grand Tour of the Vale', duration: d12, durationDays: num12, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.sonamargStay, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.doodhpathriDay, BLOCKS.yusmargDay, BLOCKS.departure] },
        { id: '12d-devotional', title: 'Sacred Sites: Divine Journey', duration: d12, durationDays: num12, days: [BLOCKS.arrivalSrinagar, { ...BLOCKS.srinagarLocal, title: 'Shankaracharya & Kheer Bhawani' }, { ...BLOCKS.srinagarLocal, title: 'Hari Parbat & Makhdoom Sahib' }, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.gulmargDay, BLOCKS.pahalgamStay, { ...BLOCKS.pahalgamValleys, title: 'Martand Sun Temple' }, BLOCKS.pahalgamLeisure, BLOCKS.yusmargDay, BLOCKS.doodhpathriDay, BLOCKS.departure] },
        { id: '12d-nature-immersion', title: 'Nature Immersion: The Great Circle', duration: d12, durationDays: num12, days: [BLOCKS.arrivalSrinagar, BLOCKS.doodhpathriDay, BLOCKS.yusmargDay, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.sonamargStay, BLOCKS.sonamargDay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.springsDay, BLOCKS.srinagarLocal, BLOCKS.departure] },
    );

    return templates;
};

export const ITINERARY_TEMPLATES: ItineraryTemplate[] = generateTemplates();
