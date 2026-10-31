/**
 * SeatEase API Service
 * 
 * Provides unified access to Seat Booking API:
 * 1. Checks if Java Backend (http://localhost:8080) is live via health probe.
 * 2. If Live Java Backend is running, delegates real HTTP requests to port 8080.
 * 3. If in browser preview / standalone demonstration, executes the Java OOP
 *    BookingService state machine in-memory with localStorage persistence.
 */

import { SeatItem, SEAT_PRICE, generateInitialSeats, validatePassenger } from '../utils/bookingRules';

export interface CustomerData {
  customerId?: number;
  name: string;
  mobile: string;
  email?: string;
}


export interface HomeStayItem {
  id: string;
  name: string;
  tagline: string;
  city: string;
  location: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  stayType: 'Plantation Estate' | 'Heritage Villa' | 'Cozy Cottage' | 'Beachfront Stay' | 'Mountain Bungalow';
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  imageUrl: string;
  amenities: string[];
  hostName: string;
  isSuperhost: boolean;
  transitDistance: string;
  description: string;
}

export interface BookingData {
  bookingId: number;
  pnr: string;
  bookingType?: 'BUS' | 'HOMESTAY';
  customer: CustomerData;
  seatIds: string[];
  totalAmount: number;
  bookingDate: string;
  bookingStatus: 'CONFIRMED' | 'CANCELLED';
  // Bus-specific fields
  busId?: string;
  busName?: string;
  busType?: string;
  from?: string;
  boardingPoint?: string;
  to?: string;
  droppingPoint?: string;
  departureTime?: string;
  arrivalTime?: string;
  journeyDate?: string;
  // Homestay-specific fields
  stayId?: string;
  stayName?: string;
  stayLocation?: string;
  stayImageUrl?: string;
  hostName?: string;
  checkInDate?: string;
  checkOutDate?: string;
  nights?: number;
  guestsCount?: number;
  pricePerNight?: number;
}

export interface BusItem {
  id: string;
  routeId: string;
  operator: string;
  busNumber: string;
  busType: string;
  from: string;
  to: string;
  defaultBoardingPoint: string;
  defaultDroppingPoint: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  distance: string;
  rating: number;
  reviewCount: number;
  pricePerSeat: number;
  amenities: string[];
}

export const CITIES_AND_STOPS: Record<string, string[]> = {
  Bangalore: [
    'Majestic BMTC Hub (Platform 6)',
    'Shantinagar Bus Station',
    'Madiwala Silk Board Junction',
    'Electronic City Toll Gate',
  ],
  Chennai: [
    'Koyambedu CMBT Terminal',
    'Guindy Kathipara Junction',
    'Sriperumbudur Bypass',
    'Tambaram Sanatorium',
  ],
  Mumbai: [
    'Borivali West (Gokul Hotel)',
    'Dadar Central (Asiad Stand)',
    'Vashi Toll Plaza Highway',
    'Sion Circle Highway',
  ],
  Pune: [
    'Wakad Highway Bridge',
    'Swargate ST Bus Stand',
    'Hinjawadi Phase 1 Circle',
    'Shivajinagar Station',
  ],
  Delhi: [
    'Kashmere Gate ISBT (Gate 2)',
    'Dhaula Kuan Metro Interchange',
    'Majnu Ka Tilla Tibetan Hub',
    'Anand Vihar ISBT Terminal',
  ],
  Jaipur: [
    'Sindhi Camp Bus Station',
    '200 Feet Bypass Ajmer Road',
    'Transport Nagar Flyover',
    'Narayan Singh Circle',
  ],
  Hyderabad: [
    'MGBS Imlibun Terminal',
    'Ameerpet Metro Hub',
    'Gachibowli ORR Junction',
    'LB Nagar Ring Road',
  ],
  Vijayawada: [
    'PNBS Central Bus Station',
    'Benz Circle Highway',
    'Ramavarappadu Ring',
    'Gollapudi Bypass',
  ],
};

export interface PopularRoute {
  id: string;
  from: string;
  to: string;
  duration: string;
  distance: string;
  busType: string;
  operator: string;
  rating: number;
  departureTime: string;
  arrivalTime: string;
  pricePerSeat: number;
  amenities: string[];
}

