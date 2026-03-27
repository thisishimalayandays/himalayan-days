import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Premium Spring Package...');

  const springPackage = await prisma.package.upsert({
    where: { slug: 'kashmir-spring-symphony' },
    update: {},
    create: {
      title: 'The Ultimate Kashmir Spring Symphony',
      slug: 'kashmir-spring-symphony',
      startingPrice: 18500,
      priceRange: '₹18,500 - ₹24,000',
      duration: '6 Days / 5 Nights',
      category: 'Spring Special',
      location: 'Srinagar, Gulmarg, Pahalgam',
      image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=2070&auto=format&fit=crop', // Beautiful Tulip/Spring vibe placeholder
      rating: 4.9,
      reviews: 128,
      overview: 'Experience the magic of Kashmir during its most spectacular season. This premium 6-day journey is perfectly crafted for couples and families wanting to witness the world-famous Indira Gandhi Memorial Tulip Garden in full bloom, alongside the snow-capped peaks of Gulmarg and the pristine valleys of Pahalgam. A perfect blend of romance, nature, and luxury.',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=2070&auto=format&fit=crop', // Tulips
        'https://images.unsplash.com/photo-1566837945700-3005fea3f527?q=80&w=2070&auto=format&fit=crop', // Dal Lake Shikara
        'https://images.unsplash.com/photo-1610412886756-31f0a28f15e8?q=80&w=2070&auto=format&fit=crop', // Pahalgam River
        'https://images.unsplash.com/photo-1605648873400-d830f3242e88?q=80&w=2070&auto=format&fit=crop', // Gulmarg Snow
      ]),
      features: JSON.stringify([
        'Asia\'s Largest Tulip Garden Entry',
        'Premium Houseboat Stay',
        'Romantic Shikara Ride on Dal Lake',
        'Gulmarg Gondola Assistance',
        'Private Luxury Sedan for 6 Days',
        'Welcome Kehwa & Spring Assortments'
      ]),
      itinerary: JSON.stringify([
        {
          day: 1,
          title: 'Arrival & The Floating Paradise',
          desc: 'Arrive at Srinagar Airport where our representative will greet you. Transfer to a premium Houseboat on Dal Lake. In the late afternoon, enjoy a complimentary romantic 1-hour Shikara ride as the sun sets over the Zabarwan range. Dinner and overnight stay at the Houseboat.'
        },
        {
          day: 2,
          title: 'Srinagar Sightseeing & The Great Tulip Festival',
          desc: 'After breakfast, check out and move to your Srinagar hotel. Today is dedicated to the Spring bloom. Visit the breathtaking Indira Gandhi Memorial Tulip Garden (open April), followed by the historic Mughal Gardens: Shalimar Bagh and Nishat Bagh. Evening free for shopping in Lal Chowk. Overnight in Srinagar.'
        },
        {
          day: 3,
          title: 'Excursion to the Meadow of Flowers (Gulmarg)',
          desc: 'A spectacular drive to Gulmarg (the Meadow of Flowers). Experience the famous Gulmarg Gondola ride (Phase 1 & Phase 2 optional) offering panoramic views of the Himalayas. You can also try snow activities or walk around the beautiful meadows. Return to Srinagar for dinner and overnight stay.'
        },
        {
          day: 4,
          title: 'Srinagar to the Valley of Shepherds (Pahalgam)',
          desc: 'After breakfast, drive to Pahalgam. En route, visit the vibrant Saffron fields of Pampore and the historic Awantipora ruins. Check into your premium hotel situated by the soothing Lidder River. Spend the evening relaxing by the pine forests. Overnight in Pahalgam.'
        },
        {
          day: 5,
          title: 'Exploring Pahalgam\'s Hidden Gems',
          desc: 'A completely free day to explore the magnificent valleys of Pahalgam. Hire a local union cab or ponies to visit the magical Betaab Valley, Aru Valley, and Chandanwari. The spring weather here is incredibly serene. Return to your hotel for dinner and an overnight stay.'
        },
        {
          day: 6,
          title: 'Departure with Spring Memories',
          desc: 'After a hearty breakfast, pack your bags with unforgettable memories of Kashmir Spring. Our driver will drop you at Srinagar International Airport for your onward journey.'
        }
      ]),
      inclusions: JSON.stringify([
        '5 Nights premium accommodation (1 Night Houseboat, 2 Nights Srinagar, 2 Nights Pahalgam)',
        'Daily Buffet Breakfast and Dinner (MAP Meal Plan)',
        'Exclusive AC Sedan/SUV for all days as per itinerary',
        '1-hour Shikara Ride on Dal Lake',
        'Airport pickup and drop-off',
        'All toll taxes, parking fees, and driver allowances',
        '24/7 on-ground trip assistance'
      ]),
      exclusions: JSON.stringify([
        'Gondola tickets in Gulmarg (can be pre-booked on request)',
        'Aru, Betaab & Chandanwari cabs (Pahalgam union cabs required)',
        'Pony rides or ATV rentals',
        'Flight or train tickets',
        'Tulip Garden entry fee (approx ₹70 per person)',
        'Personal expenses and tips'
      ])
    }
  });

  console.log('Seeded successfully:', springPackage.title);
}

main()
  .catch((e) => {
    console.error('Error seeding package:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
