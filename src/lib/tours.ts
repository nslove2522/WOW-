export type Difficulty = "Easy" | "Moderate" | "Active";

export type Tour = {
  slug: string;
  title: string;
  location: string;
  region: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  days: number;
  nights: number;
  price: number;
  currency: "INR";
  difficulty: Difficulty;
  groupSize: number;
  seatsLeft: number;
  nextDate: string;
  host: {
    name: string;
    years: number;
    bio: string;
  };
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: { day: number; title: string; detail: string }[];
};

export const tours: Tour[] = [
  {
    slug: "himalaya-sisterhood-trek",
    title: "Himalaya Sisterhood Trek",
    location: "Manali to Kasol, Himachal Pradesh",
    region: "India",
    tagline: "Pine forests, mountain tea, and a small group that actually talks at dinner.",
    description:
      "A week in the western Himalaya designed for women traveling without a companion. Days are paced for first-time trekkers: village walks, a gentle ridge day, and long evenings around a homestay kitchen. Your host, Meera, has led 40+ women-only groups on this route.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Snow-capped Himalayan peaks above a green valley",
    days: 7,
    nights: 6,
    price: 48900,
    currency: "INR",
    difficulty: "Moderate",
    groupSize: 10,
    seatsLeft: 3,
    nextDate: "12 Sep 2026",
    host: {
      name: "Meera Kapoor",
      years: 8,
      bio: "Former schoolteacher from Shimla. Wilderness first-aid certified. Runs slow, well-fed mountain weeks.",
    },
    highlights: [
      "All-women group of 8–10, never mixed",
      "Homestays with local families, not hotels",
      "Guided ridge walk with a local woman porter team",
      "Optional silent morning hike on day 5",
    ],
    inclusions: [
      "All stays and meals",
      "Local transport from Manali",
      "Certified women trek leads",
      "First-aid kit and emergency satellite messenger",
    ],
    exclusions: ["Flights to Bhuntar / Chandigarh", "Personal gear rental", "Travel insurance"],
    itinerary: [
      { day: 1, title: "Arrive Manali", detail: "Meet the group at 4pm. Safety briefing, kit check, shared dinner." },
      { day: 2, title: "Village trail to Jana", detail: "Easy 8 km walk through apple orchards. Homestay night." },
      { day: 3, title: "Waterfall day", detail: "Picnic lunch, swimming hole, rest afternoon." },
      { day: 4, title: "Ridge day", detail: "The biggest walk of the week. Packed lunch, early dinner." },
      { day: 5, title: "Kasol valley", detail: "Transfer, riverside walk, optional café afternoon." },
      { day: 6, title: "Free day", detail: "Journaling circle in the morning, spa or market in town." },
      { day: 7, title: "Depart", detail: "Breakfast and shared taxis to Bhuntar airport." },
    ],
  },
  {
    slug: "kerala-backwater-pause",
    title: "Kerala Backwater Pause",
    location: "Alleppey & Munnar",
    region: "India",
    tagline: "Houseboat mornings, tea-hill evenings, and nobody asking why you came alone.",
    description:
      "A slower South India week for women who want company without a packed itinerary. Two nights on a private houseboat with an all-women crew, then a tea-estate bungalow in Munnar. Cooking class, Ayurvedic consult, and a lot of sitting still.",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Houseboat on a Kerala backwater at dusk",
    days: 6,
    nights: 5,
    price: 56400,
    currency: "INR",
    difficulty: "Easy",
    groupSize: 8,
    seatsLeft: 5,
    nextDate: "3 Oct 2026",
    host: {
      name: "Anjali Menon",
      years: 11,
      bio: "Kochi-based host. Trains local women as boat crew and estate guides.",
    },
    highlights: [
      "Private houseboat, women crew only",
      "Ayurvedic consult included",
      "Tea-estate bungalow with a shared kitchen",
      "No forced “team building” — you can opt out of any activity",
    ],
    inclusions: [
      "Stays, most meals, airport pickup from COK",
      "Houseboat charter",
      "Cooking class",
      "Estate walk with local guide",
    ],
    exclusions: ["International flights", "Spa treatments beyond the consult", "Alcohol"],
    itinerary: [
      { day: 1, title: "Kochi to Alleppey", detail: "Pickup, board the boat, sunset on the lake." },
      { day: 2, title: "Backwaters", detail: "Village stop, lunch on deck, night on the water." },
      { day: 3, title: "Transfer to Munnar", detail: "Hill drive, check into the bungalow." },
      { day: 4, title: "Tea hills", detail: "Morning walk, afternoon free." },
      { day: 5, title: "Kitchen day", detail: "Syrian-Christian cooking class, closing circle." },
      { day: 6, title: "Depart Kochi", detail: "Drop at COK by 2pm." },
    ],
  },
  {
    slug: "rajasthan-desert-circle",
    title: "Rajasthan Desert Circle",
    location: "Jaipur, Jodhpur, Jaisalmer",
    region: "India",
    tagline: "Forts, night trains, and a dune camp with only women on the guest list.",
    description:
      "Nine days across Rajasthan with a women-only coach and a women-run desert camp. You will share rooms in havelis, ride a night train once, and sleep under the Thar sky. Built for first-time solo travelers who still want a lock on the door and a host who knows the neighborhood.",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145f127a48?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Amber Fort walls in Jaipur at golden hour",
    days: 9,
    nights: 8,
    price: 72500,
    currency: "INR",
    difficulty: "Easy",
    groupSize: 12,
    seatsLeft: 4,
    nextDate: "18 Nov 2026",
    host: {
      name: "Pooja Rathore",
      years: 9,
      bio: "Jodhpur native. Runs a women-led camp outside Jaisalmer with local craftswomen.",
    },
    highlights: [
      "Women-run dune camp, private tents",
      "Haveli stays in Jaipur and Jodhpur",
      "Craft workshop with a block-print collective",
      "Night train in a reserved women-only cabin",
    ],
    inclusions: [
      "All stays and breakfasts, most dinners",
      "AC coach and one night train",
      "Monument tickets listed in the itinerary",
      "Camp and city hosts",
    ],
    exclusions: ["Flights into Jaipur", "Lunches in cities", "Camel safari add-on"],
    itinerary: [
      { day: 1, title: "Jaipur", detail: "Haveli check-in, welcome dinner on the roof." },
      { day: 2, title: "Forts", detail: "Amber and the old city with a local historian." },
      { day: 3, title: "Night train", detail: "Free morning, evening train to Jodhpur." },
      { day: 4, title: "Blue city", detail: "Walking tour, Mehrangarh from below." },
      { day: 5, title: "Drive to Jaisalmer", detail: "Arrive at the camp before sunset." },
      { day: 6, title: "Desert", detail: "Dune walk, folk music, campfire (optional)." },
      { day: 7, title: "Fort town", detail: "Jaisalmer fort and a craft workshop." },
      { day: 8, title: "Return Jaipur", detail: "Flight or coach, closing dinner." },
      { day: 9, title: "Depart", detail: "Airport drop." },
    ],
  },
  {
    slug: "bali-coast-circle",
    title: "Bali Coast Circle",
    location: "Ubud & Amed, Indonesia",
    region: "Southeast Asia",
    tagline: "Temples at dawn, a quiet east-coast bay, and a group that does not perform wellness.",
    description:
      "Ten days split between a family compound in Ubud and a small inn on the Amed coast. Yoga is optional. Snorkeling is optional. Showing up to dinner is the only real commitment. Hosted by Lina, who has been bringing women groups to the same two properties for six years.",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Balinese temple gates with tropical greenery",
    days: 10,
    nights: 9,
    price: 118000,
    currency: "INR",
    difficulty: "Easy",
    groupSize: 10,
    seatsLeft: 2,
    nextDate: "8 Jan 2027",
    host: {
      name: "Lina Putri",
      years: 6,
      bio: "Ubud-based. Keeps the same two properties so the staff already know the group rhythm.",
    },
    highlights: [
      "Family compound, not a resort",
      "Optional dawn temple visit",
      "East-coast snorkeling with a woman skipper",
      "Shared rooms by default; private room upgrade available at checkout",
    ],
    inclusions: [
      "Stays and breakfasts",
      "Airport transfer DPS",
      "Two hosted dinners",
      "One boat morning",
    ],
    exclusions: ["International flights", "Visa on arrival", "Most lunches and dinners"],
    itinerary: [
      { day: 1, title: "Arrive Ubud", detail: "Pickup, rest, welcome dinner." },
      { day: 2, title: "Rice terraces", detail: "Slow walk, afternoon free." },
      { day: 3, title: "Temple morning", detail: "Optional 5:30am visit, rest of day open." },
      { day: 4, title: "Studio day", detail: "Silver or batik workshop." },
      { day: 5, title: "Drive to Amed", detail: "Coast check-in, sunset on the wall." },
      { day: 6, title: "Boat", detail: "Snorkel the wreck, lunch on the beach." },
      { day: 7, title: "Free", detail: "Read, swim, or hike to a viewpoint." },
      { day: 8, title: "Free", detail: "Same." },
      { day: 9, title: "Return Ubud", detail: "Closing dinner." },
      { day: 10, title: "Depart", detail: "DPS drop." },
    ],
  },
  {
    slug: "kyoto-autumn-walk",
    title: "Kyoto Autumn Walk",
    location: "Kyoto & Nara, Japan",
    region: "East Asia",
    tagline: "Temple gardens, a women-only ryokan wing, and trains you will not have to figure out alone.",
    description:
      "Eight days in Kyoto when the maples turn. You stay in a ryokan that reserves a wing for our groups. Days mix hosted temple walks with free afternoons. English and Japanese speaking host. Built for women who want Japan without the logistics homework.",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Kyoto temple pagoda among autumn maple trees",
    days: 8,
    nights: 7,
    price: 189000,
    currency: "INR",
    difficulty: "Easy",
    groupSize: 8,
    seatsLeft: 6,
    nextDate: "2 Nov 2026",
    host: {
      name: "Yuki Tanaka",
      years: 12,
      bio: "Kyoto resident. Former museum educator. Speaks English, Japanese, and slow.",
    },
    highlights: [
      "Ryokan wing reserved for the group",
      "IC cards and train legs handled",
      "Nara day with a picnic, not a checklist",
      "One kaiseki dinner included",
    ],
    inclusions: [
      "Ryokan with breakfasts",
      "IC transit card loaded for the week",
      "Hosted temple walks",
      "Nara day tickets",
    ],
    exclusions: ["Flights", "JR Pass", "Most dinners"],
    itinerary: [
      { day: 1, title: "Arrive Kyoto", detail: "Station pickup, ryokan briefing." },
      { day: 2, title: "Higashiyama", detail: "Morning walk, afternoon free." },
      { day: 3, title: "Arashiyama", detail: "Bamboo grove early, before the buses." },
      { day: 4, title: "Free", detail: "Host on call, no itinerary." },
      { day: 5, title: "Nara", detail: "Day trip, picnic, back by dinner." },
      { day: 6, title: "Fushimi", detail: "Optional dawn gates, kaiseki at night." },
      { day: 7, title: "Free", detail: "Shopping or baths." },
      { day: 8, title: "Depart", detail: "Station drop for KIX or ITM trains." },
    ],
  },
  {
    slug: "atlas-and-medina",
    title: "Atlas & Medina",
    location: "Marrakech & Imlil, Morocco",
    region: "North Africa",
    tagline: "A riad with a lock on the street door, then a mountain village with other women on the path.",
    description:
      "A week that starts in a women-owned riad in the medina and ends in Imlil with a village stay. You will walk the souks with a local woman guide, cook one night, and take a moderate mountain day. Groups are capped at eight. Host Nadia lives in Marrakech year-round.",
    image:
      "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Moroccan riad courtyard with mosaic tiles",
    days: 7,
    nights: 6,
    price: 142000,
    currency: "INR",
    difficulty: "Moderate",
    groupSize: 8,
    seatsLeft: 1,
    nextDate: "21 Mar 2027",
    host: {
      name: "Nadia El Fassi",
      years: 10,
      bio: "Marrakech host. Works with a mountain women’s cooperative in Imlil for village stays.",
    },
    highlights: [
      "Women-owned riad, street door locked at night",
      "Medina walking with a woman guide",
      "Village stay with a cooperative, not a hotel",
      "One moderate Atlas day, optional shorter route",
    ],
    inclusions: [
      "Stays and most meals",
      "Airport transfer RAK",
      "Guides and village hosts",
      "Cooking night",
    ],
    exclusions: ["Flights", "Travel insurance", "Souvenirs and hammam extras"],
    itinerary: [
      { day: 1, title: "Riad", detail: "Pickup, rest, rooftop dinner." },
      { day: 2, title: "Medina", detail: "Guided morning, free afternoon." },
      { day: 3, title: "Cook", detail: "Market shop and kitchen night." },
      { day: 4, title: "To Imlil", detail: "Mountain transfer, village welcome." },
      { day: 5, title: "Atlas day", detail: "Walk with a local woman guide, shorter option available." },
      { day: 6, title: "Return Marrakech", detail: "Closing dinner in the riad." },
      { day: 7, title: "Depart", detail: "RAK drop." },
    ],
  },
];

export function getTour(slug: string) {
  return tours.find((tour) => tour.slug === slug);
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