export const POPULAR_ROUTES: PopularRoute[] = [
  {
    id: 'blr-chn',
    from: 'Bangalore',
    to: 'Chennai',
    duration: '5h 30m',
    distance: '346 km',
    busType: 'Volvo Multi-Axle B11R AC Sleeper (2+1)',
    operator: 'SeatEase Prime Voyager',
    rating: 4.9,
    departureTime: '21:30',
    arrivalTime: '03:00',
    pricePerSeat: 150,
    amenities: ['AC', 'Reclining Seats', 'Fast USB-C Charging', 'Free High-Speed Wi-Fi', 'Bottled Water'],
  },
  {
    id: 'mum-pun',
    from: 'Mumbai',
    to: 'Pune',
    duration: '3h 15m',
    distance: '150 km',
    busType: 'Scania Metrolink HD Luxury AC (2+1)',
    operator: 'Express Glide Club',
    rating: 4.8,
    departureTime: '07:00',
    arrivalTime: '10:15',
    pricePerSeat: 150,
    amenities: ['AC', 'Reading Light', 'Blankets', 'Live GPS Tracking', 'Emergency Assistance'],
  },
  {
    id: 'del-jai',
    from: 'Delhi',
    to: 'Jaipur',
    duration: '4h 45m',
    distance: '280 km',
    busType: 'Mercedes-Benz Supercoach Sleeper',
    operator: 'Royal SeatEase Horizon',
    rating: 4.9,
    departureTime: '22:15',
    arrivalTime: '03:00',
    pricePerSeat: 150,
    amenities: ['AC', 'Deep Recliner', 'Snack Pack', 'USB Charging', 'Clean Washroom Onboard'],
  },
  {
    id: 'hyd-vij',
    from: 'Hyderabad',
    to: 'Vijayawada',
    duration: '5h 00m',
    distance: '275 km',
    busType: 'Zero-Emission Electric Sleeper',
    operator: 'EcoEase GreenLine',
    rating: 4.7,
    departureTime: '23:00',
    arrivalTime: '04:00',
    pricePerSeat: 150,
    amenities: ['Silent EV Cabin', 'AC', 'Panoramic Windows', 'Fast Charging', 'Eco-Pledge'],
  },
];

