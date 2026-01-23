const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // Create Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = await prisma.user.upsert({
        where: { email: 'admin@himalayandays.in' },
        update: {
            password: hashedPassword,
        },
        create: {
            email: 'admin@himalayandays.in',
            name: 'Admin',
            password: hashedPassword,
        },
    });
    console.log(`Created user with id: ${user.id}`);

    // Seed Destinations
    const destinations = [
        {
            name: "Srinagar",
            image: "/Destinations/Srinagar.jpeg",
            description: "The summer capital, famous for Dal Lake, Houseboats, and Mughal Gardens.",
            slug: "Srinagar",
            rating: 4.8,
            reviews: 1240,
            wikipediaUrl: "https://en.wikipedia.org/wiki/Srinagar"
        },
        {
            name: "Gulmarg",
            image: "/Destinations/Gulmarg.jpeg",
            description: "The 'Meadow of Flowers', known for the world's highest gondola and skiing.",
            slug: "Gulmarg",
            rating: 4.9,
            reviews: 980,
            wikipediaUrl: "https://en.wikipedia.org/wiki/Gulmarg"
        },
        {
            name: "Pahalgam",
            image: "/Destinations/Pahalgham.jpeg",
            description: "The 'Valley of Shepherds', bringing you closer to nature, rivers, and treks.",
            slug: "Pahalgam",
            rating: 4.7,
            reviews: 850,
            wikipediaUrl: "https://en.wikipedia.org/wiki/Pahalgam"
        },
        {
            name: "Sonmarg",
            image: "/Destinations/Sonmarg.jpeg",
            description: "The 'Meadow of Gold', gateway to Ladakh and home to the Thajiwas Glacier.",
            slug: "Sonmarg",
            rating: 4.8,
            reviews: 620,
            wikipediaUrl: "https://en.wikipedia.org/wiki/Sonamarg"
        },
        {
            name: "Gurez Valley",
            image: "/Destinations/Gurez%20Valley.jpeg",
            description: "An offbeat gem along the silk route, offering pristine beauty and solitude.",
            slug: "Gurez",
            rating: 4.9,
            reviews: 150,
            wikipediaUrl: "https://en.wikipedia.org/wiki/Gurez_Valley"
        },
        {
            name: "Doodhpathri",
            image: "/Destinations/Doodhpathri.jpeg",
            description: "The 'Valley of Milk', a lush green meadow perfect for day picnics.",
            slug: "Doodhpathri",
            rating: 4.6,
            reviews: 340,
            wikipediaUrl: "https://en.wikipedia.org/wiki/Doodhpathri"
        },
        {
            name: "Yusmarg",
            image: "/Destinations/Yusmarg%20Kashmir.jpeg",
            description: "A hidden paradise with vast meadows and pine forests, ideal for trekkers.",
            slug: "Yusmarg",
            rating: 4.7,
            reviews: 210,
            wikipediaUrl: "https://en.wikipedia.org/wiki/Yusmarg"
        },
        {
            name: "Aru Valley",
            image: "/Destinations/Aru%20Valley.jpeg",
            description: "A pristine scenic village known for its lush meadows, hiking trails, and camping sites.",
            slug: "Aru-Valley",
            rating: 4.8,
            reviews: 450,
            wikipediaUrl: "https://en.wikipedia.org/wiki/Aru_Valley"
        },
        {
            name: "Sinthan Top",
            image: "/Destinations/Sinthan%20Top.jpeg",
            description: "A mountain pass connecting Breng Valley with Kishtwar, offering 360-degree views of snow-capped peaks.",
            slug: "Sinthan-Top",
            rating: 4.9,
            reviews: 320,
            wikipediaUrl: "https://en.wikipedia.org/wiki/Sinthan_Top"
        },
        {
            name: "Verinag",
            image: "/Destinations/Verinag.jpeg",
            description: "Home to the famous Mughal Garden and the spring source of the Jhelum River.",
            slug: "Verinag",
            rating: 4.6,
            reviews: 280,
            wikipediaUrl: "https://en.wikipedia.org/wiki/Verinag_Spring"
        }
    ];

    for (const dest of destinations) {
        const d = await prisma.destination.upsert({
            where: { slug: dest.slug },
            update: {
                name: dest.name,
                image: dest.image,
                description: dest.description,
                rating: dest.rating,
                reviews: dest.reviews,
                wikipediaUrl: dest.wikipediaUrl
            },
            create: {
                name: dest.name,
                slug: dest.slug,
                image: dest.image,
                description: dest.description,
                rating: dest.rating,
                reviews: dest.reviews,
                wikipediaUrl: dest.wikipediaUrl
            }
        });
        console.log(`Created destination: ${d.name}`);
    }


    // Seed Packages
    const packages = [
        {
            slug: "magical-kashmir-honeymoon",
            title: "Magical Kashmir Honeymoon",
            duration: "5 Nights / 6 Days",
            startingPrice: 18999,
            image: "/Magical%20Kashmir%20Honeymoon/Magical%20Kashmir%20Honeymoon%20(1).png",
            gallery: [
                "/Magical%20Kashmir%20Honeymoon/Magical%20Kashmir%20Honeymoon%20(1).png",
                "/Magical%20Kashmir%20Honeymoon/Magical%20Kashmir%20Honeymoon%20(2).png",
                "/Magical%20Kashmir%20Honeymoon/Magical%20Kashmir%20Honeymoon%20(3).png",
                "/Magical%20Kashmir%20Honeymoon/Magical%20Kashmir%20Honeymoon%20(4).jpeg",
                "/Magical%20Kashmir%20Honeymoon/Magical%20Kashmir%20Honeymoon%20(5).jpeg",
                "/Magical%20Kashmir%20Honeymoon/Magical%20Kashmir%20Honeymoon%20(6).png",
                "/Magical%20Kashmir%20Honeymoon/Magical%20Kashmir%20Honeymoon%20(7).png"
            ],
            category: "Honeymoon",
            location: "Srinagar, Gulmarg, Pahalgam",
            features: ["Houseboat Stay", "Candlelight Dinner", "Flower Decoration"],
            overview: "Experience the romantic charm of Kashmir with our specially curated honeymoon package. From the serene Dal Lake to the snow-capped peaks of Gulmarg, every moment is crafted to create unforgettable memories. Enjoy romantic Shikara rides, cozy houseboat stays, and private transfers.",
            itinerary: [
                { day: 1, title: "Arrival in Srinagar & Romantic Shikara Ride", desc: "Arrive at Srinagar Airport where our representative will welcome you with a warm smile. Get transferred to your luxury houseboat docked on the tranquil Dal Lake. In the evening, enjoy a 1-hour romantic Shikara ride as the sun sets over the Zabarwan mountains, painting the sky in hues of orange and pink. Dinner and overnight stay on the houseboat." },
                { day: 2, title: "Srinagar to Gulmarg - The Meadow of Flowers", desc: "After a delicious breakfast, proceed to Gulmarg (2730m). Witness the majestic pine forests and snow-capped peaks. Take the famous Gondola Ride (Cable Car) to Kungdoor (Phase 1) or Apharwat Peak (Phase 2) for breathtaking panoramic views. Spend quality time in the snow or walk hand-in-hand through the meadows. Return to your hotel in Gulmarg for a cozy dinner." },
                { day: 3, title: "Gulmarg to Pahalgam - Valley of Shepherds", desc: "Drive to Pahalgam, passing through the saffron fields of Pampore and the ancient Avantipura Ruins. Watch the changing landscape as you enter the pine-covered mountains. Check into your riverside hotel offering mesmerizing views of the Lidder River. Enjoy a peaceful evening listening to the sound of flowing water." },
                { day: 4, title: "Pahalgam Sightseeing & Leisure", desc: "Visit the stunning Betaab Valley, named after the Bollywood movie, featuring lush green meadows and crystal clear water. Proceed to Aru Valley for its scenic beauty and peace. You can also visit Chandanwari, the starting point of Amarnath Yatra. Enjoy a romantic horse ride or simply relax by the river bank." },
                { day: 5, title: "Pahalgam to Srinagar - Mughal Gardens", desc: "Drive back to Srinagar. Visit the famous Mughal Gardens - Nishat Bagh (Garden of Joy) and Shalimar Bagh (Abode of Love), showcasing Persian architecture and beautiful fountains. Visit the Shankaracharya Temple for a bird's eye view of Srinagar. Evening free for shopping at Lal Chowk or Boulevard Road." },
                { day: 6, title: "Departure with Sweet Memories", desc: "Enjoy a final breakfast in Kashmir. Our driver will drop you at Srinagar Airport for your onward journey, carrying a bag full of beautiful memories and the taste of authentic Kashmiri Kahwa." }
            ],
            inclusions: [
                "Accommodation in 3 Star Hotels/Houseboats",
                "Daily Breakfast & Dinner",
                "All Transfers & Sightseeing by Private Car",
                "1 Hour Shikara Ride",
                "Candlelight Dinner",
                "Honeymoon Cake & Flower Decoration"
            ],
            exclusions: [
                "Airfare / Train fare",
                "Lunch",
                "Gondola Tickets / Pony Rides / Garden Entry Fees",
                "Any personal expenses"
            ]
        },
        {
            slug: "kashmir-family-adventure",
            title: "Kashmir Family Adventure",
            duration: "6 Nights / 7 Days",
            startingPrice: 15500,
            image: "/Kashmir%20Family%20Adventure/Kashmir%20Family%20Adventure%20(1).png",
            gallery: [
                "/Kashmir%20Family%20Adventure/Kashmir%20Family%20Adventure%20(1).png",
                "/Kashmir%20Family%20Adventure/Kashmir%20Family%20Adventure%20(2).png",
                "/Kashmir%20Family%20Adventure/Kashmir%20Family%20Adventure%20(3).png",
                "/Kashmir%20Family%20Adventure/Kashmir%20Family%20Adventure%20(4).jpeg",
                "/Kashmir%20Family%20Adventure/Kashmir%20Family%20Adventure%20(5).jpeg",
                "/Kashmir%20Family%20Adventure/Kashmir%20Family%20Adventure%20(6).jpeg",
                "/Kashmir%20Family%20Adventure/Kashmir%20Family%20Adventure%20(7).jpeg"
            ],
            category: "Family",
            location: "Srinagar, Sonmarg, Gulmarg",
            features: ["Gondola Ride", "Pony Ride", "River Rafting"],
            overview: "The perfect family getaway exploring the golden triangle of Kashmir - Srinagar, Gulmarg, and Sonmarg. Designed for all ages, this tour offers a mix of sightseeing, adventure, and relaxation.",
            itinerary: [
                { day: 1, title: "Arrival in Srinagar & Dal Lake", desc: "Welcome to Srinagar! Our driver will pick you up and transfer you to your hotel. After freshening up, head to the Boulevard Road for a casual walk. Enjoy a Shikara ride on Dal Lake, visiting the Floating Market and Nehru Park. Dinner at the hotel." },
                { day: 2, title: "Excursion to Sonmarg - Meadow of Gold", desc: "Full day excursion to Sonmarg (84km). The drive through the Sindh Valley is mesmerizing. Visit Thajiwas Glacier where snow remains round the year. Kids can enjoy pony rides or sledding on the snow. You can also try white water rafting in the Sindh River (seasonal). Return to Srinagar in the evening." },
                { day: 3, title: "Srinagar to Gulmarg Fun", desc: "Transfer to Gulmarg. Check-in to your hotel. Today is for adventure! Take the Gondola ride which offers views of Nanga Parbat. In winter, enjoy skiing instructions for beginners. In summer, the golf course and high-altitude meadows are perfect for a family picnic." },
                { day: 4, title: "Gulmarg Sightseeing & Strawberry Valley", desc: "Explore the local attractions like the ancient Shiva Temple (Rani Temple) and St. Mary's Church. Visit Strawberry Valley (in season) to see fresh strawberries. Take an ATV ride through the off-road tracks for some thrill. Evening at leisure." },
                { day: 5, title: "Srinagar to Pahalgam - Baisaran Valley", desc: "Drive to Pahalgam. After check-in, take a pony ride to Baisaran Valley, often called 'Mini Switzerland'. It's a large grassy meadow surrounded by dense pine forests and snow-capped mountains. Perfect for kids to run around and play. Evening free for local market exploration." },
                { day: 6, title: "Srinagar Sightseeing & Shopping", desc: "Return to Srinagar. Visit the architectural marvels including Jamia Masjid and Shah-e-Hamdan Shrine. Visit the local handicraft emporium to see how Pashmina shawls and walnut wood carvings are made. Buy souvenirs for family and friends." },
                { day: 7, title: "Departure", desc: "After breakfast, transfer to Srinagar Airport with happy memories of your family vacation." }
            ],
            inclusions: [
                "Family Suite Accommodation",
                "Breakfast & Dinner",
                "Private Innova/Tempo Traveller",
                "Shikara Ride"
            ],
            exclusions: [
                "Flights",
                "Activity costs"
            ]
        },
        {
            slug: "gurez-valley-expedition",
            title: "Gurez Valley Expedition",
            duration: "4 Nights / 5 Days",
            startingPrice: 12500,
            image: "/Gurez%20Valley%20Expedition/Gurez%20Valley%20Expedition%20(1).jpeg",
            gallery: [
                "/Gurez%20Valley%20Expedition/Gurez%20Valley%20Expedition%20(1).jpeg",
                "/Gurez%20Valley%20Expedition/Gurez%20Valley%20Expedition%20(2).jpeg",
                "/Gurez%20Valley%20Expedition/Gurez%20Valley%20Expedition%20(3).jpeg",
                "/Gurez%20Valley%20Expedition/Gurez%20Valley%20Expedition%20(4).jpeg",
                "/Gurez%20Valley%20Expedition/Gurez%20Valley%20Expedition%20(5).jpeg",
                "/Gurez%20Valley%20Expedition/Gurez%20Valley%20Expedition%20(6).jpeg",
                "/Gurez%20Valley%20Expedition/Gurez%20Valley%20Expedition%20(7).jpeg",
                "/Gurez%20Valley%20Expedition/Gurez%20Valley%20Expedition%20(8).jpeg"
            ],
            category: "Adventure",
            location: "Gurez, Dawar, Tulail",
            features: ["Offbeat", "Camping", "Trekking"],
            overview: "Explore the hidden gem of Kashmir - Gurez Valley. Located along the LOC, this offbeat destination offers pristine nature, unique culture, and absolute tranquility.",
            itinerary: [
                { day: 1, title: "Srinagar to Gurez - Crossing Razdan Pass", desc: "Start early (6 AM) for a thrilling drive to Gurez via Razdan Pass (11,672 ft), offering panoramic views of the Himalayas. Descend into the picturesque Dawar town. Check into your wooden log hut or campsite. Enjoy the absolute silence and starry night." },
                { day: 2, title: "Tulail Valley & Sheikhpura", desc: "Drive further into the valley towards Tulail. The landscape dramatically changes to rugged mountains and the turquoise Kishanganga River. Visit the traditional village of Sheikhpura and interact with the friendly Dard - Shina tribe. Their culture/language is distinct from Kashmiri." },
                { day: 3, title: "Habba Khatoon Peak & Local Lore", desc: "Visit the pyramid-shaped Habba Khatoon Peak, named after the poetess-queen. Visit the spring at the base where she is said to have wandered. Walk along the banks of the Kishanganga river (Neelam River). Experience local trout fishing if interested." },
                { day: 4, title: "Gurez to Srinagar", desc: "Bid farewell to this untouched paradise. Drive back to Srinagar via Bandipora. Stop for lunch at Wular Lake vantage point (Watlab). Reach Srinagar by evening and check into your hotel." },
                { day: 5, title: "Departure", desc: "Transfer to Srinagar Airport. You are now part of the select few who have witnessed the raw beauty of Gurez." }
            ],
            inclusions: ["Camping/Homestay", "All Meals", "Permits", "Guide"],
            exclusions: ["Personal Gear", "Tips"]
        },
        {
            slug: "luxury-houseboat-retreat",
            title: "Luxury Houseboat Retreat",
            duration: "3 Nights / 4 Days",
            startingPrice: 22000,
            image: "/Luxury%20Houseboat%20Retreat/Luxury%20Houseboat%20Retreat%20(1).jpeg",
            gallery: [
                "/Luxury%20Houseboat%20Retreat/Luxury%20Houseboat%20Retreat%20(1).jpeg",
                "/Luxury%20Houseboat%20Retreat/Luxury%20Houseboat%20Retreat%20(2).jpeg",
                "/Luxury%20Houseboat%20Retreat/Luxury%20Houseboat%20Retreat%20(3).jpeg",
                "/Luxury%20Houseboat%20Retreat/Luxury%20Houseboat%20Retreat%20(4).jpeg",
                "/Luxury%20Houseboat%20Retreat/Luxury%20Houseboat%20Retreat%20(5).jpeg"
            ],
            category: "Luxury",
            location: "Dal Lake, Srinagar",
            features: ["5 Star Meals", "Shikara Ride", "Airport Transfer"],
            overview: "Experience royalty on water. Stay in super-luxury heritage houseboats carved from walnut wood, enjoying 5-star hospitality and mesmerizing lake views.",
            itinerary: [
                { day: 1, title: "Royal Welcome & Sunset Shikara", desc: "Arrive in style with a private transfer. Be welcomed at your Heritage Houseboat with traditional Kashmiri Kahwa and cookies. Relax on the deck watching the life on the lake. enjoy a premium Shikara ride at sunset, exploring the deeper / quieter canals of Dal Lake." },
                { day: 2, title: "Floating Market & Mughal Gardens", desc: "Wake up at 5:00 AM for a unique experience - the Floating Vegetable Market, where farmers barter produce on boats. Return for a lavish breakfast. Later, take a private boat to visit Nishat and Shalimar gardens directly from the lake entrance." },
                { day: 3, title: "Heritage Walk & Wazwan Feast", desc: "A guided heritage walk through the Old City. Visit the architectural wonders: Jamia Masjid (370 deodar pillars) and Shah-e-Hamdan (Paper Mache work). Return to the houseboat for a special multi-course Wazwan dinner (Royal Kashmiri Feast)." },
                { day: 4, title: "Farewell", desc: "Enjoy a lazy morning on the deck. Private transfer to the airport with a special souvenir gift from us." }
            ],
            inclusions: ["Super Luxury Houseboat", "All Meals (Including Wazwan)", "Private Shikara", "Guide"],
            exclusions: ["Flights"]
        },
        {
            slug: "complete-kashmir-tour",
            title: "Complete Kashmir Tour",
            duration: "7 Nights / 8 Days",
            startingPrice: 20500,
            image: "/Complete%20Kashmir%20Tour/Complete%20Kashmir%20Tour%20(1).jpeg",
            gallery: [
                "/Complete%20Kashmir%20Tour/Complete%20Kashmir%20Tour%20(1).jpeg",
                "/Complete%20Kashmir%20Tour/Complete%20Kashmir%20Tour%20(2).jpeg",
                "/Complete%20Kashmir%20Tour/Complete%20Kashmir%20Tour%20(3).jpeg",
                "/Complete%20Kashmir%20Tour/Complete%20Kashmir%20Tour%20(4).jpeg",
                "/Complete%20Kashmir%20Tour/Complete%20Kashmir%20Tour%20(5).jpeg"
            ],
            category: "Bestseller",
            location: "All Major Destinations",
            features: ["Comprehensive", "Leisure", "Photography"],
            overview: "The ultimate Kashmir experience covering all major destinations at a relaxed pace. Perfect for first-time visitors who want to see it all.",
            itinerary: [
                { day: 1, title: "Arrival in Srinagar", desc: "Warm welcome at the airport. Transfer to your hotel/houseboat. Acclimatize to the beauty of the valley. Evening Shikara ride." },
                { day: 2, title: "Sonmarg Excursion", desc: "Day trip to Sonmarg. Visit majestic Thajiwas Glacier. Enjoy the scenic drive along the Sindh River. Return to Srinagar." },
                { day: 3, title: "Srinagar to Gulmarg", desc: "Drive to Gulmarg. Check-in to hotel. Enjoy the Gandola ride to Phase 1 or 2. Witness the panoramic views of the Himalayas." },
                { day: 4, title: "Gulmarg to Pahalgam", desc: "Drive to Pahalgam via Pampore Saffron fields. Visit the Bat factory to see famous Kashmir willow bats being made. Riverside evening." },
                { day: 5, title: "Pahalgam Valley Tour", desc: "Visit Aru Valley, Betaab Valley and Chandanwari. Enjoy the lush green meadows and filming locations of Bollywood movies." },
                { day: 6, title: "Pahalgam to Srinagar", desc: "Return to Srinagar. Visit Shankaracharya Temple and Chashme Shahi (Royal Spring) garden. Shopping for dry fruits and saffron." },
                { day: 7, title: "Srinagar Heritage Tour", desc: "Visit Hazratbal Shrine, housing the holy relic. Visit Jamia Masjid and roam through the bustling markets of Lal Chowk." },
                { day: 8, title: "Departure", desc: "Transfer to Srinagar Airport with a camera full of photos and a heart full of memories." }
            ],
            inclusions: ["3 Star Hotels", "Breakfast & Dinner", "Transportation"],
            exclusions: ["Lunch", "Tickets"]
        },
        {
            slug: "winter-wonderland-kashmir",
            title: "Winter Wonderland Kashmir",
            duration: "4 Nights / 5 Days",
            startingPrice: 16500,
            image: "/Winter%20Wonderland%20Kashmir/Winter%20Wonderland%20Kashmir%20(1).jpeg",
            gallery: [
                "/Winter%20Wonderland%20Kashmir/Winter%20Wonderland%20Kashmir%20(1).jpeg",
                "/Winter%20Wonderland%20Kashmir/Winter%20Wonderland%20Kashmir%20(2).jpeg",
                "/Winter%20Wonderland%20Kashmir/Winter%20Wonderland%20Kashmir%20(3).jpeg",
                "/Winter%20Wonderland%20Kashmir/Winter%20Wonderland%20Kashmir%20(4).jpeg",
                "/Winter%20Wonderland%20Kashmir/Winter%20Wonderland%20Kashmir%20(5).jpeg"
            ],
            category: "Adventure",
            location: "Gulmarg, Srinagar",
            features: ["Snow Skiing", "Igloo Stay", "Snowfall"],
            overview: "Witness the magic of snow-covered Kashmir. This package is specially designed for snow lovers and adventure enthusiasts who want to experience skiing and snowboarding in Gulmarg.",
            itinerary: [
                { day: 1, title: "Arrival in Frozen Srinagar", desc: "Land in a white blanket of snow. Transfer to a centrally heated hotel. Enjoy steaming hot Kahwa by the Bukhari (traditional heater)." },
                { day: 2, title: "Gulmarg Snow Adventures", desc: "Drive to Gulmarg through snow-walled roads. Check-in. Take basic skiing lessons from our certified instructor on the gentle slopes." },
                { day: 3, title: "Gulmarg Heights & ATV", desc: "Ride the Gondola to Apharwat peak to experience deep powder snow. Enjoy a thrilling snow bike (ATV) ride. Visit the Igloo Cafe (seasonal) for a coffee." },
                { day: 4, title: "Srinagar White Charm", desc: "Return to Srinagar. See the frozen/semi-frozen Dal Lake. Walk through the snow-laden Chinar trees in Mughal Gardens, resembling Narnia." },
                { day: 5, title: "Departure", desc: "Transfer to airport. Note: Flights may be delayed due to snow, so keep buffer time." }
            ],
            inclusions: ["Heated Accommodation", "Ski Equipment Rental", "All Meals", "Chained Vehicle for Snow"],
            exclusions: ["Gondola Tickets", "Guide Tips"]
        },
        {
            slug: "kashmir-devotional-yatra",
            title: "Kashmir Devotional Yatra",
            duration: "5 Nights / 6 Days",
            startingPrice: 14999,
            image: "/Kashmir%20Devotional%20Yatra/Kashmir%20Devotional%20Yatra%20(1).jpeg",
            gallery: [
                "/Kashmir%20Devotional%20Yatra/Kashmir%20Devotional%20Yatra%20(1).jpeg",
                "/Kashmir%20Devotional%20Yatra/Kashmir%20Devotional%20Yatra%20(2).jpeg",
                "/Kashmir%20Devotional%20Yatra/Kashmir%20Devotional%20Yatra%20(3).jpeg",
                "/Kashmir%20Devotional%20Yatra/Kashmir%20Devotional%20Yatra%20(4).jpeg",
                "/Kashmir%20Devotional%20Yatra/Kashmir%20Devotional%20Yatra%20(5).jpeg"
            ],
            category: "Religious",
            location: "Kheer Bhawani, Shankaracharya, Hazratbal",
            features: ["Temple Tour", "Spiritual", "Peaceful"],
            overview: "A spiritual journey visiting the most revered shrines in Kashmir, including Kheer Bhawani, Shankaracharya Temple, Hazratbal Shrine, and Martand Sun Temple.",
            itinerary: [
                { day: 1, title: "Arrival & Shankaracharya Darshan", desc: "Arrival. Visit the ancient Shankaracharya Temple atop the Gopadari Hill, dedicated to Lord Shiva. Meditate in the serene atmosphere overlooking Dal Lake." },
                { day: 2, title: "Kheer Bhawani & Sharika Devi", desc: "Visit Mata Kheer Bhawani temple in Tullamulla, famous for its changing spring water color. Visit Hari Parbat fort and Sharika Devi temple." },
                { day: 3, title: "Martand Sun Temple & Pahalgam", desc: "Drive to Pahalgam. Enroute visit the majestic 8th-century ruins of Martand Sun Temple. Visit the mamleshwar temple in Pahalgam." },
                { day: 4, title: "Sufi Trail of Srinagar", desc: "Return to Srinagar. Visit the white marble Hazratbal Shrine. Visit the shrine of Makhdoom Sahib and Dastgeer Sahib to witness Sufi traditions." },
                { day: 5, title: "Day at Leisure / Meditation", desc: "Morning yoga/meditation session by the lake. Day free for personal spiritual activities or shopping for prayer beads/mats." },
                { day: 6, title: "Departure", desc: "Transfer to airport with spiritual rejuvenation." }
            ],
            inclusions: ["Vegetarian Meals", "Temple Permits", "Guide", "Transport"],
            exclusions: ["Donations", "Prasad"]
        },
        {
            slug: "budget-backpackers-kashmir",
            title: "Budget Backpackers Kashmir",
            duration: "5 Nights / 6 Days",
            startingPrice: 9999,
            image: "/Budget%20Backpackers%20Kashmir/Budget%20Backpackers%20Kashmir%20(1).jpeg",
            gallery: [
                "/Budget%20Backpackers%20Kashmir/Budget%20Backpackers%20Kashmir%20(1).jpeg",
                "/Budget%20Backpackers%20Kashmir/Budget%20Backpackers%20Kashmir%20(2).jpeg",
                "/Budget%20Backpackers%20Kashmir/Budget%20Backpackers%20Kashmir%20(3).jpeg",
                "/Budget%20Backpackers%20Kashmir/Budget%20Backpackers%20Kashmir%20(4).jpeg"
            ],
            category: "Budget",
            location: "Srinagar, Pahalgam",
            features: ["Hostels", "Group Travel", "Budget Friendly"],
            overview: "Explore the beauty of Kashmir without burning a hole in your pocket. Stay in cozy hostels, travel in shared groups, and meet like-minded travelers.",
            itinerary: [
                { day: 1, title: "Arrival & Hostel Meetup", desc: "Check into a vibrant backpacker hostel near Dal Lake. Meet fellow travelers. Evening sunset walk along the Boulevard road." },
                { day: 2, title: "Srinagar Heritage Walk", desc: "Guided walking tour of the Old City. Explore the narrow alleys, copper markets, and ancient bridges of Downtown Srinagar. Try local street food (Nadir Monje)." },
                { day: 3, title: "Pahalgam on a Budget", desc: "Take a shared cab to Pahalgam. Hike to Baisaran valley (Mini Switzerland) instead of taking a pony. Picnic lunch in the meadows." },
                { day: 4, title: "Gulmarg Day Trip", desc: "Shared transport to Gulmarg. Spend the day hiking or enjoying the snow. Return to Srinagar hostel for a bonfire and music night." },
                { day: 5, title: "Local Life Experience", desc: "Take a local boat ride (not luxury Shikara) in the interiors of Dal Lake. Visit a local bakery (Kandur) to see fresh bread making." },
                { day: 6, title: "Departure", desc: "Hop on to the airport bus or shared cab for departure." }
            ],
            inclusions: ["Hostel Dorm Bed", "Breakfast", "Shared Transport"],
            exclusions: ["Lunch & Dinner", "Entry Fees"]
        },
        {
            slug: "doodhpathri-day-delight",
            title: "Doodhpathri Day Delight",
            duration: "2 Nights / 3 Days",
            startingPrice: 8500,
            image: "/Doodhpathri%20Day%20Delight/Doodhpathri%20Day%20Delight%20(1).jpeg",
            gallery: [
                "/Doodhpathri%20Day%20Delight/Doodhpathri%20Day%20Delight%20(1).jpeg",
                "/Doodhpathri%20Day%20Delight/Doodhpathri%20Day%20Delight%20(2).jpeg",
                "/Doodhpathri%20Day%20Delight/Doodhpathri%20Day%20Delight%20(3).jpeg",
                "/Doodhpathri%20Day%20Delight/Doodhpathri%20Day%20Delight%20(4).jpeg"
            ],
            category: "Weekend",
            location: "Srinagar, Doodhpathri",
            features: ["Short Trip", "Meadows", "River"],
            overview: "A quick weekend getaway to the 'Valley of Milk' - Doodhpathri. Known for its lush green meadows and crystal clear river, it's a perfect picnic spot.",
            itinerary: [
                { day: 1, title: "Arrival & Leisure", desc: "Arrive in Srinagar. Check-in. Spend the evening relaxing at the hotel or taking a short walk around Dal Lake." },
                { day: 2, title: "Doodhpathri Excursion", desc: "Drive to Doodhpathri (42km). The meadows here are incredibly soft and green. Walk down to the Shaliganga river. Dip your feet in the ice-cold glacial water. Enjoy a riverside picnic lunch. Return to Srinagar." },
                { day: 3, title: "Departure", desc: "Morning Shikara ride to the floating market (optional). Transfer to airport." }
            ],
            inclusions: ["Hotel Stay", "Private Cab", "Meals"],
            exclusions: ["Flights"]
        },
        {
            slug: "yusmarg-hidden-paradise",
            title: "Yusmarg Hidden Paradise",
            duration: "3 Nights / 4 Days",
            startingPrice: 11500,
            image: "/Yusmarg%20Hidden%20Paradise/Yusmarg%20Hidden%20Paradise%20(1).jpeg",
            gallery: [
                "/Yusmarg%20Hidden%20Paradise/Yusmarg%20Hidden%20Paradise%20(1).jpeg",
                "/Yusmarg%20Hidden%20Paradise/Yusmarg%20Hidden%20Paradise%20(2).jpeg",
                "/Yusmarg%20Hidden%20Paradise/Yusmarg%20Hidden%20Paradise%20(3).jpeg"
            ],
            category: "Offbeat",
            location: "Yusmarg, Nilnag",
            features: ["Trekking", "Nature", "Solitude"],
            overview: "Escape the crowds and head to Yusmarg. Hike to the beautiful Nilnag lake and enjoy the raw nature of the Pir Panjal range.",
            itinerary: [
                { day: 1, title: "Arrival in Srinagar", desc: "Welcome to Srinagar. Transfer to hotel/houseboat. Enjoy the evening sunset over the lake." },
                { day: 2, title: "Yusmarg & Nilnag Trek", desc: "Drive to Yusmarg (Meadow of Jesus). It is surrounded by dense forests. Undertake a 4km scenic trek to the blue water Nilnag Lake. Enjoy the absolute silence of the forest." },
                { day: 3, title: "Doodhganga & Charar-e-Sharief", desc: "Visit the Doodhganga river point. On the way back, pay respects at the Charar-e-Sharief shrine, a masterpiece of wooden architecture." },
                { day: 4, title: "Departure", desc: "Transfer to airport with refreshed lungs and mind." }
            ],
            inclusions: ["Accommodation", "Transport", "Breakfast & Dinner"],
            exclusions: ["Pony for trek"]
        },
        {
            slug: "kashmir-great-lakes-trek",
            title: "Kashmir Great Lakes Trek",
            duration: "7 Nights / 8 Days",
            startingPrice: 18500,
            image: "/Kashmir%20Great%20Lakes%20Trek/Kashmir%20Great%20Lakes%20Trek%20(1).jpeg",
            gallery: [
                "/Kashmir%20Great%20Lakes%20Trek/Kashmir%20Great%20Lakes%20Trek%20(1).jpeg",
                "/Kashmir%20Great%20Lakes%20Trek/Kashmir%20Great%20Lakes%20Trek%20(2).jpeg",
                "/Kashmir%20Great%20Lakes%20Trek/Kashmir%20Great%20Lakes%20Trek%20(3).jpeg",
                "/Kashmir%20Great%20Lakes%20Trek/Kashmir%20Great%20Lakes%20Trek%20(4).jpeg",
                "/Kashmir%20Great%20Lakes%20Trek/Kashmir%20Great%20Lakes%20Trek%20(5).jpeg",
                "/Kashmir%20Great%20Lakes%20Trek/Kashmir%20Great%20Lakes%20Trek%20(6).jpeg",
                "/Kashmir%20Great%20Lakes%20Trek/Kashmir%20Great%20Lakes%20Trek%20(7).jpeg"
            ],
            category: "Adventure",
            location: "Sonmarg, Naranag",
            features: ["High Altitude", "Camping", "Trekking"],
            overview: "The most beautiful trek in India. Cross high passes and witness 7 alpine lakes including Vishansar, Krishansar, and Gadsar. Moderate to difficult level.",
            itinerary: [
                { day: 1, title: "Srinagar to Sonmarg Camp", desc: "Drive to Sonmarg (Shitkadi) base camp. Briefing by trek leader and equipment check. Acclimatization walk." },
                { day: 2, title: "Sonmarg to Nichnai", desc: "Trek starts. Ascend through maple and pine forests. Reach Nichnai valley campsite (11,500ft). Overnight in tents." },
                { day: 3, title: "Nichnai to Vishansar Lake", desc: "Cross the Nichnai Pass (13,500ft). Descend into the flower-filled meadows. Camp near the stunning blue Vishansar Lake." },
                { day: 4, title: "Vishansar to Gadsar", desc: "The toughest day. Cross Gadsar Pass (13,800ft), the highest point. See the twin lakes Vishansar and Krishansar from top. Reach Gadsar lake." },
                { day: 5, title: "Gadsar to Satsar", desc: "Easier walk through meadows. Reach Satsar (Seven Lakes) group. Camp near the lakes." },
                { day: 6, title: "Satsar to Gangabal", desc: "Cross Zajibal Pass. Witness the majestic Mount Haramukh and the twin lakes of Gangabal and Nundkol. Camp at Nundkol." },
                { day: 7, title: "Gangabal to Naranag", desc: "Steep descent through pine forests to Naranag village. Drive back to Srinagar hotel. Celebration dinner." },
                { day: 8, title: "Departure", desc: "Fly out with a badge of honor." }
            ],
            inclusions: ["Trek Leader", "Camping Gear", "All Meals on Trek", "Ponies for gear"],
            exclusions: ["Personal Backpack carrying"]
        },
        {
            slug: "tulip-festival-special",
            title: "Tulip Festival Special",
            duration: "3 Nights / 4 Days",
            startingPrice: 13999,
            image: "/Tulip%20Festival%20Special/Tulip%20Festival%20Special%20(1).jpeg",
            gallery: [
                "/Tulip%20Festival%20Special/Tulip%20Festival%20Special%20(1).jpeg",
                "/Tulip%20Festival%20Special/Tulip%20Festival%20Special%20(2).jpeg",
                "/Tulip%20Festival%20Special/Tulip%20Festival%20Special%20(3).jpeg",
                "/Tulip%20Festival%20Special/Tulip%20Festival%20Special%20(4).jpeg",
                "/Tulip%20Festival%20Special/Tulip%20Festival%20Special%20(5).jpeg",
                "/Tulip%20Festival%20Special/Tulip%20Festival%20Special%20(6).jpeg"
            ],
            category: "Seasonal",
            location: "Srinagar",
            features: ["Tulip Garden", "Spring", "Photography"],
            overview: "Limited edition package for the famous Tulip Festival (March-April). See 1.5 million tulips in full bloom at Asia's largest Tulip Garden overlooking Dal Lake.",
            itinerary: [
                { day: 1, title: "Arrival & Spring Vibes", desc: "Arrival in Srinagar. The city is in full bloom with almond and cherry blossoms. Evening Shikara ride to see the Zabarwan range reflection." },
                { day: 2, title: "The Tulip Garden Experience", desc: "Visit the Indira Gandhi Memorial Tulip Garden. Walk through rows of 60+ varieties of tulips. Visit the adjacent Botanical Garden. Evening at Chashme Shahi." },
                { day: 3, title: "Gulmarg Spring Excursion", desc: "Day trip to Gulmarg. In spring, the lower meadows are green with wild flowers while the upper reaches still have snow. Best of both worlds." },
                { day: 4, title: "Departure", desc: "Transfer to airport with colorful memories." }
            ],
            inclusions: ["Garden Entry Tickets", "Hotel", "Transport"],
            exclusions: ["Lunch"]
        },
        {
            slug: "autumn-chinar-tour",
            title: "Autumn Chinar Tour",
            duration: "4 Nights / 5 Days",
            startingPrice: 14500,
            image: "/Autumn%20Chinar%20Tour/Autumn%20Chinar%20Tour%20(1).jpeg",
            gallery: [
                "/Autumn%20Chinar%20Tour/Autumn%20Chinar%20Tour%20(1).jpeg",
                "/Autumn%20Chinar%20Tour/Autumn%20Chinar%20Tour%20(2).jpeg",
                "/Autumn%20Chinar%20Tour/Autumn%20Chinar%20Tour%20(3).jpeg",
                "/Autumn%20Chinar%20Tour/Autumn%20Chinar%20Tour%20(4).jpeg",
                "/Autumn%20Chinar%20Tour/Autumn%20Chinar%20Tour%20(5).jpeg",
                "/Autumn%20Chinar%20Tour/Autumn%20Chinar%20Tour%20(6).jpeg",
                "/Autumn%20Chinar%20Tour/Autumn%20Chinar%20Tour%20(7).jpeg"
            ],
            category: "Seasonal",
            location: "Srinagar, Naseem Bagh",
            features: ["Fall Colors", "Photography", "Chinar"],
            overview: "Witness Kashmir turn into gold during Autumn (October-November). Walk under the majestic Chinar trees at Naseem Bagh and Nishat Garden. A photographer's dream.",
            itinerary: [
                { day: 1, title: "Arrival in Golden Kashmir", desc: "Arrival. The valley welcomes you with crisp air and golden hues. Check-in. Warm up with a cup of Saffron Kahwa." },
                { day: 2, title: "Chinar Walk - Naseem Bagh", desc: "Visit the Kashmir University campus to see Naseem Bagh (Garden of Breeze) with thousands of Chinar trees shedding crimson leaves. Visit Char Chinar island on Dal Lake." },
                { day: 3, title: "Pahalgam Golden Views", desc: "Drive to Pahalgam. The poplar avenues are yellow and the Chinar trees are fiery red. Walk along the Lidder river crunching dry leaves. Great for portrait photography." },
                { day: 4, title: "Srinagar Heritage & Gardens", desc: "Visit Nishat and Shalimar gardens. The rust-colored leaves against the blue sky and Zabarwan mountains create a magical palette." },
                { day: 5, title: "Departure", desc: "Transfer to airport." }
            ],
            inclusions: ["Hotel", "Transport", "Breakfast & Dinner"],
            exclusions: ["Personal Expenses"]
        },
        {
            slug: "ladies-special-retreat",
            title: "Ladies Special Retreat",
            duration: "5 Nights / 6 Days",
            startingPrice: 17999,
            image: "/Ladies%20Special%20Retreat/Ladies%20Special%20Retreat%20(1).jpeg",
            gallery: [
                "/Ladies%20Special%20Retreat/Ladies%20Special%20Retreat%20(1).jpeg",
                "/Ladies%20Special%20Retreat/Ladies%20Special%20Retreat%20(2).jpeg",
                "/Ladies%20Special%20Retreat/Ladies%20Special%20Retreat%20(3).jpeg",
                "/Ladies%20Special%20Retreat/Ladies%20Special%20Retreat%20(4).jpeg",
                "/Ladies%20Special%20Retreat/Ladies%20Special%20Retreat%20(5).jpeg",
                "/Ladies%20Special%20Retreat/Ladies%20Special%20Retreat%20(6).jpeg"
            ],
            category: "Group",
            location: "Srinagar, Gulmarg, Pahalgam",
            features: ["Safe", "Shopping", "Relaxation"],
            overview: "An all-women tour designed for safety, fun, and relaxation. Enjoy shopping for Pashminas, spa sessions, and sightseeing with trusted drivers and guides.",
            itinerary: [
                { day: 1, title: "Girls Trip Begins", desc: "Welcome to Srinagar. Check into a premium houseboat. Welcome drink and tour briefing. Evening Shikara ride with music and fun." },
                { day: 2, title: "Gulmarg Photo Ops", desc: "Day trip to Gulmarg. Capture insta-worthy photos against the snow. Enjoy hot chocolate at a cafe. Optional Gondola ride." },
                { day: 3, title: "Ultimate Shopping Spree", desc: "Visit the best authentic shops for Pashmina Shawls, Papier Mache, and Saffron. Lunch at a chic cafe in Lal Chowk. Evening visit to Polo View market." },
                { day: 4, title: "Pahalgam Picnic", desc: "Drive to Pahalgam. We organize a riverside picnic lunch with mats and baskets at a scenic spot. Relax, chat, and enjoy the nature." },
                { day: 5, title: "Spa & Relax Day", desc: "Morning at leisure. Afternoon pampering session at a luxury spa (Hamam experience). Farewell dinner with live music." },
                { day: 6, title: "Departure", desc: "Transfer to airport with bags full of shopping." }
            ],
            inclusions: ["Safe Transport", "Verified Hotels", "Dinner"],
            exclusions: ["Spa Cost"]
        },
        {
            slug: "photography-tour-kashmir",
            title: "Photography Tour Kashmir",
            duration: "6 Nights / 7 Days",
            startingPrice: 21000,
            image: "/Photography%20Tour%20Kashmir/Photography%20Tour%20Kashmir%20(1).jpeg",
            gallery: [
                "/Photography%20Tour%20Kashmir/Photography%20Tour%20Kashmir%20(1).jpeg",
                "/Photography%20Tour%20Kashmir/Photography%20Tour%20Kashmir%20(2).jpeg",
                "/Photography%20Tour%20Kashmir/Photography%20Tour%20Kashmir%20(3).jpeg",
                "/Photography%20Tour%20Kashmir/Photography%20Tour%20Kashmir%20(4).jpeg",
                "/Photography%20Tour%20Kashmir/Photography%20Tour%20Kashmir%20(5).jpeg",
                "/Photography%20Tour%20Kashmir/Photography%20Tour%20Kashmir%20(6).jpeg"
            ],
            category: "Hobby",
            location: "All Photogenic Spots",
            features: ["Golden Hour", "Local Life", "Landscapes"],
            overview: "Led by local experts, this tour takes you to the best vantage points for sunrise, sunset, and street photography in Kashmir. Capture the soul of the valley.",
            itinerary: [
                { day: 1, title: "Arrival & Blue Hour", desc: "Arrival. Equipment check. Head to boulevard for Blue Hour photography of the lighted houseboats and Shikaras." },
                { day: 2, title: "The Floating Market", desc: "4:00 AM start. Capture the vibrant Floating Vegetable Market action at sunrise. The play of light and shadow on the water is magical." },
                { day: 3, title: "Old City Architecture", desc: "Walk through the heritage alleyways of Downtown. Shoot the intricate wooden architecture, bridges, and candid street portraits of locals." },
                { day: 4, title: "Gulmarg Landscapes", desc: "Capture the vast white expanses and the lonely hut of Gulmarg. Great for minimalism photography." },
                { day: 5, title: "Pahalgam Rural Life", desc: "Focus on rural life. Shoot the Gujjar/Bakarwal shepherds with their flocks, mud houses, and the rushing Lidder river." },
                { day: 6, title: "Wular Lake & Watlab", desc: "Visit Asia's largest fresh water lake. Capture wide landscapes and bird life. Sunset from Watlab hill top." },
                { day: 7, title: "Departure", desc: "Transfer to airport." }
            ],
            inclusions: ["Transport", "Guide", "Stay"],
            exclusions: ["Camera Gear"]
        }
    ];

    for (const pkg of packages) {
        const p = await prisma.package.upsert({
            where: { slug: pkg.slug },
            update: {
                title: pkg.title,
                duration: pkg.duration,
                startingPrice: pkg.startingPrice,
                image: pkg.image,
                gallery: JSON.stringify(pkg.gallery),
                category: pkg.category,
                location: pkg.location,
                features: JSON.stringify(pkg.features),
                overview: pkg.overview,
                itinerary: JSON.stringify(pkg.itinerary),
                inclusions: JSON.stringify(pkg.inclusions),
                exclusions: JSON.stringify(pkg.exclusions),
            },
            create: {
                slug: pkg.slug,
                title: pkg.title,
                duration: pkg.duration,
                startingPrice: pkg.startingPrice,
                image: pkg.image,
                gallery: JSON.stringify(pkg.gallery),
                category: pkg.category,
                location: pkg.location,
                features: JSON.stringify(pkg.features),
                overview: pkg.overview,
                itinerary: JSON.stringify(pkg.itinerary),
                inclusions: JSON.stringify(pkg.inclusions),
                exclusions: JSON.stringify(pkg.exclusions),
            },
        });
        console.log(`Created package with id: ${p.id}`);
    }

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
