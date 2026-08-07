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
  customerEmail?: string;
  customerPhone: string;
  notes?: string;
  otp?: string;
  
  // Doctor/Medical specific fields
  assignedDoctorId?: string;
  assignedDoctorName?: string;
  paymentStatus?: string;
  isWalkIn?: boolean;
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

export interface SupportTicket {
  id: string;
  merchantId: string;
  merchantName: string;
  subject: string;
  message: string;
  status: 'open' | 'pending' | 'resolved';
  createdAt: string;
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
  isCustomized?: boolean;
  activeModules?: string[];
  customDictionary?: Record<string, string>;
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
  archetype?: 'Healthcare' | 'ResourceBooking' | 'Service' | 'Dining' | 'Accommodation' | 'SportsFacility' | 'Fitness' | 'EventSpace' | 'Rental' | 'CareServices';
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
  customMerchants: Record<string, Partial<MerchantUser>>;
  
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

  completeOnboarding: (merchantId: string, setupData: { activeModules: string[], customDictionary: Record<string, string>, merchantName?: string, archetype?: string }) => void;
  updateMerchantModules: (merchantId: string, activeModules: string[], customDictionary?: Record<string, string>) => void;
  resetOnboarding: (merchantId: string) => void;

  // Support Tickets
  supportTickets: SupportTicket[];
  fetchSupportTickets: () => Promise<void>;
  addSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'timestamp' | 'status' | 'createdAt'>) => void;
  resolveSupportTicket: (ticketId: string) => void;
  updateSupportTicketStatus: (ticketId: string, status: 'open' | 'pending' | 'resolved') => void;
}

export const PRESET_MERCHANTS: MerchantUser[] = [

  {
    id: 'mer-901',
    username: 'O501',
    isCustomized: false,
    merchantName: 'Alpha Logistics',
    category: 'Logistics',
    logoLetter: 'A',
    aboutText: 'Generic business example for other categories.',
    vendorId: '2026090100',
    email: 'o501@bnxmail.com',
    archetype: 'Service'
  },
  {
    id: 'mer-902',
    username: 'O502',
    isCustomized: false,
    merchantName: 'Beta Security',
    category: 'Security Services',
    logoLetter: 'B',
    aboutText: 'Generic business example for other categories.',
    vendorId: '2026090200',
    email: 'o502@bnxmail.com',
    archetype: 'Service'
  },
  {
    id: 'mer-903',
    username: 'O503',
    isCustomized: false,
    merchantName: 'Gamma Education',
    category: 'Tutoring',
    logoLetter: 'G',
    aboutText: 'Generic business example for other categories.',
    vendorId: '2026090300',
    email: 'o503@bnxmail.com',
    archetype: 'Service'
  },

  {
    id: 'mer-100',
    username: 'H101',
    merchantName: 'Grand Hotel',
    category: 'Hotel Booking',
    logoLetter: 'G',
    aboutText: 'Grand Hotel is a premier provider of Hotel Booking services.',
    vendorId: '2026050100',
    email: 'h101@bnxmail.com',
    archetype: 'Accommodation'
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
    archetype: 'Accommodation'
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
    archetype: 'Accommodation'
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
    archetype: 'Accommodation'
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
    archetype: 'Accommodation'
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
    archetype: 'SportsFacility'
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
    archetype: 'Service'
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
    archetype: 'SportsFacility'
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
    archetype: 'SportsFacility'
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
    archetype: 'SportsFacility'
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
    archetype: 'SportsFacility'
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
    archetype: 'SportsFacility'
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
    archetype: 'SportsFacility'
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
    archetype: 'Fitness'
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
    archetype: 'EventSpace'
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
    archetype: 'EventSpace'
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
    archetype: 'EventSpace'
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
    archetype: 'EventSpace'
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
    archetype: 'Fitness'
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
    archetype: 'EventSpace'
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
    archetype: 'EventSpace'
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
    archetype: 'Rental'
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
    archetype: 'Rental'
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
    archetype: 'Rental'
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
    archetype: 'Rental'
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
    archetype: 'Rental'
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
    archetype: 'EventSpace'
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
    archetype: 'CareServices'
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
    archetype: 'CareServices'
  },
];