export const SAMPLE_HOMESTAYS: HomeStayItem[] = [
  {
    id: 'hs-coorg-1',
    name: 'Whispering Woods Coffee Estate',
    tagline: 'Private plantation villa nestled in organic Robusta coffee groves',
    city: 'Coorg',
    location: 'Madikeri Hills, Coorg, Karnataka',
    rating: 4.94,
    reviewCount: 142,
    pricePerNight: 3800,
    stayType: 'Plantation Estate',
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3,
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80',
    amenities: ['Plantation Tour', 'Bonfire & BBQ', 'High-Speed Wi-Fi', 'Homecooked Kodava Meals', 'Mountain View', 'Free Parking'],
    hostName: 'Kaveri Nanjappa',
    isSuperhost: true,
    transitDistance: '2.4 km from Madikeri Bus Depot',
    description: 'Wake up to the fresh aroma of blossoming coffee plants and misty hillside sunrises. Featuring heritage wooden architecture, authentic homemade breakfast, and guided spice trails.',
  },
  {
    id: 'hs-ooty-1',
    name: 'Nilgiri Mist Heritage Bungalow',
    tagline: '1920s British colonial cottage with stone fireplace & tea garden vistas',
    city: 'Ooty',
    location: 'Doddabetta Road, Ooty, Tamil Nadu',
    rating: 4.88,
    reviewCount: 98,
    pricePerNight: 4200,
    stayType: 'Mountain Bungalow',
    maxGuests: 5,
    bedrooms: 2,
    bathrooms: 2,
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80',
    amenities: ['Indoor Fireplace', 'Panoramic Tea Vistas', 'Artisanal Breakfast', 'Heated Bedrooms', 'Botanical Garden Access'],
    hostName: 'Dr. Arthur Samuel',
    isSuperhost: true,
    transitDistance: '3.1 km from Ooty Central Bus Stand',
    description: 'A restored colonial gem built with Nilgiri slate and cedar. Enjoy crisp highland air, evening tea tastings, and panoramic views of rolling Eucalyptus hills.',
  },
  {
    id: 'hs-goa-1',
    name: 'Casa Miramar Coastal Haven',
    tagline: 'Portuguese-style beachfront sanctuary steps away from golden sands',
    city: 'Goa',
    location: 'Candolim Beach Road, North Goa',
    rating: 4.92,
    reviewCount: 215,
    pricePerNight: 5500,
    stayType: 'Beachfront Stay',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
    amenities: ['Private Plunge Pool', 'Direct Beach Trail', 'Air Conditioning', 'Fully Equipped Kitchen', 'Outdoor Sun Loungers'],
    hostName: 'Maria D’Souza',
    isSuperhost: true,
    transitDistance: '1.8 km from Mapusa Intercity Hub',
    description: 'Charming Portuguese villa with terracotta tiling, private courtyard garden, and sun-drenched verandas just a 3-minute stroll to the Arabian Sea.',
  },
  {
    id: 'hs-wayanad-1',
    name: 'Silver Oak Rain-Forest Retreat',
    tagline: 'Eco-lodge perched along a whispering mountain stream',
    city: 'Wayanad',
    location: 'Vythiri Rainforest Valley, Wayanad, Kerala',
    rating: 4.86,
    reviewCount: 84,
    pricePerNight: 3400,
    stayType: 'Cozy Cottage',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=900&q=80',
    amenities: ['Natural Stream Pool', 'Organic Kerala Cuisine', 'Bamboo Balcony', 'Wi-Fi', 'Bird Watching Trails'],
    hostName: 'Mathew George',
    isSuperhost: true,
    transitDistance: '4.0 km from Kalpetta Bus Stand',
    description: 'Immerse in lush Western Ghats biodiversity. Handcrafted eco-cottage made with bamboo and local granite, offering soothing sounds of flowing streams and birdsong.',
  },
  {
    id: 'hs-mysore-1',
    name: 'Royal Chamundi Heritage Haveli',
    tagline: 'Regal courtyard mansion with antique teak pillars & courtyard garden',
    city: 'Mysore',
    location: 'Chamundipuram, Mysore, Karnataka',
    rating: 4.90,
    reviewCount: 167,
    pricePerNight: 4600,
    stayType: 'Heritage Villa',
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    amenities: ['Central Courtyard', 'Royal Mysore Thali', 'Yoga & Meditation Deck', 'Fiber Wi-Fi', 'EV Charging Station'],
    hostName: 'Raghunath Rao',
    isSuperhost: true,
    transitDistance: '1.5 km from Mysore Suburban Bus Stand',
    description: 'Step into princely Mysuru heritage. Featuring stone corridors, brass lamps, shaded courtyards, and home-cooked South Indian delicacies.',
  },
  {
    id: 'hs-chik-1',
    name: 'Cloudburst Peak Valley Cottage',
    tagline: 'Rustic cedar cabin overlooking the Mullayanagiri peak crest',
    city: 'Chikmagalur',
    location: 'Mullayanagiri Foothills, Chikmagalur, Karnataka',
    rating: 4.84,
    reviewCount: 76,
    pricePerNight: 3200,
    stayType: 'Cozy Cottage',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=80',
    amenities: ['Stargazing Terrace', 'Campfire Nightly', 'Hot Spring Tubs', 'Arabica Coffee Bar', 'Pet Friendly'],
    hostName: 'Vikram Gowda',
    isSuperhost: false,
    transitDistance: '5.2 km from Chikmagalur KSRTC Terminal',
    description: 'High-altitude peace on the slopes of Karnataka’s tallest peak. Perfect for trekking enthusiasts, quiet weekend escapes, and stargazing beside crackling pine fires.',
  },
  {
    id: 'hs-blr-1',
    name: 'Garden City Terrace Penthouse',
    tagline: 'Minimalist designer loft in leafy Indiranagar with rooftop plunge garden',
    city: 'Bangalore',
    location: '100ft Road, Indiranagar, Bangalore',
    rating: 4.81,
    reviewCount: 194,
    pricePerNight: 2900,
    stayType: 'Cozy Cottage',
    maxGuests: 3,
    bedrooms: 1,
    bathrooms: 1,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
    amenities: ['Ultra-fast Wi-Fi 300Mbps', 'Ergonomic Workstation', 'Rooftop Garden', 'AC', 'Kitchenette'],
    hostName: 'Ananya Sharma',
    isSuperhost: true,
    transitDistance: '3.8 km from Shantinagar Bus Station',
    description: 'Chic urban retreat for digital nomads and transit stopovers. Surrounded by Indiranagar’s premier cafes, metro access, and quiet tree-lined boulevards.',
  },
  {
    id: 'hs-chn-1',
    name: 'Coromandel Bay Heritage Villa',
    tagline: 'Restored Chettinad-style coastal villa with breezy pillared verandahs',
    city: 'Chennai',
    location: 'East Coast Road (ECR), Chennai, Tamil Nadu',
    rating: 4.87,
    reviewCount: 112,
    pricePerNight: 4800,
    stayType: 'Heritage Villa',
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3,
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=900&q=80',
    amenities: ['Swimming Pool', 'Chettinad Cuisine', 'Sea Breeze Verandah', 'AC Bedrooms', 'Lawn & Swing'],
    hostName: 'Senthil Nathan',
    isSuperhost: true,
    transitDistance: '6.5 km from Koyambedu CMBT Hub',
    description: 'Authentic coastal heritage with Athangudi handmade tiles, sculpted teak pillars, and cool ocean breezes along Chennai’s scenic East Coast Road.',
  },
];

