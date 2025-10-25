// src/data/sampleData.ts
// Lightweight seed data — no UI changes. Nashik prioritized.

export type SampleTurf = {
  id: string;
  name: string;
  area: string;
  city: string;
  state?: string;
  rating: number;
  price_per_hour: number; // INR
  images: string[];
  amenities: string[];
  sport_names: string[]; // readable names, the UI already understands this
  is_active?: boolean;
};

export type SampleSport = { id: string; name: string };

const u = (query: string) =>
  `https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=60&ixlib=rb-4.0.3&query=${encodeURIComponent(
    query
  )}`;

export const sampleSports: SampleSport[] = [
  { id: 'FOOTBALL', name: 'Football' },
  { id: 'CRICKET', name: 'Cricket' },
  { id: 'BADMINTON', name: 'Badminton' },
  { id: 'TENNIS', name: 'Tennis' },
  { id: 'BASKETBALL', name: 'Basketball' },
];

export const sampleTurfs: SampleTurf[] = [
  // --- Nashik (priority) ---
  {
    id: 'n1',
    name: 'GreenPitch Arena Nashik',
    area: 'College Road',
    city: 'Nashik',
    state: 'Maharashtra',
    rating: 4.7,
    price_per_hour: 800,
    images: [
      'https://images.unsplash.com/photo-1599058917212-d750089bc07c?auto=format&fit=crop&w=1200&q=60',
      'https://images.unsplash.com/photo-1528291151373-706c4bbf35cf?auto=format&fit=crop&w=1200&q=60',
      'https://images.unsplash.com/photo-1530549387789-4c1017266637?auto=format&fit=crop&w=1200&q=60',
    ],
    amenities: ['Parking', 'Changing Room', 'Drinking Water'],
    sport_names: ['Football', 'Cricket'],
    is_active: true,
  },
  {
    id: 'n2',
    name: 'City Sports Hub Nashik',
    area: 'Gangapur Road',
    city: 'Nashik',
    state: 'Maharashtra',
    rating: 4.6,
    price_per_hour: 650,
    images: [
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=60',
      'https://images.unsplash.com/photo-1521417531039-94c5c4f2ab1a?auto=format&fit=crop&w=1200&q=60',
    ],
    amenities: ['Parking', 'Drinking Water'],
    sport_names: ['Badminton', 'Tennis'],
    is_active: true,
  },
  {
    id: 'n3',
    name: 'Metro Arena Nashik',
    area: 'Indira Nagar',
    city: 'Nashik',
    state: 'Maharashtra',
    rating: 4.8,
    price_per_hour: 1000,
    images: [
      'https://images.unsplash.com/photo-1487956382158-bb926046304a?auto=format&fit=crop&w=1200&q=60',
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=60',
    ],
    amenities: ['Parking', 'Changing Room', 'Cafeteria'],
    sport_names: ['Basketball', 'Football'],
    is_active: true,
  },

  // --- Mumbai ---
  {
    id: 'm1',
    name: 'Andheri Turf Park',
    area: 'Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    rating: 4.7,
    price_per_hour: 1200,
    images: [
      'https://images.unsplash.com/photo-1530549387789-4c1017266637?auto=format&fit=crop&w=1200&q=60',
      u('football mumbai'),
    ],
    amenities: ['Parking', 'Lockers'],
    sport_names: ['Football'],
    is_active: true,
  },
  {
    id: 'm2',
    name: 'Marine Drive Courts',
    area: 'Marine Drive',
    city: 'Mumbai',
    state: 'Maharashtra',
    rating: 4.5,
    price_per_hour: 900,
    images: [
      'https://images.unsplash.com/photo-1587383693061-53b5f1a59c83?auto=format&fit=crop&w=1200&q=60',
      u('tennis court mumbai'),
    ],
    amenities: ['Changing Room', 'Drinking Water'],
    sport_names: ['Tennis', 'Badminton'],
    is_active: true,
  },

  // --- Pune ---
  {
    id: 'p1',
    name: 'Shivajinagar Sports Complex',
    area: 'Shivajinagar',
    city: 'Pune',
    state: 'Maharashtra',
    rating: 4.6,
    price_per_hour: 700,
    images: [
      'https://images.unsplash.com/photo-1542144582-1ba00456b5a4?auto=format&fit=crop&w=1200&q=60',
      u('badminton indoor india'),
    ],
    amenities: ['Parking', 'Cafeteria'],
    sport_names: ['Badminton', 'Basketball'],
    is_active: true,
  },
  {
    id: 'p2',
    name: 'Kalyani Nagar Arena',
    area: 'Kalyani Nagar',
    city: 'Pune',
    state: 'Maharashtra',
    rating: 4.3,
    price_per_hour: 600,
    images: [
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=60',
      u('cricket turf pune'),
    ],
    amenities: ['Drinking Water'],
    sport_names: ['Cricket'],
    is_active: true,
  },

  // --- Delhi ---
  {
    id: 'd1',
    name: 'Capital Sports Arena',
    area: 'Dwarka',
    city: 'Delhi',
    state: 'Delhi',
    rating: 4.5,
    price_per_hour: 950,
    images: [
      'https://images.unsplash.com/photo-1521417531039-94c5c4f2ab1a?auto=format&fit=crop&w=1200&q=60',
      u('football delhi night'),
    ],
    amenities: ['Parking', 'Changing Room'],
    sport_names: ['Football', 'Basketball'],
    is_active: true,
  },
  {
    id: 'd2',
    name: 'Green Park Courts',
    area: 'Green Park',
    city: 'Delhi',
    state: 'Delhi',
    rating: 4.4,
    price_per_hour: 800,
    images: [
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=60',
      u('tennis delhi'),
    ],
    amenities: ['Lockers', 'Drinking Water'],
    sport_names: ['Tennis'],
    is_active: true,
  },

  // --- Bengaluru ---
  {
    id: 'b1',
    name: 'Koramangala Sports Hub',
    area: 'Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    rating: 4.6,
    price_per_hour: 850,
    images: [
      'https://images.unsplash.com/photo-1521417531039-94c5c4f2ab1a?auto=format&fit=crop&w=1200&q=60',
      u('badminton bengaluru indoor'),
    ],
    amenities: ['Parking', 'Cafeteria'],
    sport_names: ['Badminton', 'Cricket'],
    is_active: true,
  },
  {
    id: 'b2',
    name: 'Whitefield Courts',
    area: 'Whitefield',
    city: 'Bengaluru',
    state: 'Karnataka',
    rating: 4.2,
    price_per_hour: 650,
    images: [
      'https://images.unsplash.com/photo-1542144582-1ba00456b5a4?auto=format&fit=crop&w=1200&q=60',
      u('basketball court india'),
    ],
    amenities: ['Changing Room', 'Drinking Water'],
    sport_names: ['Basketball'],
    is_active: true,
  },

  // --- Hyderabad ---
  {
    id: 'h1',
    name: 'Gachibowli Arena',
    area: 'Gachibowli',
    city: 'Hyderabad',
    state: 'Telangana',
    rating: 4.5,
    price_per_hour: 700,
    images: [
      'https://images.unsplash.com/photo-1530549387789-4c1017266637?auto=format&fit=crop&w=1200&q=60',
      u('football turf hyderabad'),
    ],
    amenities: ['Parking', 'Lockers'],
    sport_names: ['Football'],
    is_active: true,
  },
  {
    id: 'h2',
    name: 'Kukatpally Sports Club',
    area: 'Kukatpally',
    city: 'Hyderabad',
    state: 'Telangana',
    rating: 4.3,
    price_per_hour: 600,
    images: [
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=60',
      u('cricket hyderabad box'),
    ],
    amenities: ['Drinking Water'],
    sport_names: ['Cricket', 'Badminton'],
    is_active: true,
  },

  // --- Chennai ---
  {
    id: 'c1',
    name: 'Adyar Courts',
    area: 'Adyar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    rating: 4.4,
    price_per_hour: 700,
    images: [
      'https://images.unsplash.com/photo-1587383693061-53b5f1a59c83?auto=format&fit=crop&w=1200&q=60',
      u('tennis chennai'),
    ],
    amenities: ['Parking', 'Changing Room'],
    sport_names: ['Tennis'],
    is_active: true,
  },

  // --- Kolkata ---
  {
    id: 'k1',
    name: 'Salt Lake Sports Arena',
    area: 'Salt Lake',
    city: 'Kolkata',
    state: 'West Bengal',
    rating: 4.5,
    price_per_hour: 750,
    images: [
      'https://images.unsplash.com/photo-1521417531039-94c5c4f2ab1a?auto=format&fit=crop&w=1200&q=60',
      u('badminton kolkata'),
    ],
    amenities: ['Parking', 'Cafeteria'],
    sport_names: ['Badminton', 'Football'],
    is_active: true,
  },
];