const INITIAL_SERVICES: CatalogService[] = [
  {
    "id": "svc-1",
    "name": "Deluxe Room Booking",
    "merchant": "Grand Hotel",
    "price": 500,
    "duration": 60,
    "category": "Hotel Booking",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-2",
    "name": "Executive Suite",
    "merchant": "Grand Hotel",
    "price": 1500,
    "duration": 90,
    "category": "Hotel Booking",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-3",
    "name": "Presidential Suite",
    "merchant": "Grand Hotel",
    "price": 3500,
    "duration": 120,
    "category": "Hotel Booking",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-4",
    "name": "Deluxe Room Booking",
    "merchant": "Sunstone Resort",
    "price": 500,
    "duration": 60,
    "category": "Resort Booking",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-5",
    "name": "Executive Suite",
    "merchant": "Sunstone Resort",
    "price": 1500,
    "duration": 90,
    "category": "Resort Booking",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-6",
    "name": "Presidential Suite",
    "merchant": "Sunstone Resort",
    "price": 3500,
    "duration": 120,
    "category": "Resort Booking",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-7",
    "name": "Deluxe Room Booking",
    "merchant": "Riverfront Villa",
    "price": 500,
    "duration": 60,
    "category": "Homestay / Villa",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-8",
    "name": "Executive Suite",
    "merchant": "Riverfront Villa",
    "price": 1500,
    "duration": 90,
    "category": "Homestay / Villa",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-9",
    "name": "Presidential Suite",
    "merchant": "Riverfront Villa",
    "price": 3500,
    "duration": 120,
    "category": "Homestay / Villa",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-10",
    "name": "Standard Slot",
    "merchant": "Backpackers Hostel",
    "price": 500,
    "duration": 60,
    "category": "Hostel Booking",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-11",
    "name": "VIP Access",
    "merchant": "Backpackers Hostel",
    "price": 1500,
    "duration": 90,
    "category": "Hostel Booking",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-12",
    "name": "Group Session",
    "merchant": "Backpackers Hostel",
    "price": 3500,
    "duration": 120,
    "category": "Hostel Booking",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-13",
    "name": "Standard Slot",
    "merchant": "Pine Trails Camp",
    "price": 500,
    "duration": 60,
    "category": "Camping Booking",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-14",
    "name": "VIP Access",
    "merchant": "Pine Trails Camp",
    "price": 1500,
    "duration": 90,
    "category": "Camping Booking",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-15",
    "name": "Group Session",
    "merchant": "Pine Trails Camp",
    "price": 3500,
    "duration": 120,
    "category": "Camping Booking",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-16",
    "name": "1-Hour Standard Slot",
    "merchant": "Arena 5 Turf",
    "price": 500,
    "duration": 60,
    "category": "Football Turf",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs.",
    "doctorId": "ref1@arena5.com",
    "doctorName": "Vikram Singh"
  },
  {
    "id": "svc-17",
    "name": "2-Hour Tournament Slot",
    "merchant": "Arena 5 Turf",
    "price": 1500,
    "duration": 90,
    "category": "Football Turf",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits.",
    "doctorId": "ref1@arena5.com",
    "doctorName": "Vikram Singh"
  },
  {
    "id": "svc-18",
    "name": "Coaching Session",
    "merchant": "Arena 5 Turf",
    "price": 3500,
    "duration": 120,
    "category": "Football Turf",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering.",
    "doctorId": "ref1@arena5.com",
    "doctorName": "Vikram Singh"
  },
  {
    "id": "svc-19",
    "name": "1-Hour Standard Slot",
    "merchant": "Pitch Perfect Grounds",
    "price": 500,
    "duration": 60,
    "category": "Cricket Ground",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-20",
    "name": "2-Hour Tournament Slot",
    "merchant": "Pitch Perfect Grounds",
    "price": 1500,
    "duration": 90,
    "category": "Cricket Ground",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-21",
    "name": "Coaching Session",
    "merchant": "Pitch Perfect Grounds",
    "price": 3500,
    "duration": 120,
    "category": "Cricket Ground",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-22",
    "name": "1-Hour Standard Slot",
    "merchant": "Smash Academy",
    "price": 500,
    "duration": 60,
    "category": "Badminton Court",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-23",
    "name": "2-Hour Tournament Slot",
    "merchant": "Smash Academy",
    "price": 1500,
    "duration": 90,
    "category": "Badminton Court",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-24",
    "name": "Coaching Session",
    "merchant": "Smash Academy",
    "price": 3500,
    "duration": 120,
    "category": "Badminton Court",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-25",
    "name": "1-Hour Standard Slot",
    "merchant": "Grand Slam Club",
    "price": 500,
    "duration": 60,
    "category": "Tennis Court",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-26",
    "name": "2-Hour Tournament Slot",
    "merchant": "Grand Slam Club",
    "price": 1500,
    "duration": 90,
    "category": "Tennis Court",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-27",
    "name": "Coaching Session",
    "merchant": "Grand Slam Club",
    "price": 3500,
    "duration": 120,
    "category": "Tennis Court",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-28",
    "name": "1-Hour Standard Slot",
    "merchant": "Hoop Kings Arena",
    "price": 500,
    "duration": 60,
    "category": "Basketball Court",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-29",
    "name": "2-Hour Tournament Slot",
    "merchant": "Hoop Kings Arena",
    "price": 1500,
    "duration": 90,
    "category": "Basketball Court",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-30",
    "name": "Coaching Session",
    "merchant": "Hoop Kings Arena",
    "price": 3500,
    "duration": 120,
    "category": "Basketball Court",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-31",
    "name": "Standard Slot",
    "merchant": "Blue Wave Pool",
    "price": 500,
    "duration": 60,
    "category": "Swimming Pool Slots",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-32",
    "name": "VIP Access",
    "merchant": "Blue Wave Pool",
    "price": 1500,
    "duration": 90,
    "category": "Swimming Pool Slots",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-33",
    "name": "Group Session",
    "merchant": "Blue Wave Pool",
    "price": 3500,
    "duration": 120,
    "category": "Swimming Pool Slots",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-34",
    "name": "Standard Slot",
    "merchant": "Cyber Core Cafe",
    "price": 500,
    "duration": 60,
    "category": "Gaming Arena Booking",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-35",
    "name": "VIP Access",
    "merchant": "Cyber Core Cafe",
    "price": 1500,
    "duration": 90,
    "category": "Gaming Arena Booking",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-36",
    "name": "Group Session",
    "merchant": "Cyber Core Cafe",
    "price": 3500,
    "duration": 120,
    "category": "Gaming Arena Booking",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-37",
    "name": "Standard Slot",
    "merchant": "JumpZone Park",
    "price": 500,
    "duration": 60,
    "category": "Indoor Play Arena",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-38",
    "name": "VIP Access",
    "merchant": "JumpZone Park",
    "price": 1500,
    "duration": 90,
    "category": "Indoor Play Arena",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-39",
    "name": "Group Session",
    "merchant": "JumpZone Park",
    "price": 3500,
    "duration": 120,
    "category": "Indoor Play Arena",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-40",
    "name": "Table for 2",
    "merchant": "Grand Temple Restaurant",
    "price": 500,
    "duration": 60,
    "category": "Restaurant Table Reservation",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-41",
    "name": "Family Table (4-6)",
    "merchant": "Grand Temple Restaurant",
    "price": 1500,
    "duration": 90,
    "category": "Restaurant Table Reservation",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-42",
    "name": "VIP Dining Experience",
    "merchant": "Grand Temple Restaurant",
    "price": 3500,
    "duration": 120,
    "category": "Restaurant Table Reservation",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-43",
    "name": "Basic Grooming",
    "merchant": "Style Studio",
    "price": 500,
    "duration": 60,
    "category": "Salon / Spa Appointment",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-44",
    "name": "Premium Makeover",
    "merchant": "Style Studio",
    "price": 1500,
    "duration": 90,
    "category": "Salon / Spa Appointment",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-45",
    "name": "Spa Therapy Session",
    "merchant": "Style Studio",
    "price": 3500,
    "duration": 120,
    "category": "Salon / Spa Appointment",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-46",
    "name": "Standard Session",
    "merchant": "ZenFit Clinic",
    "price": 500,
    "duration": 60,
    "category": "Gym / Yoga Slot Booking",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-47",
    "name": "Extended Therapy",
    "merchant": "ZenFit Clinic",
    "price": 1500,
    "duration": 90,
    "category": "Gym / Yoga Slot Booking",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-48",
    "name": "Consultation",
    "merchant": "ZenFit Clinic",
    "price": 3500,
    "duration": 120,
    "category": "Gym / Yoga Slot Booking",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-49",
    "name": "General Consultation",
    "merchant": "Apollo Dental",
    "price": 500,
    "duration": 60,
    "category": "Doctor Appointment",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs.",
    "doctorId": "doc2@apollo.com",
    "doctorName": "Priya Sharma"
  },
  {
    "id": "svc-50",
    "name": "Specialist Checkup",
    "merchant": "Apollo Dental",
    "price": 1500,
    "duration": 90,
    "category": "Doctor Appointment",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits.",
    "doctorId": "doc1@apollo.com",
    "doctorName": "Sanjay Gupta"
  },
  {
    "id": "svc-51",
    "name": "Follow-up Review",
    "merchant": "Apollo Dental",
    "price": 3500,
    "duration": 120,
    "category": "Doctor Appointment",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering.",
    "doctorId": "doc1@apollo.com",
    "doctorName": "Sanjay Gupta"
  },
  {
    "id": "svc-52",
    "name": "Basic Inspection",
    "merchant": "Spark Electricians",
    "price": 500,
    "duration": 60,
    "category": "Electrician Booking",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs.",
    "doctorId": "tech2@spark.com",
    "doctorName": "Karthik Technician"
  },
  {
    "id": "svc-53",
    "name": "Emergency Repair",
    "merchant": "Spark Electricians",
    "price": 1500,
    "duration": 90,
    "category": "Electrician Booking",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits.",
    "doctorId": "tech1@spark.com",
    "doctorName": "Ravi Electrician"
  },
  {
    "id": "svc-54",
    "name": "Full System Overhaul",
    "merchant": "Spark Electricians",
    "price": 3500,
    "duration": 120,
    "category": "Electrician Booking",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering.",
    "doctorId": "tech2@spark.com",
    "doctorName": "Karthik Technician"
  },
  {
    "id": "svc-55",
    "name": "Basic Inspection",
    "merchant": "FlowTech Plumbers",
    "price": 500,
    "duration": 60,
    "category": "Plumber Booking",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-56",
    "name": "Emergency Repair",
    "merchant": "FlowTech Plumbers",
    "price": 1500,
    "duration": 90,
    "category": "Plumber Booking",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-57",
    "name": "Full System Overhaul",
    "merchant": "FlowTech Plumbers",
    "price": 3500,
    "duration": 120,
    "category": "Plumber Booking",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-58",
    "name": "Standard Session",
    "merchant": "Shine Home Cleaners",
    "price": 500,
    "duration": 60,
    "category": "Cleaning Service",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-59",
    "name": "Extended Therapy",
    "merchant": "Shine Home Cleaners",
    "price": 1500,
    "duration": 90,
    "category": "Cleaning Service",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-60",
    "name": "Consultation",
    "merchant": "Shine Home Cleaners",
    "price": 3500,
    "duration": 120,
    "category": "Cleaning Service",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-61",
    "name": "Basic Inspection",
    "merchant": "FixIt Tech Repairs",
    "price": 500,
    "duration": 60,
    "category": "Technician Service",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-62",
    "name": "Emergency Repair",
    "merchant": "FixIt Tech Repairs",
    "price": 1500,
    "duration": 90,
    "category": "Technician Service",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-63",
    "name": "Full System Overhaul",
    "merchant": "FixIt Tech Repairs",
    "price": 3500,
    "duration": 120,
    "category": "Technician Service",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-64",
    "name": "Standard Slot",
    "merchant": "HubSpace",
    "price": 500,
    "duration": 60,
    "category": "Co-working Space",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-65",
    "name": "VIP Access",
    "merchant": "HubSpace",
    "price": 1500,
    "duration": 90,
    "category": "Co-working Space",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-66",
    "name": "Group Session",
    "merchant": "HubSpace",
    "price": 3500,
    "duration": 120,
    "category": "Co-working Space",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-67",
    "name": "Standard Slot",
    "merchant": "Boardroom Plus",
    "price": 500,
    "duration": 60,
    "category": "Meeting Room",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-68",
    "name": "VIP Access",
    "merchant": "Boardroom Plus",
    "price": 1500,
    "duration": 90,
    "category": "Meeting Room",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-69",
    "name": "Group Session",
    "merchant": "Boardroom Plus",
    "price": 3500,
    "duration": 120,
    "category": "Meeting Room",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-70",
    "name": "Standard Slot",
    "merchant": "AudioWave Cast",
    "price": 500,
    "duration": 60,
    "category": "Podcast Studio",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-71",
    "name": "VIP Access",
    "merchant": "AudioWave Cast",
    "price": 1500,
    "duration": 90,
    "category": "Podcast Studio",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-72",
    "name": "Group Session",
    "merchant": "AudioWave Cast",
    "price": 3500,
    "duration": 120,
    "category": "Podcast Studio",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-73",
    "name": "Standard Slot",
    "merchant": "Summit Conference",
    "price": 500,
    "duration": 60,
    "category": "Conference Hall",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-74",
    "name": "VIP Access",
    "merchant": "Summit Conference",
    "price": 1500,
    "duration": 90,
    "category": "Conference Hall",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-75",
    "name": "Group Session",
    "merchant": "Summit Conference",
    "price": 3500,
    "duration": 120,
    "category": "Conference Hall",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-76",
    "name": "Standard Slot",
    "merchant": "EduPro Sessions",
    "price": 500,
    "duration": 60,
    "category": "Training Sessions",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-77",
    "name": "VIP Access",
    "merchant": "EduPro Sessions",
    "price": 1500,
    "duration": 90,
    "category": "Training Sessions",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-78",
    "name": "Group Session",
    "merchant": "EduPro Sessions",
    "price": 3500,
    "duration": 120,
    "category": "Training Sessions",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-79",
    "name": "Standard Slot",
    "merchant": "Shutter Studio",
    "price": 500,
    "duration": 60,
    "category": "Studio Booking",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-80",
    "name": "VIP Access",
    "merchant": "Shutter Studio",
    "price": 1500,
    "duration": 90,
    "category": "Studio Booking",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-81",
    "name": "Group Session",
    "merchant": "Shutter Studio",
    "price": 3500,
    "duration": 120,
    "category": "Studio Booking",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-82",
    "name": "Standard Slot",
    "merchant": "Elite Planners",
    "price": 500,
    "duration": 60,
    "category": "Event Organizer Booking",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-83",
    "name": "VIP Access",
    "merchant": "Elite Planners",
    "price": 1500,
    "duration": 90,
    "category": "Event Organizer Booking",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-84",
    "name": "Group Session",
    "merchant": "Elite Planners",
    "price": 3500,
    "duration": 120,
    "category": "Event Organizer Booking",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-85",
    "name": "Half-Day Rental",
    "merchant": "City Wheels",
    "price": 500,
    "duration": 60,
    "category": "Cycle Rental",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-86",
    "name": "Full-Day Rental",
    "merchant": "City Wheels",
    "price": 1500,
    "duration": 90,
    "category": "Cycle Rental",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-87",
    "name": "Weekend Special Rental",
    "merchant": "City Wheels",
    "price": 3500,
    "duration": 120,
    "category": "Cycle Rental",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-88",
    "name": "Half-Day Rental",
    "merchant": "Rev Rider",
    "price": 500,
    "duration": 60,
    "category": "Sports Bike Rental",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-89",
    "name": "Full-Day Rental",
    "merchant": "Rev Rider",
    "price": 1500,
    "duration": 90,
    "category": "Sports Bike Rental",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-90",
    "name": "Weekend Special Rental",
    "merchant": "Rev Rider",
    "price": 3500,
    "duration": 120,
    "category": "Sports Bike Rental",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-91",
    "name": "Half-Day Rental",
    "merchant": "Lens Crafters",
    "price": 500,
    "duration": 60,
    "category": "Camera Rental",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-92",
    "name": "Full-Day Rental",
    "merchant": "Lens Crafters",
    "price": 1500,
    "duration": 90,
    "category": "Camera Rental",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-93",
    "name": "Weekend Special Rental",
    "merchant": "Lens Crafters",
    "price": 3500,
    "duration": 120,
    "category": "Camera Rental",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-94",
    "name": "Half-Day Rental",
    "merchant": "Bass Drop Audio",
    "price": 500,
    "duration": 60,
    "category": "Sound System Rental",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-95",
    "name": "Full-Day Rental",
    "merchant": "Bass Drop Audio",
    "price": 1500,
    "duration": 90,
    "category": "Sound System Rental",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-96",
    "name": "Weekend Special Rental",
    "merchant": "Bass Drop Audio",
    "price": 3500,
    "duration": 120,
    "category": "Sound System Rental",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-97",
    "name": "Half-Day Rental",
    "merchant": "Party Supply Co",
    "price": 500,
    "duration": 60,
    "category": "Event Equipment Rental",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-98",
    "name": "Full-Day Rental",
    "merchant": "Party Supply Co",
    "price": 1500,
    "duration": 90,
    "category": "Event Equipment Rental",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-99",
    "name": "Weekend Special Rental",
    "merchant": "Party Supply Co",
    "price": 3500,
    "duration": 120,
    "category": "Event Equipment Rental",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-100",
    "name": "Basic Grooming",
    "merchant": "Paws & Bubbles",
    "price": 500,
    "duration": 60,
    "category": "Pet Grooming Appointment",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-101",
    "name": "Premium Makeover",
    "merchant": "Paws & Bubbles",
    "price": 1500,
    "duration": 90,
    "category": "Pet Grooming Appointment",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-102",
    "name": "Spa Therapy Session",
    "merchant": "Paws & Bubbles",
    "price": 3500,
    "duration": 120,
    "category": "Pet Grooming Appointment",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-103",
    "name": "Standard Session",
    "merchant": "SafeHands Nannies",
    "price": 500,
    "duration": 60,
    "category": "Babysitting Service",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-104",
    "name": "Extended Therapy",
    "merchant": "SafeHands Nannies",
    "price": 1500,
    "duration": 90,
    "category": "Babysitting Service",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-105",
    "name": "Consultation",
    "merchant": "SafeHands Nannies",
    "price": 3500,
    "duration": 120,
    "category": "Babysitting Service",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  },
  {
    "id": "svc-106",
    "name": "Basic Grooming",
    "merchant": "Compassion Care",
    "price": 500,
    "duration": 60,
    "category": "Elder Care Service",
    "active": true,
    "rating": 4.5,
    "bookingsCount": 120,
    "description": "High quality service for all your needs."
  },
  {
    "id": "svc-107",
    "name": "Premium Makeover",
    "merchant": "Compassion Care",
    "price": 1500,
    "duration": 90,
    "category": "Elder Care Service",
    "active": true,
    "rating": 4.8,
    "bookingsCount": 85,
    "description": "Premium experience with added benefits."
  },
  {
    "id": "svc-108",
    "name": "Spa Therapy Session",
    "merchant": "Compassion Care",
    "price": 3500,
    "duration": 120,
    "category": "Elder Care Service",
    "active": true,
    "rating": 4.9,
    "bookingsCount": 40,
    "description": "Exclusive top-tier offering."
  }
];

