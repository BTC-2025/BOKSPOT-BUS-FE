import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MedicalReport {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
}

export interface Prescription {
  diagnosis: string;
  medications: { name: string; dosage: string; duration: string }[];
  updatedAt: string;
}

export interface DietPlan {
  protein: number; // in grams
  carbs: number; // in grams
  fats: number; // in grams
  dietType: string; // e.g. "Keto", "High Protein Lean Bulk"
  assignedAt: string;
}

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: number;
  weightLbs?: number;
}

export interface PersistedBooking {
  id: string;
  ref: string;
  serviceId: string;
  serviceName: string;
  merchantName: string;
  category: string;
  date: string;
  time: string;
  amount: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'CHECKED_IN';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
  otp?: string;
  
  // Doctor/Medical specific fields
  assignedDoctorId?: string;
  vitals?: {
    bp: string;
    temp: string;
    pulse: string;
    oxygen: string;
  };
  symptoms?: string;
  medicalReports?: MedicalReport[];
  prescription?: Prescription;

  // Fitness specific fields
  fitnessGoal?: string;
  dietPlan?: DietPlan;
  workoutPlan?: WorkoutExercise[];
  weightTracker?: { date: string; weightKg: number }[];

  // Salon specific fields
  stylingNotes?: string;
  stylistAssigned?: string;
  hairType?: string;
  skinType?: string;
  beforeAfterGallery?: string[]; // simulated base64 or picture seeds

  // Dining specific fields
  tableNumber?: string;
  seatCount?: number;
  dietaryRestrictions?: string[];
  occasion?: string;
  preOrderedCourses?: string[];
  
  // Turf / Resource specific fields
  teamName?: string;
  equipmentRentals?: { item: string; qty: number; price: number }[];
  matchNotes?: string;
  refereeAssigned?: string;
}

export interface CatalogService {
  id: string;
  name: string;
  merchant: string;
  price: number;
  duration: number; // in minutes
  category: string;
  active: boolean;
  rating: number;
  bookingsCount: number;
  description?: string;
  
  // Custom industry-specific details
  specializationRequired?: string;
  difficultyLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  productsUsed?: string;
  tableCapacity?: number;

  // Doctor/Medical specific
  doctorId?: string; // Links this schedule to a specific sub-id
  doctorName?: string;
  roomNumber?: string;
  timeSlots?: string[]; // E.g. ['10:00 AM', '11:00 AM']

  // Fitness specific
  trainerName?: string;
  classCapacity?: number;

  // Salon specific
  stylistName?: string;
  treatmentType?: string;

  // Dining specific
  cuisineType?: string;
  seatingSection?: string;

  // Turf specific
  pitchType?: string;
  includesFloodlights?: boolean;

  // Cinema/Theatre specific
  moviePoster?: string;
  movieShowtimes?: string;
  movieLanguage?: string;
  movieRating?: string;
  hallNumber?: string;

  [key: string]: any;
}

export interface MerchantUser {
  id: string;
  username: string;
  merchantName: string;
  category: string;
  logoLetter: string;
  aboutText: string;
  vendorId?: string;
  email?: string;
  assignSupervisor?: boolean;
  supervisorName?: string;
  supervisorPhone?: string;
  supervisorEmail?: string;
  supervisorAddress?: string;
  archetype?: 'Healthcare' | 'ResourceBooking' | 'Service' | 'Dining';
}

export interface StaffPermissions {
  canManageVitals: boolean;
  canAddPrescription: boolean;
  canManageBilling: boolean;
  canManageAppointments: boolean;
}

export interface StaffMember {
  id: string; // e.g., nurse/ahhospital@bnxmail.com
  merchantId: string;
  name: string;
  roleTitle: string;
  isDoctor?: boolean;
  passwordHash: string;
  permissions: StaffPermissions;
}

interface VendorStoreState {
  currentMerchant: MerchantUser | null;
  loginRole: 'vendor' | 'supervisor' | 'staff' | null;
  supervisorId: string | null;
  currentStaff: StaffMember | null;
  theme: 'system' | 'light' | 'dark';
  bookings: PersistedBooking[];
  services: CatalogService[];
  staffAccounts: StaffMember[];
  
  // Theme actions
  setTheme: (theme: 'system' | 'light' | 'dark') => void;
  
  // Auth actions
  loginMerchant: (username: string, passwordHash: string) => boolean;
  logoutMerchant: () => void;
  switchStore: (merchantId: string) => void;
  
  // Booking actions
  checkInBooking: (bookingId: string) => void;
  completeBooking: (bookingId: string) => void;
  cancelBooking: (bookingId: string) => void;
  rescheduleBooking: (bookingId: string, newDate: string, newTime: string) => void;
  updateBookingNotes: (bookingId: string, notes: string) => void;
  
  // Industry actions — Medical
  uploadReport: (bookingId: string, reportName: string) => void;
  deleteReport: (bookingId: string, reportId: string) => void;
  savePrescription: (bookingId: string, prescription: Prescription) => void;
  
  // Industry actions — Fitness
  assignDiet: (bookingId: string, diet: DietPlan) => void;
  saveWorkout: (bookingId: string, workout: WorkoutExercise[]) => void;
  
  // Industry actions — Salon
  saveStylingDetails: (bookingId: string, details: { stylist: string; hairType: string; skinType: string; stylingNotes: string }) => void;
  uploadBeforeAfterPhoto: (bookingId: string, photoSeed: string) => void;
  
  // Industry actions — Dining
  assignTable: (bookingId: string, tableNumber: string) => void;
  saveDietaryAlerts: (bookingId: string, alerts: string[]) => void;

  // Services actions
  addService: (service: CatalogService) => void;
  updateService: (updated: CatalogService) => void;
  deleteService: (serviceId: string) => void;

  // Staff actions
  addStaffMember: (staff: StaffMember) => void;
  updateStaffPermissions: (staffId: string, permissions: StaffPermissions) => void;
  deleteStaffMember: (staffId: string) => void;
}