export const ALL_AVAILABLE_BUSES: BusItem[] = [
  // Bangalore -> Chennai
  {
    id: 'blr-chn-1',
    routeId: 'blr-chn',
    operator: 'SeatEase Prime Voyager',
    busNumber: 'KA-01-EQ-1001',
    busType: 'Volvo B11R Multi-Axle AC Sleeper (2+1)',
    from: 'Bangalore',
    to: 'Chennai',
    defaultBoardingPoint: 'Majestic BMTC Hub (Platform 6)',
    defaultDroppingPoint: 'Koyambedu CMBT Terminal',
    departureTime: '21:30',
    arrivalTime: '03:00',
    duration: '5h 30m',
    distance: '346 km',
    rating: 4.9,
    reviewCount: 384,
    pricePerSeat: 150,
    amenities: ['AC', 'Reclining Seats', 'Fast USB-C Charging', 'Free Wi-Fi', 'Bottled Water'],
  },
  {
    id: 'blr-chn-2',
    routeId: 'blr-chn',
    operator: 'SeatEase Morning Glider',
    busNumber: 'KA-01-EQ-1002',
    busType: 'Scania Metrolink HD Luxury AC (2+1)',
    from: 'Bangalore',
    to: 'Chennai',
    defaultBoardingPoint: 'Madiwala Silk Board Junction',
    defaultDroppingPoint: 'Guindy Kathipara Junction',
    departureTime: '06:15',
    arrivalTime: '11:45',
    duration: '5h 30m',
    distance: '346 km',
    rating: 4.8,
    reviewCount: 219,
    pricePerSeat: 150,
    amenities: ['AC', 'Reading Light', 'Charging Ports', 'Water Bottle'],
  },
  {
    id: 'blr-chn-3',
    routeId: 'blr-chn',
    operator: 'SeatEase Starlight Club EV',
    busNumber: 'KA-01-EV-8822',
    busType: 'Zero-Emission Electric Ultra-Sleeper (2+1)',
    from: 'Bangalore',
    to: 'Chennai',
    defaultBoardingPoint: 'Shantinagar Bus Station',
    defaultDroppingPoint: 'Koyambedu CMBT Terminal',
    departureTime: '23:15',
    arrivalTime: '04:45',
    duration: '5h 30m',
    distance: '346 km',
    rating: 4.9,
    reviewCount: 412,
    pricePerSeat: 150,
    amenities: ['Silent EV Cabin', 'AC', 'Personal Reading Lamp', 'Clean Pillow & Blanket'],
  },

  // Mumbai -> Pune
  {
    id: 'mum-pun-1',
    routeId: 'mum-pun',
    operator: 'Express Glide Club',
    busNumber: 'MH-02-AB-2041',
    busType: 'Scania Metrolink HD Luxury AC (2+1)',
    from: 'Mumbai',
    to: 'Pune',
    defaultBoardingPoint: 'Borivali West (Gokul Hotel)',
    defaultDroppingPoint: 'Wakad Highway Bridge',
    departureTime: '07:00',
    arrivalTime: '10:15',
    duration: '3h 15m',
    distance: '150 km',
    rating: 4.8,
    reviewCount: 298,
    pricePerSeat: 150,
    amenities: ['AC', 'Reading Light', 'Live GPS Tracking', 'Blankets'],
  },
  {
    id: 'mum-pun-2',
    routeId: 'mum-pun',
    operator: 'SeatEase TwinCity Superfast',
    busNumber: 'MH-04-CR-5544',
    busType: 'Volvo 9600 Multi-Axle Luxury (2+1)',
    from: 'Mumbai',
    to: 'Pune',
    defaultBoardingPoint: 'Dadar Central (Asiad Stand)',
    defaultDroppingPoint: 'Swargate ST Bus Stand',
    departureTime: '14:30',
    arrivalTime: '17:45',
    duration: '3h 15m',
    distance: '150 km',
    rating: 4.9,
    reviewCount: 360,
    pricePerSeat: 150,
    amenities: ['AC', 'USB Charging', 'Water Bottle', 'Comfort Suspension'],
  },
  {
    id: 'mum-pun-3',
    routeId: 'mum-pun',
    operator: 'SeatEase Night Owl Sleeper',
    busNumber: 'MH-01-DD-9011',
    busType: 'Mercedes-Benz Supercoach Sleeper (2+1)',
    from: 'Mumbai',
    to: 'Pune',
    defaultBoardingPoint: 'Vashi Toll Plaza Highway',
    defaultDroppingPoint: 'Hinjawadi Phase 1 Circle',
    departureTime: '22:30',
    arrivalTime: '01:45',
    duration: '3h 15m',
    distance: '150 km',
    rating: 4.7,
    reviewCount: 185,
    pricePerSeat: 150,
    amenities: ['AC', 'Sleeper Berths', 'USB Ports', 'Emergency Assistance'],
  },

  // Delhi -> Jaipur
  {
    id: 'del-jai-1',
    routeId: 'del-jai',
    operator: 'Royal SeatEase Horizon',
    busNumber: 'DL-01-TC-3301',
    busType: 'Mercedes-Benz Supercoach Sleeper (2+1)',
    from: 'Delhi',
    to: 'Jaipur',
    defaultBoardingPoint: 'Kashmere Gate ISBT (Gate 2)',
    defaultDroppingPoint: 'Sindhi Camp Bus Station',
    departureTime: '06:30',
    arrivalTime: '11:15',
    duration: '4h 45m',
    distance: '280 km',
    rating: 4.9,
    reviewCount: 420,
    pricePerSeat: 150,
    amenities: ['AC', 'Deep Recliner', 'Snack Pack', 'USB Charging', 'Clean Washroom Onboard'],
  },
  {
    id: 'del-jai-2',
    routeId: 'del-jai',
    operator: 'Pink City Goldline',
    busNumber: 'RJ-14-EA-7711',
    busType: 'Volvo 9600 AC Sleeper (2+1)',
    from: 'Delhi',
    to: 'Jaipur',
    defaultBoardingPoint: 'Dhaula Kuan Metro Interchange',
    defaultDroppingPoint: '200 Feet Bypass Ajmer Road',
    departureTime: '22:15',
    arrivalTime: '03:00',
    duration: '4h 45m',
    distance: '280 km',
    rating: 4.8,
    reviewCount: 310,
    pricePerSeat: 150,
    amenities: ['AC', 'Personal Lamp', 'Blanket', 'High Speed Wi-Fi'],
  },

  // Hyderabad -> Vijayawada
  {
    id: 'hyd-vij-1',
    routeId: 'hyd-vij',
    operator: 'EcoEase GreenLine EV',
    busNumber: 'TS-09-EV-6060',
    busType: 'Zero-Emission Electric Sleeper (2+1)',
    from: 'Hyderabad',
    to: 'Vijayawada',
    defaultBoardingPoint: 'MGBS Imlibun Terminal',
    defaultDroppingPoint: 'PNBS Central Bus Station',
    departureTime: '23:00',
    arrivalTime: '04:00',
    duration: '5h 00m',
    distance: '275 km',
    rating: 4.8,
    reviewCount: 275,
    pricePerSeat: 150,
    amenities: ['Silent EV Cabin', 'AC', 'Panoramic Windows', 'Fast Charging', 'Eco-Pledge'],
  },
  {
    id: 'hyd-vij-2',
    routeId: 'hyd-vij',
    operator: 'Krishna River Cruiser',
    busNumber: 'AP-16-TX-4499',
    busType: 'Volvo Multi-Axle B11R AC (2+1)',
    from: 'Hyderabad',
    to: 'Vijayawada',
    defaultBoardingPoint: 'Ameerpet Metro Hub',
    defaultDroppingPoint: 'Benz Circle Highway',
    departureTime: '06:00',
    arrivalTime: '11:00',
    duration: '5h 00m',
    distance: '275 km',
    rating: 4.7,
    reviewCount: 195,
    pricePerSeat: 150,
    amenities: ['AC', 'Reclining Seats', 'Water Bottle', 'Live GPS Tracking'],
  },
];