const INITIAL_BOOKINGS: PersistedBooking[] = [
  {
    id: 'hb-1',
    ref: 'GH-A01',
    serviceId: 'h-room-1',
    serviceName: 'Deluxe Room',
    merchantName: 'Grand Hotel',
    category: 'Hotel Booking',
    date: new Date().toISOString().split('T')[0],
    time: '12:00 PM',
    amount: 3000,
    status: 'CONFIRMED',
    customerName: 'Ramesh',
    customerPhone: '9876543210',
    assignedDoctorId: 'staff1@grandhotel.com',
    paymentStatus: 'Paid',
    isWalkIn: false,
    otp: '1111'
  },
  {
    id: 'hb-2',
    ref: 'GH-A02',
    serviceId: 'h-room-2',
    serviceName: 'Suite Room',
    merchantName: 'Grand Hotel',
    category: 'Hotel Booking',
    date: new Date().toISOString().split('T')[0],
    time: '02:00 PM',
    amount: 5000,
    status: 'CHECKED_IN',
    customerName: 'Suresh',
    customerPhone: '9988776655',
    assignedDoctorId: 'staff1@grandhotel.com',
    paymentStatus: 'Paid',
    isWalkIn: true,
    otp: '2222'
  },
  {
    "id": "bk-1",
    "ref": "BK-G1002",
    "serviceId": "svc-1",
    "serviceName": "Deluxe Room Booking",
    "merchantName": "Grand Hotel",
    "category": "Hotel Booking",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Ayesha Khan",
    "customerEmail": "ayesha@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-2",
    "ref": "BK-G1003",
    "serviceId": "svc-2",
    "serviceName": "Executive Suite",
    "merchantName": "Grand Hotel",
    "category": "Hotel Booking",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Deepa Reddy",
    "customerEmail": "deepa@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-3",
    "ref": "BK-G1004",
    "serviceId": "svc-3",
    "serviceName": "Presidential Suite",
    "merchantName": "Grand Hotel",
    "category": "Hotel Booking",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Karan Mehra",
    "customerEmail": "karan@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-4",
    "ref": "BK-G1005",
    "serviceId": "svc-1",
    "serviceName": "Deluxe Room Booking",
    "merchantName": "Grand Hotel",
    "category": "Hotel Booking",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Arun Kumar",
    "customerEmail": "arun@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-5",
    "ref": "BK-G1006",
    "serviceId": "svc-2",
    "serviceName": "Executive Suite",
    "merchantName": "Grand Hotel",
    "category": "Hotel Booking",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Ayesha Khan",
    "customerEmail": "ayesha@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-6",
    "ref": "BK-S1007",
    "serviceId": "svc-4",
    "serviceName": "Deluxe Room Booking",
    "merchantName": "Sunstone Resort",
    "category": "Resort Booking",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Priya Das",
    "customerEmail": "priya@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-7",
    "ref": "BK-S1008",
    "serviceId": "svc-5",
    "serviceName": "Executive Suite",
    "merchantName": "Sunstone Resort",
    "category": "Resort Booking",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Rahul Singh",
    "customerEmail": "rahul@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-8",
    "ref": "BK-S1009",
    "serviceId": "svc-6",
    "serviceName": "Presidential Suite",
    "merchantName": "Sunstone Resort",
    "category": "Resort Booking",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Vivek Sharma",
    "customerEmail": "vivek@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-9",
    "ref": "BK-S1010",
    "serviceId": "svc-4",
    "serviceName": "Deluxe Room Booking",
    "merchantName": "Sunstone Resort",
    "category": "Resort Booking",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "John Doe",
    "customerEmail": "john@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-10",
    "ref": "BK-S1011",
    "serviceId": "svc-5",
    "serviceName": "Executive Suite",
    "merchantName": "Sunstone Resort",
    "category": "Resort Booking",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Priya Das",
    "customerEmail": "priya@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-11",
    "ref": "BK-R1012",
    "serviceId": "svc-7",
    "serviceName": "Deluxe Room Booking",
    "merchantName": "Riverfront Villa",
    "category": "Homestay / Villa",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Deepa Reddy",
    "customerEmail": "deepa@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-12",
    "ref": "BK-R1013",
    "serviceId": "svc-8",
    "serviceName": "Executive Suite",
    "merchantName": "Riverfront Villa",
    "category": "Homestay / Villa",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Karan Mehra",
    "customerEmail": "karan@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-13",
    "ref": "BK-R1014",
    "serviceId": "svc-9",
    "serviceName": "Presidential Suite",
    "merchantName": "Riverfront Villa",
    "category": "Homestay / Villa",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Arun Kumar",
    "customerEmail": "arun@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-14",
    "ref": "BK-R1015",
    "serviceId": "svc-7",
    "serviceName": "Deluxe Room Booking",
    "merchantName": "Riverfront Villa",
    "category": "Homestay / Villa",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Ayesha Khan",
    "customerEmail": "ayesha@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-15",
    "ref": "BK-R1016",
    "serviceId": "svc-8",
    "serviceName": "Executive Suite",
    "merchantName": "Riverfront Villa",
    "category": "Homestay / Villa",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Deepa Reddy",
    "customerEmail": "deepa@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-16",
    "ref": "BK-B1017",
    "serviceId": "svc-10",
    "serviceName": "Standard Slot",
    "merchantName": "Backpackers Hostel",
    "category": "Hostel Booking",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Rahul Singh",
    "customerEmail": "rahul@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-17",
    "ref": "BK-B1018",
    "serviceId": "svc-11",
    "serviceName": "VIP Access",
    "merchantName": "Backpackers Hostel",
    "category": "Hostel Booking",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Vivek Sharma",
    "customerEmail": "vivek@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-18",
    "ref": "BK-B1019",
    "serviceId": "svc-12",
    "serviceName": "Group Session",
    "merchantName": "Backpackers Hostel",
    "category": "Hostel Booking",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "John Doe",
    "customerEmail": "john@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-19",
    "ref": "BK-B1020",
    "serviceId": "svc-10",
    "serviceName": "Standard Slot",
    "merchantName": "Backpackers Hostel",
    "category": "Hostel Booking",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Priya Das",
    "customerEmail": "priya@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-20",
    "ref": "BK-B1021",
    "serviceId": "svc-11",
    "serviceName": "VIP Access",
    "merchantName": "Backpackers Hostel",
    "category": "Hostel Booking",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Rahul Singh",
    "customerEmail": "rahul@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-21",
    "ref": "BK-P1022",
    "serviceId": "svc-13",
    "serviceName": "Standard Slot",
    "merchantName": "Pine Trails Camp",
    "category": "Camping Booking",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Karan Mehra",
    "customerEmail": "karan@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-22",
    "ref": "BK-P1023",
    "serviceId": "svc-14",
    "serviceName": "VIP Access",
    "merchantName": "Pine Trails Camp",
    "category": "Camping Booking",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Arun Kumar",
    "customerEmail": "arun@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-23",
    "ref": "BK-P1024",
    "serviceId": "svc-15",
    "serviceName": "Group Session",
    "merchantName": "Pine Trails Camp",
    "category": "Camping Booking",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Ayesha Khan",
    "customerEmail": "ayesha@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-24",
    "ref": "BK-P1025",
    "serviceId": "svc-13",
    "serviceName": "Standard Slot",
    "merchantName": "Pine Trails Camp",
    "category": "Camping Booking",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Deepa Reddy",
    "customerEmail": "deepa@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-25",
    "ref": "BK-P1026",
    "serviceId": "svc-14",
    "serviceName": "VIP Access",
    "merchantName": "Pine Trails Camp",
    "category": "Camping Booking",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Karan Mehra",
    "customerEmail": "karan@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-26",
    "ref": "BK-A1027",
    "serviceId": "svc-16",
    "serviceName": "1-Hour Standard Slot",
    "merchantName": "Arena 5 Turf",
    "category": "Football Turf",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Vivek Sharma",
    "customerEmail": "vivek@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking.",
    "refereeAssigned": "Vikram Singh",
    "teamName": "Team Vivek"
  },
  {
    "id": "bk-27",
    "ref": "BK-A1028",
    "serviceId": "svc-17",
    "serviceName": "2-Hour Tournament Slot",
    "merchantName": "Arena 5 Turf",
    "category": "Football Turf",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "John Doe",
    "customerEmail": "john@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking.",
    "refereeAssigned": "Ramesh Kumar",
    "teamName": "Team John"
  },
  {
    "id": "bk-28",
    "ref": "BK-A1029",
    "serviceId": "svc-18",
    "serviceName": "Coaching Session",
    "merchantName": "Arena 5 Turf",
    "category": "Football Turf",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Priya Das",
    "customerEmail": "priya@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking.",
    "refereeAssigned": "Ramesh Kumar",
    "teamName": "Team Priya"
  },
  {
    "id": "bk-29",
    "ref": "BK-A1030",
    "serviceId": "svc-16",
    "serviceName": "1-Hour Standard Slot",
    "merchantName": "Arena 5 Turf",
    "category": "Football Turf",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Rahul Singh",
    "customerEmail": "rahul@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking.",
    "refereeAssigned": "Ramesh Kumar",
    "teamName": "Team Rahul"
  },
  {
    "id": "bk-30",
    "ref": "BK-A1031",
    "serviceId": "svc-17",
    "serviceName": "2-Hour Tournament Slot",
    "merchantName": "Arena 5 Turf",
    "category": "Football Turf",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Vivek Sharma",
    "customerEmail": "vivek@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking.",
    "refereeAssigned": "Ramesh Kumar",
    "teamName": "Team Vivek"
  },
  {
    "id": "bk-31",
    "ref": "BK-P1032",
    "serviceId": "svc-19",
    "serviceName": "1-Hour Standard Slot",
    "merchantName": "Pitch Perfect Grounds",
    "category": "Cricket Ground",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Arun Kumar",
    "customerEmail": "arun@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-32",
    "ref": "BK-P1033",
    "serviceId": "svc-20",
    "serviceName": "2-Hour Tournament Slot",
    "merchantName": "Pitch Perfect Grounds",
    "category": "Cricket Ground",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Ayesha Khan",
    "customerEmail": "ayesha@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-33",
    "ref": "BK-P1034",
    "serviceId": "svc-21",
    "serviceName": "Coaching Session",
    "merchantName": "Pitch Perfect Grounds",
    "category": "Cricket Ground",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Deepa Reddy",
    "customerEmail": "deepa@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-34",
    "ref": "BK-P1035",
    "serviceId": "svc-19",
    "serviceName": "1-Hour Standard Slot",
    "merchantName": "Pitch Perfect Grounds",
    "category": "Cricket Ground",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Karan Mehra",
    "customerEmail": "karan@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-35",
    "ref": "BK-P1036",
    "serviceId": "svc-20",
    "serviceName": "2-Hour Tournament Slot",
    "merchantName": "Pitch Perfect Grounds",
    "category": "Cricket Ground",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Arun Kumar",
    "customerEmail": "arun@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-36",
    "ref": "BK-S1037",
    "serviceId": "svc-22",
    "serviceName": "1-Hour Standard Slot",
    "merchantName": "Smash Academy",
    "category": "Badminton Court",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "John Doe",
    "customerEmail": "john@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-37",
    "ref": "BK-S1038",
    "serviceId": "svc-23",
    "serviceName": "2-Hour Tournament Slot",
    "merchantName": "Smash Academy",
    "category": "Badminton Court",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Priya Das",
    "customerEmail": "priya@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-38",
    "ref": "BK-S1039",
    "serviceId": "svc-24",
    "serviceName": "Coaching Session",
    "merchantName": "Smash Academy",
    "category": "Badminton Court",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Rahul Singh",
    "customerEmail": "rahul@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-39",
    "ref": "BK-S1040",
    "serviceId": "svc-22",
    "serviceName": "1-Hour Standard Slot",
    "merchantName": "Smash Academy",
    "category": "Badminton Court",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Vivek Sharma",
    "customerEmail": "vivek@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-40",
    "ref": "BK-S1041",
    "serviceId": "svc-23",
    "serviceName": "2-Hour Tournament Slot",
    "merchantName": "Smash Academy",
    "category": "Badminton Court",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "John Doe",
    "customerEmail": "john@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-41",
    "ref": "BK-G1042",
    "serviceId": "svc-25",
    "serviceName": "1-Hour Standard Slot",
    "merchantName": "Grand Slam Club",
    "category": "Tennis Court",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Ayesha Khan",
    "customerEmail": "ayesha@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-42",
    "ref": "BK-G1043",
    "serviceId": "svc-26",
    "serviceName": "2-Hour Tournament Slot",
    "merchantName": "Grand Slam Club",
    "category": "Tennis Court",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Deepa Reddy",
    "customerEmail": "deepa@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-43",
    "ref": "BK-G1044",
    "serviceId": "svc-27",
    "serviceName": "Coaching Session",
    "merchantName": "Grand Slam Club",
    "category": "Tennis Court",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Karan Mehra",
    "customerEmail": "karan@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-44",
    "ref": "BK-G1045",
    "serviceId": "svc-25",
    "serviceName": "1-Hour Standard Slot",
    "merchantName": "Grand Slam Club",
    "category": "Tennis Court",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Arun Kumar",
    "customerEmail": "arun@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-45",
    "ref": "BK-G1046",
    "serviceId": "svc-26",
    "serviceName": "2-Hour Tournament Slot",
    "merchantName": "Grand Slam Club",
    "category": "Tennis Court",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Ayesha Khan",
    "customerEmail": "ayesha@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-46",
    "ref": "BK-H1047",
    "serviceId": "svc-28",
    "serviceName": "1-Hour Standard Slot",
    "merchantName": "Hoop Kings Arena",
    "category": "Basketball Court",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Priya Das",
    "customerEmail": "priya@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-47",
    "ref": "BK-H1048",
    "serviceId": "svc-29",
    "serviceName": "2-Hour Tournament Slot",
    "merchantName": "Hoop Kings Arena",
    "category": "Basketball Court",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Rahul Singh",
    "customerEmail": "rahul@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-48",
    "ref": "BK-H1049",
    "serviceId": "svc-30",
    "serviceName": "Coaching Session",
    "merchantName": "Hoop Kings Arena",
    "category": "Basketball Court",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Vivek Sharma",
    "customerEmail": "vivek@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-49",
    "ref": "BK-H1050",
    "serviceId": "svc-28",
    "serviceName": "1-Hour Standard Slot",
    "merchantName": "Hoop Kings Arena",
    "category": "Basketball Court",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "John Doe",
    "customerEmail": "john@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-50",
    "ref": "BK-H1051",
    "serviceId": "svc-29",
    "serviceName": "2-Hour Tournament Slot",
    "merchantName": "Hoop Kings Arena",
    "category": "Basketball Court",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Priya Das",
    "customerEmail": "priya@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-51",
    "ref": "BK-B1052",
    "serviceId": "svc-31",
    "serviceName": "Standard Slot",
    "merchantName": "Blue Wave Pool",
    "category": "Swimming Pool Slots",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Deepa Reddy",
    "customerEmail": "deepa@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-52",
    "ref": "BK-B1053",
    "serviceId": "svc-32",
    "serviceName": "VIP Access",
    "merchantName": "Blue Wave Pool",
    "category": "Swimming Pool Slots",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Karan Mehra",
    "customerEmail": "karan@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-53",
    "ref": "BK-B1054",
    "serviceId": "svc-33",
    "serviceName": "Group Session",
    "merchantName": "Blue Wave Pool",
    "category": "Swimming Pool Slots",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Arun Kumar",
    "customerEmail": "arun@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-54",
    "ref": "BK-B1055",
    "serviceId": "svc-31",
    "serviceName": "Standard Slot",
    "merchantName": "Blue Wave Pool",
    "category": "Swimming Pool Slots",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Ayesha Khan",
    "customerEmail": "ayesha@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-55",
    "ref": "BK-B1056",
    "serviceId": "svc-32",
    "serviceName": "VIP Access",
    "merchantName": "Blue Wave Pool",
    "category": "Swimming Pool Slots",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Deepa Reddy",
    "customerEmail": "deepa@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-56",
    "ref": "BK-C1057",
    "serviceId": "svc-34",
    "serviceName": "Standard Slot",
    "merchantName": "Cyber Core Cafe",
    "category": "Gaming Arena Booking",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Rahul Singh",
    "customerEmail": "rahul@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-57",
    "ref": "BK-C1058",
    "serviceId": "svc-35",
    "serviceName": "VIP Access",
    "merchantName": "Cyber Core Cafe",
    "category": "Gaming Arena Booking",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Vivek Sharma",
    "customerEmail": "vivek@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-58",
    "ref": "BK-C1059",
    "serviceId": "svc-36",
    "serviceName": "Group Session",
    "merchantName": "Cyber Core Cafe",
    "category": "Gaming Arena Booking",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "John Doe",
    "customerEmail": "john@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-59",
    "ref": "BK-C1060",
    "serviceId": "svc-34",
    "serviceName": "Standard Slot",
    "merchantName": "Cyber Core Cafe",
    "category": "Gaming Arena Booking",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Priya Das",
    "customerEmail": "priya@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-60",
    "ref": "BK-C1061",
    "serviceId": "svc-35",
    "serviceName": "VIP Access",
    "merchantName": "Cyber Core Cafe",
    "category": "Gaming Arena Booking",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Rahul Singh",
    "customerEmail": "rahul@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-61",
    "ref": "BK-J1062",
    "serviceId": "svc-37",
    "serviceName": "Standard Slot",
    "merchantName": "JumpZone Park",
    "category": "Indoor Play Arena",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Karan Mehra",
    "customerEmail": "karan@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-62",
    "ref": "BK-J1063",
    "serviceId": "svc-38",
    "serviceName": "VIP Access",
    "merchantName": "JumpZone Park",
    "category": "Indoor Play Arena",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Arun Kumar",
    "customerEmail": "arun@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-63",
    "ref": "BK-J1064",
    "serviceId": "svc-39",
    "serviceName": "Group Session",
    "merchantName": "JumpZone Park",
    "category": "Indoor Play Arena",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Ayesha Khan",
    "customerEmail": "ayesha@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-64",
    "ref": "BK-J1065",
    "serviceId": "svc-37",
    "serviceName": "Standard Slot",
    "merchantName": "JumpZone Park",
    "category": "Indoor Play Arena",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Deepa Reddy",
    "customerEmail": "deepa@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-65",
    "ref": "BK-J1066",
    "serviceId": "svc-38",
    "serviceName": "VIP Access",
    "merchantName": "JumpZone Park",
    "category": "Indoor Play Arena",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Karan Mehra",
    "customerEmail": "karan@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-66",
    "ref": "BK-G1067",
    "serviceId": "svc-40",
    "serviceName": "Table for 2",
    "merchantName": "Grand Temple Restaurant",
    "category": "Restaurant Table Reservation",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Vivek Sharma",
    "customerEmail": "vivek@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-67",
    "ref": "BK-G1068",
    "serviceId": "svc-41",
    "serviceName": "Family Table (4-6)",
    "merchantName": "Grand Temple Restaurant",
    "category": "Restaurant Table Reservation",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "John Doe",
    "customerEmail": "john@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-68",
    "ref": "BK-G1069",
    "serviceId": "svc-42",
    "serviceName": "VIP Dining Experience",
    "merchantName": "Grand Temple Restaurant",
    "category": "Restaurant Table Reservation",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Priya Das",
    "customerEmail": "priya@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-69",
    "ref": "BK-G1070",
    "serviceId": "svc-40",
    "serviceName": "Table for 2",
    "merchantName": "Grand Temple Restaurant",
    "category": "Restaurant Table Reservation",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Rahul Singh",
    "customerEmail": "rahul@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-70",
    "ref": "BK-G1071",
    "serviceId": "svc-41",
    "serviceName": "Family Table (4-6)",
    "merchantName": "Grand Temple Restaurant",
    "category": "Restaurant Table Reservation",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Vivek Sharma",
    "customerEmail": "vivek@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-71",
    "ref": "BK-S1072",
    "serviceId": "svc-43",
    "serviceName": "Basic Grooming",
    "merchantName": "Style Studio",
    "category": "Salon / Spa Appointment",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Arun Kumar",
    "customerEmail": "arun@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-72",
    "ref": "BK-S1073",
    "serviceId": "svc-44",
    "serviceName": "Premium Makeover",
    "merchantName": "Style Studio",
    "category": "Salon / Spa Appointment",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Ayesha Khan",
    "customerEmail": "ayesha@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-73",
    "ref": "BK-S1074",
    "serviceId": "svc-45",
    "serviceName": "Spa Therapy Session",
    "merchantName": "Style Studio",
    "category": "Salon / Spa Appointment",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Deepa Reddy",
    "customerEmail": "deepa@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-74",
    "ref": "BK-S1075",
    "serviceId": "svc-43",
    "serviceName": "Basic Grooming",
    "merchantName": "Style Studio",
    "category": "Salon / Spa Appointment",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Karan Mehra",
    "customerEmail": "karan@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-75",
    "ref": "BK-S1076",
    "serviceId": "svc-44",
    "serviceName": "Premium Makeover",
    "merchantName": "Style Studio",
    "category": "Salon / Spa Appointment",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Arun Kumar",
    "customerEmail": "arun@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-76",
    "ref": "BK-Z1077",
    "serviceId": "svc-46",
    "serviceName": "Standard Session",
    "merchantName": "ZenFit Clinic",
    "category": "Gym / Yoga Slot Booking",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "John Doe",
    "customerEmail": "john@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-77",
    "ref": "BK-Z1078",
    "serviceId": "svc-47",
    "serviceName": "Extended Therapy",
    "merchantName": "ZenFit Clinic",
    "category": "Gym / Yoga Slot Booking",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Priya Das",
    "customerEmail": "priya@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-78",
    "ref": "BK-Z1079",
    "serviceId": "svc-48",
    "serviceName": "Consultation",
    "merchantName": "ZenFit Clinic",
    "category": "Gym / Yoga Slot Booking",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Rahul Singh",
    "customerEmail": "rahul@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-79",
    "ref": "BK-Z1080",
    "serviceId": "svc-46",
    "serviceName": "Standard Session",
    "merchantName": "ZenFit Clinic",
    "category": "Gym / Yoga Slot Booking",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Vivek Sharma",
    "customerEmail": "vivek@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-80",
    "ref": "BK-Z1081",
    "serviceId": "svc-47",
    "serviceName": "Extended Therapy",
    "merchantName": "ZenFit Clinic",
    "category": "Gym / Yoga Slot Booking",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "John Doe",
    "customerEmail": "john@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-81",
    "ref": "BK-A1082",
    "serviceId": "svc-49",
    "serviceName": "General Consultation",
    "merchantName": "Apollo Dental",
    "category": "Doctor Appointment",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Ayesha Khan",
    "customerEmail": "ayesha@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking.",
    "assignedDoctorId": "doc1@apollo.com"
  },
  {
    "id": "bk-82",
    "ref": "BK-A1083",
    "serviceId": "svc-50",
    "serviceName": "Specialist Checkup",
    "merchantName": "Apollo Dental",
    "category": "Doctor Appointment",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Deepa Reddy",
    "customerEmail": "deepa@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking.",
    "assignedDoctorId": "doc2@apollo.com"
  },
  {
    "id": "bk-83",
    "ref": "BK-A1084",
    "serviceId": "svc-51",
    "serviceName": "Follow-up Review",
    "merchantName": "Apollo Dental",
    "category": "Doctor Appointment",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Karan Mehra",
    "customerEmail": "karan@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking.",
    "assignedDoctorId": "doc2@apollo.com"
  },
  {
    "id": "bk-84",
    "ref": "BK-A1085",
    "serviceId": "svc-49",
    "serviceName": "General Consultation",
    "merchantName": "Apollo Dental",
    "category": "Doctor Appointment",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Arun Kumar",
    "customerEmail": "arun@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking.",
    "assignedDoctorId": "doc1@apollo.com"
  },
  {
    "id": "bk-85",
    "ref": "BK-A1086",
    "serviceId": "svc-50",
    "serviceName": "Specialist Checkup",
    "merchantName": "Apollo Dental",
    "category": "Doctor Appointment",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Ayesha Khan",
    "customerEmail": "ayesha@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking.",
    "assignedDoctorId": "doc2@apollo.com"
  },
  {
    "id": "bk-86",
    "ref": "BK-S1087",
    "serviceId": "svc-52",
    "serviceName": "Basic Inspection",
    "merchantName": "Spark Electricians",
    "category": "Electrician Booking",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Priya Das",
    "customerEmail": "priya@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking.",
    "assignedDoctorId": "tech2@spark.com",
    "assignedDoctorName": "Karthik Technician"
  },
  {
    "id": "bk-87",
    "ref": "BK-S1088",
    "serviceId": "svc-53",
    "serviceName": "Emergency Repair",
    "merchantName": "Spark Electricians",
    "category": "Electrician Booking",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Rahul Singh",
    "customerEmail": "rahul@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking.",
    "assignedDoctorId": "tech1@spark.com",
    "assignedDoctorName": "Ravi Electrician"
  },
  {
    "id": "bk-88",
    "ref": "BK-S1089",
    "serviceId": "svc-54",
    "serviceName": "Full System Overhaul",
    "merchantName": "Spark Electricians",
    "category": "Electrician Booking",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Vivek Sharma",
    "customerEmail": "vivek@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking.",
    "assignedDoctorId": "tech2@spark.com",
    "assignedDoctorName": "Karthik Technician"
  },
  {
    "id": "bk-89",
    "ref": "BK-S1090",
    "serviceId": "svc-52",
    "serviceName": "Basic Inspection",
    "merchantName": "Spark Electricians",
    "category": "Electrician Booking",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "John Doe",
    "customerEmail": "john@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking.",
    "assignedDoctorId": "tech2@spark.com",
    "assignedDoctorName": "Karthik Technician"
  },
  {
    "id": "bk-90",
    "ref": "BK-S1091",
    "serviceId": "svc-53",
    "serviceName": "Emergency Repair",
    "merchantName": "Spark Electricians",
    "category": "Electrician Booking",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Priya Das",
    "customerEmail": "priya@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking.",
    "assignedDoctorId": "tech2@spark.com",
    "assignedDoctorName": "Karthik Technician"
  },
  {
    "id": "bk-91",
    "ref": "BK-F1092",
    "serviceId": "svc-55",
    "serviceName": "Basic Inspection",
    "merchantName": "FlowTech Plumbers",
    "category": "Plumber Booking",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Deepa Reddy",
    "customerEmail": "deepa@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-92",
    "ref": "BK-F1093",
    "serviceId": "svc-56",
    "serviceName": "Emergency Repair",
    "merchantName": "FlowTech Plumbers",
    "category": "Plumber Booking",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Karan Mehra",
    "customerEmail": "karan@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-93",
    "ref": "BK-F1094",
    "serviceId": "svc-57",
    "serviceName": "Full System Overhaul",
    "merchantName": "FlowTech Plumbers",
    "category": "Plumber Booking",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Arun Kumar",
    "customerEmail": "arun@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-94",
    "ref": "BK-F1095",
    "serviceId": "svc-55",
    "serviceName": "Basic Inspection",
    "merchantName": "FlowTech Plumbers",
    "category": "Plumber Booking",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Ayesha Khan",
    "customerEmail": "ayesha@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-95",
    "ref": "BK-F1096",
    "serviceId": "svc-56",
    "serviceName": "Emergency Repair",
    "merchantName": "FlowTech Plumbers",
    "category": "Plumber Booking",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Deepa Reddy",
    "customerEmail": "deepa@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-96",
    "ref": "BK-S1097",
    "serviceId": "svc-58",
    "serviceName": "Standard Session",
    "merchantName": "Shine Home Cleaners",
    "category": "Cleaning Service",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Rahul Singh",
    "customerEmail": "rahul@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-97",
    "ref": "BK-S1098",
    "serviceId": "svc-59",
    "serviceName": "Extended Therapy",
    "merchantName": "Shine Home Cleaners",
    "category": "Cleaning Service",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Vivek Sharma",
    "customerEmail": "vivek@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-98",
    "ref": "BK-S1099",
    "serviceId": "svc-60",
    "serviceName": "Consultation",
    "merchantName": "Shine Home Cleaners",
    "category": "Cleaning Service",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "John Doe",
    "customerEmail": "john@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-99",
    "ref": "BK-S1100",
    "serviceId": "svc-58",
    "serviceName": "Standard Session",
    "merchantName": "Shine Home Cleaners",
    "category": "Cleaning Service",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Priya Das",
    "customerEmail": "priya@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-100",
    "ref": "BK-S1101",
    "serviceId": "svc-59",
    "serviceName": "Extended Therapy",
    "merchantName": "Shine Home Cleaners",
    "category": "Cleaning Service",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Rahul Singh",
    "customerEmail": "rahul@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-101",
    "ref": "BK-F1102",
    "serviceId": "svc-61",
    "serviceName": "Basic Inspection",
    "merchantName": "FixIt Tech Repairs",
    "category": "Technician Service",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Karan Mehra",
    "customerEmail": "karan@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-102",
    "ref": "BK-F1103",
    "serviceId": "svc-62",
    "serviceName": "Emergency Repair",
    "merchantName": "FixIt Tech Repairs",
    "category": "Technician Service",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Arun Kumar",
    "customerEmail": "arun@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-103",
    "ref": "BK-F1104",
    "serviceId": "svc-63",
    "serviceName": "Full System Overhaul",
    "merchantName": "FixIt Tech Repairs",
    "category": "Technician Service",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Ayesha Khan",
    "customerEmail": "ayesha@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-104",
    "ref": "BK-F1105",
    "serviceId": "svc-61",
    "serviceName": "Basic Inspection",
    "merchantName": "FixIt Tech Repairs",
    "category": "Technician Service",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Deepa Reddy",
    "customerEmail": "deepa@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-105",
    "ref": "BK-F1106",
    "serviceId": "svc-62",
    "serviceName": "Emergency Repair",
    "merchantName": "FixIt Tech Repairs",
    "category": "Technician Service",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Karan Mehra",
    "customerEmail": "karan@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-106",
    "ref": "BK-H1107",
    "serviceId": "svc-64",
    "serviceName": "Standard Slot",
    "merchantName": "HubSpace",
    "category": "Co-working Space",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Vivek Sharma",
    "customerEmail": "vivek@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-107",
    "ref": "BK-H1108",
    "serviceId": "svc-65",
    "serviceName": "VIP Access",
    "merchantName": "HubSpace",
    "category": "Co-working Space",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "John Doe",
    "customerEmail": "john@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-108",
    "ref": "BK-H1109",
    "serviceId": "svc-66",
    "serviceName": "Group Session",
    "merchantName": "HubSpace",
    "category": "Co-working Space",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Priya Das",
    "customerEmail": "priya@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-109",
    "ref": "BK-H1110",
    "serviceId": "svc-64",
    "serviceName": "Standard Slot",
    "merchantName": "HubSpace",
    "category": "Co-working Space",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Rahul Singh",
    "customerEmail": "rahul@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-110",
    "ref": "BK-H1111",
    "serviceId": "svc-65",
    "serviceName": "VIP Access",
    "merchantName": "HubSpace",
    "category": "Co-working Space",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Vivek Sharma",
    "customerEmail": "vivek@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-111",
    "ref": "BK-B1112",
    "serviceId": "svc-67",
    "serviceName": "Standard Slot",
    "merchantName": "Boardroom Plus",
    "category": "Meeting Room",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Arun Kumar",
    "customerEmail": "arun@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-112",
    "ref": "BK-B1113",
    "serviceId": "svc-68",
    "serviceName": "VIP Access",
    "merchantName": "Boardroom Plus",
    "category": "Meeting Room",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Ayesha Khan",
    "customerEmail": "ayesha@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-113",
    "ref": "BK-B1114",
    "serviceId": "svc-69",
    "serviceName": "Group Session",
    "merchantName": "Boardroom Plus",
    "category": "Meeting Room",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Deepa Reddy",
    "customerEmail": "deepa@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-114",
    "ref": "BK-B1115",
    "serviceId": "svc-67",
    "serviceName": "Standard Slot",
    "merchantName": "Boardroom Plus",
    "category": "Meeting Room",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Karan Mehra",
    "customerEmail": "karan@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-115",
    "ref": "BK-B1116",
    "serviceId": "svc-68",
    "serviceName": "VIP Access",
    "merchantName": "Boardroom Plus",
    "category": "Meeting Room",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Arun Kumar",
    "customerEmail": "arun@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-116",
    "ref": "BK-A1117",
    "serviceId": "svc-70",
    "serviceName": "Standard Slot",
    "merchantName": "AudioWave Cast",
    "category": "Podcast Studio",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "John Doe",
    "customerEmail": "john@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-117",
    "ref": "BK-A1118",
    "serviceId": "svc-71",
    "serviceName": "VIP Access",
    "merchantName": "AudioWave Cast",
    "category": "Podcast Studio",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Priya Das",
    "customerEmail": "priya@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-118",
    "ref": "BK-A1119",
    "serviceId": "svc-72",
    "serviceName": "Group Session",
    "merchantName": "AudioWave Cast",
    "category": "Podcast Studio",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Rahul Singh",
    "customerEmail": "rahul@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-119",
    "ref": "BK-A1120",
    "serviceId": "svc-70",
    "serviceName": "Standard Slot",
    "merchantName": "AudioWave Cast",
    "category": "Podcast Studio",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Vivek Sharma",
    "customerEmail": "vivek@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-120",
    "ref": "BK-A1121",
    "serviceId": "svc-71",
    "serviceName": "VIP Access",
    "merchantName": "AudioWave Cast",
    "category": "Podcast Studio",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "John Doe",
    "customerEmail": "john@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-121",
    "ref": "BK-S1122",
    "serviceId": "svc-73",
    "serviceName": "Standard Slot",
    "merchantName": "Summit Conference",
    "category": "Conference Hall",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Ayesha Khan",
    "customerEmail": "ayesha@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-122",
    "ref": "BK-S1123",
    "serviceId": "svc-74",
    "serviceName": "VIP Access",
    "merchantName": "Summit Conference",
    "category": "Conference Hall",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Deepa Reddy",
    "customerEmail": "deepa@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-123",
    "ref": "BK-S1124",
    "serviceId": "svc-75",
    "serviceName": "Group Session",
    "merchantName": "Summit Conference",
    "category": "Conference Hall",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Karan Mehra",
    "customerEmail": "karan@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-124",
    "ref": "BK-S1125",
    "serviceId": "svc-73",
    "serviceName": "Standard Slot",
    "merchantName": "Summit Conference",
    "category": "Conference Hall",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Arun Kumar",
    "customerEmail": "arun@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-125",
    "ref": "BK-S1126",
    "serviceId": "svc-74",
    "serviceName": "VIP Access",
    "merchantName": "Summit Conference",
    "category": "Conference Hall",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Ayesha Khan",
    "customerEmail": "ayesha@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-126",
    "ref": "BK-E1127",
    "serviceId": "svc-76",
    "serviceName": "Standard Slot",
    "merchantName": "EduPro Sessions",
    "category": "Training Sessions",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Priya Das",
    "customerEmail": "priya@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-127",
    "ref": "BK-E1128",
    "serviceId": "svc-77",
    "serviceName": "VIP Access",
    "merchantName": "EduPro Sessions",
    "category": "Training Sessions",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Rahul Singh",
    "customerEmail": "rahul@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-128",
    "ref": "BK-E1129",
    "serviceId": "svc-78",
    "serviceName": "Group Session",
    "merchantName": "EduPro Sessions",
    "category": "Training Sessions",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Vivek Sharma",
    "customerEmail": "vivek@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-129",
    "ref": "BK-E1130",
    "serviceId": "svc-76",
    "serviceName": "Standard Slot",
    "merchantName": "EduPro Sessions",
    "category": "Training Sessions",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "John Doe",
    "customerEmail": "john@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-130",
    "ref": "BK-E1131",
    "serviceId": "svc-77",
    "serviceName": "VIP Access",
    "merchantName": "EduPro Sessions",
    "category": "Training Sessions",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Priya Das",
    "customerEmail": "priya@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-131",
    "ref": "BK-S1132",
    "serviceId": "svc-79",
    "serviceName": "Standard Slot",
    "merchantName": "Shutter Studio",
    "category": "Studio Booking",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Deepa Reddy",
    "customerEmail": "deepa@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-132",
    "ref": "BK-S1133",
    "serviceId": "svc-80",
    "serviceName": "VIP Access",
    "merchantName": "Shutter Studio",
    "category": "Studio Booking",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Karan Mehra",
    "customerEmail": "karan@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-133",
    "ref": "BK-S1134",
    "serviceId": "svc-81",
    "serviceName": "Group Session",
    "merchantName": "Shutter Studio",
    "category": "Studio Booking",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Arun Kumar",
    "customerEmail": "arun@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-134",
    "ref": "BK-S1135",
    "serviceId": "svc-79",
    "serviceName": "Standard Slot",
    "merchantName": "Shutter Studio",
    "category": "Studio Booking",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Ayesha Khan",
    "customerEmail": "ayesha@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-135",
    "ref": "BK-S1136",
    "serviceId": "svc-80",
    "serviceName": "VIP Access",
    "merchantName": "Shutter Studio",
    "category": "Studio Booking",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Deepa Reddy",
    "customerEmail": "deepa@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-136",
    "ref": "BK-E1137",
    "serviceId": "svc-82",
    "serviceName": "Standard Slot",
    "merchantName": "Elite Planners",
    "category": "Event Organizer Booking",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Rahul Singh",
    "customerEmail": "rahul@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-137",
    "ref": "BK-E1138",
    "serviceId": "svc-83",
    "serviceName": "VIP Access",
    "merchantName": "Elite Planners",
    "category": "Event Organizer Booking",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Vivek Sharma",
    "customerEmail": "vivek@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-138",
    "ref": "BK-E1139",
    "serviceId": "svc-84",
    "serviceName": "Group Session",
    "merchantName": "Elite Planners",
    "category": "Event Organizer Booking",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "John Doe",
    "customerEmail": "john@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-139",
    "ref": "BK-E1140",
    "serviceId": "svc-82",
    "serviceName": "Standard Slot",
    "merchantName": "Elite Planners",
    "category": "Event Organizer Booking",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Priya Das",
    "customerEmail": "priya@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-140",
    "ref": "BK-E1141",
    "serviceId": "svc-83",
    "serviceName": "VIP Access",
    "merchantName": "Elite Planners",
    "category": "Event Organizer Booking",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Rahul Singh",
    "customerEmail": "rahul@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-141",
    "ref": "BK-C1142",
    "serviceId": "svc-85",
    "serviceName": "Half-Day Rental",
    "merchantName": "City Wheels",
    "category": "Cycle Rental",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Karan Mehra",
    "customerEmail": "karan@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-142",
    "ref": "BK-C1143",
    "serviceId": "svc-86",
    "serviceName": "Full-Day Rental",
    "merchantName": "City Wheels",
    "category": "Cycle Rental",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Arun Kumar",
    "customerEmail": "arun@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-143",
    "ref": "BK-C1144",
    "serviceId": "svc-87",
    "serviceName": "Weekend Special Rental",
    "merchantName": "City Wheels",
    "category": "Cycle Rental",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Ayesha Khan",
    "customerEmail": "ayesha@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-144",
    "ref": "BK-C1145",
    "serviceId": "svc-85",
    "serviceName": "Half-Day Rental",
    "merchantName": "City Wheels",
    "category": "Cycle Rental",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Deepa Reddy",
    "customerEmail": "deepa@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-145",
    "ref": "BK-C1146",
    "serviceId": "svc-86",
    "serviceName": "Full-Day Rental",
    "merchantName": "City Wheels",
    "category": "Cycle Rental",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Karan Mehra",
    "customerEmail": "karan@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-146",
    "ref": "BK-R1147",
    "serviceId": "svc-88",
    "serviceName": "Half-Day Rental",
    "merchantName": "Rev Rider",
    "category": "Sports Bike Rental",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Vivek Sharma",
    "customerEmail": "vivek@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-147",
    "ref": "BK-R1148",
    "serviceId": "svc-89",
    "serviceName": "Full-Day Rental",
    "merchantName": "Rev Rider",
    "category": "Sports Bike Rental",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "John Doe",
    "customerEmail": "john@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-148",
    "ref": "BK-R1149",
    "serviceId": "svc-90",
    "serviceName": "Weekend Special Rental",
    "merchantName": "Rev Rider",
    "category": "Sports Bike Rental",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Priya Das",
    "customerEmail": "priya@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-149",
    "ref": "BK-R1150",
    "serviceId": "svc-88",
    "serviceName": "Half-Day Rental",
    "merchantName": "Rev Rider",
    "category": "Sports Bike Rental",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Rahul Singh",
    "customerEmail": "rahul@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-150",
    "ref": "BK-R1151",
    "serviceId": "svc-89",
    "serviceName": "Full-Day Rental",
    "merchantName": "Rev Rider",
    "category": "Sports Bike Rental",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Vivek Sharma",
    "customerEmail": "vivek@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-151",
    "ref": "BK-L1152",
    "serviceId": "svc-91",
    "serviceName": "Half-Day Rental",
    "merchantName": "Lens Crafters",
    "category": "Camera Rental",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Arun Kumar",
    "customerEmail": "arun@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-152",
    "ref": "BK-L1153",
    "serviceId": "svc-92",
    "serviceName": "Full-Day Rental",
    "merchantName": "Lens Crafters",
    "category": "Camera Rental",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Ayesha Khan",
    "customerEmail": "ayesha@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-153",
    "ref": "BK-L1154",
    "serviceId": "svc-93",
    "serviceName": "Weekend Special Rental",
    "merchantName": "Lens Crafters",
    "category": "Camera Rental",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Deepa Reddy",
    "customerEmail": "deepa@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-154",
    "ref": "BK-L1155",
    "serviceId": "svc-91",
    "serviceName": "Half-Day Rental",
    "merchantName": "Lens Crafters",
    "category": "Camera Rental",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Karan Mehra",
    "customerEmail": "karan@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-155",
    "ref": "BK-L1156",
    "serviceId": "svc-92",
    "serviceName": "Full-Day Rental",
    "merchantName": "Lens Crafters",
    "category": "Camera Rental",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Arun Kumar",
    "customerEmail": "arun@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-156",
    "ref": "BK-B1157",
    "serviceId": "svc-94",
    "serviceName": "Half-Day Rental",
    "merchantName": "Bass Drop Audio",
    "category": "Sound System Rental",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "John Doe",
    "customerEmail": "john@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-157",
    "ref": "BK-B1158",
    "serviceId": "svc-95",
    "serviceName": "Full-Day Rental",
    "merchantName": "Bass Drop Audio",
    "category": "Sound System Rental",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Priya Das",
    "customerEmail": "priya@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-158",
    "ref": "BK-B1159",
    "serviceId": "svc-96",
    "serviceName": "Weekend Special Rental",
    "merchantName": "Bass Drop Audio",
    "category": "Sound System Rental",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Rahul Singh",
    "customerEmail": "rahul@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-159",
    "ref": "BK-B1160",
    "serviceId": "svc-94",
    "serviceName": "Half-Day Rental",
    "merchantName": "Bass Drop Audio",
    "category": "Sound System Rental",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Vivek Sharma",
    "customerEmail": "vivek@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-160",
    "ref": "BK-B1161",
    "serviceId": "svc-95",
    "serviceName": "Full-Day Rental",
    "merchantName": "Bass Drop Audio",
    "category": "Sound System Rental",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "John Doe",
    "customerEmail": "john@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-161",
    "ref": "BK-P1162",
    "serviceId": "svc-97",
    "serviceName": "Half-Day Rental",
    "merchantName": "Party Supply Co",
    "category": "Event Equipment Rental",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Ayesha Khan",
    "customerEmail": "ayesha@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-162",
    "ref": "BK-P1163",
    "serviceId": "svc-98",
    "serviceName": "Full-Day Rental",
    "merchantName": "Party Supply Co",
    "category": "Event Equipment Rental",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Deepa Reddy",
    "customerEmail": "deepa@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-163",
    "ref": "BK-P1164",
    "serviceId": "svc-99",
    "serviceName": "Weekend Special Rental",
    "merchantName": "Party Supply Co",
    "category": "Event Equipment Rental",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Karan Mehra",
    "customerEmail": "karan@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-164",
    "ref": "BK-P1165",
    "serviceId": "svc-97",
    "serviceName": "Half-Day Rental",
    "merchantName": "Party Supply Co",
    "category": "Event Equipment Rental",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Arun Kumar",
    "customerEmail": "arun@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-165",
    "ref": "BK-P1166",
    "serviceId": "svc-98",
    "serviceName": "Full-Day Rental",
    "merchantName": "Party Supply Co",
    "category": "Event Equipment Rental",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Ayesha Khan",
    "customerEmail": "ayesha@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-166",
    "ref": "BK-P1167",
    "serviceId": "svc-100",
    "serviceName": "Basic Grooming",
    "merchantName": "Paws & Bubbles",
    "category": "Pet Grooming Appointment",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Priya Das",
    "customerEmail": "priya@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-167",
    "ref": "BK-P1168",
    "serviceId": "svc-101",
    "serviceName": "Premium Makeover",
    "merchantName": "Paws & Bubbles",
    "category": "Pet Grooming Appointment",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Rahul Singh",
    "customerEmail": "rahul@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-168",
    "ref": "BK-P1169",
    "serviceId": "svc-102",
    "serviceName": "Spa Therapy Session",
    "merchantName": "Paws & Bubbles",
    "category": "Pet Grooming Appointment",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Vivek Sharma",
    "customerEmail": "vivek@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-169",
    "ref": "BK-P1170",
    "serviceId": "svc-100",
    "serviceName": "Basic Grooming",
    "merchantName": "Paws & Bubbles",
    "category": "Pet Grooming Appointment",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "John Doe",
    "customerEmail": "john@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-170",
    "ref": "BK-P1171",
    "serviceId": "svc-101",
    "serviceName": "Premium Makeover",
    "merchantName": "Paws & Bubbles",
    "category": "Pet Grooming Appointment",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Priya Das",
    "customerEmail": "priya@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-171",
    "ref": "BK-S1172",
    "serviceId": "svc-103",
    "serviceName": "Standard Session",
    "merchantName": "SafeHands Nannies",
    "category": "Babysitting Service",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Deepa Reddy",
    "customerEmail": "deepa@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-172",
    "ref": "BK-S1173",
    "serviceId": "svc-104",
    "serviceName": "Extended Therapy",
    "merchantName": "SafeHands Nannies",
    "category": "Babysitting Service",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Karan Mehra",
    "customerEmail": "karan@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-173",
    "ref": "BK-S1174",
    "serviceId": "svc-105",
    "serviceName": "Consultation",
    "merchantName": "SafeHands Nannies",
    "category": "Babysitting Service",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "Arun Kumar",
    "customerEmail": "arun@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-174",
    "ref": "BK-S1175",
    "serviceId": "svc-103",
    "serviceName": "Standard Session",
    "merchantName": "SafeHands Nannies",
    "category": "Babysitting Service",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Ayesha Khan",
    "customerEmail": "ayesha@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-175",
    "ref": "BK-S1176",
    "serviceId": "svc-104",
    "serviceName": "Extended Therapy",
    "merchantName": "SafeHands Nannies",
    "category": "Babysitting Service",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Deepa Reddy",
    "customerEmail": "deepa@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-176",
    "ref": "BK-C1177",
    "serviceId": "svc-106",
    "serviceName": "Basic Grooming",
    "merchantName": "Compassion Care",
    "category": "Elder Care Service",
    "date": "2026-08-04",
    "time": "08:00 AM",
    "amount": 500,
    "status": "CONFIRMED",
    "customerName": "Rahul Singh",
    "customerEmail": "rahul@gmail.com",
    "customerPhone": "+91 99887 77660",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-177",
    "ref": "BK-C1178",
    "serviceId": "svc-107",
    "serviceName": "Premium Makeover",
    "merchantName": "Compassion Care",
    "category": "Elder Care Service",
    "date": "2026-08-04",
    "time": "09:00 AM",
    "amount": 1500,
    "status": "CHECKED_IN",
    "customerName": "Vivek Sharma",
    "customerEmail": "vivek@gmail.com",
    "customerPhone": "+91 99887 77661",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-178",
    "ref": "BK-C1179",
    "serviceId": "svc-108",
    "serviceName": "Spa Therapy Session",
    "merchantName": "Compassion Care",
    "category": "Elder Care Service",
    "date": "2026-08-04",
    "time": "010:00 AM",
    "amount": 3500,
    "status": "CONFIRMED",
    "customerName": "John Doe",
    "customerEmail": "john@gmail.com",
    "customerPhone": "+91 99887 77662",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-179",
    "ref": "BK-C1180",
    "serviceId": "svc-106",
    "serviceName": "Basic Grooming",
    "merchantName": "Compassion Care",
    "category": "Elder Care Service",
    "date": "2026-08-04",
    "time": "011:00 AM",
    "amount": 500,
    "status": "CHECKED_IN",
    "customerName": "Priya Das",
    "customerEmail": "priya@gmail.com",
    "customerPhone": "+91 99887 77663",
    "notes": "Looking forward to the booking."
  },
  {
    "id": "bk-180",
    "ref": "BK-C1181",
    "serviceId": "svc-107",
    "serviceName": "Premium Makeover",
    "merchantName": "Compassion Care",
    "category": "Elder Care Service",
    "date": "2026-08-04",
    "time": "012:00 AM",
    "amount": 1500,
    "status": "CONFIRMED",
    "customerName": "Rahul Singh",
    "customerEmail": "rahul@gmail.com",
    "customerPhone": "+91 99887 77664",
    "notes": "Looking forward to the booking."
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
  { subId: 'H101', merchantId: 'mer-100', passwordHash: 'pass101' },
  { subId: 'E202', merchantId: 'mer-117', passwordHash: 'pass202' },
  { subId: 'F202', merchantId: 'mer-2', passwordHash: 'pass202' },
  { subId: 'S303', merchantId: 'mer-3', passwordHash: 'pass303' },
  { subId: 'R404', merchantId: 'mer-4', passwordHash: 'pass404' },
  { subId: 'G505', merchantId: 'mer-5', passwordHash: 'pass505' },
  { subId: 'U606', merchantId: 'mer-6', passwordHash: 'pass606' },
  { subId: 'C707', merchantId: 'mer-7', passwordHash: 'pass707' },
  { subId: 'W808', merchantId: 'mer-8', passwordHash: 'pass808' },
  { subId: 'T102', merchantId: 'mer-105', passwordHash: 'pass102' }
];

export const VENDOR_ACCOUNTS = [
  { username: 'admin', passwordHash: 'admin123' },
  { username: 'vendor123', passwordHash: 'vendorpass123' }
];

export const useVendorStore = create<VendorStoreState>()(
  persist(
    (set, get) => ({
      
  customMerchants: {},
  supportTickets: [],
  completeOnboarding: (merchantId, setupData) => set((state) => {
    const customData: any = { isCustomized: true, activeModules: setupData.activeModules, customDictionary: setupData.customDictionary };
    if (setupData.merchantName) customData.merchantName = setupData.merchantName;
    if (setupData.archetype) customData.archetype = setupData.archetype;
    return {
      customMerchants: { ...state.customMerchants, [merchantId]: customData },
      currentMerchant: state.currentMerchant?.id === merchantId 
        ? { ...state.currentMerchant, ...customData }
        : state.currentMerchant
    };
  }),
  updateMerchantModules: (merchantId, activeModules, customDictionary) => set((state) => {
    const customData = { activeModules, ...(customDictionary ? { customDictionary } : {}) };
    return {
      customMerchants: { ...state.customMerchants, [merchantId]: { ...(state.customMerchants[merchantId] || {}), ...customData } },
      currentMerchant: state.currentMerchant?.id === merchantId 
        ? { ...state.currentMerchant, ...customData }
        : state.currentMerchant
    };
  }),
  resetOnboarding: (merchantId) => set((state) => {
    return {
      customMerchants: { ...state.customMerchants, [merchantId]: { ...(state.customMerchants[merchantId] || {}), isCustomized: false } },
      currentMerchant: state.currentMerchant?.id === merchantId 
        ? { ...state.currentMerchant, isCustomized: false }
        : state.currentMerchant
    };
  }),

      currentMerchant: null,
      loginRole: null,
      supervisorId: null,
      currentStaff: null,
      theme: 'system',
      bookings: INITIAL_BOOKINGS,
      services: INITIAL_SERVICES,
      staffAccounts: [
        {
          id: 'chef@restaurant.com',
          merchantId: 'mer-113',
          name: 'Gordon Ramsay',
          roleTitle: 'Head Chef',
          isDoctor: false,
          passwordHash: 'pass123',
          permissions: { canManageVitals: false, canAddPrescription: false, canManageBilling: true, canManageAppointments: true }
        },
        {
          id: 'host@restaurant.com',
          merchantId: 'mer-113',
          name: 'Monica Geller',
          roleTitle: 'Maitre D',
          isDoctor: false,
          passwordHash: 'pass123',
          permissions: { canManageVitals: false, canAddPrescription: false, canManageBilling: true, canManageAppointments: true }
        },
        {
          id: 's303_senior@salon.com',
          merchantId: 'mer-114',
          name: 'Priya Sharma',
          roleTitle: 'Senior Stylist',
          isDoctor: false,
          passwordHash: 'pass123',
          permissions: { canManageVitals: false, canAddPrescription: false, canManageBilling: true, canManageAppointments: true }
        },
        {
          id: 's303_color@salon.com',
          merchantId: 'mer-114',
          name: 'Rahul Verma',
          roleTitle: 'Color Specialist',
          isDoctor: false,
          passwordHash: 'pass123',
          permissions: { canManageVitals: false, canAddPrescription: false, canManageBilling: true, canManageAppointments: true }
        },
        {
          id: 'reception@hotel.com',
          merchantId: 'mer-4',
          name: 'Anita Desai',
          roleTitle: 'Front Desk',
          isDoctor: true,
          passwordHash: 'pass123',
          permissions: { canManageVitals: true, canAddPrescription: true, canManageBilling: true, canManageAppointments: true }
        },
        {
          id: 'stylist@salon.com',
          merchantId: 'mer-3',
          name: 'Karthik Aryan',
          roleTitle: 'Senior Stylist',
          isDoctor: true,
          passwordHash: 'pass123',
          permissions: { canManageVitals: true, canAddPrescription: true, canManageBilling: true, canManageAppointments: true }
        },
        {
          id: 'trainer@gym.com',
          merchantId: 'mer-2',
          name: 'Rahul Dravid',
          roleTitle: 'Gym Trainer',
          isDoctor: true,
          passwordHash: 'pass123',
          permissions: { canManageVitals: true, canAddPrescription: true, canManageBilling: true, canManageAppointments: true }
        },
        {
          id: 'tech@service.com',
          merchantId: 'mer-117',
          name: 'Suresh Kumar',
          roleTitle: 'Electrician',
          isDoctor: true,
          passwordHash: 'pass123',
          permissions: { canManageVitals: true, canAddPrescription: true, canManageBilling: true, canManageAppointments: true }
        },
        {
          id: 'reception@grandhotel.com',
          merchantId: 'mer-100',
          name: 'Priyanka Chopra',
          roleTitle: 'Hotel Manager',
          isDoctor: true,
          passwordHash: 'pass123',
          permissions: { canManageVitals: true, canAddPrescription: true, canManageBilling: true, canManageAppointments: true }
        },

        {
          id: 'ref1@arena5.com',
          merchantId: 'mer-105',
          name: 'Vikram Singh',
          roleTitle: 'Senior Referee',
          isDoctor: true,
          passwordHash: 'pass123',
          permissions: { canManageVitals: true, canAddPrescription: true, canManageBilling: true, canManageAppointments: true }
        },
        {
          id: 'manager@arena5.com',
          merchantId: 'mer-105',
          name: 'Ramesh Kumar',
          roleTitle: 'Turf Manager',
          isDoctor: true,
          passwordHash: 'pass123',
          permissions: { canManageVitals: true, canAddPrescription: true, canManageBilling: true, canManageAppointments: true }
        },
        {
          id: 'doc1@apollo.com',
          merchantId: 'mer-116',
          name: 'Sanjay Gupta',
          roleTitle: 'Cardiologist',
          isDoctor: true,
          passwordHash: 'pass123',
          permissions: { canManageVitals: true, canAddPrescription: true, canManageBilling: false, canManageAppointments: true }
        },
        {
          id: 'doc2@apollo.com',
          merchantId: 'mer-116',
          name: 'Priya Sharma',
          roleTitle: 'Dentist',
          isDoctor: true,
          passwordHash: 'pass123',
          permissions: { canManageVitals: true, canAddPrescription: true, canManageBilling: false, canManageAppointments: true }
        },
        {
          id: 'nurse1@apollo.com',
          merchantId: 'mer-116',
          name: 'Anjali Desai',
          roleTitle: 'Head Nurse',
          isDoctor: true,
          passwordHash: 'pass123',
          permissions: { canManageVitals: true, canAddPrescription: false, canManageBilling: false, canManageAppointments: true }
        },
        {
          id: 'staff1@grandhotel.com',
          merchantId: 'mer-100',
          name: 'Priya Sharma',
          roleTitle: 'Front Desk',
          isDoctor: true,
          passwordHash: 'pass123',
          permissions: { canManageVitals: false, canAddPrescription: false, canManageBilling: true, canManageAppointments: true }
        },
        {
          id: 'staff2@grandhotel.com',
          merchantId: 'mer-100',
          name: 'Arun Housekeeping',
          roleTitle: 'Housekeeping',
          isDoctor: true,
          passwordHash: 'pass123',
          permissions: { canManageVitals: false, canAddPrescription: false, canManageBilling: false, canManageAppointments: false }
        },
        {
          id: 'tech1@spark.com',
          merchantId: 'mer-117',
          name: 'Ravi Electrician',
          roleTitle: 'Senior Technician',
          isDoctor: true,
          passwordHash: 'pass123',
          permissions: { canManageVitals: true, canAddPrescription: false, canManageBilling: true, canManageAppointments: true }
        },
        {
          id: 'tech2@spark.com',
          merchantId: 'mer-117',
          name: 'Karthik Technician',
          roleTitle: 'Junior Technician',
          isDoctor: true,
          passwordHash: 'pass123',
          permissions: { canManageVitals: true, canAddPrescription: false, canManageBilling: false, canManageAppointments: true }
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
        // Allow passXXX where XXX is the numeric part of the username (e.g. T102 -> pass102)
        const expectedPass = 'pass' + lowerUser.replace(/\D/g, '');
        const isLegacyPreset = (passwordHash === '123' || passwordHash.toLowerCase() === expectedPass) && PRESET_MERCHANTS.some(m => m.username.toLowerCase() === lowerUser || lowerUser === 'admin');

        if (isVendor || isLegacyPreset) {
          const checkUsername = lowerUser === 'admin' || lowerUser === 'vendor123' ? 'doctor' : lowerUser;
          let found = PRESET_MERCHANTS.find((m) => m.username.toLowerCase() === checkUsername);
          if (!found) {
            found = PRESET_MERCHANTS[0];
          }
          const finalMerchant = { ...found, ...(get().customMerchants[found.id] || {}) };
          set({ currentMerchant: finalMerchant, loginRole: 'vendor', supervisorId: null });
          
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
          const finalMerchant = { ...found, ...(get().customMerchants[found.id] || {}) };
          set({ currentMerchant: finalMerchant });
          
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
      },

      fetchSupportTickets: async () => {
        try {
          const res = await fetch('http://localhost:9000/api/v1/tickets');
          if (res.ok) {
            const body = await res.json();
            const ticketsData = body.data || [];
            // Map the API data structure to the BUS-FE structure
            const mapped = ticketsData.map((t: any) => ({
              id: t.id,
              merchantId: t.merchantId,
              merchantName: t.merchantName,
              subject: t.subject,
              message: t.message,
              status: t.status.toLowerCase(), // OPEN -> open
              createdAt: t.createdAt
            }));
            set({ supportTickets: mapped });
          }
        } catch (e) {
          console.error('Failed to fetch tickets from backend', e);
        }
      },

      addSupportTicket: async (ticket) => {
        try {
          const res = await fetch('http://localhost:9000/api/v1/tickets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...ticket, targetType: 'ADMIN' })
          });
          if (res.ok) {
            const body = await res.json();
            const newTicket = body.data;
            const mappedTicket = {
              id: newTicket.id,
              merchantId: newTicket.merchantId,
              merchantName: newTicket.merchantName,
              subject: newTicket.subject,
              message: newTicket.message,
              status: newTicket.status.toLowerCase(),
              createdAt: newTicket.createdAt
            };
            set((state) => ({
              supportTickets: [mappedTicket, ...state.supportTickets]
            }));
          }
        } catch (e) {
          console.error('Failed to create ticket in backend', e);
        }
      },

      resolveSupportTicket: (ticketId) => {
        set((state) => ({
          supportTickets: state.supportTickets.map((t) =>
            t.id === ticketId ? { ...t, status: 'resolved' } : t
          )
        }));
      },

      updateSupportTicketStatus: async (ticketId, status) => {
        try {
          const res = await fetch(`http://localhost:9000/api/v1/tickets/${ticketId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: status.toUpperCase() })
          });
          if (res.ok) {
            set((state) => ({
              supportTickets: state.supportTickets.map((t) =>
                t.id === ticketId ? { ...t, status } : t
              )
            }));
          }
        } catch (e) {
          console.error('Failed to update ticket status', e);
          // Fallback local update
          set((state) => ({
            supportTickets: state.supportTickets.map((t) =>
              t.id === ticketId ? { ...t, status } : t
            )
          }));
        }
      }
    }),
    { name: 'vendor-portal-storage-v9' }
  )
);
