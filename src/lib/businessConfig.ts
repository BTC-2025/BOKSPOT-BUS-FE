export interface BusinessConfig {
  themeClass: string;
  words: {
    customer: string;
    customers: string;
    booking: string;
    bookings: string;
    directoryTitle: string;
    settingsTitle: string;
    dashboardMap: string;
  };
  dashboardWidgets: {
    quickActions: string[];
    statusWidget: {
      title: string;
      items: string[];
      metric: string;
    };
  };
}

export const BUSINESS_CONFIG: Record<string, BusinessConfig> = {
  'Hotel Booking': { themeClass: 'theme-hotel', words: { customer: 'Guest', customers: 'Guests', booking: 'Reservation', bookings: 'Reservations', directoryTitle: 'Guest Directory', settingsTitle: 'Property Settings', dashboardMap: 'Room Occupancy View' } },
  'Resort Booking': { themeClass: 'theme-hotel', words: { customer: 'Guest', customers: 'Guests', booking: 'Reservation', bookings: 'Reservations', directoryTitle: 'Guest Directory', settingsTitle: 'Property Settings', dashboardMap: 'Room Occupancy View' } },
  'Homestay / Villa': { themeClass: 'theme-hotel', words: { customer: 'Guest', customers: 'Guests', booking: 'Reservation', bookings: 'Reservations', directoryTitle: 'Guest Directory', settingsTitle: 'Property Settings', dashboardMap: 'Room Occupancy View' } },
  'Hostel Booking': { themeClass: 'theme-hotel', words: { customer: 'Guest', customers: 'Guests', booking: 'Reservation', bookings: 'Reservations', directoryTitle: 'Guest Directory', settingsTitle: 'Property Settings', dashboardMap: 'Room Occupancy View' } },
  'Camping Booking': { themeClass: 'theme-turf', words: { customer: 'Client', customers: 'Clients', booking: 'Booking', bookings: 'Bookings', directoryTitle: 'Client Directory', settingsTitle: 'Resource Settings', dashboardMap: 'Live Allocation Map' } },
  'Football Turf': { themeClass: 'theme-turf', words: { customer: 'Player', customers: 'Players', booking: 'Match', bookings: 'Matches', directoryTitle: 'Player Directory', settingsTitle: 'Facility Settings', dashboardMap: 'Live Pitch Allocation' } },
  'Cricket Ground': { themeClass: 'theme-turf', words: { customer: 'Player', customers: 'Players', booking: 'Match', bookings: 'Matches', directoryTitle: 'Player Directory', settingsTitle: 'Facility Settings', dashboardMap: 'Live Pitch Allocation' } },
  'Badminton Court': { themeClass: 'theme-turf', words: { customer: 'Player', customers: 'Players', booking: 'Match', bookings: 'Matches', directoryTitle: 'Player Directory', settingsTitle: 'Facility Settings', dashboardMap: 'Live Pitch Allocation' } },
  'Tennis Court': { themeClass: 'theme-turf', words: { customer: 'Player', customers: 'Players', booking: 'Match', bookings: 'Matches', directoryTitle: 'Player Directory', settingsTitle: 'Facility Settings', dashboardMap: 'Live Pitch Allocation' } },
  'Basketball Court': { themeClass: 'theme-turf', words: { customer: 'Player', customers: 'Players', booking: 'Match', bookings: 'Matches', directoryTitle: 'Player Directory', settingsTitle: 'Facility Settings', dashboardMap: 'Live Pitch Allocation' } },
  'Swimming Pool Slots': { themeClass: 'theme-turf', words: { customer: 'Player', customers: 'Players', booking: 'Match', bookings: 'Matches', directoryTitle: 'Player Directory', settingsTitle: 'Facility Settings', dashboardMap: 'Live Pitch Allocation' } },
  'Gaming Arena Booking': { themeClass: 'theme-turf', words: { customer: 'Client', customers: 'Clients', booking: 'Booking', bookings: 'Bookings', directoryTitle: 'Client Directory', settingsTitle: 'Resource Settings', dashboardMap: 'Live Allocation Map' } },
  'Indoor Play Arena': { themeClass: 'theme-turf', words: { customer: 'Client', customers: 'Clients', booking: 'Booking', bookings: 'Bookings', directoryTitle: 'Client Directory', settingsTitle: 'Resource Settings', dashboardMap: 'Live Allocation Map' } },
  'Restaurant Table Reservation': { themeClass: 'theme-dining', words: { customer: 'Diner', customers: 'Diners', booking: 'Table', bookings: 'Reservations', directoryTitle: 'Diner Database', settingsTitle: 'Restaurant Settings', dashboardMap: 'Live Table Layout' } },
  'Salon / Spa Appointment': { themeClass: 'theme-salon', words: { customer: 'Client', customers: 'Clients', booking: 'Appointment', bookings: 'Appointments', directoryTitle: 'Client Directory', settingsTitle: 'Salon Settings', dashboardMap: 'Live Chair Allocation' } },
  'Gym / Yoga Slot Booking': { themeClass: 'theme-service', words: { customer: 'Client', customers: 'Clients', booking: 'Session', bookings: 'Sessions', directoryTitle: 'Client List', settingsTitle: 'Service Settings', dashboardMap: 'Live Ongoing Services' } },
  'Doctor Appointment': { themeClass: 'theme-medical', words: { customer: 'Patient', customers: 'Patients', booking: 'Appointment', bookings: 'Appointments', directoryTitle: 'Patient Database', settingsTitle: 'Clinic Settings', dashboardMap: 'Live Ward & ER Map' } },
  'Electrician Booking': { themeClass: 'theme-trade', words: { customer: 'Client', customers: 'Clients', booking: 'Job', bookings: 'Active Jobs', directoryTitle: 'Client CRM', settingsTitle: 'Dispatch Settings', dashboardMap: 'Technician Route Map' } },
  'Plumber Booking': { themeClass: 'theme-trade', words: { customer: 'Client', customers: 'Clients', booking: 'Job', bookings: 'Active Jobs', directoryTitle: 'Client CRM', settingsTitle: 'Dispatch Settings', dashboardMap: 'Technician Route Map' } },
  'Cleaning Service': { themeClass: 'theme-trade', words: { customer: 'Client', customers: 'Clients', booking: 'Job', bookings: 'Active Jobs', directoryTitle: 'Client CRM', settingsTitle: 'Dispatch Settings', dashboardMap: 'Technician Route Map' } },
  'Technician Service': { themeClass: 'theme-trade', words: { customer: 'Client', customers: 'Clients', booking: 'Job', bookings: 'Active Jobs', directoryTitle: 'Client CRM', settingsTitle: 'Dispatch Settings', dashboardMap: 'Technician Route Map' } },
  'Co-working Space': { themeClass: 'theme-workspace', words: { customer: 'Member', customers: 'Members', booking: 'Session', bookings: 'Sessions', directoryTitle: 'Member Directory', settingsTitle: 'Space Settings', dashboardMap: 'Live Room Allocation' } },
  'Meeting Room': { themeClass: 'theme-workspace', words: { customer: 'Member', customers: 'Members', booking: 'Session', bookings: 'Sessions', directoryTitle: 'Member Directory', settingsTitle: 'Space Settings', dashboardMap: 'Live Room Allocation' } },
  'Podcast Studio': { themeClass: 'theme-workspace', words: { customer: 'Member', customers: 'Members', booking: 'Session', bookings: 'Sessions', directoryTitle: 'Member Directory', settingsTitle: 'Space Settings', dashboardMap: 'Live Room Allocation' } },
  'Conference Hall': { themeClass: 'theme-workspace', words: { customer: 'Member', customers: 'Members', booking: 'Session', bookings: 'Sessions', directoryTitle: 'Member Directory', settingsTitle: 'Space Settings', dashboardMap: 'Live Room Allocation' } },
  'Training Sessions': { themeClass: 'theme-turf', words: { customer: 'Client', customers: 'Clients', booking: 'Booking', bookings: 'Bookings', directoryTitle: 'Client Directory', settingsTitle: 'Resource Settings', dashboardMap: 'Live Allocation Map' } },
  'Studio Booking': { themeClass: 'theme-workspace', words: { customer: 'Member', customers: 'Members', booking: 'Session', bookings: 'Sessions', directoryTitle: 'Member Directory', settingsTitle: 'Space Settings', dashboardMap: 'Live Room Allocation' } },
  'Event Organizer Booking': { themeClass: 'theme-turf', words: { customer: 'Client', customers: 'Clients', booking: 'Booking', bookings: 'Bookings', directoryTitle: 'Client Directory', settingsTitle: 'Resource Settings', dashboardMap: 'Live Allocation Map' } },
  'Cycle Rental': { themeClass: 'theme-rental', words: { customer: 'Renter', customers: 'Renters', booking: 'Rental', bookings: 'Rentals', directoryTitle: 'Renter Directory', settingsTitle: 'Inventory Settings', dashboardMap: 'Live Fleet/Stock View' } },
  'Sports Bike Rental': { themeClass: 'theme-rental', words: { customer: 'Renter', customers: 'Renters', booking: 'Rental', bookings: 'Rentals', directoryTitle: 'Renter Directory', settingsTitle: 'Inventory Settings', dashboardMap: 'Live Fleet/Stock View' } },
  'Camera Rental': { themeClass: 'theme-rental', words: { customer: 'Renter', customers: 'Renters', booking: 'Rental', bookings: 'Rentals', directoryTitle: 'Renter Directory', settingsTitle: 'Inventory Settings', dashboardMap: 'Live Fleet/Stock View' } },
  'Sound System Rental': { themeClass: 'theme-rental', words: { customer: 'Renter', customers: 'Renters', booking: 'Rental', bookings: 'Rentals', directoryTitle: 'Renter Directory', settingsTitle: 'Inventory Settings', dashboardMap: 'Live Fleet/Stock View' } },
  'Event Equipment Rental': { themeClass: 'theme-rental', words: { customer: 'Renter', customers: 'Renters', booking: 'Rental', bookings: 'Rentals', directoryTitle: 'Renter Directory', settingsTitle: 'Inventory Settings', dashboardMap: 'Live Fleet/Stock View' } },
  'Pet Grooming Appointment': { themeClass: 'theme-salon', words: { customer: 'Client', customers: 'Clients', booking: 'Appointment', bookings: 'Appointments', directoryTitle: 'Client Directory', settingsTitle: 'Salon Settings', dashboardMap: 'Live Chair Allocation' } },
  'Babysitting Service': { themeClass: 'theme-service', words: { customer: 'Client', customers: 'Clients', booking: 'Session', bookings: 'Sessions', directoryTitle: 'Client List', settingsTitle: 'Service Settings', dashboardMap: 'Live Ongoing Services' } },
  'Elder Care Service': { themeClass: 'theme-service', words: { customer: 'Client', customers: 'Clients', booking: 'Session', bookings: 'Sessions', directoryTitle: 'Client List', settingsTitle: 'Service Settings', dashboardMap: 'Live Ongoing Services' } },
  'default': { themeClass: 'theme-default', words: { customer: 'Customer', customers: 'Customers', booking: 'Booking', bookings: 'Bookings', directoryTitle: 'Customer Directory', settingsTitle: 'Settings', dashboardMap: 'Resource Map' } }
};

export function getConfig(category: string | undefined): BusinessConfig {
  if (!category) return BUSINESS_CONFIG['default'];
  return BUSINESS_CONFIG[category] || BUSINESS_CONFIG['default'];
}