/**
 * Searches for all available buses matching from and to cities.
 * If not in the pre-defined routes, dynamically creates buses with appropriate stops.
 */
export function searchAvailableBuses(fromCity: string, toCity: string): BusItem[] {
  const normFrom = fromCity.trim().toLowerCase();
  const normTo = toCity.trim().toLowerCase();

  const direct = ALL_AVAILABLE_BUSES.filter(
    (b) => b.from.toLowerCase() === normFrom && b.to.toLowerCase() === normTo
  );

  if (direct.length > 0) return direct;

  // Reverse route check or generate dynamic buses for any selected city pair
  const reverse = ALL_AVAILABLE_BUSES.filter(
    (b) => b.from.toLowerCase() === normTo && b.to.toLowerCase() === normFrom
  );

  const fromStops = CITIES_AND_STOPS[fromCity] || [
    `${fromCity} Central Bus Stand`,
    `${fromCity} Highway Toll`,
  ];
  const toStops = CITIES_AND_STOPS[toCity] || [
    `${toCity} Main Bus Station`,
    `${toCity} Ring Road Junction`,
  ];

  if (reverse.length > 0) {
    return reverse.map((b, idx) => ({
      ...b,
      id: `${normFrom.slice(0, 3)}-${normTo.slice(0, 3)}-${idx + 1}`,
      routeId: `${normFrom.slice(0, 3)}-${normTo.slice(0, 3)}`,
      from: fromCity,
      to: toCity,
      defaultBoardingPoint: fromStops[idx % fromStops.length],
      defaultDroppingPoint: toStops[idx % toStops.length],
    }));
  }

  // Generate 3 standard daily buses for any city pair
  return [
    {
      id: `${normFrom.slice(0, 3)}-${normTo.slice(0, 3)}-1`,
      routeId: `${normFrom.slice(0, 3)}-${normTo.slice(0, 3)}`,
      operator: 'SeatEase Prime Voyager',
      busNumber: 'IND-SE-8801',
      busType: 'Volvo B11R Multi-Axle AC Sleeper (2+1)',
      from: fromCity,
      to: toCity,
      defaultBoardingPoint: fromStops[0],
      defaultDroppingPoint: toStops[0],
      departureTime: '21:00',
      arrivalTime: '05:30',
      duration: '8h 30m',
      distance: '480 km',
      rating: 4.9,
      reviewCount: 310,
      pricePerSeat: 150,
      amenities: ['AC', 'Reclining Sleeper', 'USB-C Charging', 'Wi-Fi', 'Bottled Water'],
    },
    {
      id: `${normFrom.slice(0, 3)}-${normTo.slice(0, 3)}-2`,
      routeId: `${normFrom.slice(0, 3)}-${normTo.slice(0, 3)}`,
      operator: 'SeatEase Morning Express',
      busNumber: 'IND-SE-8802',
      busType: 'Scania Metrolink HD Luxury AC (2+1)',
      from: fromCity,
      to: toCity,
      defaultBoardingPoint: fromStops[1] || fromStops[0],
      defaultDroppingPoint: toStops[1] || toStops[0],
      departureTime: '06:30',
      arrivalTime: '15:00',
      duration: '8h 30m',
      distance: '480 km',
      rating: 4.8,
      reviewCount: 215,
      pricePerSeat: 150,
      amenities: ['AC', 'Reading Lamp', 'Live GPS Tracking', 'Snack Pack'],
    },
    {
      id: `${normFrom.slice(0, 3)}-${normTo.slice(0, 3)}-3`,
      routeId: `${normFrom.slice(0, 3)}-${normTo.slice(0, 3)}`,
      operator: 'EcoEase GreenLine EV Sleeper',
      busNumber: 'IND-EV-9903',
      busType: 'Zero-Emission Electric Sleeper (2+1)',
      from: fromCity,
      to: toCity,
      defaultBoardingPoint: fromStops[2] || fromStops[0],
      defaultDroppingPoint: toStops[0],
      departureTime: '22:30',
      arrivalTime: '07:00',
      duration: '8h 30m',
      distance: '480 km',
      rating: 4.9,
      reviewCount: 180,
      pricePerSeat: 150,
      amenities: ['Silent EV Cabin', 'AC', 'Fast USB Charging', 'Clean Bedding'],
    },
  ];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// In-Memory Simulation State with LocalStorage backing
const STORAGE_KEY_SEATS_PREFIX = 'seatease_bus_seats_v3_';
const STORAGE_KEY_GLOBAL_SEATS = 'seatease_seats_v2';
const STORAGE_KEY_BOOKINGS = 'seatease_bookings_v2';
const STORAGE_KEY_CUSTOMERS = 'seatease_customers_v2';

let isLiveBackendAvailable = false;
let backendCheckCompleted = false;

// Seed initial state with ALL 30 seats AVAILABLE (none initially booked)
export function getStoredSeats(busId?: string): SeatItem[] {
  const key = busId ? `${STORAGE_KEY_SEATS_PREFIX}${busId}` : STORAGE_KEY_GLOBAL_SEATS;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not read stored seats:', e);
  }
  const initial = generateInitialSeats();
  // Initially, all seats are AVAILABLE (none are pre-booked)
  saveStoredSeats(initial, busId);
  return initial;
}