export const PRESET_MERCHANTS: MerchantUser[] = [
  {
    id: 'mer-100',
    username: 'H101',
    merchantName: 'Grand Hotel',
    category: 'Hotel Booking',
    logoLetter: 'G',
    aboutText: 'Grand Hotel is a premier provider of Hotel Booking services.',
    vendorId: '2026050100',
    email: 'h101@bnxmail.com',
    archetype: 'ResourceBooking'
  },
  {
    id: 'mer-101',
    username: 'H102',
    merchantName: 'Sunstone Resort',
    category: 'Resort Booking',
    logoLetter: 'S',
    aboutText: 'Sunstone Resort is a premier provider of Resort Booking services.',
    vendorId: '2026050101',
    email: 'h102@bnxmail.com',
    archetype: 'ResourceBooking'
  },
  {
    id: 'mer-102',
    username: 'H103',
    merchantName: 'Riverfront Villa',
    category: 'Homestay / Villa',
    logoLetter: 'R',
    aboutText: 'Riverfront Villa is a premier provider of Homestay / Villa services.',
    vendorId: '2026050102',
    email: 'h103@bnxmail.com',
    archetype: 'ResourceBooking'
  },
  {
    id: 'mer-103',
    username: 'H104',
    merchantName: 'Backpackers Hostel',
    category: 'Hostel Booking',
    logoLetter: 'B',
    aboutText: 'Backpackers Hostel is a premier provider of Hostel Booking services.',
    vendorId: '2026050103',
    email: 'h104@bnxmail.com',
    archetype: 'ResourceBooking'
  },
  {
    id: 'mer-104',
    username: 'H105',
    merchantName: 'Pine Trails Camp',
    category: 'Camping Booking',
    logoLetter: 'P',
    aboutText: 'Pine Trails Camp is a premier provider of Camping Booking services.',
    vendorId: '2026050104',
    email: 'h105@bnxmail.com',
    archetype: 'ResourceBooking'
  },
  {
    id: 'mer-105',
    username: 'T102',
    merchantName: 'Arena 5 Turf',
    category: 'Football Turf',
    logoLetter: 'A',
    aboutText: 'Arena 5 Turf is a premier provider of Football Turf services.',
    vendorId: '2026050105',
    email: 't102@bnxmail.com',
    archetype: 'ResourceBooking'
  },
  {
    id: 'mer-106',
    username: 'T103',
    merchantName: 'Pitch Perfect Grounds',
    category: 'Cricket Ground',
    logoLetter: 'P',
    aboutText: 'Pitch Perfect Grounds is a premier provider of Cricket Ground services.',
    vendorId: '2026050106',
    email: 't103@bnxmail.com',
    archetype: 'ResourceBooking'
  },
  {
    id: 'mer-107',
    username: 'T104',
    merchantName: 'Smash Academy',
    category: 'Badminton Court',
    logoLetter: 'S',
    aboutText: 'Smash Academy is a premier provider of Badminton Court services.',
    vendorId: '2026050107',
    email: 't104@bnxmail.com',
    archetype: 'ResourceBooking'
  },
  {
    id: 'mer-108',
    username: 'T105',
    merchantName: 'Grand Slam Club',
    category: 'Tennis Court',
    logoLetter: 'G',
    aboutText: 'Grand Slam Club is a premier provider of Tennis Court services.',
    vendorId: '2026050108',
    email: 't105@bnxmail.com',
    archetype: 'ResourceBooking'
  },
  {
    id: 'mer-109',
    username: 'T106',
    merchantName: 'Hoop Kings Arena',
    category: 'Basketball Court',
    logoLetter: 'H',
    aboutText: 'Hoop Kings Arena is a premier provider of Basketball Court services.',
    vendorId: '2026050109',
    email: 't106@bnxmail.com',
    archetype: 'ResourceBooking'
  },
  {
    id: 'mer-110',
    username: 'T107',
    merchantName: 'Blue Wave Pool',
    category: 'Swimming Pool Slots',
    logoLetter: 'B',
    aboutText: 'Blue Wave Pool is a premier provider of Swimming Pool Slots services.',
    vendorId: '2026050110',
    email: 't107@bnxmail.com',
    archetype: 'ResourceBooking'
  },
  {
    id: 'mer-111',
    username: 'G101',
    merchantName: 'Cyber Core Cafe',
    category: 'Gaming Arena Booking',
    logoLetter: 'C',
    aboutText: 'Cyber Core Cafe is a premier provider of Gaming Arena Booking services.',
    vendorId: '2026050111',
    email: 'g101@bnxmail.com',
    archetype: 'ResourceBooking'
  },
  {
    id: 'mer-112',
    username: 'G102',
    merchantName: 'JumpZone Park',
    category: 'Indoor Play Arena',
    logoLetter: 'J',
    aboutText: 'JumpZone Park is a premier provider of Indoor Play Arena services.',
    vendorId: '2026050112',
    email: 'g102@bnxmail.com',
    archetype: 'ResourceBooking'
  },
  {
    id: 'mer-113',
    username: 'R404',
    merchantName: 'Grand Temple Restaurant',
    category: 'Restaurant Table Reservation',
    logoLetter: 'G',
    aboutText: 'Grand Temple Restaurant is a premier provider of Restaurant Table Reservation services.',
    vendorId: '2026050113',
    email: 'r404@bnxmail.com',
    archetype: 'Dining'
  },
  {
    id: 'mer-114',
    username: 'S303',
    merchantName: 'Style Studio',
    category: 'Salon / Spa Appointment',
    logoLetter: 'S',
    aboutText: 'Style Studio is a premier provider of Salon / Spa Appointment services.',
    vendorId: '2026050114',
    email: 's303@bnxmail.com',
    archetype: 'Service'
  },
  {
    id: 'mer-115',
    username: 'F202',
    merchantName: 'ZenFit Clinic',
    category: 'Gym / Yoga Slot Booking',
    logoLetter: 'Z',
    aboutText: 'ZenFit Clinic is a premier provider of Gym / Yoga Slot Booking services.',
    vendorId: '2026050115',
    email: 'f202@bnxmail.com',
    archetype: 'Service'
  },
  {
    id: 'mer-116',
    username: 'D101',
    merchantName: 'Apollo Dental',
    category: 'Doctor Appointment',
    logoLetter: 'A',
    aboutText: 'Apollo Dental is a premier provider of Doctor Appointment services.',
    vendorId: '2026050116',
    email: 'd101@bnxmail.com',
    archetype: 'Healthcare'
  },
  {
    id: 'mer-117',
    username: 'E201',
    merchantName: 'Spark Electricians',
    category: 'Electrician Booking',
    logoLetter: 'S',
    aboutText: 'Spark Electricians is a premier provider of Electrician Booking services.',
    vendorId: '2026050117',
    email: 'e201@bnxmail.com',
    archetype: 'Service'
  },
  {
    id: 'mer-118',
    username: 'E202',
    merchantName: 'FlowTech Plumbers',
    category: 'Plumber Booking',
    logoLetter: 'F',
    aboutText: 'FlowTech Plumbers is a premier provider of Plumber Booking services.',
    vendorId: '2026050118',
    email: 'e202@bnxmail.com',
    archetype: 'Service'
  },
  {
    id: 'mer-119',
    username: 'E203',
    merchantName: 'Shine Home Cleaners',
    category: 'Cleaning Service',
    logoLetter: 'S',
    aboutText: 'Shine Home Cleaners is a premier provider of Cleaning Service services.',
    vendorId: '2026050119',
    email: 'e203@bnxmail.com',
    archetype: 'Service'
  },
  {
    id: 'mer-120',
    username: 'E204',
    merchantName: 'FixIt Tech Repairs',
    category: 'Technician Service',
    logoLetter: 'F',
    aboutText: 'FixIt Tech Repairs is a premier provider of Technician Service services.',
    vendorId: '2026050120',
    email: 'e204@bnxmail.com',
    archetype: 'Service'
  },
  {
    id: 'mer-121',
    username: 'W301',
    merchantName: 'HubSpace',
    category: 'Co-working Space',
    logoLetter: 'H',
    aboutText: 'HubSpace is a premier provider of Co-working Space services.',
    vendorId: '2026050121',
    email: 'w301@bnxmail.com',
    archetype: 'ResourceBooking'
  },
  {
    id: 'mer-122',
    username: 'W302',
    merchantName: 'Boardroom Plus',
    category: 'Meeting Room',
    logoLetter: 'B',
    aboutText: 'Boardroom Plus is a premier provider of Meeting Room services.',
    vendorId: '2026050122',
    email: 'w302@bnxmail.com',
    archetype: 'ResourceBooking'
  },
  {
    id: 'mer-123',
    username: 'W303',
    merchantName: 'AudioWave Cast',
    category: 'Podcast Studio',
    logoLetter: 'A',
    aboutText: 'AudioWave Cast is a premier provider of Podcast Studio services.',
    vendorId: '2026050123',
    email: 'w303@bnxmail.com',
    archetype: 'ResourceBooking'
  },
  {
    id: 'mer-124',
    username: 'W304',
    merchantName: 'Summit Conference',
    category: 'Conference Hall',
    logoLetter: 'S',
    aboutText: 'Summit Conference is a premier provider of Conference Hall services.',
    vendorId: '2026050124',
    email: 'w304@bnxmail.com',
    archetype: 'ResourceBooking'
  },
  {
    id: 'mer-125',
    username: 'W305',
    merchantName: 'EduPro Sessions',
    category: 'Training Sessions',
    logoLetter: 'E',
    aboutText: 'EduPro Sessions is a premier provider of Training Sessions services.',
    vendorId: '2026050125',
    email: 'w305@bnxmail.com',
    archetype: 'ResourceBooking'
  },
  {
    id: 'mer-126',
    username: 'W306',
    merchantName: 'Shutter Studio',
    category: 'Studio Booking',
    logoLetter: 'S',
    aboutText: 'Shutter Studio is a premier provider of Studio Booking services.',
    vendorId: '2026050126',
    email: 'w306@bnxmail.com',
    archetype: 'ResourceBooking'
  },
  {
    id: 'mer-127',
    username: 'O801',
    merchantName: 'Elite Planners',
    category: 'Event Organizer Booking',
    logoLetter: 'E',
    aboutText: 'Elite Planners is a premier provider of Event Organizer Booking services.',
    vendorId: '2026050127',
    email: 'o801@bnxmail.com',
    archetype: 'ResourceBooking'
  },
  {
    id: 'mer-128',
    username: 'V401',
    merchantName: 'City Wheels',
    category: 'Cycle Rental',
    logoLetter: 'C',
    aboutText: 'City Wheels is a premier provider of Cycle Rental services.',
    vendorId: '2026050128',
    email: 'v401@bnxmail.com',
    archetype: 'ResourceBooking'
  },
  {
    id: 'mer-129',
    username: 'V402',
    merchantName: 'Rev Rider',
    category: 'Sports Bike Rental',
    logoLetter: 'R',
    aboutText: 'Rev Rider is a premier provider of Sports Bike Rental services.',
    vendorId: '2026050129',
    email: 'v402@bnxmail.com',
    archetype: 'ResourceBooking'
  },
  {
    id: 'mer-130',
    username: 'M501',
    merchantName: 'Lens Crafters',
    category: 'Camera Rental',
    logoLetter: 'L',
    aboutText: 'Lens Crafters is a premier provider of Camera Rental services.',
    vendorId: '2026050130',
    email: 'm501@bnxmail.com',
    archetype: 'ResourceBooking'
  },
  {
    id: 'mer-131',
    username: 'M502',
    merchantName: 'Bass Drop Audio',
    category: 'Sound System Rental',
    logoLetter: 'B',
    aboutText: 'Bass Drop Audio is a premier provider of Sound System Rental services.',
    vendorId: '2026050131',
    email: 'm502@bnxmail.com',
    archetype: 'ResourceBooking'
  },
  {
    id: 'mer-132',
    username: 'M503',
    merchantName: 'Party Supply Co',
    category: 'Event Equipment Rental',
    logoLetter: 'P',
    aboutText: 'Party Supply Co is a premier provider of Event Equipment Rental services.',
    vendorId: '2026050132',
    email: 'm503@bnxmail.com',
    archetype: 'ResourceBooking'
  },
  {
    id: 'mer-133',
    username: 'P601',
    merchantName: 'Paws & Bubbles',
    category: 'Pet Grooming Appointment',
    logoLetter: 'P',
    aboutText: 'Paws & Bubbles is a premier provider of Pet Grooming Appointment services.',
    vendorId: '2026050133',
    email: 'p601@bnxmail.com',
    archetype: 'Service'
  },
  {
    id: 'mer-134',
    username: 'B701',
    merchantName: 'SafeHands Nannies',
    category: 'Babysitting Service',
    logoLetter: 'S',
    aboutText: 'SafeHands Nannies is a premier provider of Babysitting Service services.',
    vendorId: '2026050134',
    email: 'b701@bnxmail.com',
    archetype: 'Service'
  },
  {
    id: 'mer-135',
    username: 'B702',
    merchantName: 'Compassion Care',
    category: 'Elder Care Service',
    logoLetter: 'C',
    aboutText: 'Compassion Care is a premier provider of Elder Care Service services.',
    vendorId: '2026050135',
    email: 'b702@bnxmail.com',
    archetype: 'Service'
  },
];

