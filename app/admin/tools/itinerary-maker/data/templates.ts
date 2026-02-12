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

// --- BUILDING BLOCKS (Reusable Days) ---

export const BLOCKS = {
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

    // Generate for 3 to 12 days
    for (let days = 3; days <= 12; days++) {
        const nights = days - 1;
        const duration = `${days} Days / ${nights} Nights`;

        const itineraryDays = [];
        for (let d = 1; d <= days; d++) {
            itineraryDays.push({
                title: '', // User requested blank title
                description: ' ', // Empty space for blank
                meals: 'Breakfast & Dinner',
                stay: 'Hotel in Srinagar' // Default placeholder
            });
        }

        templates.push({
            id: `${days}d-blank`,
            title: 'Blank Canvas (Paste Your Own)',
            type: 'General',
            duration: duration,
            durationDays: days,
            description: 'A clean slate with pre-defined days but empty descriptions. Perfect for pasting your own itinerary from AI or other sources.',
            days: itineraryDays
        });
    }

    return templates;
};

export const ITINERARY_TEMPLATES: ItineraryTemplate[] = generateTemplates();