export function saveStoredSeats(seats: SeatItem[], busId?: string) {
  const key = busId ? `${STORAGE_KEY_SEATS_PREFIX}${busId}` : STORAGE_KEY_GLOBAL_SEATS;
  try {
    localStorage.setItem(key, JSON.stringify(seats));
    // Also keep global key in sync if busId is default
    if (busId === 'blr-chn-1' || !busId) {
      localStorage.setItem(STORAGE_KEY_GLOBAL_SEATS, JSON.stringify(seats));
    }
  } catch (e) {
    console.warn('Could not save seats:', e);
  }
}

export function getAvailableSeatsForBus(busId?: string): number {
  const seats = getStoredSeats(busId);
  return seats.filter((s) => s.status === 'AVAILABLE').length;
}

function getStoredBookings(): BookingData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read stored bookings:', e);
  }
  // Initially, no bookings exist
  const initialBookings: BookingData[] = [];
  saveStoredBookings(initialBookings);
  return initialBookings;
}

function saveStoredBookings(bookings: BookingData[]) {
  try {
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
  } catch (e) {
    console.warn('Could not save bookings:', e);
  }
}

/**
 * Probes the backend connection if an external endpoint is configured.
 */
export async function checkBackendConnection(): Promise<boolean> {
  if (!API_BASE_URL) {
    isLiveBackendAvailable = false;
    backendCheckCompleted = true;
    return false;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const resp = await fetch(`${API_BASE_URL}/api/seats`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    isLiveBackendAvailable = resp.ok;
  } catch {
    isLiveBackendAvailable = false;
  }
  backendCheckCompleted = true;
  return isLiveBackendAvailable;
}

export function isUsingLiveBackend(): boolean {
  return isLiveBackendAvailable;
}

/**
 * Fetch all seats from Java backend or simulation
 */
export async function fetchSeats(busId?: string): Promise<{
  success: boolean;
  totalSeats: number;
  availableCount: number;
  bookedCount: number;
  data: SeatItem[];
}> {
  if (!backendCheckCompleted) {
    await checkBackendConnection();
  }

  if (isLiveBackendAvailable) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/seats`);
      if (res.ok) {
        const json = await res.json();
        return json;
      }
    } catch (e) {
      console.warn('Java backend fetch failed, switching to in-memory mode:', e);
      isLiveBackendAvailable = false;
    }
  }

  // Simulated Java Service response
  const seats = getStoredSeats(busId);
  const availableCount = seats.filter((s) => s.status === 'AVAILABLE').length;
  const bookedCount = seats.length - availableCount;

  return {
    success: true,
    totalSeats: seats.length,
    availableCount,
    bookedCount,
    data: seats,
  };
}

/**
 * Fetch available seats only
 */
export async function fetchAvailableSeats(busId?: string): Promise<SeatItem[]> {
  const result = await fetchSeats(busId);
  return result.data.filter((s) => s.status === 'AVAILABLE');
}

/**
 * Create a new booking
 */
export async function createBooking(payload: {
  name: string;
  mobile: string;
  email?: string;
  seatIds: string[];
  busId?: string;
  busName?: string;
  busType?: string;
  from?: string;
  boardingPoint?: string;
  to?: string;
  droppingPoint?: string;
  departureTime?: string;
  arrivalTime?: string;
  journeyDate?: string;
}): Promise<{
  success: boolean;
  message: string;
  data: BookingData;
}> {
  // Validate request
  const validation = validatePassenger(payload.name, payload.mobile, payload.seatIds);
  if (!validation.isValid) {
    const firstErr = Object.values(validation.errors)[0] || 'Invalid input.';
    throw new Error(firstErr);
  }

  const busId = payload.busId || 'blr-chn-1';

  if (isLiveBackendAvailable) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: payload.name,
          mobile: payload.mobile,
          email: payload.email || '',
          seatIds: payload.seatIds,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Booking creation failed.');
      }
      return json;
    } catch (err: unknown) {
      if (err instanceof Error && err.message !== 'Failed to fetch') {
        throw err;
      }
      console.warn('Java backend POST failed, falling back to simulation:', err);
      isLiveBackendAvailable = false;
    }
  }

  // Java BookingService simulation with Pessimistic Lock logic
  const seats = getStoredSeats(busId);

  // Verify candidate seats exist and are available
  const conflictSeats: string[] = [];
  for (const id of payload.seatIds) {
    const match = seats.find((s) => s.seatId === id);
    if (!match) {
      throw new Error(`Seat ${id} does not exist in bus.`);
    }
    if (match.status !== 'AVAILABLE') {
      conflictSeats.push(id);
    }
  }

  if (conflictSeats.length > 0) {
    throw new Error(`Seats already booked or unavailable: ${conflictSeats.join(', ')}`);
  }

  // Calculate price dynamically (150 per seat)
  const totalAmount = payload.seatIds.length * SEAT_PRICE;

  // Mark seats as BOOKED in this bus
  const updatedSeats = seats.map((s) => {
    if (payload.seatIds.includes(s.seatId)) {
      return { ...s, status: 'BOOKED' as const };
    }
    return s;
  });
  saveStoredSeats(updatedSeats, busId);

  // Generate Booking record
  const currentBookings = getStoredBookings();
  const newBookingId = currentBookings.length > 0
    ? Math.max(...currentBookings.map((b) => b.bookingId)) + 1
    : 1001;

  const newBooking: BookingData = {
    bookingId: newBookingId,
    pnr: `SE-${newBookingId}`,
    bookingType: 'BUS',
    customer: {
      customerId: Math.floor(Math.random() * 9000) + 1000,
      name: payload.name.trim(),
      mobile: payload.mobile.trim(),
      email: payload.email?.trim() || '',
    },
    seatIds: payload.seatIds,
    totalAmount,
    bookingDate: new Date().toISOString(),
    bookingStatus: 'CONFIRMED',
    busId,
    busName: payload.busName || 'SeatEase Prime Voyager',
    busType: payload.busType || 'Volvo Multi-Axle B11R AC Sleeper (2+1)',
    from: payload.from || 'Bangalore',
    boardingPoint: payload.boardingPoint || 'Majestic BMTC Hub (Platform 6)',
    to: payload.to || 'Chennai',
    droppingPoint: payload.droppingPoint || 'Koyambedu CMBT Terminal',
    departureTime: payload.departureTime || '21:30',
    arrivalTime: payload.arrivalTime || '03:00',
    journeyDate: payload.journeyDate || new Date().toISOString().split('T')[0],
  };

  currentBookings.unshift(newBooking);
  saveStoredBookings(currentBookings);

  return {
    success: true,
    message: 'Booking confirmed successfully!',
    data: newBooking,
  };
}

/**
 * Get booking by ID or PNR
 */
export async function getBookingById(query: string | number): Promise<BookingData | null> {
  const qStr = String(query).trim().toUpperCase();

  if (isLiveBackendAvailable && /^\d+$/.test(qStr)) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${qStr}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {
      console.warn('Java getBookingById failed, falling back:', e);
    }
  }

  const bookings = getStoredBookings();
  const match = bookings.find(
    (b) =>
      String(b.bookingId) === qStr ||
      b.pnr.toUpperCase() === qStr ||
      b.customer.mobile === qStr
  );
  return match || null;
}

export interface UserProfile {
  name: string;
  email: string;
  mobile: string;
  loyaltyPoints: number;
  totalTrips: number;
  carbonOffsetKg: number;
  emergencyContact: string;
  preferredSeatType: 'Window' | 'Aisle' | 'Any';
  memberTier: string;
}

const STORAGE_KEY_PROFILE = 'seatease_profile_v2';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Kishor Khan',
  email: 'kishorkhan.dev@gmail.com',
  mobile: '9876543210',
  loyaltyPoints: 450,
  totalTrips: 3,
  carbonOffsetKg: 28.5,
  emergencyContact: '+91 98450 12345',
  preferredSeatType: 'Window',
  memberTier: 'Platinum Voyager',
};

export function getUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read user profile:', e);
  }
  return DEFAULT_USER_PROFILE;
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.warn('Could not save user profile:', e);
  }
}

/**
 * Fetch all bookings (for My Bookings page)
 */
export async function getAllBookings(): Promise<BookingData[]> {
  const bookings = getStoredBookings();
  return bookings;
}

export interface CreateHomestayBookingPayload {
  stayId: string;
  stayName: string;
  stayLocation: string;
  stayImageUrl: string;
  hostName?: string;
  pricePerNight: number;
  name: string;
  mobile: string;
  email?: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guestsCount: number;
}

/**
 * Creates a verified Homestay reservation
 */
export async function createHomestayBooking(payload: CreateHomestayBookingPayload): Promise<{
  success: boolean;
  message: string;
  data: BookingData;
}> {
  const validation = validatePassenger(payload.name, payload.mobile);
  if (!validation.isValid) {
    const firstErr = Object.values(validation.errors)[0] || 'Invalid guest details.';
    throw new Error(firstErr);
  }

  if (payload.nights < 1) {
    throw new Error('Please select valid check-in and check-out dates (minimum 1 night).');
  }

  const basePrice = payload.nights * payload.pricePerNight;
  const taxes = Math.round(basePrice * 0.12);
  const totalAmount = basePrice + taxes;

  const currentBookings = getStoredBookings();
  const newBookingId = currentBookings.length > 0
    ? Math.max(...currentBookings.map((b) => b.bookingId)) + 1
    : 1001;

  const newBooking: BookingData = {
    bookingId: newBookingId,
    pnr: `HS-${newBookingId}`,
    bookingType: 'HOMESTAY',
    customer: {
      customerId: Math.floor(Math.random() * 9000) + 1000,
      name: payload.name.trim(),
      mobile: payload.mobile.trim(),
      email: payload.email?.trim() || '',
    },
    seatIds: [],
    totalAmount,
    bookingDate: new Date().toISOString(),
    bookingStatus: 'CONFIRMED',
    stayId: payload.stayId,
    stayName: payload.stayName,
    stayLocation: payload.stayLocation,
    stayImageUrl: payload.stayImageUrl,
    hostName: payload.hostName || 'Homestay Host',
    checkInDate: payload.checkInDate,
    checkOutDate: payload.checkOutDate,
    nights: payload.nights,
    guestsCount: payload.guestsCount,
    pricePerNight: payload.pricePerNight,
  };

  currentBookings.unshift(newBooking);
  saveStoredBookings(currentBookings);

  return {
    success: true,
    message: 'Homestay reserved successfully!',
    data: newBooking,
  };
}

/**
 * Cancel a booking and release its seats (if a bus booking)
 */
export async function cancelBooking(bookingId: number): Promise<{
  success: boolean;
  message: string;
  bookingId: number;
}> {
  if (isLiveBackendAvailable) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Cancellation failed.');
      }
      return json;
    } catch (err: unknown) {
      if (err instanceof Error && err.message !== 'Failed to fetch') {
        throw err;
      }
      console.warn('Java cancel failed, falling back to simulation:', err);
    }
  }

  const bookings = getStoredBookings();
  const booking = bookings.find((b) => b.bookingId === bookingId);

  if (!booking) {
    throw new Error(`Booking with ID ${bookingId} not found.`);
  }

  if (booking.bookingStatus === 'CANCELLED') {
    throw new Error('This booking is already CANCELLED.');
  }

  // Update status
  booking.bookingStatus = 'CANCELLED';
  saveStoredBookings(bookings);

  // If bus booking with seats, release seats
  if (booking.bookingType !== 'HOMESTAY' && booking.seatIds && booking.seatIds.length > 0) {
    const busId = booking.busId || 'blr-chn-1';
    const seats = getStoredSeats(busId);
    const updatedSeats = seats.map((s) => {
      if (booking.seatIds.includes(s.seatId)) {
        return { ...s, status: 'AVAILABLE' as const };
      }
      return s;
    });
    saveStoredSeats(updatedSeats, busId);

    return {
      success: true,
      message: `Booking #${bookingId} cancelled successfully. Seats ${booking.seatIds.join(', ')} released.`,
      bookingId,
    };
  }

  return {
    success: true,
    message: `Homestay reservation #${bookingId} cancelled successfully.`,
    bookingId,
  };
}

/**
 * Resets simulated database back to standard seed
 */
export function resetSimulatedData(): void {
  localStorage.removeItem(STORAGE_KEY_GLOBAL_SEATS);
  localStorage.removeItem(STORAGE_KEY_BOOKINGS);
  localStorage.removeItem(STORAGE_KEY_PROFILE);
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith(STORAGE_KEY_SEATS_PREFIX) || k.startsWith('seatease_'))) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    console.warn('Reset simulated data error:', e);
  }
}