const INITIAL_SERVICES: CatalogService[] = [
  {
    id: "svc-1",
    name: "Standard Service",
    merchant: "Grand Hotel",
    price: 500,
    duration: 60,
    category: "Hotel Booking",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-2",
    name: "Premium Service",
    merchant: "Grand Hotel",
    price: 1500,
    duration: 120,
    category: "Hotel Booking",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-3",
    name: "Quick Consult",
    merchant: "Grand Hotel",
    price: 300,
    duration: 30,
    category: "Hotel Booking",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-4",
    name: "Standard Service",
    merchant: "Sunstone Resort",
    price: 500,
    duration: 60,
    category: "Resort Booking",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-5",
    name: "Premium Service",
    merchant: "Sunstone Resort",
    price: 1500,
    duration: 120,
    category: "Resort Booking",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-6",
    name: "Quick Consult",
    merchant: "Sunstone Resort",
    price: 300,
    duration: 30,
    category: "Resort Booking",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-7",
    name: "Standard Service",
    merchant: "Riverfront Villa",
    price: 500,
    duration: 60,
    category: "Homestay / Villa",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-8",
    name: "Premium Service",
    merchant: "Riverfront Villa",
    price: 1500,
    duration: 120,
    category: "Homestay / Villa",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-9",
    name: "Quick Consult",
    merchant: "Riverfront Villa",
    price: 300,
    duration: 30,
    category: "Homestay / Villa",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-10",
    name: "Standard Service",
    merchant: "Backpackers Hostel",
    price: 500,
    duration: 60,
    category: "Hostel Booking",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-11",
    name: "Premium Service",
    merchant: "Backpackers Hostel",
    price: 1500,
    duration: 120,
    category: "Hostel Booking",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-12",
    name: "Quick Consult",
    merchant: "Backpackers Hostel",
    price: 300,
    duration: 30,
    category: "Hostel Booking",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-13",
    name: "Standard Service",
    merchant: "Pine Trails Camp",
    price: 500,
    duration: 60,
    category: "Camping Booking",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-14",
    name: "Premium Service",
    merchant: "Pine Trails Camp",
    price: 1500,
    duration: 120,
    category: "Camping Booking",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-15",
    name: "Quick Consult",
    merchant: "Pine Trails Camp",
    price: 300,
    duration: 30,
    category: "Camping Booking",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-16",
    name: "Standard Service",
    merchant: "Arena 5 Turf",
    price: 500,
    duration: 60,
    category: "Football Turf",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-17",
    name: "Premium Service",
    merchant: "Arena 5 Turf",
    price: 1500,
    duration: 120,
    category: "Football Turf",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-18",
    name: "Quick Consult",
    merchant: "Arena 5 Turf",
    price: 300,
    duration: 30,
    category: "Football Turf",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-19",
    name: "Standard Service",
    merchant: "Pitch Perfect Grounds",
    price: 500,
    duration: 60,
    category: "Cricket Ground",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-20",
    name: "Premium Service",
    merchant: "Pitch Perfect Grounds",
    price: 1500,
    duration: 120,
    category: "Cricket Ground",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-21",
    name: "Quick Consult",
    merchant: "Pitch Perfect Grounds",
    price: 300,
    duration: 30,
    category: "Cricket Ground",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-22",
    name: "Standard Service",
    merchant: "Smash Academy",
    price: 500,
    duration: 60,
    category: "Badminton Court",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-23",
    name: "Premium Service",
    merchant: "Smash Academy",
    price: 1500,
    duration: 120,
    category: "Badminton Court",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-24",
    name: "Quick Consult",
    merchant: "Smash Academy",
    price: 300,
    duration: 30,
    category: "Badminton Court",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-25",
    name: "Standard Service",
    merchant: "Grand Slam Club",
    price: 500,
    duration: 60,
    category: "Tennis Court",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-26",
    name: "Premium Service",
    merchant: "Grand Slam Club",
    price: 1500,
    duration: 120,
    category: "Tennis Court",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-27",
    name: "Quick Consult",
    merchant: "Grand Slam Club",
    price: 300,
    duration: 30,
    category: "Tennis Court",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-28",
    name: "Standard Service",
    merchant: "Hoop Kings Arena",
    price: 500,
    duration: 60,
    category: "Basketball Court",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-29",
    name: "Premium Service",
    merchant: "Hoop Kings Arena",
    price: 1500,
    duration: 120,
    category: "Basketball Court",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-30",
    name: "Quick Consult",
    merchant: "Hoop Kings Arena",
    price: 300,
    duration: 30,
    category: "Basketball Court",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-31",
    name: "Standard Service",
    merchant: "Blue Wave Pool",
    price: 500,
    duration: 60,
    category: "Swimming Pool Slots",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-32",
    name: "Premium Service",
    merchant: "Blue Wave Pool",
    price: 1500,
    duration: 120,
    category: "Swimming Pool Slots",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-33",
    name: "Quick Consult",
    merchant: "Blue Wave Pool",
    price: 300,
    duration: 30,
    category: "Swimming Pool Slots",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-34",
    name: "Standard Service",
    merchant: "Cyber Core Cafe",
    price: 500,
    duration: 60,
    category: "Gaming Arena Booking",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-35",
    name: "Premium Service",
    merchant: "Cyber Core Cafe",
    price: 1500,
    duration: 120,
    category: "Gaming Arena Booking",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-36",
    name: "Quick Consult",
    merchant: "Cyber Core Cafe",
    price: 300,
    duration: 30,
    category: "Gaming Arena Booking",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-37",
    name: "Standard Service",
    merchant: "JumpZone Park",
    price: 500,
    duration: 60,
    category: "Indoor Play Arena",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-38",
    name: "Premium Service",
    merchant: "JumpZone Park",
    price: 1500,
    duration: 120,
    category: "Indoor Play Arena",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-39",
    name: "Quick Consult",
    merchant: "JumpZone Park",
    price: 300,
    duration: 30,
    category: "Indoor Play Arena",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-40",
    name: "Standard Service",
    merchant: "Grand Temple Restaurant",
    price: 500,
    duration: 60,
    category: "Restaurant Table Reservation",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-41",
    name: "Premium Service",
    merchant: "Grand Temple Restaurant",
    price: 1500,
    duration: 120,
    category: "Restaurant Table Reservation",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-42",
    name: "Quick Consult",
    merchant: "Grand Temple Restaurant",
    price: 300,
    duration: 30,
    category: "Restaurant Table Reservation",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-43",
    name: "Standard Service",
    merchant: "Style Studio",
    price: 500,
    duration: 60,
    category: "Salon / Spa Appointment",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-44",
    name: "Premium Service",
    merchant: "Style Studio",
    price: 1500,
    duration: 120,
    category: "Salon / Spa Appointment",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-45",
    name: "Quick Consult",
    merchant: "Style Studio",
    price: 300,
    duration: 30,
    category: "Salon / Spa Appointment",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-46",
    name: "Standard Service",
    merchant: "ZenFit Clinic",
    price: 500,
    duration: 60,
    category: "Gym / Yoga Slot Booking",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-47",
    name: "Premium Service",
    merchant: "ZenFit Clinic",
    price: 1500,
    duration: 120,
    category: "Gym / Yoga Slot Booking",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-48",
    name: "Quick Consult",
    merchant: "ZenFit Clinic",
    price: 300,
    duration: 30,
    category: "Gym / Yoga Slot Booking",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-49",
    name: "Standard Service",
    merchant: "Apollo Dental",
    price: 500,
    duration: 60,
    category: "Doctor Appointment",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-50",
    name: "Premium Service",
    merchant: "Apollo Dental",
    price: 1500,
    duration: 120,
    category: "Doctor Appointment",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-51",
    name: "Quick Consult",
    merchant: "Apollo Dental",
    price: 300,
    duration: 30,
    category: "Doctor Appointment",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-52",
    name: "Standard Service",
    merchant: "Spark Electricians",
    price: 500,
    duration: 60,
    category: "Electrician Booking",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-53",
    name: "Premium Service",
    merchant: "Spark Electricians",
    price: 1500,
    duration: 120,
    category: "Electrician Booking",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-54",
    name: "Quick Consult",
    merchant: "Spark Electricians",
    price: 300,
    duration: 30,
    category: "Electrician Booking",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-55",
    name: "Standard Service",
    merchant: "FlowTech Plumbers",
    price: 500,
    duration: 60,
    category: "Plumber Booking",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-56",
    name: "Premium Service",
    merchant: "FlowTech Plumbers",
    price: 1500,
    duration: 120,
    category: "Plumber Booking",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-57",
    name: "Quick Consult",
    merchant: "FlowTech Plumbers",
    price: 300,
    duration: 30,
    category: "Plumber Booking",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-58",
    name: "Standard Service",
    merchant: "Shine Home Cleaners",
    price: 500,
    duration: 60,
    category: "Cleaning Service",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-59",
    name: "Premium Service",
    merchant: "Shine Home Cleaners",
    price: 1500,
    duration: 120,
    category: "Cleaning Service",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-60",
    name: "Quick Consult",
    merchant: "Shine Home Cleaners",
    price: 300,
    duration: 30,
    category: "Cleaning Service",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-61",
    name: "Standard Service",
    merchant: "FixIt Tech Repairs",
    price: 500,
    duration: 60,
    category: "Technician Service",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-62",
    name: "Premium Service",
    merchant: "FixIt Tech Repairs",
    price: 1500,
    duration: 120,
    category: "Technician Service",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-63",
    name: "Quick Consult",
    merchant: "FixIt Tech Repairs",
    price: 300,
    duration: 30,
    category: "Technician Service",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-64",
    name: "Standard Service",
    merchant: "HubSpace",
    price: 500,
    duration: 60,
    category: "Co-working Space",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-65",
    name: "Premium Service",
    merchant: "HubSpace",
    price: 1500,
    duration: 120,
    category: "Co-working Space",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-66",
    name: "Quick Consult",
    merchant: "HubSpace",
    price: 300,
    duration: 30,
    category: "Co-working Space",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-67",
    name: "Standard Service",
    merchant: "Boardroom Plus",
    price: 500,
    duration: 60,
    category: "Meeting Room",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-68",
    name: "Premium Service",
    merchant: "Boardroom Plus",
    price: 1500,
    duration: 120,
    category: "Meeting Room",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-69",
    name: "Quick Consult",
    merchant: "Boardroom Plus",
    price: 300,
    duration: 30,
    category: "Meeting Room",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-70",
    name: "Standard Service",
    merchant: "AudioWave Cast",
    price: 500,
    duration: 60,
    category: "Podcast Studio",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-71",
    name: "Premium Service",
    merchant: "AudioWave Cast",
    price: 1500,
    duration: 120,
    category: "Podcast Studio",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-72",
    name: "Quick Consult",
    merchant: "AudioWave Cast",
    price: 300,
    duration: 30,
    category: "Podcast Studio",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-73",
    name: "Standard Service",
    merchant: "Summit Conference",
    price: 500,
    duration: 60,
    category: "Conference Hall",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-74",
    name: "Premium Service",
    merchant: "Summit Conference",
    price: 1500,
    duration: 120,
    category: "Conference Hall",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-75",
    name: "Quick Consult",
    merchant: "Summit Conference",
    price: 300,
    duration: 30,
    category: "Conference Hall",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-76",
    name: "Standard Service",
    merchant: "EduPro Sessions",
    price: 500,
    duration: 60,
    category: "Training Sessions",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-77",
    name: "Premium Service",
    merchant: "EduPro Sessions",
    price: 1500,
    duration: 120,
    category: "Training Sessions",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-78",
    name: "Quick Consult",
    merchant: "EduPro Sessions",
    price: 300,
    duration: 30,
    category: "Training Sessions",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-79",
    name: "Standard Service",
    merchant: "Shutter Studio",
    price: 500,
    duration: 60,
    category: "Studio Booking",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-80",
    name: "Premium Service",
    merchant: "Shutter Studio",
    price: 1500,
    duration: 120,
    category: "Studio Booking",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-81",
    name: "Quick Consult",
    merchant: "Shutter Studio",
    price: 300,
    duration: 30,
    category: "Studio Booking",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-82",
    name: "Standard Service",
    merchant: "Elite Planners",
    price: 500,
    duration: 60,
    category: "Event Organizer Booking",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-83",
    name: "Premium Service",
    merchant: "Elite Planners",
    price: 1500,
    duration: 120,
    category: "Event Organizer Booking",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-84",
    name: "Quick Consult",
    merchant: "Elite Planners",
    price: 300,
    duration: 30,
    category: "Event Organizer Booking",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-85",
    name: "Standard Service",
    merchant: "City Wheels",
    price: 500,
    duration: 60,
    category: "Cycle Rental",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-86",
    name: "Premium Service",
    merchant: "City Wheels",
    price: 1500,
    duration: 120,
    category: "Cycle Rental",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-87",
    name: "Quick Consult",
    merchant: "City Wheels",
    price: 300,
    duration: 30,
    category: "Cycle Rental",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-88",
    name: "Standard Service",
    merchant: "Rev Rider",
    price: 500,
    duration: 60,
    category: "Sports Bike Rental",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-89",
    name: "Premium Service",
    merchant: "Rev Rider",
    price: 1500,
    duration: 120,
    category: "Sports Bike Rental",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-90",
    name: "Quick Consult",
    merchant: "Rev Rider",
    price: 300,
    duration: 30,
    category: "Sports Bike Rental",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-91",
    name: "Standard Service",
    merchant: "Lens Crafters",
    price: 500,
    duration: 60,
    category: "Camera Rental",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-92",
    name: "Premium Service",
    merchant: "Lens Crafters",
    price: 1500,
    duration: 120,
    category: "Camera Rental",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-93",
    name: "Quick Consult",
    merchant: "Lens Crafters",
    price: 300,
    duration: 30,
    category: "Camera Rental",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-94",
    name: "Standard Service",
    merchant: "Bass Drop Audio",
    price: 500,
    duration: 60,
    category: "Sound System Rental",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-95",
    name: "Premium Service",
    merchant: "Bass Drop Audio",
    price: 1500,
    duration: 120,
    category: "Sound System Rental",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-96",
    name: "Quick Consult",
    merchant: "Bass Drop Audio",
    price: 300,
    duration: 30,
    category: "Sound System Rental",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-97",
    name: "Standard Service",
    merchant: "Party Supply Co",
    price: 500,
    duration: 60,
    category: "Event Equipment Rental",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-98",
    name: "Premium Service",
    merchant: "Party Supply Co",
    price: 1500,
    duration: 120,
    category: "Event Equipment Rental",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-99",
    name: "Quick Consult",
    merchant: "Party Supply Co",
    price: 300,
    duration: 30,
    category: "Event Equipment Rental",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-100",
    name: "Standard Service",
    merchant: "Paws & Bubbles",
    price: 500,
    duration: 60,
    category: "Pet Grooming Appointment",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-101",
    name: "Premium Service",
    merchant: "Paws & Bubbles",
    price: 1500,
    duration: 120,
    category: "Pet Grooming Appointment",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-102",
    name: "Quick Consult",
    merchant: "Paws & Bubbles",
    price: 300,
    duration: 30,
    category: "Pet Grooming Appointment",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-103",
    name: "Standard Service",
    merchant: "SafeHands Nannies",
    price: 500,
    duration: 60,
    category: "Babysitting Service",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-104",
    name: "Premium Service",
    merchant: "SafeHands Nannies",
    price: 1500,
    duration: 120,
    category: "Babysitting Service",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-105",
    name: "Quick Consult",
    merchant: "SafeHands Nannies",
    price: 300,
    duration: 30,
    category: "Babysitting Service",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  },
  {
    id: "svc-106",
    name: "Standard Service",
    merchant: "Compassion Care",
    price: 500,
    duration: 60,
    category: "Elder Care Service",
    active: true,
    rating: 4.5,
    bookingsCount: 120,
    timeSlots: [
      "09:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM"
    ]
  },
  {
    id: "svc-107",
    name: "Premium Service",
    merchant: "Compassion Care",
    price: 1500,
    duration: 120,
    category: "Elder Care Service",
    active: true,
    rating: 4.8,
    bookingsCount: 85,
    timeSlots: [
      "10:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    id: "svc-108",
    name: "Quick Consult",
    merchant: "Compassion Care",
    price: 300,
    duration: 30,
    category: "Elder Care Service",
    active: true,
    rating: 4.2,
    bookingsCount: 200,
    timeSlots: [
      "09:30 AM",
      "10:30 AM",
      "11:30 AM",
      "03:30 PM"
    ]
  }
];

const INITIAL_BOOKINGS: PersistedBooking[] = [
  {
    id: "bk-1",
    ref: "BK-H10101",
    serviceId: "svc-1",
    serviceName: "Standard Service",
    merchantName: "Grand Hotel",
    category: "Hotel Booking",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-2"
  },
  {
    id: "bk-2",
    ref: "BK-H10102",
    serviceId: "svc-2",
    serviceName: "Premium Service",
    merchantName: "Grand Hotel",
    category: "Hotel Booking",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-3"
  },
  {
    id: "bk-3",
    ref: "BK-H10103",
    serviceId: "svc-3",
    serviceName: "Quick Consult",
    merchantName: "Grand Hotel",
    category: "Hotel Booking",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-2"
  },
  {
    id: "bk-4",
    ref: "BK-H10104",
    serviceId: "svc-1",
    serviceName: "Standard Service",
    merchantName: "Grand Hotel",
    category: "Hotel Booking",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-3"
  },
  {
    id: "bk-5",
    ref: "BK-H10105",
    serviceId: "svc-2",
    serviceName: "Premium Service",
    merchantName: "Grand Hotel",
    category: "Hotel Booking",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-2"
  },
  {
    id: "bk-6",
    ref: "BK-H10201",
    serviceId: "svc-4",
    serviceName: "Standard Service",
    merchantName: "Sunstone Resort",
    category: "Resort Booking",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-5"
  },
  {
    id: "bk-7",
    ref: "BK-H10202",
    serviceId: "svc-5",
    serviceName: "Premium Service",
    merchantName: "Sunstone Resort",
    category: "Resort Booking",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-6"
  },
  {
    id: "bk-8",
    ref: "BK-H10203",
    serviceId: "svc-6",
    serviceName: "Quick Consult",
    merchantName: "Sunstone Resort",
    category: "Resort Booking",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-5"
  },
  {
    id: "bk-9",
    ref: "BK-H10204",
    serviceId: "svc-4",
    serviceName: "Standard Service",
    merchantName: "Sunstone Resort",
    category: "Resort Booking",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-6"
  },
  {
    id: "bk-10",
    ref: "BK-H10205",
    serviceId: "svc-5",
    serviceName: "Premium Service",
    merchantName: "Sunstone Resort",
    category: "Resort Booking",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-5"
  },
  {
    id: "bk-11",
    ref: "BK-H10301",
    serviceId: "svc-7",
    serviceName: "Standard Service",
    merchantName: "Riverfront Villa",
    category: "Homestay / Villa",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-8"
  },
  {
    id: "bk-12",
    ref: "BK-H10302",
    serviceId: "svc-8",
    serviceName: "Premium Service",
    merchantName: "Riverfront Villa",
    category: "Homestay / Villa",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-9"
  },
  {
    id: "bk-13",
    ref: "BK-H10303",
    serviceId: "svc-9",
    serviceName: "Quick Consult",
    merchantName: "Riverfront Villa",
    category: "Homestay / Villa",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-8"
  },
  {
    id: "bk-14",
    ref: "BK-H10304",
    serviceId: "svc-7",
    serviceName: "Standard Service",
    merchantName: "Riverfront Villa",
    category: "Homestay / Villa",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-9"
  },
  {
    id: "bk-15",
    ref: "BK-H10305",
    serviceId: "svc-8",
    serviceName: "Premium Service",
    merchantName: "Riverfront Villa",
    category: "Homestay / Villa",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-8"
  },
  {
    id: "bk-16",
    ref: "BK-H10401",
    serviceId: "svc-10",
    serviceName: "Standard Service",
    merchantName: "Backpackers Hostel",
    category: "Hostel Booking",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-11"
  },
  {
    id: "bk-17",
    ref: "BK-H10402",
    serviceId: "svc-11",
    serviceName: "Premium Service",
    merchantName: "Backpackers Hostel",
    category: "Hostel Booking",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-12"
  },
  {
    id: "bk-18",
    ref: "BK-H10403",
    serviceId: "svc-12",
    serviceName: "Quick Consult",
    merchantName: "Backpackers Hostel",
    category: "Hostel Booking",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-11"
  },
  {
    id: "bk-19",
    ref: "BK-H10404",
    serviceId: "svc-10",
    serviceName: "Standard Service",
    merchantName: "Backpackers Hostel",
    category: "Hostel Booking",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-12"
  },
  {
    id: "bk-20",
    ref: "BK-H10405",
    serviceId: "svc-11",
    serviceName: "Premium Service",
    merchantName: "Backpackers Hostel",
    category: "Hostel Booking",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-11"
  },
  {
    id: "bk-21",
    ref: "BK-H10501",
    serviceId: "svc-13",
    serviceName: "Standard Service",
    merchantName: "Pine Trails Camp",
    category: "Camping Booking",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-14"
  },
  {
    id: "bk-22",
    ref: "BK-H10502",
    serviceId: "svc-14",
    serviceName: "Premium Service",
    merchantName: "Pine Trails Camp",
    category: "Camping Booking",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-15"
  },
  {
    id: "bk-23",
    ref: "BK-H10503",
    serviceId: "svc-15",
    serviceName: "Quick Consult",
    merchantName: "Pine Trails Camp",
    category: "Camping Booking",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-14"
  },
  {
    id: "bk-24",
    ref: "BK-H10504",
    serviceId: "svc-13",
    serviceName: "Standard Service",
    merchantName: "Pine Trails Camp",
    category: "Camping Booking",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-15"
  },
  {
    id: "bk-25",
    ref: "BK-H10505",
    serviceId: "svc-14",
    serviceName: "Premium Service",
    merchantName: "Pine Trails Camp",
    category: "Camping Booking",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-14"
  },
  {
    id: "bk-26",
    ref: "BK-T10201",
    serviceId: "svc-16",
    serviceName: "Standard Service",
    merchantName: "Arena 5 Turf",
    category: "Football Turf",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-17"
  },
  {
    id: "bk-27",
    ref: "BK-T10202",
    serviceId: "svc-17",
    serviceName: "Premium Service",
    merchantName: "Arena 5 Turf",
    category: "Football Turf",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-18"
  },
  {
    id: "bk-28",
    ref: "BK-T10203",
    serviceId: "svc-18",
    serviceName: "Quick Consult",
    merchantName: "Arena 5 Turf",
    category: "Football Turf",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-17"
  },
  {
    id: "bk-29",
    ref: "BK-T10204",
    serviceId: "svc-16",
    serviceName: "Standard Service",
    merchantName: "Arena 5 Turf",
    category: "Football Turf",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-18"
  },
  {
    id: "bk-30",
    ref: "BK-T10205",
    serviceId: "svc-17",
    serviceName: "Premium Service",
    merchantName: "Arena 5 Turf",
    category: "Football Turf",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-17"
  },
  {
    id: "bk-31",
    ref: "BK-T10301",
    serviceId: "svc-19",
    serviceName: "Standard Service",
    merchantName: "Pitch Perfect Grounds",
    category: "Cricket Ground",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-20"
  },
  {
    id: "bk-32",
    ref: "BK-T10302",
    serviceId: "svc-20",
    serviceName: "Premium Service",
    merchantName: "Pitch Perfect Grounds",
    category: "Cricket Ground",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-21"
  },
  {
    id: "bk-33",
    ref: "BK-T10303",
    serviceId: "svc-21",
    serviceName: "Quick Consult",
    merchantName: "Pitch Perfect Grounds",
    category: "Cricket Ground",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-20"
  },
  {
    id: "bk-34",
    ref: "BK-T10304",
    serviceId: "svc-19",
    serviceName: "Standard Service",
    merchantName: "Pitch Perfect Grounds",
    category: "Cricket Ground",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-21"
  },
  {
    id: "bk-35",
    ref: "BK-T10305",
    serviceId: "svc-20",
    serviceName: "Premium Service",
    merchantName: "Pitch Perfect Grounds",
    category: "Cricket Ground",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-20"
  },
  {
    id: "bk-36",
    ref: "BK-T10401",
    serviceId: "svc-22",
    serviceName: "Standard Service",
    merchantName: "Smash Academy",
    category: "Badminton Court",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-23"
  },
  {
    id: "bk-37",
    ref: "BK-T10402",
    serviceId: "svc-23",
    serviceName: "Premium Service",
    merchantName: "Smash Academy",
    category: "Badminton Court",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-24"
  },
  {
    id: "bk-38",
    ref: "BK-T10403",
    serviceId: "svc-24",
    serviceName: "Quick Consult",
    merchantName: "Smash Academy",
    category: "Badminton Court",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-23"
  },
  {
    id: "bk-39",
    ref: "BK-T10404",
    serviceId: "svc-22",
    serviceName: "Standard Service",
    merchantName: "Smash Academy",
    category: "Badminton Court",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-24"
  },
  {
    id: "bk-40",
    ref: "BK-T10405",
    serviceId: "svc-23",
    serviceName: "Premium Service",
    merchantName: "Smash Academy",
    category: "Badminton Court",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-23"
  },
  {
    id: "bk-41",
    ref: "BK-T10501",
    serviceId: "svc-25",
    serviceName: "Standard Service",
    merchantName: "Grand Slam Club",
    category: "Tennis Court",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-26"
  },
  {
    id: "bk-42",
    ref: "BK-T10502",
    serviceId: "svc-26",
    serviceName: "Premium Service",
    merchantName: "Grand Slam Club",
    category: "Tennis Court",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-27"
  },
  {
    id: "bk-43",
    ref: "BK-T10503",
    serviceId: "svc-27",
    serviceName: "Quick Consult",
    merchantName: "Grand Slam Club",
    category: "Tennis Court",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-26"
  },
  {
    id: "bk-44",
    ref: "BK-T10504",
    serviceId: "svc-25",
    serviceName: "Standard Service",
    merchantName: "Grand Slam Club",
    category: "Tennis Court",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-27"
  },
  {
    id: "bk-45",
    ref: "BK-T10505",
    serviceId: "svc-26",
    serviceName: "Premium Service",
    merchantName: "Grand Slam Club",
    category: "Tennis Court",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-26"
  },
  {
    id: "bk-46",
    ref: "BK-T10601",
    serviceId: "svc-28",
    serviceName: "Standard Service",
    merchantName: "Hoop Kings Arena",
    category: "Basketball Court",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-29"
  },
  {
    id: "bk-47",
    ref: "BK-T10602",
    serviceId: "svc-29",
    serviceName: "Premium Service",
    merchantName: "Hoop Kings Arena",
    category: "Basketball Court",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-30"
  },
  {
    id: "bk-48",
    ref: "BK-T10603",
    serviceId: "svc-30",
    serviceName: "Quick Consult",
    merchantName: "Hoop Kings Arena",
    category: "Basketball Court",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-29"
  },
  {
    id: "bk-49",
    ref: "BK-T10604",
    serviceId: "svc-28",
    serviceName: "Standard Service",
    merchantName: "Hoop Kings Arena",
    category: "Basketball Court",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-30"
  },
  {
    id: "bk-50",
    ref: "BK-T10605",
    serviceId: "svc-29",
    serviceName: "Premium Service",
    merchantName: "Hoop Kings Arena",
    category: "Basketball Court",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-29"
  },
  {
    id: "bk-51",
    ref: "BK-T10701",
    serviceId: "svc-31",
    serviceName: "Standard Service",
    merchantName: "Blue Wave Pool",
    category: "Swimming Pool Slots",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-32"
  },
  {
    id: "bk-52",
    ref: "BK-T10702",
    serviceId: "svc-32",
    serviceName: "Premium Service",
    merchantName: "Blue Wave Pool",
    category: "Swimming Pool Slots",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-33"
  },
  {
    id: "bk-53",
    ref: "BK-T10703",
    serviceId: "svc-33",
    serviceName: "Quick Consult",
    merchantName: "Blue Wave Pool",
    category: "Swimming Pool Slots",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-32"
  },
  {
    id: "bk-54",
    ref: "BK-T10704",
    serviceId: "svc-31",
    serviceName: "Standard Service",
    merchantName: "Blue Wave Pool",
    category: "Swimming Pool Slots",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-33"
  },
  {
    id: "bk-55",
    ref: "BK-T10705",
    serviceId: "svc-32",
    serviceName: "Premium Service",
    merchantName: "Blue Wave Pool",
    category: "Swimming Pool Slots",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-32"
  },
  {
    id: "bk-56",
    ref: "BK-G10101",
    serviceId: "svc-34",
    serviceName: "Standard Service",
    merchantName: "Cyber Core Cafe",
    category: "Gaming Arena Booking",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-35"
  },
  {
    id: "bk-57",
    ref: "BK-G10102",
    serviceId: "svc-35",
    serviceName: "Premium Service",
    merchantName: "Cyber Core Cafe",
    category: "Gaming Arena Booking",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-36"
  },
  {
    id: "bk-58",
    ref: "BK-G10103",
    serviceId: "svc-36",
    serviceName: "Quick Consult",
    merchantName: "Cyber Core Cafe",
    category: "Gaming Arena Booking",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-35"
  },
  {
    id: "bk-59",
    ref: "BK-G10104",
    serviceId: "svc-34",
    serviceName: "Standard Service",
    merchantName: "Cyber Core Cafe",
    category: "Gaming Arena Booking",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-36"
  },
  {
    id: "bk-60",
    ref: "BK-G10105",
    serviceId: "svc-35",
    serviceName: "Premium Service",
    merchantName: "Cyber Core Cafe",
    category: "Gaming Arena Booking",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-35"
  },
  {
    id: "bk-61",
    ref: "BK-G10201",
    serviceId: "svc-37",
    serviceName: "Standard Service",
    merchantName: "JumpZone Park",
    category: "Indoor Play Arena",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-38"
  },
  {
    id: "bk-62",
    ref: "BK-G10202",
    serviceId: "svc-38",
    serviceName: "Premium Service",
    merchantName: "JumpZone Park",
    category: "Indoor Play Arena",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-39"
  },
  {
    id: "bk-63",
    ref: "BK-G10203",
    serviceId: "svc-39",
    serviceName: "Quick Consult",
    merchantName: "JumpZone Park",
    category: "Indoor Play Arena",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-38"
  },
  {
    id: "bk-64",
    ref: "BK-G10204",
    serviceId: "svc-37",
    serviceName: "Standard Service",
    merchantName: "JumpZone Park",
    category: "Indoor Play Arena",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-39"
  },
  {
    id: "bk-65",
    ref: "BK-G10205",
    serviceId: "svc-38",
    serviceName: "Premium Service",
    merchantName: "JumpZone Park",
    category: "Indoor Play Arena",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-38"
  },
  {
    id: "bk-66",
    ref: "BK-R40401",
    serviceId: "svc-40",
    serviceName: "Standard Service",
    merchantName: "Grand Temple Restaurant",
    category: "Restaurant Table Reservation",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-41"
  },
  {
    id: "bk-67",
    ref: "BK-R40402",
    serviceId: "svc-41",
    serviceName: "Premium Service",
    merchantName: "Grand Temple Restaurant",
    category: "Restaurant Table Reservation",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-42"
  },
  {
    id: "bk-68",
    ref: "BK-R40403",
    serviceId: "svc-42",
    serviceName: "Quick Consult",
    merchantName: "Grand Temple Restaurant",
    category: "Restaurant Table Reservation",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-41"
  },
  {
    id: "bk-69",
    ref: "BK-R40404",
    serviceId: "svc-40",
    serviceName: "Standard Service",
    merchantName: "Grand Temple Restaurant",
    category: "Restaurant Table Reservation",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-42"
  },
  {
    id: "bk-70",
    ref: "BK-R40405",
    serviceId: "svc-41",
    serviceName: "Premium Service",
    merchantName: "Grand Temple Restaurant",
    category: "Restaurant Table Reservation",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-41"
  },
  {
    id: "bk-71",
    ref: "BK-S30301",
    serviceId: "svc-43",
    serviceName: "Standard Service",
    merchantName: "Style Studio",
    category: "Salon / Spa Appointment",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-44"
  },
  {
    id: "bk-72",
    ref: "BK-S30302",
    serviceId: "svc-44",
    serviceName: "Premium Service",
    merchantName: "Style Studio",
    category: "Salon / Spa Appointment",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-45"
  },
  {
    id: "bk-73",
    ref: "BK-S30303",
    serviceId: "svc-45",
    serviceName: "Quick Consult",
    merchantName: "Style Studio",
    category: "Salon / Spa Appointment",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-44"
  },
  {
    id: "bk-74",
    ref: "BK-S30304",
    serviceId: "svc-43",
    serviceName: "Standard Service",
    merchantName: "Style Studio",
    category: "Salon / Spa Appointment",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-45"
  },
  {
    id: "bk-75",
    ref: "BK-S30305",
    serviceId: "svc-44",
    serviceName: "Premium Service",
    merchantName: "Style Studio",
    category: "Salon / Spa Appointment",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-44"
  },
  {
    id: "bk-76",
    ref: "BK-F20201",
    serviceId: "svc-46",
    serviceName: "Standard Service",
    merchantName: "ZenFit Clinic",
    category: "Gym / Yoga Slot Booking",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-47"
  },
  {
    id: "bk-77",
    ref: "BK-F20202",
    serviceId: "svc-47",
    serviceName: "Premium Service",
    merchantName: "ZenFit Clinic",
    category: "Gym / Yoga Slot Booking",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-48"
  },
  {
    id: "bk-78",
    ref: "BK-F20203",
    serviceId: "svc-48",
    serviceName: "Quick Consult",
    merchantName: "ZenFit Clinic",
    category: "Gym / Yoga Slot Booking",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-47"
  },
  {
    id: "bk-79",
    ref: "BK-F20204",
    serviceId: "svc-46",
    serviceName: "Standard Service",
    merchantName: "ZenFit Clinic",
    category: "Gym / Yoga Slot Booking",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-48"
  },
  {
    id: "bk-80",
    ref: "BK-F20205",
    serviceId: "svc-47",
    serviceName: "Premium Service",
    merchantName: "ZenFit Clinic",
    category: "Gym / Yoga Slot Booking",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-47"
  },
  {
    id: "bk-81",
    ref: "BK-D10101",
    serviceId: "svc-49",
    serviceName: "Standard Service",
    merchantName: "Apollo Dental",
    category: "Doctor Appointment",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-50"
  },
  {
    id: "bk-82",
    ref: "BK-D10102",
    serviceId: "svc-50",
    serviceName: "Premium Service",
    merchantName: "Apollo Dental",
    category: "Doctor Appointment",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-51"
  },
  {
    id: "bk-83",
    ref: "BK-D10103",
    serviceId: "svc-51",
    serviceName: "Quick Consult",
    merchantName: "Apollo Dental",
    category: "Doctor Appointment",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-50"
  },
  {
    id: "bk-84",
    ref: "BK-D10104",
    serviceId: "svc-49",
    serviceName: "Standard Service",
    merchantName: "Apollo Dental",
    category: "Doctor Appointment",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-51"
  },
  {
    id: "bk-85",
    ref: "BK-D10105",
    serviceId: "svc-50",
    serviceName: "Premium Service",
    merchantName: "Apollo Dental",
    category: "Doctor Appointment",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-50"
  },
  {
    id: "bk-86",
    ref: "BK-E20101",
    serviceId: "svc-52",
    serviceName: "Standard Service",
    merchantName: "Spark Electricians",
    category: "Electrician Booking",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-53"
  },
  {
    id: "bk-87",
    ref: "BK-E20102",
    serviceId: "svc-53",
    serviceName: "Premium Service",
    merchantName: "Spark Electricians",
    category: "Electrician Booking",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-54"
  },
  {
    id: "bk-88",
    ref: "BK-E20103",
    serviceId: "svc-54",
    serviceName: "Quick Consult",
    merchantName: "Spark Electricians",
    category: "Electrician Booking",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-53"
  },
  {
    id: "bk-89",
    ref: "BK-E20104",
    serviceId: "svc-52",
    serviceName: "Standard Service",
    merchantName: "Spark Electricians",
    category: "Electrician Booking",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-54"
  },
  {
    id: "bk-90",
    ref: "BK-E20105",
    serviceId: "svc-53",
    serviceName: "Premium Service",
    merchantName: "Spark Electricians",
    category: "Electrician Booking",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-53"
  },
  {
    id: "bk-91",
    ref: "BK-E20201",
    serviceId: "svc-55",
    serviceName: "Standard Service",
    merchantName: "FlowTech Plumbers",
    category: "Plumber Booking",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-56"
  },
  {
    id: "bk-92",
    ref: "BK-E20202",
    serviceId: "svc-56",
    serviceName: "Premium Service",
    merchantName: "FlowTech Plumbers",
    category: "Plumber Booking",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-57"
  },
  {
    id: "bk-93",
    ref: "BK-E20203",
    serviceId: "svc-57",
    serviceName: "Quick Consult",
    merchantName: "FlowTech Plumbers",
    category: "Plumber Booking",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-56"
  },
  {
    id: "bk-94",
    ref: "BK-E20204",
    serviceId: "svc-55",
    serviceName: "Standard Service",
    merchantName: "FlowTech Plumbers",
    category: "Plumber Booking",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-57"
  },
  {
    id: "bk-95",
    ref: "BK-E20205",
    serviceId: "svc-56",
    serviceName: "Premium Service",
    merchantName: "FlowTech Plumbers",
    category: "Plumber Booking",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-56"
  },
  {
    id: "bk-96",
    ref: "BK-E20301",
    serviceId: "svc-58",
    serviceName: "Standard Service",
    merchantName: "Shine Home Cleaners",
    category: "Cleaning Service",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-59"
  },
  {
    id: "bk-97",
    ref: "BK-E20302",
    serviceId: "svc-59",
    serviceName: "Premium Service",
    merchantName: "Shine Home Cleaners",
    category: "Cleaning Service",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-60"
  },
  {
    id: "bk-98",
    ref: "BK-E20303",
    serviceId: "svc-60",
    serviceName: "Quick Consult",
    merchantName: "Shine Home Cleaners",
    category: "Cleaning Service",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-59"
  },
  {
    id: "bk-99",
    ref: "BK-E20304",
    serviceId: "svc-58",
    serviceName: "Standard Service",
    merchantName: "Shine Home Cleaners",
    category: "Cleaning Service",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-60"
  },
  {
    id: "bk-100",
    ref: "BK-E20305",
    serviceId: "svc-59",
    serviceName: "Premium Service",
    merchantName: "Shine Home Cleaners",
    category: "Cleaning Service",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-59"
  },
  {
    id: "bk-101",
    ref: "BK-E20401",
    serviceId: "svc-61",
    serviceName: "Standard Service",
    merchantName: "FixIt Tech Repairs",
    category: "Technician Service",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-62"
  },
  {
    id: "bk-102",
    ref: "BK-E20402",
    serviceId: "svc-62",
    serviceName: "Premium Service",
    merchantName: "FixIt Tech Repairs",
    category: "Technician Service",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-63"
  },
  {
    id: "bk-103",
    ref: "BK-E20403",
    serviceId: "svc-63",
    serviceName: "Quick Consult",
    merchantName: "FixIt Tech Repairs",
    category: "Technician Service",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-62"
  },
  {
    id: "bk-104",
    ref: "BK-E20404",
    serviceId: "svc-61",
    serviceName: "Standard Service",
    merchantName: "FixIt Tech Repairs",
    category: "Technician Service",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-63"
  },
  {
    id: "bk-105",
    ref: "BK-E20405",
    serviceId: "svc-62",
    serviceName: "Premium Service",
    merchantName: "FixIt Tech Repairs",
    category: "Technician Service",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-62"
  },
  {
    id: "bk-106",
    ref: "BK-W30101",
    serviceId: "svc-64",
    serviceName: "Standard Service",
    merchantName: "HubSpace",
    category: "Co-working Space",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-65"
  },
  {
    id: "bk-107",
    ref: "BK-W30102",
    serviceId: "svc-65",
    serviceName: "Premium Service",
    merchantName: "HubSpace",
    category: "Co-working Space",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-66"
  },
  {
    id: "bk-108",
    ref: "BK-W30103",
    serviceId: "svc-66",
    serviceName: "Quick Consult",
    merchantName: "HubSpace",
    category: "Co-working Space",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-65"
  },
  {
    id: "bk-109",
    ref: "BK-W30104",
    serviceId: "svc-64",
    serviceName: "Standard Service",
    merchantName: "HubSpace",
    category: "Co-working Space",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-66"
  },
  {
    id: "bk-110",
    ref: "BK-W30105",
    serviceId: "svc-65",
    serviceName: "Premium Service",
    merchantName: "HubSpace",
    category: "Co-working Space",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-65"
  },
  {
    id: "bk-111",
    ref: "BK-W30201",
    serviceId: "svc-67",
    serviceName: "Standard Service",
    merchantName: "Boardroom Plus",
    category: "Meeting Room",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-68"
  },
  {
    id: "bk-112",
    ref: "BK-W30202",
    serviceId: "svc-68",
    serviceName: "Premium Service",
    merchantName: "Boardroom Plus",
    category: "Meeting Room",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-69"
  },
  {
    id: "bk-113",
    ref: "BK-W30203",
    serviceId: "svc-69",
    serviceName: "Quick Consult",
    merchantName: "Boardroom Plus",
    category: "Meeting Room",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-68"
  },
  {
    id: "bk-114",
    ref: "BK-W30204",
    serviceId: "svc-67",
    serviceName: "Standard Service",
    merchantName: "Boardroom Plus",
    category: "Meeting Room",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-69"
  },
  {
    id: "bk-115",
    ref: "BK-W30205",
    serviceId: "svc-68",
    serviceName: "Premium Service",
    merchantName: "Boardroom Plus",
    category: "Meeting Room",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-68"
  },
  {
    id: "bk-116",
    ref: "BK-W30301",
    serviceId: "svc-70",
    serviceName: "Standard Service",
    merchantName: "AudioWave Cast",
    category: "Podcast Studio",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-71"
  },
  {
    id: "bk-117",
    ref: "BK-W30302",
    serviceId: "svc-71",
    serviceName: "Premium Service",
    merchantName: "AudioWave Cast",
    category: "Podcast Studio",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-72"
  },
  {
    id: "bk-118",
    ref: "BK-W30303",
    serviceId: "svc-72",
    serviceName: "Quick Consult",
    merchantName: "AudioWave Cast",
    category: "Podcast Studio",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-71"
  },
  {
    id: "bk-119",
    ref: "BK-W30304",
    serviceId: "svc-70",
    serviceName: "Standard Service",
    merchantName: "AudioWave Cast",
    category: "Podcast Studio",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-72"
  },
  {
    id: "bk-120",
    ref: "BK-W30305",
    serviceId: "svc-71",
    serviceName: "Premium Service",
    merchantName: "AudioWave Cast",
    category: "Podcast Studio",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-71"
  },
  {
    id: "bk-121",
    ref: "BK-W30401",
    serviceId: "svc-73",
    serviceName: "Standard Service",
    merchantName: "Summit Conference",
    category: "Conference Hall",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-74"
  },
  {
    id: "bk-122",
    ref: "BK-W30402",
    serviceId: "svc-74",
    serviceName: "Premium Service",
    merchantName: "Summit Conference",
    category: "Conference Hall",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-75"
  },
  {
    id: "bk-123",
    ref: "BK-W30403",
    serviceId: "svc-75",
    serviceName: "Quick Consult",
    merchantName: "Summit Conference",
    category: "Conference Hall",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-74"
  },
  {
    id: "bk-124",
    ref: "BK-W30404",
    serviceId: "svc-73",
    serviceName: "Standard Service",
    merchantName: "Summit Conference",
    category: "Conference Hall",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-75"
  },
  {
    id: "bk-125",
    ref: "BK-W30405",
    serviceId: "svc-74",
    serviceName: "Premium Service",
    merchantName: "Summit Conference",
    category: "Conference Hall",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-74"
  },
  {
    id: "bk-126",
    ref: "BK-W30501",
    serviceId: "svc-76",
    serviceName: "Standard Service",
    merchantName: "EduPro Sessions",
    category: "Training Sessions",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-77"
  },
  {
    id: "bk-127",
    ref: "BK-W30502",
    serviceId: "svc-77",
    serviceName: "Premium Service",
    merchantName: "EduPro Sessions",
    category: "Training Sessions",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-78"
  },
  {
    id: "bk-128",
    ref: "BK-W30503",
    serviceId: "svc-78",
    serviceName: "Quick Consult",
    merchantName: "EduPro Sessions",
    category: "Training Sessions",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-77"
  },
  {
    id: "bk-129",
    ref: "BK-W30504",
    serviceId: "svc-76",
    serviceName: "Standard Service",
    merchantName: "EduPro Sessions",
    category: "Training Sessions",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-78"
  },
  {
    id: "bk-130",
    ref: "BK-W30505",
    serviceId: "svc-77",
    serviceName: "Premium Service",
    merchantName: "EduPro Sessions",
    category: "Training Sessions",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-77"
  },
  {
    id: "bk-131",
    ref: "BK-W30601",
    serviceId: "svc-79",
    serviceName: "Standard Service",
    merchantName: "Shutter Studio",
    category: "Studio Booking",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-80"
  },
  {
    id: "bk-132",
    ref: "BK-W30602",
    serviceId: "svc-80",
    serviceName: "Premium Service",
    merchantName: "Shutter Studio",
    category: "Studio Booking",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-81"
  },
  {
    id: "bk-133",
    ref: "BK-W30603",
    serviceId: "svc-81",
    serviceName: "Quick Consult",
    merchantName: "Shutter Studio",
    category: "Studio Booking",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-80"
  },
  {
    id: "bk-134",
    ref: "BK-W30604",
    serviceId: "svc-79",
    serviceName: "Standard Service",
    merchantName: "Shutter Studio",
    category: "Studio Booking",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-81"
  },
  {
    id: "bk-135",
    ref: "BK-W30605",
    serviceId: "svc-80",
    serviceName: "Premium Service",
    merchantName: "Shutter Studio",
    category: "Studio Booking",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-80"
  },
  {
    id: "bk-136",
    ref: "BK-O80101",
    serviceId: "svc-82",
    serviceName: "Standard Service",
    merchantName: "Elite Planners",
    category: "Event Organizer Booking",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-83"
  },
  {
    id: "bk-137",
    ref: "BK-O80102",
    serviceId: "svc-83",
    serviceName: "Premium Service",
    merchantName: "Elite Planners",
    category: "Event Organizer Booking",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-84"
  },
  {
    id: "bk-138",
    ref: "BK-O80103",
    serviceId: "svc-84",
    serviceName: "Quick Consult",
    merchantName: "Elite Planners",
    category: "Event Organizer Booking",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-83"
  },
  {
    id: "bk-139",
    ref: "BK-O80104",
    serviceId: "svc-82",
    serviceName: "Standard Service",
    merchantName: "Elite Planners",
    category: "Event Organizer Booking",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-84"
  },
  {
    id: "bk-140",
    ref: "BK-O80105",
    serviceId: "svc-83",
    serviceName: "Premium Service",
    merchantName: "Elite Planners",
    category: "Event Organizer Booking",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-83"
  },
  {
    id: "bk-141",
    ref: "BK-V40101",
    serviceId: "svc-85",
    serviceName: "Standard Service",
    merchantName: "City Wheels",
    category: "Cycle Rental",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-86"
  },
  {
    id: "bk-142",
    ref: "BK-V40102",
    serviceId: "svc-86",
    serviceName: "Premium Service",
    merchantName: "City Wheels",
    category: "Cycle Rental",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-87"
  },
  {
    id: "bk-143",
    ref: "BK-V40103",
    serviceId: "svc-87",
    serviceName: "Quick Consult",
    merchantName: "City Wheels",
    category: "Cycle Rental",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-86"
  },
  {
    id: "bk-144",
    ref: "BK-V40104",
    serviceId: "svc-85",
    serviceName: "Standard Service",
    merchantName: "City Wheels",
    category: "Cycle Rental",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-87"
  },
  {
    id: "bk-145",
    ref: "BK-V40105",
    serviceId: "svc-86",
    serviceName: "Premium Service",
    merchantName: "City Wheels",
    category: "Cycle Rental",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-86"
  },
  {
    id: "bk-146",
    ref: "BK-V40201",
    serviceId: "svc-88",
    serviceName: "Standard Service",
    merchantName: "Rev Rider",
    category: "Sports Bike Rental",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-89"
  },
  {
    id: "bk-147",
    ref: "BK-V40202",
    serviceId: "svc-89",
    serviceName: "Premium Service",
    merchantName: "Rev Rider",
    category: "Sports Bike Rental",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-90"
  },
  {
    id: "bk-148",
    ref: "BK-V40203",
    serviceId: "svc-90",
    serviceName: "Quick Consult",
    merchantName: "Rev Rider",
    category: "Sports Bike Rental",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-89"
  },
  {
    id: "bk-149",
    ref: "BK-V40204",
    serviceId: "svc-88",
    serviceName: "Standard Service",
    merchantName: "Rev Rider",
    category: "Sports Bike Rental",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-90"
  },
  {
    id: "bk-150",
    ref: "BK-V40205",
    serviceId: "svc-89",
    serviceName: "Premium Service",
    merchantName: "Rev Rider",
    category: "Sports Bike Rental",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-89"
  },
  {
    id: "bk-151",
    ref: "BK-M50101",
    serviceId: "svc-91",
    serviceName: "Standard Service",
    merchantName: "Lens Crafters",
    category: "Camera Rental",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-92"
  },
  {
    id: "bk-152",
    ref: "BK-M50102",
    serviceId: "svc-92",
    serviceName: "Premium Service",
    merchantName: "Lens Crafters",
    category: "Camera Rental",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-93"
  },
  {
    id: "bk-153",
    ref: "BK-M50103",
    serviceId: "svc-93",
    serviceName: "Quick Consult",
    merchantName: "Lens Crafters",
    category: "Camera Rental",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-92"
  },
  {
    id: "bk-154",
    ref: "BK-M50104",
    serviceId: "svc-91",
    serviceName: "Standard Service",
    merchantName: "Lens Crafters",
    category: "Camera Rental",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-93"
  },
  {
    id: "bk-155",
    ref: "BK-M50105",
    serviceId: "svc-92",
    serviceName: "Premium Service",
    merchantName: "Lens Crafters",
    category: "Camera Rental",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-92"
  },
  {
    id: "bk-156",
    ref: "BK-M50201",
    serviceId: "svc-94",
    serviceName: "Standard Service",
    merchantName: "Bass Drop Audio",
    category: "Sound System Rental",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-95"
  },
  {
    id: "bk-157",
    ref: "BK-M50202",
    serviceId: "svc-95",
    serviceName: "Premium Service",
    merchantName: "Bass Drop Audio",
    category: "Sound System Rental",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-96"
  },
  {
    id: "bk-158",
    ref: "BK-M50203",
    serviceId: "svc-96",
    serviceName: "Quick Consult",
    merchantName: "Bass Drop Audio",
    category: "Sound System Rental",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-95"
  },
  {
    id: "bk-159",
    ref: "BK-M50204",
    serviceId: "svc-94",
    serviceName: "Standard Service",
    merchantName: "Bass Drop Audio",
    category: "Sound System Rental",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-96"
  },
  {
    id: "bk-160",
    ref: "BK-M50205",
    serviceId: "svc-95",
    serviceName: "Premium Service",
    merchantName: "Bass Drop Audio",
    category: "Sound System Rental",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-95"
  },
  {
    id: "bk-161",
    ref: "BK-M50301",
    serviceId: "svc-97",
    serviceName: "Standard Service",
    merchantName: "Party Supply Co",
    category: "Event Equipment Rental",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-98"
  },
  {
    id: "bk-162",
    ref: "BK-M50302",
    serviceId: "svc-98",
    serviceName: "Premium Service",
    merchantName: "Party Supply Co",
    category: "Event Equipment Rental",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-99"
  },
  {
    id: "bk-163",
    ref: "BK-M50303",
    serviceId: "svc-99",
    serviceName: "Quick Consult",
    merchantName: "Party Supply Co",
    category: "Event Equipment Rental",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-98"
  },
  {
    id: "bk-164",
    ref: "BK-M50304",
    serviceId: "svc-97",
    serviceName: "Standard Service",
    merchantName: "Party Supply Co",
    category: "Event Equipment Rental",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-99"
  },
  {
    id: "bk-165",
    ref: "BK-M50305",
    serviceId: "svc-98",
    serviceName: "Premium Service",
    merchantName: "Party Supply Co",
    category: "Event Equipment Rental",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-98"
  },
  {
    id: "bk-166",
    ref: "BK-P60101",
    serviceId: "svc-100",
    serviceName: "Standard Service",
    merchantName: "Paws & Bubbles",
    category: "Pet Grooming Appointment",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-101"
  },
  {
    id: "bk-167",
    ref: "BK-P60102",
    serviceId: "svc-101",
    serviceName: "Premium Service",
    merchantName: "Paws & Bubbles",
    category: "Pet Grooming Appointment",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-102"
  },
  {
    id: "bk-168",
    ref: "BK-P60103",
    serviceId: "svc-102",
    serviceName: "Quick Consult",
    merchantName: "Paws & Bubbles",
    category: "Pet Grooming Appointment",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-101"
  },
  {
    id: "bk-169",
    ref: "BK-P60104",
    serviceId: "svc-100",
    serviceName: "Standard Service",
    merchantName: "Paws & Bubbles",
    category: "Pet Grooming Appointment",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-102"
  },
  {
    id: "bk-170",
    ref: "BK-P60105",
    serviceId: "svc-101",
    serviceName: "Premium Service",
    merchantName: "Paws & Bubbles",
    category: "Pet Grooming Appointment",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-101"
  },
  {
    id: "bk-171",
    ref: "BK-B70101",
    serviceId: "svc-103",
    serviceName: "Standard Service",
    merchantName: "SafeHands Nannies",
    category: "Babysitting Service",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-104"
  },
  {
    id: "bk-172",
    ref: "BK-B70102",
    serviceId: "svc-104",
    serviceName: "Premium Service",
    merchantName: "SafeHands Nannies",
    category: "Babysitting Service",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-105"
  },
  {
    id: "bk-173",
    ref: "BK-B70103",
    serviceId: "svc-105",
    serviceName: "Quick Consult",
    merchantName: "SafeHands Nannies",
    category: "Babysitting Service",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-104"
  },
  {
    id: "bk-174",
    ref: "BK-B70104",
    serviceId: "svc-103",
    serviceName: "Standard Service",
    merchantName: "SafeHands Nannies",
    category: "Babysitting Service",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-105"
  },
  {
    id: "bk-175",
    ref: "BK-B70105",
    serviceId: "svc-104",
    serviceName: "Premium Service",
    merchantName: "SafeHands Nannies",
    category: "Babysitting Service",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-104"
  },
  {
    id: "bk-176",
    ref: "BK-B70201",
    serviceId: "svc-106",
    serviceName: "Standard Service",
    merchantName: "Compassion Care",
    category: "Elder Care Service",
    date: "2026-08-04",
    time: "09:00 AM",
    amount: 500,
    status: "CONFIRMED",
    customerName: "Rahul Verma",
    customerEmail: "rahul@gmail.com",
    customerPhone: "+91 9988776655",
    assignedDoctorId: "stf-107"
  },
  {
    id: "bk-177",
    ref: "BK-B70202",
    serviceId: "svc-107",
    serviceName: "Premium Service",
    merchantName: "Compassion Care",
    category: "Elder Care Service",
    date: "2026-08-04",
    time: "10:00 AM",
    amount: 1500,
    status: "CONFIRMED",
    customerName: "Sneha Patel",
    customerEmail: "sneha@gmail.com",
    customerPhone: "+91 8877665544",
    assignedDoctorId: "stf-108"
  },
  {
    id: "bk-178",
    ref: "BK-B70203",
    serviceId: "svc-108",
    serviceName: "Quick Consult",
    merchantName: "Compassion Care",
    category: "Elder Care Service",
    date: "2026-08-04",
    time: "11:30 AM",
    amount: 300,
    status: "CHECKED_IN",
    customerName: "Vikram Singh",
    customerEmail: "vikram@gmail.com",
    customerPhone: "+91 7766554433",
    assignedDoctorId: "stf-107"
  },
  {
    id: "bk-179",
    ref: "BK-B70204",
    serviceId: "svc-106",
    serviceName: "Standard Service",
    merchantName: "Compassion Care",
    category: "Elder Care Service",
    date: "2026-08-04",
    time: "02:00 PM",
    amount: 500,
    status: "CHECKED_IN",
    customerName: "Anjali Desai",
    customerEmail: "anjali@gmail.com",
    customerPhone: "+91 6655443322",
    assignedDoctorId: "stf-108"
  },
  {
    id: "bk-180",
    ref: "BK-B70205",
    serviceId: "svc-107",
    serviceName: "Premium Service",
    merchantName: "Compassion Care",
    category: "Elder Care Service",
    date: "2026-08-04",
    time: "05:00 PM",
    amount: 1500,
    status: "COMPLETED",
    customerName: "Karthik Raj",
    customerEmail: "karthik@gmail.com",
    customerPhone: "+91 5544332211",
    assignedDoctorId: "stf-107"
  }
];

function formatSlug(slug: string): string {
  const mapping: Record<string, string> = {
    flights: 'Flight Booking',
    trains: 'Train Booking',
    buses: 'Bus Booking',
    ferry: 'Ferry / Boat Booking',
    shuttle: 'Shuttle / Van Booking',
    helicopter: 'Helicopter Booking',
    cabs: 'Cab / Taxi Booking',
    'bike-rental': 'Bike Rental',
    'car-rental': 'Self-Drive Car Rental',
    hotels: 'Hotel Booking',
    resorts: 'Resort Booking',
    villas: 'Homestay / Villa',
    hostels: 'Hostel Booking',
    camping: 'Camping Booking',
    movies: 'Cinema / Movie Tickets',
    theatre: 'Theatre Shows',
    concerts: 'Concert Tickets',
    events: 'Events & Festivals',
    exhibitions: 'Exhibition Entry',
    workshops: 'Workshops / Classes',
    gaming: 'Gaming Arena Booking',
    'football-turf': 'Football Turf',
    'cricket-ground': 'Cricket Ground',
    badminton: 'Badminton Court',
    tennis: 'Tennis Court',
    basketball: 'Basketball Court',
    swimming: 'Swimming Pool Slots',
    'play-arena': 'Indoor Play Arena',
    dining: 'Restaurant Table Reservation',
    salons: 'Salon / Spa Appointment',
    'gym-yoga': 'Gym / Yoga Slot Booking',
    doctor: 'Doctor Appointment',
    electrician: 'Electrician Booking',
    plumber: 'Plumber Booking',
    cleaning: 'Cleaning Service',
    technician: 'Technician Service',
    studio: 'Studio Booking',
    coworking: 'Co-working Space',
    'meeting-room': 'Meeting Room',
    podcast: 'Podcast Studio',
    conference: 'Conference Hall',
    training: 'Training Sessions',
    darshan: 'Temple Darshan Booking',
    pooja: 'Pooja Slot Booking',
    pilgrimage: 'Pilgrimage Packages',
    'cycle-rental': 'Cycle Rental',
    'sports-bike': 'Sports Bike Rental',
    camera: 'Camera Rental',
    'sound-system': 'Sound System Rental',
    'event-equip': 'Event Equipment Rental',
    'pet-grooming': 'Pet Grooming Appointment',
    babysitting: 'Babysitting Service',
    'elder-care': 'Elder Care Service',
    'event-organizer': 'Event Organizer Booking',
  };
  
  if (mapping[slug]) return mapping[slug];
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getMockServicesForAdminMerchant(merchant: MerchantUser): CatalogService[] {
  return [
    {
      id: `ds-${merchant.username}-1`,
      name: `Standard ${merchant.category} Service`,
      merchant: merchant.merchantName,
      price: 499,
      duration: 45,
      category: merchant.category,
      active: true,
      rating: 4.7,
      bookingsCount: 24,
      description: `Professional standard ${merchant.category} package.`
    },
    {
      id: `ds-${merchant.username}-2`,
      name: `Premium ${merchant.category} Package`,
      merchant: merchant.merchantName,
      price: 1499,
      duration: 90,
      category: merchant.category,
      active: true,
      rating: 4.9,
      bookingsCount: 12,
      description: `Complete luxury ${merchant.category} experience.`
    }
  ];
}

export interface SubAccount {
  subId: string;
  merchantId: string;
  passwordHash: string;
}

export const SUB_ACCOUNTS: SubAccount[] = [
  { subId: 'D101', merchantId: 'mer-1', passwordHash: 'pass101' },
  { subId: 'F202', merchantId: 'mer-2', passwordHash: 'pass202' },
  { subId: 'S303', merchantId: 'mer-3', passwordHash: 'pass303' },
  { subId: 'R404', merchantId: 'mer-4', passwordHash: 'pass404' },
  { subId: 'G505', merchantId: 'mer-5', passwordHash: 'pass505' },
  { subId: 'U606', merchantId: 'mer-6', passwordHash: 'pass606' },
  { subId: 'C707', merchantId: 'mer-7', passwordHash: 'pass707' },
  { subId: 'W808', merchantId: 'mer-8', passwordHash: 'pass808' },
  { subId: 'T102', merchantId: 'mer-102', passwordHash: 'pass102' }
];

export const VENDOR_ACCOUNTS = [
  { username: 'admin', passwordHash: 'admin123' },
  { username: 'vendor123', passwordHash: 'vendorpass123' }
];

export const useVendorStore = create<VendorStoreState>()(
  persist(
    (set, get) => ({
      currentMerchant: null,
      loginRole: null,
      supervisorId: null,
      currentStaff: null,
      theme: 'system',
      bookings: INITIAL_BOOKINGS,
      services: INITIAL_SERVICES,
      staffAccounts: [
        {
          id: 'ref1@arena5.com',
          merchantId: 'mer-102',
          name: 'Vikram Singh',
          roleTitle: 'Senior Referee',
          isDoctor: true,
          passwordHash: 'pass123',
          permissions: { canManageVitals: true, canAddPrescription: true, canManageBilling: true, canManageAppointments: true }
        },
        {
          id: 'manager@arena5.com',
          merchantId: 'mer-102',
          name: 'Ramesh Kumar',
          roleTitle: 'Turf Manager',
          isDoctor: true,
          passwordHash: 'pass123',
          permissions: { canManageVitals: true, canAddPrescription: true, canManageBilling: true, canManageAppointments: true }
        },
        {
          id: 'doc1@apollo.com',
          merchantId: 'mer-1',
          name: 'Sanjay Gupta',
          roleTitle: 'Cardiologist',
          isDoctor: true,
          passwordHash: 'pass123',
          permissions: { canManageVitals: true, canAddPrescription: true, canManageBilling: false, canManageAppointments: true }
        },
        {
          id: 'doc2@apollo.com',
          merchantId: 'mer-1',
          name: 'Priya Sharma',
          roleTitle: 'Dentist',
          isDoctor: true,
          passwordHash: 'pass123',
          permissions: { canManageVitals: true, canAddPrescription: true, canManageBilling: false, canManageAppointments: true }
        }
      ],
      
      setTheme: (theme) => set({ theme }),
      
      loginMerchant: (username, passwordHash) => {
        const cleanUser = username.trim();
        const lowerUser = cleanUser.toLowerCase();

        // 0. Check Staff Account (Sub ID)
        const staffAcc = get().staffAccounts.find(
          (s) => s.id.toLowerCase() === lowerUser && s.passwordHash === passwordHash
        );
        if (staffAcc) {
          const found = PRESET_MERCHANTS.find((m) => m.id === staffAcc.merchantId);
          if (found) {
            set({ currentMerchant: found, loginRole: 'staff', supervisorId: null, currentStaff: staffAcc });
            return true;
          }
        }

        // 1. Check Sub ID (Supervisor)
        const subAcc = SUB_ACCOUNTS.find(
          (s) => s.subId.toUpperCase() === cleanUser.toUpperCase() && s.passwordHash === passwordHash
        );
        if (subAcc) {
          const found = PRESET_MERCHANTS.find((m) => m.id === subAcc.merchantId);
          if (found) {
            set({ currentMerchant: found, loginRole: 'supervisor', supervisorId: subAcc.subId });
            // Seed services for this merchant if not present
            const hasServices = get().services.some(s => s.merchant === found.merchantName);
            if (!hasServices) {
              const newServices = getMockServicesForAdminMerchant(found);
              set({ services: [...get().services, ...newServices] });
            }
            return true;
          }
        }

        // 2. Check Main Vendor Account
        const isVendor = VENDOR_ACCOUNTS.some(
          (v) => v.username.toLowerCase() === lowerUser && v.passwordHash === passwordHash
        );
        // Fallback for old preset login for testing if passcode is '123' or 'passXXX'
        const expectedNumeric = lowerUser.replace(/\D/g, '');
        const expectedPasscode = expectedNumeric ? 'pass' + expectedNumeric : '123';
        
        const isLegacyPreset = (passwordHash === '123' || passwordHash === expectedPasscode) && PRESET_MERCHANTS.some(m => m.username.toLowerCase() === lowerUser || lowerUser === 'admin');

        if (isVendor || isLegacyPreset) {
          const checkUsername = lowerUser === 'admin' || lowerUser === 'vendor123' ? 'doctor' : lowerUser;
          let found = PRESET_MERCHANTS.find((m) => m.username.toLowerCase() === checkUsername);
          if (!found) {
            found = PRESET_MERCHANTS[0];
          }
          set({ currentMerchant: found, loginRole: 'vendor', supervisorId: null });
          
          // Seed services for this merchant if not present
          const hasServices = get().services.some(s => s.merchant === found.merchantName);
          if (!hasServices) {
            const newServices = getMockServicesForAdminMerchant(found);
            set({ services: [...get().services, ...newServices] });
          }
          return true;
        }

        return false;
      },
      
      logoutMerchant: () => {
        set({ currentMerchant: null, loginRole: null, supervisorId: null, currentStaff: null });
      },
      
      switchStore: (merchantId) => {
        let found = PRESET_MERCHANTS.find((m) => m.id === merchantId);
        if (!found && merchantId.startsWith('mer-')) {
          const checkUsername = merchantId.replace('mer-', '');
          const categoryName = formatSlug(checkUsername);
          found = {
            id: merchantId,
            username: checkUsername,
            merchantName: `${categoryName} Care Hub`,
            category: categoryName,
            logoLetter: categoryName.charAt(0),
            aboutText: `Welcome to ${categoryName} Care Hub. We provide professional bookings and top-tier services.`
          };
        }
        if (found) {
          set({ currentMerchant: found });
          
          // Seed services for this merchant if not present
          const hasServices = get().services.some(s => s.merchant === found.merchantName);
          if (!hasServices) {
            const newServices = getMockServicesForAdminMerchant(found);
            set({ services: [...get().services, ...newServices] });
          }
        }
      },
      
      checkInBooking: (bookingId) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: 'CHECKED_IN' as const } : b
          )
        }));
      },
      
      completeBooking: (bookingId) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: 'COMPLETED' } : b
          ),
        })),

      cancelBooking: (bookingId) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: 'CANCELLED' } : b
          ),
        })),

      rescheduleBooking: (bookingId, newDate, newTime) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, date: newDate, time: newTime } : b
          ),
        })),

      updateBookingNotes: (bookingId, notes) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, notes } : b
          )
        }));
      },
      
      // Medical actions
      uploadReport: (bookingId, reportName) => {
        const newReport = {
          id: `rep-${Date.now()}`,
          name: reportName,
          url: 'https://picsum.photos/seed/rep/300/300',
          uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
        set((state) => ({
          bookings: state.bookings.map((b) => {
            if (b.id === bookingId) {
              const currentReports = b.medicalReports || [];
              return { ...b, medicalReports: [...currentReports, newReport] };
            }
            return b;
          })
        }));
      },
      
      deleteReport: (bookingId, reportId) => {
        set((state) => ({
          bookings: state.bookings.map((b) => {
            if (b.id === bookingId) {
              const currentReports = b.medicalReports || [];
              return {
                ...b,
                medicalReports: currentReports.filter((r) => r.id !== reportId)
              };
            }
            return b;
          })
        }));
      },
      
      savePrescription: (bookingId, prescription) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, prescription } : b
          )
        }));
      },
      
      // Fitness actions
      assignDiet: (bookingId, diet) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, dietPlan: diet } : b
          )
        }));
      },
      
      saveWorkout: (bookingId, workout) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, workoutPlan: workout } : b
          )
        }));
      },
      
      // Salon actions
      saveStylingDetails: (bookingId, details) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId
              ? {
                  ...b,
                  stylistAssigned: details.stylist,
                  hairType: details.hairType,
                  skinType: details.skinType,
                  stylingNotes: details.stylingNotes
                }
              : b
          )
        }));
      },
      
      uploadBeforeAfterPhoto: (bookingId, photoSeed) => {
        const photoUrl = `https://picsum.photos/seed/${photoSeed}/200/200`;
        set((state) => ({
          bookings: state.bookings.map((b) => {
            if (b.id === bookingId) {
              const currentGallery = b.beforeAfterGallery || [];
              return { ...b, beforeAfterGallery: [...currentGallery, photoUrl] };
            }
            return b;
          })
        }));
      },
      
      // Dining actions
      assignTable: (bookingId, tableNumber) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, tableNumber } : b
          )
        }));
      },
      
      saveDietaryAlerts: (bookingId, alerts) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, dietaryRestrictions: alerts } : b
          )
        }));
      },

      // Services actions
      addService: (service) => {
        set((state) => ({
          services: [service, ...state.services]
        }));
      },
      
      updateService: (updated) => {
        set((state) => ({
          services: state.services.map((s) => (s.id === updated.id ? updated : s))
        }));
      },
      
      deleteService: (serviceId) => {
        set((state) => ({
          services: state.services.filter((s) => s.id !== serviceId)
        }));
      },

      // Staff actions
      addStaffMember: (staff) => {
        set((state) => ({
          staffAccounts: [...state.staffAccounts, staff]
        }));
      },
      
      updateStaffPermissions: (staffId, permissions) => {
        set((state) => ({
          staffAccounts: state.staffAccounts.map((s) => 
            s.id === staffId ? { ...s, permissions } : s
          ),
          currentStaff: state.currentStaff?.id === staffId 
            ? { ...state.currentStaff, permissions } 
            : state.currentStaff
        }));
      },
      
      deleteStaffMember: (staffId) => {
        set((state) => ({
          staffAccounts: state.staffAccounts.filter((s) => s.id !== staffId)
        }));
      }
    }),
    { name: 'vendor-portal-storage-v2' }
  )
);
