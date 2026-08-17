import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, X, LocateFixed } from 'lucide-react';

export const POPULAR_CITIES = [
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'Goa', lat: 15.2993, lng: 74.1240 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567 },
];

export const ALL_CITIES = [
  'Abohar', 'Abu Road', 'Achampet', 'Acharapakkam', 'Addanki', 'Adilabad', 'Adipur',
  'Adoni', 'Adoor', 'Agar', 'Agartala', 'Agra', 'Ahmedabad', 'Ahmedgarh', 'Ahmednagar', 'Aizawl',
  'Ajmer', 'Akbarpur', 'Akividu', 'Akola', 'Alakode', 'Alangayam', 'Alangudi', 'Aligarh',
  'Allahabad', 'Alleppey', 'Alwar', 'Ambala', 'Amravati', 'Amritsar', 'Anand', 'Anantapur',
  'Aurangabad', 'Bangalore', 'Bareilly', 'Belgaum', 'Bhavnagar', 'Bhilai', 'Bhiwandi', 'Bhopal',
  'Bhubaneswar', 'Bikaner', 'Bilaspur', 'Bokaro', 'Chandigarh', 'Chennai', 'Coimbatore', 'Cuttack',
  'Dehradun', 'Delhi', 'Dhanbad', 'Durgapur', 'Erode', 'Faridabad', 'Firozabad', 'Ghaziabad',
  'Goa', 'Gorakhpur', 'Gulbarga', 'Guntur', 'Gurgaon', 'Guwahati', 'Gwalior', 'Hubli', 'Hyderabad',
  'Indore', 'Jabalpur', 'Jaipur', 'Jalandhar', 'Jammu', 'Jamnagar', 'Jamshedpur', 'Jhansi', 'Jodhpur',
  'Kakinada', 'Kannur', 'Kanpur', 'Karnal', 'Kochi', 'Kolhapur', 'Kolkata', 'Kollam', 'Kota',
  'Kozhikode', 'Kurnool', 'Lucknow', 'Ludhiana', 'Madurai', 'Mangalore', 'Mathura', 'Meerut',
  'Moradabad', 'Mumbai', 'Mysore', 'Nagpur', 'Nanded', 'Nashik', 'Nellore', 'Noida', 'Patna',
  'Pondicherry', 'Pune', 'Raipur', 'Rajkot', 'Ranchi', 'Rohtak', 'Rourkela', 'Salem', 'Sangli',
  'Shimla', 'Siliguri', 'Solapur', 'Srinagar', 'Surat', 'Thiruvananthapuram', 'Thrissur', 'Tiruchirappalli',
  'Tirunelveli', 'Tiruppur', 'Udaipur', 'Ujjain', 'Vadodara', 'Varanasi', 'Vasai', 'Vellore', 'Vijayawada',
  'Visakhapatnam', 'Warangal'
].sort();

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: string;
  setCity: (city: string) => void;
  setStatus: (status: 'idle' | 'detecting' | 'detected' | 'error') => void;
}

export function LocationSelectorModal({ isOpen, onClose, city, setCity, setStatus }: LocationSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Group cities by first letter for A-Z
  const groupedCities = useMemo(() => {
    const groups: Record<string, string[]> = {};
    const filtered = ALL_CITIES.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
    
    filtered.forEach(c => {
      const firstLetter = c.charAt(0).toUpperCase();
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(c);
    });
    return groups;
  }, [searchQuery]);

  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const handleCitySelect = (selectedCity: string, lat?: number, lng?: number) => {
    setCity(selectedCity);
    onClose();
  };

  const handleUseCurrentLocation = () => {
    setStatus('detecting');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`, {
            headers: { 'User-Agent': 'BetaBookingApp/1.0' }
          })
            .then(res => res.json())
            .then(data => {
              if (data && data.address) {
                const address = data.address;
                const cityOrTown = address.city || address.town || address.municipality || 'Current Location';
                setCity(cityOrTown);
              } else {
                setCity('Current Location');
              }
              onClose();
            })
            .catch(err => {
              console.warn('Reverse geocode failed:', err);
              setCity('Current Location');
              onClose();
            });
        },
        (error) => {
          console.error('GPS Geolocation error:', error);
          setStatus('error');
        }
      );
    } else {
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-bg-secondary text-text-primary rounded-[2rem] shadow-2xl z-50 overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header & Search */}
            <div className="p-6 pb-4 border-b border-slate-200 dark:border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Select Location</h2>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search city, area or locality"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border border-slate-300 dark:border-slate-600 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-[#8b6508] focus:ring-1 focus:ring-[#8b6508] transition-all"
                />
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto hide-scrollbar flex-1">
              {/* Use Current Location */}
              {!searchQuery && (
                <button 
                  onClick={handleUseCurrentLocation}
                  className="w-full flex items-center gap-3 text-[#8b6508] font-bold mb-8 hover:bg-[#8b6508]/10 p-3 rounded-xl transition-colors"
                >
                  <LocateFixed size={20} />
                  <span>Use Current Location</span>
                </button>
              )}

              {/* Popular Cities */}
              {!searchQuery && (
                <div className="mb-8">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {POPULAR_CITIES.map(c => (
                      <button
                        key={c.name}
                        onClick={() => handleCitySelect(c.name, c.lat, c.lng)}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                          city === c.name 
                            ? 'border-[#8b6508] bg-[#8b6508]/10 shadow-sm' 
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow-sm'
                        }`}
                      >
                        <MapPin size={24} className={`mb-2 ${city === c.name ? 'text-[#8b6508]' : 'text-slate-500'}`} />
                        <span className="text-xs font-semibold text-center">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* All Cities (A-Z) */}
              <div>
                {!searchQuery && <h3 className="text-sm font-bold text-slate-500 mb-4">All Cities</h3>}
                
                {/* A-Z Index */}
                {!searchQuery && (
                  <div className="flex flex-wrap gap-1 mb-6">
                    {alphabets.map(letter => (
                      <a 
                        key={letter} 
                        href={`#city-group-${letter}`}
                        className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-bold transition-colors ${
                          groupedCities[letter] 
                            ? 'text-[#8b6508] hover:bg-[#8b6508]/10' 
                            : 'text-slate-400 cursor-not-allowed'
                        }`}
                        onClick={(e) => {
                          if (!groupedCities[letter]) e.preventDefault();
                        }}
                      >
                        {letter}
                      </a>
                    ))}
                  </div>
                )}

                {/* City List */}
                <div className="space-y-6">
                  {Object.keys(groupedCities).sort().map(letter => (
                    <div key={letter} id={`city-group-${letter}`}>
                      <h4 className="text-xs font-black text-slate-500 mb-3 pl-2">{letter}</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4">
                        {groupedCities[letter].map(c => (
                          <button
                            key={c}
                            onClick={() => handleCitySelect(c)}
                            className={`text-left text-sm px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                              city === c ? 'font-bold text-[#8b6508]' : 'text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {Object.keys(groupedCities).length === 0 && (
                    <p className="text-center text-slate-500 text-sm py-8">No cities found matching "{searchQuery}"</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
