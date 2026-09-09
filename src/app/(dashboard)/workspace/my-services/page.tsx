'use client';

import { useVendorStore, CatalogService } from '@/lib/store';
import { getArchetypeConfig } from '@/lib/businessDictionary';
import { compressImage } from '@/lib/imageUtils';
import { Plus, Trash2, Edit, X, Package, List } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkspacePage() {
  const router = useRouter();
  const { currentMerchant, services, fetchServices, addService, updateService, deleteService } = useVendorStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchServices(); // Always pull fresh data from backend on load
  }, []);

  // Modals state
  const [showBookingTypeModal, setShowBookingTypeModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  
  // Navigation State
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Booking Type Form State
  const [bookingTypeCategory, setBookingTypeCategory] = useState('');
  const [bookingTypeImage, setBookingTypeImage] = useState('');

  // Category Form State
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');

  const GROUPED_CATEGORIES = {
    "Accommodation & Hospitality": [
      "Hotel Booking", "Resort Booking", "Homestay / Villa", "Hostel Booking", "Camping Booking"
    ],
    "Sports & Arenas": [
      "Football Turf", "Cricket Ground", "Badminton Court", "Tennis Court", "Basketball Court", "Swimming Pool Slots", "Gaming Arena Booking", "Indoor Play Arena"
    ],
    "Health, Wellness & Dining": [
      "Restaurant Table Reservation", "Salon / Spa Appointment", "Gym / Yoga Slot Booking", "Doctor Appointment"
    ],
    "Home & Trade Services": [
      "Electrician Booking", "Plumber Booking", "Cleaning Service", "Technician Service"
    ],
    "Workspaces, Studios & Events": [
      "Co-working Space", "Meeting Room", "Podcast Studio", "Conference Hall", "Training Sessions", "Studio Booking", "Event Organizer Booking"
    ],
    "Rentals & Equipment": [
      "Cycle Rental", "Sports Bike Rental", "Camera Rental", "Sound System Rental", "Event Equipment Rental"
    ],
    "Personal Care Services": [
      "Pet Grooming Appointment", "Babysitting Service", "Elder Care Service"
    ],
    "API Integrations (Category B)": [
      "Flight Booking", "Train Booking", "Bus Booking", "Ferry / Boat Booking", "Shuttle / Van Booking", "Helicopter Booking (Premium)", "Cab / Taxi Booking", "Bike Rental", "Self-Drive Car Rental", "Cinema / Movie Tickets", "Theatre Shows", "Concert Tickets", "Events & Festivals", "Exhibition Entry", "Workshops / Classes", "Temple Darshan Booking", "Pooja Slot Booking", "Pilgrimage Packages"
    ]
  };

  if (!currentMerchant || !mounted) {
    return (
      <div className="flex h-full min-h-[500px] items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-[#8b6508] border-t-transparent animate-spin" />
      </div>
    );
  }

  const merchantServices = services;

  // Save Booking Type (Level 1)
  const handleSaveBookingType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingTypeCategory) return alert("Please select a booking type");

    const newService: CatalogService = {
      id: crypto.randomUUID(),
      name: '__BOKSPOT_GROUP__', // Special marker
      merchant: currentMerchant.merchantName,
      price: 0,
      duration: 30,
      category: bookingTypeCategory,
      active: true,
      rating: 5.0,
      bookingsCount: 0,
      city: (typeof window !== 'undefined' ? localStorage.getItem('bus-selected-city') : null) || currentMerchant.city || 'Chennai',
      listings: [],
      metadata: { mainImageUrl: bookingTypeImage.trim() || undefined },
      createdAt: new Date().toISOString()
    };

    addService(newService);
    
    setShowBookingTypeModal(false);
    setBookingTypeCategory('');
    setBookingTypeImage('');
  };

  // Save Category (Level 2)
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return alert("Please enter a category name");

    const newService: CatalogService = {
      id: editingServiceId || crypto.randomUUID(),
      name: categoryName.trim(),
      merchant: currentMerchant.merchantName,
      price: 0,
      duration: 30,
      category: selectedGroup || currentMerchant.category,
      active: true,
      rating: 5.0,
      bookingsCount: 0,
      city: (typeof window !== 'undefined' ? localStorage.getItem('bus-selected-city') : null) || currentMerchant.city || 'Chennai',
      imageUrl: categoryImage.trim() || undefined,
      description: categoryDesc.trim() || undefined,
      listings: [],
      createdAt: new Date().toISOString()
    };

    if (editingServiceId) {
      // Find original service to preserve its listings during update
      const origService = merchantServices.find(s => s.id === editingServiceId);
      if (origService) {
        newService.listings = origService.listings;
      }
      updateService(newService);
    } else {
      addService(newService);
    }
    
    setShowCategoryModal(false);
    setEditingServiceId(null);
    setCategoryName('');
    setCategoryImage('');
    setCategoryDesc('');
  };

  const openEditCategory = (e: React.MouseEvent, srv: CatalogService) => {
    e.stopPropagation();
    setEditingServiceId(srv.id);
    setCategoryName(srv.name);
    setCategoryImage(srv.imageUrl || '');
    setCategoryDesc(srv.description || '');
    setShowCategoryModal(true);
  };

  const handleDeleteService = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteService(id);
  };

  const openCategoryPage = (srv: CatalogService) => {
    router.push(`/workspace/my-services/${srv.id}`);
  };

  const getFallbackImage = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=150`;
  }

  const groupedCategories = merchantServices.reduce((acc: any, srv: any) => {
    const cat = srv.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = { category: cat, mainImage: null, count: 0, serviceId: null, createdAt: srv.createdAt, city: srv.city };
    
    if (srv.name === '__BOKSPOT_GROUP__') {
      acc[cat].mainImage = srv.metadata?.mainImageUrl || srv.imageUrl || acc[cat].mainImage;
      acc[cat].serviceId = srv.id;
      if (srv.createdAt) acc[cat].createdAt = srv.createdAt;
      if (srv.city) acc[cat].city = srv.city;
    } else {
      acc[cat].count += 1; // Only count real categories
      if (!acc[cat].mainImage) acc[cat].mainImage = srv.imageUrl; // Fallback to first real category image
    }
    return acc;
  }, {});

  // Real categories in the selected group (Level 2)
  const currentGroupCategories = merchantServices.filter(s => s.category === selectedGroup && s.name !== '__BOKSPOT_GROUP__');

  return (
    <div className="space-y-12 animate-fade-in pb-12 font-sans">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            {selectedGroup ? `${selectedGroup} Categories` : 'My Services'}
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-2 max-w-2xl">
            {selectedGroup 
              ? `Manage your ${selectedGroup} categories and their specific listings.`
              : 'Add main booking types (like Hotel Booking), then click them to add specific categories (like Deluxe Room) and listings.'}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          {!selectedGroup ? (
            <button 
              onClick={() => {
                setBookingTypeCategory('');
                setBookingTypeImage('');
                setShowBookingTypeModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8b6508] hover:bg-[#6c4e06] text-white font-bold tracking-wide transition-all shadow-md active:scale-95"
            >
              <Plus size={18} /> Add Booking Type
            </button>
          ) : (
            <>
              <button 
                onClick={() => {
                  setEditingServiceId(null);
                  setCategoryName('');
                  setCategoryImage('');
                  setCategoryDesc('');
                  setShowCategoryModal(true);
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8b6508] hover:bg-[#6c4e06] text-white font-bold tracking-wide transition-all shadow-md active:scale-95"
              >
                <Plus size={18} /> Add Category
              </button>
              <button
                onClick={() => router.push('/workspace/about')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold tracking-wide transition-all shadow-sm active:scale-95 border border-slate-200"
              >
                Venue Profile
              </button>
            </>
          )}
        </div>
      </div>

      {/* Grid Area */}
      <div>
        {!selectedGroup ? (
          // LEVEL 1: BOOKING TYPES
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {Object.entries(groupedCategories).map(([cat, info]: any) => (
                <div 
                  key={cat} 
                  onClick={() => setSelectedGroup(cat)}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden flex flex-col cursor-pointer"
                >
                  <div className="h-36 w-full bg-slate-100 relative">
                    <img 
                      src={info.mainImage || getFallbackImage(cat)} 
                      alt={cat} 
                      className="h-full w-full object-cover" 
                      onError={(e) => { e.currentTarget.src = getFallbackImage(cat); }}
                    />
                    {info.serviceId && (
                      <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => {
                          e.stopPropagation();
                          const srv = merchantServices.find(s => s.id === info.serviceId);
                          if (srv) {
                            setBookingTypeCategory(srv.category || '');
                            setBookingTypeImage(srv.metadata?.mainImageUrl || srv.imageUrl || '');
                            setShowBookingTypeModal(true);
                          }
                        }} className="h-8 w-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-slate-700 shadow-sm transition-colors">
                          <Edit size={14} />
                        </button>
                        <button onClick={(e) => handleDeleteService(e, info.serviceId)} className="h-8 w-8 bg-white/90 hover:bg-red-50 hover:text-red-600 rounded-full flex items-center justify-center text-slate-700 shadow-sm transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div className="flex flex-col">
                        <h3 className="font-extrabold text-base text-slate-900 leading-tight">{cat}</h3>
                        {info.createdAt && (
                          <span className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">
                            Added: {new Date(info.createdAt).toLocaleDateString()} {new Date(info.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true})}
                          </span>
                        )}
                        {info.city && (
                          <span className="text-[10px] text-[#8b6508] font-bold mt-1 uppercase tracking-wider flex items-center gap-1">
                            📍 {info.city}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Package size={14} className="text-[#8b6508]" />
                        <span className="text-xs font-bold">{info.count} Categories inside</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {Object.keys(groupedCategories).length === 0 && (
              <div className="col-span-full py-20 px-6 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 bg-slate-200 rounded-2xl flex items-center justify-center mb-4 text-slate-400 rotate-3">
                  <Package size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Booking Types Yet</h3>
                <p className="text-slate-500 max-w-md text-sm mb-6">
                  Start by adding a main Booking Type (like Hotel Booking or Turf Booking).
                </p>
                <button 
                  onClick={() => setShowBookingTypeModal(true)}
                  className="px-6 py-3 rounded-xl bg-[#8b6508] hover:bg-[#6c4e06] text-white font-bold text-sm transition-colors"
                >
                  Add First Booking Type
                </button>
              </div>
            )}
          </>
        ) : (
          // LEVEL 2: CATEGORIES & LISTINGS
          <div>
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setSelectedGroup(null)} className="text-sm font-bold text-[#8b6508] hover:text-[#6c4e06] flex items-center gap-1">
                ← Back to Booking Types
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {currentGroupCategories.map(srv => (
                <div 
                  key={srv.id} 
                  onClick={() => openCategoryPage(srv)}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden flex flex-col cursor-pointer"
                >
                  <div className="h-36 w-full bg-slate-100 relative">
                    <img 
                      src={srv.imageUrl || getFallbackImage(srv.name)} 
                      alt={srv.name} 
                      className="h-full w-full object-cover" 
                      onError={(e) => { e.currentTarget.src = getFallbackImage(srv.name); }}
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => openEditCategory(e, srv)} className="h-8 w-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-slate-700 shadow-sm transition-colors">
                        <Edit size={14} />
                      </button>
                      <button onClick={(e) => handleDeleteService(e, srv.id)} className="h-8 w-8 bg-white/90 hover:bg-red-50 hover:text-red-600 rounded-full flex items-center justify-center text-slate-700 shadow-sm transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div className="flex flex-col">
                        <h3 className="font-extrabold text-base text-slate-900 leading-tight">{srv.name}</h3>
                      </div>
                    </div>
                    {srv.description && (
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">{srv.description}</p>
                    )}
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                      <div className="flex items-center gap-2 text-slate-500">
                        <List size={14} className="text-[#8b6508]" />
                        <span className="text-xs font-bold">{srv.listings?.length || 0} Listings inside</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {currentGroupCategories.length === 0 && (
              <div className="mt-12 py-16 px-6 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 bg-slate-200 rounded-2xl flex items-center justify-center mb-4 text-slate-400 rotate-3">
                  <Package size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Categories Here</h3>
                <p className="text-slate-500 max-w-md text-sm mb-6">
                  You haven't added any categories (like Deluxe Room) to {selectedGroup} yet.
                </p>
                <button 
                  onClick={() => setShowCategoryModal(true)}
                  className="px-6 py-3 rounded-xl bg-[#8b6508] hover:bg-[#6c4e06] text-white font-bold text-sm transition-colors"
                >
                  Add First Category & Listing
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* LEVEL 1 MODAL: BOOKING TYPE */}
      {showBookingTypeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-900">Add Booking Type</h2>
              <button onClick={() => setShowBookingTypeModal(false)} className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="bookingTypeForm" onSubmit={handleSaveBookingType} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Service Type (BokSpot Category)</label>
                  <select value={bookingTypeCategory} onChange={(e) => setBookingTypeCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8b6508] focus:ring-2 focus:ring-[#8b6508]/20 transition-all font-medium" required>
                    <option value="" disabled>Select a service type</option>
                    {Object.entries(GROUPED_CATEGORIES).map(([groupName, categories]) => (
                      <optgroup key={groupName} label={groupName} className="font-bold text-slate-800 bg-slate-50">
                        {categories.map(cat => (
                          <option key={cat} value={cat} className="font-normal text-slate-700 bg-white">{cat}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Main Cover Image (User App Front Page)</label>
                  <div onClick={() => document.getElementById('booking-image-upload')?.click()} className="w-full h-32 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#8b6508] bg-slate-50 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden group mb-3">
                    {bookingTypeImage ? (
                      <>
                        <img src={bookingTypeImage} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="text-white font-bold text-sm flex items-center gap-2">Change Image</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-slate-500 group-hover:text-[#8b6508] transition-colors">
                        <span className="font-bold text-sm">Click to choose image</span>
                        <span className="text-xs mt-1 opacity-70">PNG, JPG up to 5MB</span>
                      </div>
                    )}
                  </div>
                  <input id="booking-image-upload" type="file" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const compressed = await compressImage(file, 400, 400, 0.8);
                        setBookingTypeImage(compressed);
                      } catch (err) {
                        console.error('Image compression failed', err);
                      }
                    }
                  }} accept="image/*" />
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button type="button" onClick={() => setShowBookingTypeModal(false)} className="px-5 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition-colors">Cancel</button>
              <button type="submit" form="bookingTypeForm" className="px-6 py-2.5 rounded-xl bg-[#8b6508] hover:bg-[#6c4e06] text-white font-bold transition-colors shadow-lg shadow-[#8b6508]/20">Save Booking Type</button>
            </div>
          </div>
        </div>
      )}

      {/* LEVEL 2 MODAL: CATEGORY & LISTING */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-900">{editingServiceId ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setShowCategoryModal(false)} className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"><X size={16} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="categoryListingForm" onSubmit={handleSaveCategory} className="space-y-5">
                  <h3 className="text-lg font-black text-slate-800 border-b border-slate-100 pb-2 mb-4">Category Details</h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Category Name</label>
                    <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="e.g. Deluxe Room" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8b6508] focus:ring-2 focus:ring-[#8b6508]/20 transition-all font-medium" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Category Image</label>
                    <div onClick={() => document.getElementById('cat-image-upload')?.click()} className="w-full h-32 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#8b6508] bg-slate-50 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden group mb-3">
                      {categoryImage ? (
                        <>
                          <img src={categoryImage} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><span className="text-white font-bold text-sm flex items-center gap-2">Change Image</span></div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-slate-500 group-hover:text-[#8b6508] transition-colors"><span className="font-bold text-sm">Click to choose image</span></div>
                      )}
                    </div>
                    <input id="cat-image-upload" type="file" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const compressed = await compressImage(file, 400, 400, 0.8);
                          setCategoryImage(compressed);
                        } catch (err) {
                          console.error('Image compression failed', err);
                        }
                      }
                    }} accept="image/*" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Description</label>
                    <textarea value={categoryDesc} onChange={(e) => setCategoryDesc(e.target.value)} placeholder="Short description..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8b6508] focus:ring-2 focus:ring-[#8b6508]/20 transition-all font-medium min-h-[80px]" />
                  </div>
              </form>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end items-center gap-3 shrink-0">
              <button type="button" onClick={() => setShowCategoryModal(false)} className="px-5 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button type="submit" form="categoryListingForm" className="px-6 py-2.5 rounded-xl bg-[#8b6508] hover:bg-[#6c4e06] text-white font-bold transition-colors shadow-lg shadow-[#8b6508]/20">
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
