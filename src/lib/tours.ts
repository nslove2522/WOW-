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
  gallery?: { src: string; alt: string }[];
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
    slug: "seetharkundu-falls-kollengodu",
    title: "Trip to Seetharkundu Falls, Kollengodu",
    location: "Seetharkundu Falls, Kollengode, Palakkad, Kerala",
    region: "India",
    tagline: "Women only. Strangers today, sisters forever.",
    description:
      "A one-day strangers trip for women. Come solo. Leave with stories, friendships, and memories for life. Waterfalls, viewpoints, and hidden gems around Seetharkundu Falls, Kollengodu — plus many more spots to cover. Detailed itinerary will be shared personally.",
    image: "/tours/seetharkundu-1.jpg",
    imageAlt: "Seetharkundu Falls cascading into a forest river",
    gallery: [
      {
        src: "/tours/seetharkundu-1.jpg",
        alt: "Long-exposure river below Seetharkundu Falls",
      },
      {
        src: "/tours/seetharkundu-2.jpg",
        alt: "Forest pool and waterfall at Seetharkundu",
      },
    ],
    days: 1,
    nights: 0,
    price: 2499,
    currency: "INR",
    difficulty: "Easy",
    groupSize: 12,
    seatsLeft: 8,
    nextDate: "Saturday, 22 August 2026",
    host: {
      name: "Wings of Women",
      years: 1,
      bio: "DM @wings._ofwomen or WhatsApp 9489029797. Limited slots. Itinerary details are shared personally.",
    },
    highlights: [
      "Breathtaking waterfalls",
      "Scenic viewpoints",
      "Hidden gems",
      "New friends, unforgettable memories",
    ],
    inclusions: [
      "One-day hosted trip, women-only roster",
      "Local host on the route",
      "Stops at waterfalls, viewpoints, and hidden spots",
    ],
    exclusions: [
      "Personal meals unless listed when we share the itinerary",
      "Travel to the meeting point",
    ],
    itinerary: [
      {
        day: 1,
        title: "Seetharkundu Falls, Kollengodu",
        detail:
          "One-day escape covering waterfalls, viewpoints, and more. The detailed hour-by-hour plan is shared personally after you book.",
      },
    ],
  },
];

export function getTour(slug: string) {
  return tours.find((tour) => tour.slug === slug);
}

export function formatDuration(tour: Tour) {
  if (tour.days === 1) return "One day trip";
  return `${tour.days} days / ${tour.nights} nights`;
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
