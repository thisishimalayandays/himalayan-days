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

// --- BUILDING BLOCKS (Reusable Days) ---

const BLOCKS = {
    arrivalSrinagar: {
        title: 'Arrival & Houseboat Check-in',
        description: 'Upon arrival at Srinagar Airport, our representative will greet you and transfer you to a luxurious Houseboat on Dal Lake. Enjoy a traditional welcome with Saffron Kahwa. In the evening, experience a mesmerizing 1-hour Shikara Ride on the glistening waters, witnessing the "Floating Vegetable Market" and the golden sunset behind the Zabarwan mountains. Dinner and overnight stay in the unparalleled comfort of the Houseboat.',
        meals: 'Dinner',
        stay: 'Overnight in Houseboat'
    },
    arrivalSrinagarRomantic: {
        title: 'Arrival & Romantic Shikara Ride',
        description: 'Welcome to Paradise. A private luxury car will whisk you away to your Honeymoon Suite Houseboat. The room will be decorated with fresh flowers and a welcome cake. As the sun sets, embark on a private, candle-lit Shikara ride on the silent waters of Nigeen or Dal Lake, creating unforgettable memories. Enjoy a candlelight dinner on the deck under the stars.',
        meals: 'Dinner',
        stay: 'Luxury Heritage Houseboat'
    },

    srinagarLocal: {
        title: 'Srinagar Sightseeing: Gardens & History',
        description: 'Begin your day with a tour of the world-famous Mughal Gardens: Nishat Bagh (The Garden of Pleasure) and Shalimar Bagh (Abode of Love), showcasing Persian architecture and fountains. Visit the Shankaracharya Temple atop the Gopadari Hill for a panoramic view of the entire city. End the day at the Pari Mahal (Palace of Fairies) to witness stunning terraced lawns and ancient history.',
        meals: 'Breakfast & Dinner',
        stay: 'Hotel in Srinagar'
    },
    srinagarOldCity: {
        title: 'Heritage Walk: Old Srinagar',
        description: 'Dive into the rich history of Sheher-e-Khaas (Old City). Walk through narrow lanes filled with the aroma of spices and copperware. Visit the architectural marvel of Jamia Masjid with its 370 wooden pillars, and the intricate wood carvings of Khanqah-e-Moula shrine. Explore the bustling Zaina Kadal market for authentic Kashmiri handicrafts and dry fruits.',
        meals: 'Breakfast & Dinner',
        stay: 'Hotel in Srinagar'
    },

    sonamargDay: {
        title: 'Sonamarg: The Meadow of Gold',
        description: 'Embark on a scenic drive to Sonamarg (80km, 3 hrs), passing through picturesque villages and the winding Sindh River. Upon arrival, marvel at the Thajiwas Glacier, which remains snow-covered year-round. You can hire a pony to reach the glacier base or enjoy trout fishing in the crystal-clear river. The lush green meadows and alpine peaks provide a perfect backdrop for photography.',
        meals: 'Breakfast & Dinner',
        stay: 'Hotel in Srinagar'
    },
    sonamargStay: {
        title: 'Srinagar to Sonamarg: Alpine Stay',
        description: 'Leave the city behind for the tranquility of Sonamarg. After a beautiful drive, check into your hotel surrounded by snow-capped mountains. Spend the afternoon exploring the meadows at your own pace, or take a short hike to the nilagrad river where mountain stream meets the Indus (reddish water). Enjoy a bonfire evening at the hotel (subject to availability).',
        meals: 'Breakfast & Dinner',
        stay: 'Hotel in Sonamarg'
    },

    gulmargDay: {
        title: 'Gulmarg: Meadow of Flowers',
        description: 'Drive to Gulmarg (55km), a premier hill station. The journey offers views of rice fields and apple orchards. In Gulmarg, board the famous Gulmarg Gondola (Cable Car), one of the highest in the world. Phase 1 takes you to Kongdori, and Phase 2 rises to Apharwat Peak for breathtaking views of the Himalayas. Return to Srinagar in the evening with a heart full of memories.',
        meals: 'Breakfast & Dinner',
        stay: 'Hotel in Srinagar'
    },
    gulmargStay: {
        title: 'Srinagar to Gulmarg: Mountain Retreat',
        description: 'Transfer to Gulmarg via Tangmarg. As you ascend, watch the landscape change to dense pine forests. Check into your resort. The rest of the day is at leisure to walk around the fascinating 18-hole Golf Course (highest in the world) or visit the historic St. Mary\'s Church. Experience the silence and serenity of the mountains at night.',
        meals: 'Breakfast & Dinner',
        stay: 'Hotel in Gulmarg'
    },
    gulmargAdventure: {
        title: 'Gulmarg Adventure & Activities',
        description: 'Dedicate this day to thrill. Depending on the season, enjoy Skiing or Snowboarding on world-class slopes. In summer, try an ATV ride across the undulating meadows or a pony ride to Strawberry Valley. For nature lovers, a trek to Alpather Lake (frozen lake) is a challenging yet rewarding option.',
        meals: 'Breakfast & Dinner',
        stay: 'Hotel in Gulmarg'
    },

    pahalgamDay: {
        title: 'Pahalgam: Valley of Shepherds',
        description: 'Proceed to Pahalgam (90km), driving through purple Saffron fields of Pampore and the Avantipora Ruins. See the cricket bat factories of Sangam. In Pahalgam, visit Betaab Valley (famous film location) and Chandanwari (starting point of Amarnath Yatra). The Lidder River flowing alongside makes for a perfect picnic spot.',
        meals: 'Breakfast & Dinner',
        stay: 'Hotel in Srinagar'
    },
    pahalgamStay: {
        title: 'Drive to Pahalgam: Riverside Bliss',
        description: 'A mesmerizing drive takes you to Pahalgam via the National Highway. Stop at the "Apple Valley" to buy fresh apples and juice. Upon reaching Pahalgam, check into your riverside hotel. The sound of the Lidder River will be your lullaby. Evening free to stroll through the quaint Pahalgam market.',
        meals: 'Breakfast & Dinner',
        stay: 'Hotel in Pahalgam'
    },
    pahalgamValleys: {
        title: 'Exploring Pahalgam Valleys',
        description: 'Hire a local Union taxi to visit the trio of valleys: Aru Valley (a pristine village with meadows), Betaab Valley (green pastures surrounded by mountains), and Chandanwari (snow bridges). Each valley offers unique landscapes and photo opportunities that define the beauty of Kashmir.',
        meals: 'Breakfast & Dinner',
        stay: 'Hotel in Pahalgam'
    },
    pahalgamLeisure: {
        title: 'Pahalgam Leisure & Mini Switzerland',
        description: 'A day for leisure. ride a pony through pine forests to Baisaran Meadow, often called "Mini Switzerland" for its resemblance to European landscapes. It offers a commanding view of the Pahalgam valley. Alternatively, visit the Mamal Temple (dates back to 400 AD) or just relax by the river bank reading a book.',
        meals: 'Breakfast & Dinner',
        stay: 'Hotel in Pahalgam'
    },

    doodhpathriDay: {
        title: 'Doodhpathri: Valley of Milk',
        description: 'Day trip to the hidden gem, Doodhpathri. The water of the river here churns frothy white, resembling milk. The meadows are vast, velvet-green, and less crowded than other destinations. Ideally suited for a relaxed family picnic, horse riding, and soaking in the untouched nature.',
        meals: 'Breakfast & Dinner',
        stay: 'Hotel in Srinagar'
    },
    yusmargDay: {
        title: 'Yusmarg & Nilnag Lake',
        description: 'Visit Yusmarg, known as "The Meadow of Jesus". A quiet destination surrounded by forests of pine and fir. A short trek takes you to the beautiful Nilnag Lake with its blue waters. The Doodhganga river is another attraction nearby. Perfect for travelers seeking solitude and raw nature.',
        meals: 'Breakfast & Dinner',
        stay: 'Hotel in Srinagar'
    },
    gurezTrip: {
        title: 'Journey to Gurez Valley',
        description: 'An adventurous drive across the high-altitude Razdan Pass (11,600ft) brings you to Gurez. The valley is famous for the pyramid-shaped Habba Khatoon Peak and the Kishanganga River. Check into a wooden log hut or campsite. Experience the unique Dard Shin culture and warm hospitality of the locals.',
        meals: 'Breakfast & Dinner',
        stay: 'Hotel/Camp in Gurez'
    },

    springsDay: {
        title: 'Saffron, Kokernag & Verinag Springs',
        description: 'A day of refreshing natural wonders. Drive through the purple Saffron fields of Pampore. Visit the Achabal Garden, a Mughal architectural gem. Proceed to Kokernag to see the largest fresh water spring in Kashmir, blooming with roses. Finally, witness the deep blue spring of Verinag, the source of the mighty Jhelum River.',
        meals: 'Breakfast & Dinner',
        stay: 'Hotel in Srinagar'
    },

    departure: {
        title: 'Departure & Farewell',
        description: 'After breakfast, check out from the hotel. Depending on your flight timing, you may have time for some last-minute shopping for souvenirs. Transfer to Srinagar Airport with bags full of memories and a promise to return to the Valley of Saints.',
        meals: 'Breakfast',
        stay: 'N/A'
    }
};

