export type Turf = {
  id: string;
  name: string;
  sport: "Football"|"Cricket"|"Badminton"|"Tennis"|"Basketball";
  city: "Mumbai"|"Delhi"|"Bengaluru"|"Chennai"|"Hyderabad"|"Kolkata"|"Nashik";
  address: string;
  availability: string;
  rating: number;
  price_per_hour: number;
  description: string;
  images: string[];
};

export const seedSports = ["Football","Cricket","Badminton","Tennis","Basketball"];
export const seedCities  = ["Mumbai","Delhi","Bengaluru","Chennai","Hyderabad","Kolkata","Nashik"];

const U = (q:string) =>
  `https://images.unsplash.com/photo-1558980664-10b2d2ebf61b?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&auto=compress&cs=tinysrgb&fm=jpg`;

export const seedTurfs: Turf[] = [
  // --- Football (Nashik focus + metros)
  {
    id: "nashik-fb-01",
    name: "GreenPitch Arena",
    sport: "Football",
    city: "Nashik",
    address: "College Road, Nashik",
    availability: "Mon–Sun, 6AM–11PM",
    rating: 4.7,
    price_per_hour: 900,
    description: "Premium 5-a-side football turf with floodlights and lockers.",
    images: [
      "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522770179533-24471fcdba45?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "nashik-fb-02",
    name: "CitySport Nashik",
    sport: "Football",
    city: "Nashik",
    address: "CIDCO, Nashik",
    availability: "Mon–Sun, 6AM–10PM",
    rating: 4.6,
    price_per_hour: 750,
    description: "Soft turf, great ball roll, perfect for evening games under LED lights.",
    images: [
      "https://images.unsplash.com/photo-1486286701208-1d58e9338013?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509023914279-9f37f2f5c2f4?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "mumbai-fb-01",
    name: "Andheri Rovers",
    sport: "Football",
    city: "Mumbai",
    address: "Andheri West, Mumbai",
    availability: "Mon–Sun, 6AM–11PM",
    rating: 4.8,
    price_per_hour: 1500,
    description: "Full-size floodlit turf, locker rooms and showers.",
    images: [
      "https://images.unsplash.com/photo-1521417531210-86b1d3b09558?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "bengaluru-fb-01",
    name: "Koramangala Kicks",
    sport: "Football",
    city: "Bengaluru",
    address: "Koramangala 5th Block",
    availability: "Mon–Sun, 5AM–11PM",
    rating: 4.6,
    price_per_hour: 1100,
    description: "5v5 & 7v7 pitches; perfect evening atmosphere.",
    images: [
      "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504215680853-026ed2a45def?q=80&w=1200&auto=format&fit=crop"
    ]
  },

  // --- Cricket
  {
    id: "mumbai-cr-01",
    name: "Wicket Works",
    sport: "Cricket",
    city: "Mumbai",
    address: "Andheri West",
    availability: "Mon–Sun, 6AM–10PM",
    rating: 4.6,
    price_per_hour: 1200,
    description: "Box cricket arena with nets, bowling machine and LED lighting.",
    images: [
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "delhi-cr-01",
    name: "Capital Crease",
    sport: "Cricket",
    city: "Delhi",
    address: "Dwarka Sector 12",
    availability: "Mon–Sun, 5AM–10PM",
    rating: 4.5,
    price_per_hour: 900,
    description: "Synthetic wicket, net practice and practice lanes.",
    images: [
      "https://images.unsplash.com/photo-1559657692-6ebd8aa9f3d5?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594471922173-2383b5c7f2f9?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "nashik-cr-01",
    name: "Nashik Box Cricket",
    sport: "Cricket",
    city: "Nashik",
    address: "Gangapur Road",
    availability: "Mon–Sun, 6AM–11PM",
    rating: 4.7,
    price_per_hour: 800,
    description: "Popular box cricket ground with turf wickets.",
    images: [
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598899134739-24b3c52e3a1a?q=80&w=1200&auto=format&fit=crop"
    ]
  },

  // --- Badminton
  {
    id: "delhi-bd-01",
    name: "Feather Court Delhi",
    sport: "Badminton",
    city: "Delhi",
    address: "Rohini Sec 3",
    availability: "Mon–Sun, 5AM–10PM",
    rating: 4.6,
    price_per_hour: 600,
    description: "Indoor wooden courts, Yonex nets and LED lights.",
    images: [
      "https://images.unsplash.com/photo-1509475826633-fed577a2c71b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544717302-9cdcb1f5941c?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "bengaluru-bd-01",
    name: "Shuttle Hub BLR",
    sport: "Badminton",
    city: "Bengaluru",
    address: "HSR Layout",
    availability: "Mon–Sun, 6AM–11PM",
    rating: 4.8,
    price_per_hour: 700,
    description: "Air-conditioned indoor arena with premium flooring.",
    images: [
      "https://images.unsplash.com/photo-1521417531210-86b1d3b09558?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544717302-9cdcb1f5941c?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "nashik-bd-01",
    name: "Nashik Smashers",
    sport: "Badminton",
    city: "Nashik",
    address: "Panchavati",
    availability: "Mon–Sun, 6AM–10PM",
    rating: 4.5,
    price_per_hour: 500,
    description: "Indoor courts with coaching for beginners.",
    images: [
      "https://images.unsplash.com/photo-1509475826633-fed577a2c71b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544717302-9cdcb1f5941c?q=80&w=1200&auto=format&fit=crop"
    ]
  },

  // --- Tennis
  {
    id: "chennai-tn-01",
    name: "Marina Aces",
    sport: "Tennis",
    city: "Chennai",
    address: "Adyar",
    availability: "Mon–Sun, 6AM–10PM",
    rating: 4.6,
    price_per_hour: 900,
    description: "Synthetic courts with night lighting and coaching.",
    images: [
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542144582-1ba00456b5d5?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "hyderabad-tn-01",
    name: "Hyderabad Baseliners",
    sport: "Tennis",
    city: "Hyderabad",
    address: "Gachibowli",
    availability: "Mon–Sun, 5AM–10PM",
    rating: 4.7,
    price_per_hour: 1000,
    description: "Acrylic surface with pro coaching sessions.",
    images: [
      "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop"
    ]
  },

  // --- Basketball
  {
    id: "kolkata-bk-01",
    name: "Hoop Central",
    sport: "Basketball",
    city: "Kolkata",
    address: "Salt Lake",
    availability: "Mon–Sun, 6AM–10PM",
    rating: 4.6,
    price_per_hour: 700,
    description: "Outdoor court with fiberglass boards and floodlights.",
    images: [
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519861155730-0b5fbf0b6cf7?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  {
    id: "mumbai-bk-01",
    name: "Bandra Buckets",
    sport: "Basketball",
    city: "Mumbai",
    address: "Bandra",
    availability: "Mon–Sun, 6AM–11PM",
    rating: 4.7,
    price_per_hour: 1200,
    description: "Full-size surface with locker rooms and café.",
    images: [
      "https://images.unsplash.com/photo-1519861155730-0b5fbf0b6cf7?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop"
    ]
  }
];