// --- HELPER TO GENERATE TEMPLATES ---

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
        { id: '5d-scenic', title: 'Scenic Valley Tour', type: 'General', duration: d5, durationDays: num5, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '5d-family-fun', title: 'Family Fun', type: 'General', duration: d5, durationDays: num5, days: [BLOCKS.arrivalSrinagar, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.gulmargDay, BLOCKS.departure] },
        { id: '5d-mix', title: 'Mountain Mix', type: 'General', duration: d5, durationDays: num5, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargStay, BLOCKS.pahalgamDay, BLOCKS.srinagarLocal, BLOCKS.departure] },
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
        { id: '6d-explorer', title: 'Valley Explorer', type: 'General', duration: d6, durationDays: num6, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargStay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '6d-balanced', title: 'Balanced Cachemire', type: 'General', duration: d6, durationDays: num6, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.departure] },
        { id: '6d-serenity', title: 'Serenity & Snow', type: 'General', duration: d6, durationDays: num6, days: [BLOCKS.arrivalSrinagar, BLOCKS.doodhpathriDay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.srinagarLocal, BLOCKS.departure] },
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
        { id: '7d-comprehensive', title: 'Comprehensive Kashmir', type: 'General', duration: d7, durationDays: num7, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargStay, BLOCKS.gulmargStay, { ...BLOCKS.gulmargAdventure, title: 'Gulmarg Adventure' }, BLOCKS.pahalgamStay, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '7d-leisure-gen', title: 'Leisure & Landscapes', type: 'General', duration: d7, durationDays: num7, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.doodhpathriDay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.departure] },
        { id: '7d-grand-week', title: 'Grand Week', type: 'General', duration: d7, durationDays: num7, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.yusmargDay, BLOCKS.departure] },
    );

    // Fillers for other durations to ensure coverage
    // 3 Days
    templates.push(
        { id: '3d-standard', title: 'Kashmir Weekend Escape', type: 'General', duration: '3 Days / 2 Nights', durationDays: 3, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargDay, BLOCKS.departure] },
        { id: '3d-snow', title: 'Alpine Snow Retreat', type: 'Winter', duration: '3 Days / 2 Nights', durationDays: 3, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargStay, BLOCKS.departure] },
        { id: '3d-city', title: 'Srinagar City Lights', type: 'General', duration: '3 Days / 2 Nights', durationDays: 3, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '3d-essence', title: 'Essence of Kashmir', type: 'General', duration: '3 Days / 2 Nights', durationDays: 3, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargDay, BLOCKS.departure] },
        { id: '3d-glimpse', title: 'Valley Glimpse', type: 'General', duration: '3 Days / 2 Nights', durationDays: 3, days: [BLOCKS.arrivalSrinagar, BLOCKS.pahalgamDay, BLOCKS.departure] },
        { id: '3d-quick-retreat', title: 'Quick Mountain Retreat', type: 'General', duration: '3 Days / 2 Nights', durationDays: 3, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargStay, BLOCKS.departure] },
    );

    // 4 Days
    templates.push(
        { id: '4d-quick', title: 'Himalayan Glimpse', type: 'General', duration: '4 Days / 3 Nights', durationDays: 4, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargDay, BLOCKS.pahalgamDay, BLOCKS.departure] },
        { id: '4d-relax', title: 'Valley Serenity Break', type: 'Family', duration: '4 Days / 3 Nights', durationDays: 4, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargStay, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '4d-luxury', title: 'Luxury Lakeside Leisure', type: 'Luxury', duration: '4 Days / 3 Nights', durationDays: 4, days: [BLOCKS.arrivalSrinagarRomantic, BLOCKS.srinagarLocal, { ...BLOCKS.arrivalSrinagarRomantic, title: 'Shikara & Chill', description: 'Full day relaxing on the houseboat deck.' }, BLOCKS.departure] },
        { id: '4d-couple', title: 'Romantic Valley Sojourn', type: 'Honeymoon', duration: '4 Days / 3 Nights', durationDays: 4, days: [BLOCKS.arrivalSrinagarRomantic, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.departure] },
        { id: '4d-golden', title: 'Golden Meadow Tour', type: 'General', duration: '4 Days / 3 Nights', durationDays: 4, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargDay, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '4d-classic-short', title: 'Short Classic', type: 'General', duration: '4 Days / 3 Nights', durationDays: 4, days: [BLOCKS.arrivalSrinagar, BLOCKS.gulmargStay, BLOCKS.pahalgamDay, BLOCKS.departure] },
        { id: '4d-highlights', title: 'Kashmir Highlights', type: 'General', duration: '4 Days / 3 Nights', durationDays: 4, days: [BLOCKS.arrivalSrinagar, BLOCKS.pahalgamStay, BLOCKS.gulmargDay, BLOCKS.departure] },
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
        { id: '8d-panorama', title: 'Panorama of Paradise', type: 'General', duration: d8, durationDays: num8, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.sonamargStay, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.departure] },
        { id: '8d-relaxed', title: 'Relaxed Valley Tour', type: 'General', duration: d8, durationDays: num8, days: [BLOCKS.arrivalSrinagar, BLOCKS.doodhpathriDay, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '8d-full-circle', title: 'Full Circle Kashmir', type: 'General', duration: d8, durationDays: num8, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.yusmargDay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.srinagarLocal, BLOCKS.departure] },
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
        { id: '9d-grandeur', title: 'Himalayan Grandeur', type: 'General', duration: d9, durationDays: num9, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargStay, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '9d-discovery', title: 'Valley Discovery', type: 'General', duration: d9, durationDays: num9, days: [BLOCKS.arrivalSrinagar, BLOCKS.gurezTrip, { ...BLOCKS.gurezTrip, title: 'Gurez Exploration' }, { ...BLOCKS.gurezTrip, title: 'Return from Gurez', stay: 'Srinagar' }, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '9d-nature-gen', title: 'Nature\'s Embrace', type: 'General', duration: d9, durationDays: num9, days: [BLOCKS.arrivalSrinagar, BLOCKS.doodhpathriDay, BLOCKS.yusmargDay, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.srinagarLocal, BLOCKS.departure] },
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
        { id: '10d-majestic', title: 'Majestic Mountains', type: 'General', duration: d10, durationDays: num10, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargStay, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.pahalgamLeisure, BLOCKS.yusmargDay, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '10d-complete-gen', title: 'Complete Valley Experience', type: 'General', duration: d10, durationDays: num10, days: [BLOCKS.arrivalSrinagar, BLOCKS.gurezTrip, { ...BLOCKS.gurezTrip, title: 'Gurez Exploration' }, { ...BLOCKS.gurezTrip, title: 'Return from Gurez', stay: 'Srinagar' }, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '10d-sojourn', title: 'Kashmir Sojourn', type: 'General', duration: d10, durationDays: num10, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.doodhpathriDay, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.pahalgamLeisure, BLOCKS.srinagarOldCity, BLOCKS.departure] },
    );

    // --- 11 DAYS / 10 NIGHTS ---
    const d11 = '11 Days / 10 Nights';
    const num11 = 11;
    templates.push(
        { id: '11d-gurez', title: 'Hidden Gems of the Himalayas', type: 'Adventure', duration: d11, durationDays: num11, days: [BLOCKS.arrivalSrinagar, BLOCKS.gurezTrip, { ...BLOCKS.gurezTrip, title: 'Gurez Exploration' }, { ...BLOCKS.gurezTrip, title: 'Return from Gurez', stay: 'Srinagar' }, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.pahalgamLeisure, BLOCKS.doodhpathriDay, BLOCKS.departure] },
        { id: '11d-slow', title: 'Mindful Travel: Slow Kashmir', type: 'Family', duration: d11, durationDays: num11, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.sonamargStay, BLOCKS.sonamargStay, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '11d-photo', title: 'Visual Poetry: Photographer\'s Tour', type: 'Nature', duration: d11, durationDays: num11, days: [BLOCKS.arrivalSrinagar, BLOCKS.doodhpathriDay, BLOCKS.yusmargDay, BLOCKS.sonamargStay, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.srinagarOldCity, BLOCKS.departure] },
        { id: '11d-adventure-pro', title: 'Kashmir Odyssey: Valleys & Peaks', type: 'Adventure', duration: d11, durationDays: num11, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargStay, { ...BLOCKS.sonamargDay, description: 'Trek to Vishansar Lake Base.' }, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.yusmargDay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.pahalgamLeisure, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '11d-odyssey', title: 'The Great Odyssey', type: 'General', duration: d11, durationDays: num11, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargStay, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.pahalgamLeisure, BLOCKS.yusmargDay, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '11d-extensive', title: 'Extensive Tour', type: 'General', duration: d11, durationDays: num11, days: [BLOCKS.arrivalSrinagar, BLOCKS.gurezTrip, { ...BLOCKS.gurezTrip, title: 'Gurez Exploration' }, { ...BLOCKS.gurezTrip, title: 'Return from Gurez', stay: 'Srinagar' }, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.doodhpathriDay, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '11d-leisure-long', title: 'Long Leisure Holiday', type: 'General', duration: d11, durationDays: num11, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.srinagarOldCity, BLOCKS.sonamargStay, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamLeisure, BLOCKS.yusmargDay, BLOCKS.doodhpathriDay, BLOCKS.departure] },
    );

    // --- 12 DAYS / 11 NIGHTS ---
    const d12 = '12 Days / 11 Nights';
    const num12 = 12;
    templates.push(
        { id: '12d-ultimate', title: 'The Ultimate Himalayan Vacation', type: 'Luxury', duration: d12, durationDays: num12, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.sonamargStay, BLOCKS.gurezTrip, { ...BLOCKS.gurezTrip, title: 'Gurez Sightseeing' }, { ...BLOCKS.gurezTrip, title: 'Return from Gurez', stay: 'Srinagar' }, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.yusmargDay, BLOCKS.departure] },
        { id: '12d-grand-tour', title: 'Grand Tour of the Vale', type: 'General', duration: d12, durationDays: num12, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.sonamargStay, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.gulmargStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.doodhpathriDay, BLOCKS.yusmargDay, BLOCKS.departure] },
        { id: '12d-devotional', title: 'Sacred Sites: Divine Journey', type: 'Religious', duration: d12, durationDays: num12, days: [BLOCKS.arrivalSrinagar, { ...BLOCKS.srinagarLocal, title: 'Shankaracharya & Kheer Bhawani' }, { ...BLOCKS.srinagarLocal, title: 'Hari Parbat & Makhdoom Sahib' }, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.gulmargDay, BLOCKS.pahalgamStay, { ...BLOCKS.pahalgamValleys, title: 'Martand Sun Temple' }, BLOCKS.pahalgamLeisure, BLOCKS.yusmargDay, BLOCKS.doodhpathriDay, BLOCKS.departure] },
        { id: '12d-nature-immersion', title: 'Nature Immersion: The Great Circle', type: 'Nature', duration: d12, durationDays: num12, days: [BLOCKS.arrivalSrinagar, BLOCKS.doodhpathriDay, BLOCKS.yusmargDay, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.sonamargStay, BLOCKS.sonamargDay, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.springsDay, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '12d-supreme', title: 'Supreme Kashmir', type: 'General', duration: d12, durationDays: num12, days: [BLOCKS.arrivalSrinagar, BLOCKS.sonamargStay, BLOCKS.sonamargDay, BLOCKS.gurezTrip, { ...BLOCKS.gurezTrip, title: 'Gurez Sightseeing' }, { ...BLOCKS.gurezTrip, title: 'Return from Gurez', stay: 'Srinagar' }, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '12d-all-inclusive', title: 'All Inclusive Trail', type: 'General', duration: d12, durationDays: num12, days: [BLOCKS.arrivalSrinagar, BLOCKS.doodhpathriDay, BLOCKS.yusmargDay, BLOCKS.sonamargStay, BLOCKS.sonamargDay, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.pahalgamLeisure, BLOCKS.srinagarLocal, BLOCKS.departure] },
        { id: '12d-wanderlust', title: 'Wanderlust Journey', type: 'General', duration: d12, durationDays: num12, days: [BLOCKS.arrivalSrinagar, BLOCKS.srinagarLocal, BLOCKS.srinagarOldCity, BLOCKS.sonamargStay, BLOCKS.gulmargStay, BLOCKS.gulmargAdventure, BLOCKS.pahalgamStay, BLOCKS.pahalgamValleys, BLOCKS.pahalgamLeisure, BLOCKS.yusmargDay, BLOCKS.doodhpathriDay, BLOCKS.departure] },
    );

    return templates;
};

export const ITINERARY_TEMPLATES: ItineraryTemplate[] = generateTemplates();
