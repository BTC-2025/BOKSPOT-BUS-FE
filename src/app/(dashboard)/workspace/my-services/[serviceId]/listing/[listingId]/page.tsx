'use client';

import { useVendorStore, CatalogListing } from '@/lib/store';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Package, AlertTriangle, Tag, Users, CheckSquare, Info, X, ToggleLeft, ToggleRight, Save, Bed } from 'lucide-react';

const ToggleHeader = ({ title, enabled, onToggle, desc, icon: Icon }: any) => (
  <div className="flex items-start justify-between pb-4 mb-6">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${enabled ? 'bg-[#8b6508]/10 text-[#8b6508]' : 'bg-slate-100 text-slate-400'}`}>
        <Icon size={20} />
      </div>
      <div>
        <h4 className="text-lg font-black text-slate-900">{title}</h4>
        {desc && <p className="text-sm text-slate-500 mt-1">{desc}</p>}
      </div>
    </div>
    <button type="button" onClick={onToggle} className="flex items-center gap-2 text-sm font-bold mt-1">
      <span className={enabled ? "text-[#8b6508]" : "text-slate-400"}>{enabled ? 'Enabled' : 'Disabled'}</span>
      {enabled ? <ToggleRight size={32} className="text-[#8b6508]" /> : <ToggleLeft size={32} className="text-slate-300" />}
    </button>
  </div>
);

export default function ListingEditorPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.serviceId as string;
  const listingId = params.listingId as string;
  const isCreating = listingId === 'new';
  
  const { services, updateService, currentMerchant } = useVendorStore();
  const [mounted, setMounted] = useState(false);

  // Form State
  const [serviceName, setServiceName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [duration, setDuration] = useState('30');
  
  const [detTiming, setDetTiming] = useState('');
  const [detCapacity, setDetCapacity] = useState('');
  
  const [detAddOns, setDetAddOns] = useState<{name: string, price: number}[]>([]);
  const [newAddOnName, setNewAddOnName] = useState('');
  const [newAddOnPrice, setNewAddOnPrice] = useState('');
  
  const [detTips, setDetTips] = useState('');
  const [detRestrictions, setDetRestrictions] = useState('');
  const [detInstructions, setDetInstructions] = useState('');
  
  const [detOffers, setDetOffers] = useState('');

  // Toggles (7 Individual Toggles)
  const [isTimingEnabled, setIsTimingEnabled] = useState(false);
  const [isCapacityEnabled, setIsCapacityEnabled] = useState(false);
  const [isAddonsEnabled, setIsAddonsEnabled] = useState(false);
  const [isTipsEnabled, setIsTipsEnabled] = useState(false);
  const [isRestrictionsEnabled, setIsRestrictionsEnabled] = useState(false);
  const [isInstructionsEnabled, setIsInstructionsEnabled] = useState(false);
  const [isOffersEnabled, setIsOffersEnabled] = useState(false);
  
  // Config-Driven Metadata State
  const [metadata, setMetadata] = useState<Record<string, any>>({});

  useEffect(() => {
    setMounted(true);
    if (services.length > 0 && currentMerchant) {
      const category = services.find(s => s.id === serviceId);
      if (category && !isCreating) {
        const list = category.listings?.find(l => l.id === listingId);
        if (list) {
          setServiceName(list.name || '');
          setImageUrl(list.imageUrl || '');
          setDescription(list.description || '');
          setPrice(list.price ? String(list.price) : '0');
          setDuration(list.duration ? String(list.duration) : '30');
          
          setDetTiming(list.timingDetails || '');
          setDetCapacity(list.participantCapacity ? String(list.participantCapacity) : '');
          setDetAddOns(list.addOns || []);
          setDetTips(list.tipsAndGuidelines || '');
          setDetRestrictions(list.restrictions || '');
          setDetOffers(list.offersAndDiscounts || '');
          setDetInstructions(list.specialInstructions || '');
          
          setIsTimingEnabled(list.isTimingEnabled || false);
          setIsCapacityEnabled(list.isCapacityEnabled || false);
          setIsAddonsEnabled(list.isAddonsEnabled || false);
          setIsTipsEnabled(list.isTipsEnabled || false);
          setIsRestrictionsEnabled(list.isRestrictionsEnabled || false);
          setIsInstructionsEnabled(list.isInstructionsEnabled || false);
          setIsOffersEnabled(list.isOffersEnabled || false);
          setMetadata(list.metadata || {});
        }
      }
    }
  }, [services, serviceId, listingId, isCreating, currentMerchant]);

  if (!mounted || !currentMerchant) return null;

  const category = services.find(s => s.id === serviceId);
  if (!category) return null;

  const handleAddAddon = () => {
    if (newAddOnName.trim() && newAddOnPrice.trim()) {
      setDetAddOns([...detAddOns, { name: newAddOnName.trim(), price: parseFloat(newAddOnPrice) }]);
      setNewAddOnName('');
      setNewAddOnPrice('');
    }
  };

  const handleRemoveAddon = (idx: number) => {
    setDetAddOns(detAddOns.filter((_, i) => i !== idx));
  };

  const handleSaveDetails = () => {
    if (!serviceName.trim()) return;

    const updatedListing: CatalogListing = {
      id: isCreating ? `list-${Date.now()}` : listingId,
      name: serviceName.trim(),
      imageUrl: imageUrl.trim() || undefined,
      description: description.trim() || undefined,
      active: true,
      price: parseFloat(price) || 0,
      duration: parseInt(duration) || 30,
      
      isTimingEnabled,
      timingDetails: isTimingEnabled ? (detTiming.trim() || undefined) : undefined,
      
      isCapacityEnabled,
      participantCapacity: isCapacityEnabled ? (parseInt(detCapacity) || undefined) : undefined,
      
      isAddonsEnabled,
      addOns: isAddonsEnabled && detAddOns.length > 0 ? detAddOns : undefined,
      
      isTipsEnabled,
      tipsAndGuidelines: isTipsEnabled ? (detTips.trim() || undefined) : undefined,
      
      isRestrictionsEnabled,
      restrictions: isRestrictionsEnabled ? (detRestrictions.trim() || undefined) : undefined,
      
      isInstructionsEnabled,
      specialInstructions: isInstructionsEnabled ? (detInstructions.trim() || undefined) : undefined,
      
      isOffersEnabled,
      offersAndDiscounts: isOffersEnabled ? (detOffers.trim() || undefined) : undefined,
      metadata
    };

    let updatedListings = category.listings || [];
    if (isCreating) {
      updatedListings = [...updatedListings, updatedListing];
    } else {
      updatedListings = updatedListings.map(l => l.id === updatedListing.id ? updatedListing : l);
    }

    const updatedCategory = {
      ...category,
      listings: updatedListings
    };

    updateService(updatedCategory);
    router.push(`/workspace/my-services/${serviceId}`);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24 font-sans max-w-4xl mx-auto">
      
      {/* Header section (No buttons here) */}
      <div className="py-6">
        <button 
          onClick={() => router.push(`/workspace/my-services/${serviceId}`)}
          className="flex items-center gap-2 text-slate-500 hover:text-[#8b6508] font-bold text-sm mb-4 transition-colors"
        >
          <ArrowLeft size={16} /> Back to {category.name} Listings
        </button>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          {isCreating ? 'Create New Listing' : 'Edit Listing'}
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-2">
          Configure all details for this specific listing.
        </p>
      </div>

      {/* SINGLE LARGE CARD */}
      <div className="bg-white rounded-[2rem] shadow-lg border border-slate-200/60 overflow-hidden">
        
        <div className="p-8 md:p-10 space-y-12">
          
          {/* Basic Info */}
          <div>
            <h4 className="text-xl font-black text-slate-900 mb-6 border-b border-slate-100 pb-4">Basic Information</h4>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Listing Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g. Room 101, VIP Table"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8b6508] focus:ring-2 focus:ring-[#8b6508]/20 transition-all font-medium bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Listing Image</label>
                <div 
                  onClick={() => document.getElementById('list-image-upload')?.click()}
                  className="w-full h-40 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#8b6508] bg-slate-50 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden group"
                >
                  {imageUrl ? (
                    <>
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-white font-bold text-sm flex items-center gap-2">
                          Change Image
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-slate-500 group-hover:text-[#8b6508] transition-colors">
                      <span className="font-bold text-sm">Click to choose image</span>
                      <span className="text-xs mt-1 opacity-70">PNG, JPG up to 5MB</span>
                    </div>
                  )}
                </div>
                <input 
                  id="list-image-upload"
                  type="file" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setImageUrl(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  accept="image/*"
                  className="hidden" 
                />
                <div className="mt-3">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Or enter Image URL</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8b6508] focus:ring-2 focus:ring-[#8b6508]/20 transition-all font-medium text-sm bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8b6508] focus:ring-2 focus:ring-[#8b6508]/20 transition-all font-medium min-h-[120px] bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Price (₹) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8b6508] focus:ring-2 focus:ring-[#8b6508]/20 transition-all font-medium bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Base Duration (Mins) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 60 or 1440 for full day"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8b6508] focus:ring-2 focus:ring-[#8b6508]/20 transition-all font-medium bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full my-8"></div>

          {/* DYNAMIC CONFIG DRIVEN UI BLOCK */}
          {currentMerchant.archetype === 'Accommodation' && (
            <div>
              <h4 className="text-xl font-black text-slate-900 mb-6 border-b border-slate-100 pb-4 flex items-center gap-2">
                <Bed size={24} className="text-[#8b6508]" />
                Hotel Specific Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#8b6508]/5 p-6 rounded-2xl border border-[#8b6508]/20">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Bed Size</label>
                  <select
                    value={metadata.bedSize || ''}
                    onChange={(e) => setMetadata({...metadata, bedSize: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8b6508] focus:ring-2 focus:ring-[#8b6508]/20 transition-all font-medium bg-white"
                  >
                    <option value="">Select Bed Size</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Queen">Queen</option>
                    <option value="King">King</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Max Guests</label>
                  <input
                    type="number"
                    value={metadata.maxGuests || ''}
                    onChange={(e) => setMetadata({...metadata, maxGuests: parseInt(e.target.value)})}
                    placeholder="e.g. 2"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8b6508] focus:ring-2 focus:ring-[#8b6508]/20 transition-all font-medium bg-white"
                  />
                </div>
                <div className="md:col-span-2 flex flex-wrap items-center gap-6 pt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={!!metadata.hasAC}
                      onChange={(e) => setMetadata({...metadata, hasAC: e.target.checked})}
                      className="w-5 h-5 rounded text-[#8b6508] focus:ring-[#8b6508]"
                    />
                    <span className="font-bold text-slate-700">Air Conditioning</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={!!metadata.hasWiFi}
                      onChange={(e) => setMetadata({...metadata, hasWiFi: e.target.checked})}
                      className="w-5 h-5 rounded text-[#8b6508] focus:ring-[#8b6508]"
                    />
                    <span className="font-bold text-slate-700">Free WiFi</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={!!metadata.hasBreakfast}
                      onChange={(e) => setMetadata({...metadata, hasBreakfast: e.target.checked})}
                      className="w-5 h-5 rounded text-[#8b6508] focus:ring-[#8b6508]"
                    />
                    <span className="font-bold text-slate-700">Breakfast Included</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="h-px bg-slate-100 w-full my-8"></div>

          {/* 1. Timings */}
          <div>
            <ToggleHeader 
              title="Operational Timings" 
              desc="Configure specific availability, days, and time slots."
              icon={Clock}
              enabled={isTimingEnabled}
              onToggle={() => setIsTimingEnabled(!isTimingEnabled)}
            />
            {isTimingEnabled && (
              <div className="animate-slide-down space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                
                {/* Days of Week */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Available Days</label>
                  <div className="flex flex-wrap gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <button 
                        key={day}
                        type="button" 
                        onClick={() => {
                          const current = detTiming.includes(day) 
                            ? detTiming.replace(new RegExp(day + '\\b,?\\s*', 'g'), '').trim() 
                            : detTiming + ' ' + day;
                          setDetTiming(current.replace(/,$/, '').trim());
                        }}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${detTiming.includes(day) ? 'bg-[#8b6508] text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:border-[#8b6508] hover:text-[#8b6508]'}`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Opening Time</label>
                    <input 
                      type="time" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8b6508] focus:ring-2 focus:ring-[#8b6508]/20 transition-all font-medium bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Closing Time</label>
                    <input 
                      type="time" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8b6508] focus:ring-2 focus:ring-[#8b6508]/20 transition-all font-medium bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Additional Timing Details</label>
                  <textarea
                    value={detTiming}
                    onChange={(e) => setDetTiming(e.target.value)}
                    placeholder="e.g., Closed on public holidays..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8b6508] focus:ring-2 focus:ring-[#8b6508]/20 transition-all text-sm min-h-[80px] bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-slate-100 w-full my-8"></div>

          {/* 2. Capacity */}
          <div>
            <ToggleHeader 
              title="Capacity Limits" 
              desc="Set maximum capacity constraints."
              icon={Users}
              enabled={isCapacityEnabled}
              onToggle={() => setIsCapacityEnabled(!isCapacityEnabled)}
            />
            {isCapacityEnabled && (
              <div className="animate-slide-down">
                <input
                  type="number"
                  value={detCapacity}
                  onChange={(e) => setDetCapacity(e.target.value)}
                  placeholder="e.g. 50 (total people or units)"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8b6508] focus:ring-2 focus:ring-[#8b6508]/20 transition-all text-sm bg-slate-50 focus:bg-white"
                />
              </div>
            )}
          </div>

          <div className="h-px bg-slate-100 w-full my-8"></div>

          {/* 3. Add-ons */}
          <div>
            <ToggleHeader 
              title="Add-ons & Extras" 
              desc="Allow customers to select extra items or services during booking."
              icon={Package}
              enabled={isAddonsEnabled}
              onToggle={() => setIsAddonsEnabled(!isAddonsEnabled)}
            />
            {isAddonsEnabled && (
              <div className="space-y-4 animate-slide-down">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={newAddOnName}
                    onChange={(e) => setNewAddOnName(e.target.value)}
                    placeholder="Add-on Name (e.g. Extra Bed)"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#8b6508] focus:ring-2 focus:ring-[#8b6508]/20 transition-all text-sm bg-slate-50 focus:bg-white"
                  />
                  <input
                    type="number"
                    value={newAddOnPrice}
                    onChange={(e) => setNewAddOnPrice(e.target.value)}
                    placeholder="Price ($)"
                    className="w-full sm:w-32 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#8b6508] focus:ring-2 focus:ring-[#8b6508]/20 transition-all text-sm bg-slate-50 focus:bg-white"
                  />
                  <button 
                    type="button" 
                    onClick={handleAddAddon}
                    className="px-6 py-2.5 rounded-xl bg-[#8b6508] hover:bg-[#6c4e06] text-white font-bold text-sm transition-colors whitespace-nowrap"
                  >
                    + Add
                  </button>
                </div>
                
                <div className="space-y-3 mt-4">
                  {detAddOns.length === 0 ? (
                    <p className="text-sm text-slate-400 italic py-2">No add-ons added yet.</p>
                  ) : (
                    detAddOns.map((addon, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
                        <span className="font-bold text-slate-800 text-sm">{addon.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-[#8b6508] font-black text-sm">$${addon.price}</span>
                          <button onClick={() => handleRemoveAddon(idx)} className="h-8 w-8 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors flex items-center justify-center">
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-slate-100 w-full my-8"></div>

          {/* 4. Tips & Guidelines */}
          <div>
            <ToggleHeader 
              title="General Guidelines & Tips" 
              desc="Helpful tips for the customer."
              icon={Info}
              enabled={isTipsEnabled}
              onToggle={() => setIsTipsEnabled(!isTipsEnabled)}
            />
            {isTipsEnabled && (
              <div className="animate-slide-down">
                <textarea
                  value={detTips}
                  onChange={(e) => setDetTips(e.target.value)}
                  placeholder="e.g. Please arrive 15 minutes early."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8b6508] focus:ring-2 focus:ring-[#8b6508]/20 transition-all text-sm min-h-[80px] bg-slate-50 focus:bg-white"
                />
              </div>
            )}
          </div>

          <div className="h-px bg-slate-100 w-full my-8"></div>

          {/* 5. Restrictions */}
          <div>
            <ToggleHeader 
              title="Strict Restrictions" 
              desc="Rules that must not be broken."
              icon={AlertTriangle}
              enabled={isRestrictionsEnabled}
              onToggle={() => setIsRestrictionsEnabled(!isRestrictionsEnabled)}
            />
            {isRestrictionsEnabled && (
              <div className="animate-slide-down">
                <textarea
                  value={detRestrictions}
                  onChange={(e) => setDetRestrictions(e.target.value)}
                  placeholder="e.g. No outside food allowed. Age limit 18+."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8b6508] focus:ring-2 focus:ring-[#8b6508]/20 transition-all text-sm min-h-[80px] bg-slate-50 focus:bg-white"
                />
              </div>
            )}
          </div>

          <div className="h-px bg-slate-100 w-full my-8"></div>

          {/* 6. Special Instructions */}
          <div>
            <ToggleHeader 
              title="Special Instructions" 
              desc="Additional specific instructions."
              icon={CheckSquare}
              enabled={isInstructionsEnabled}
              onToggle={() => setIsInstructionsEnabled(!isInstructionsEnabled)}
            />
            {isInstructionsEnabled && (
              <div className="animate-slide-down">
                <textarea
                  value={detInstructions}
                  onChange={(e) => setDetInstructions(e.target.value)}
                  placeholder="e.g. Bring your own towel."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8b6508] focus:ring-2 focus:ring-[#8b6508]/20 transition-all text-sm min-h-[80px] bg-slate-50 focus:bg-white"
                />
              </div>
            )}
          </div>

          <div className="h-px bg-slate-100 w-full my-8"></div>

          {/* 7. Offers & Discounts */}
          <div>
            <ToggleHeader 
              title="Offers & Discounts" 
              desc="Highlight any ongoing promotions or conditional discounts."
              icon={Tag}
              enabled={isOffersEnabled}
              onToggle={() => setIsOffersEnabled(!isOffersEnabled)}
            />
            {isOffersEnabled && (
              <div className="animate-slide-down">
                <textarea
                  value={detOffers}
                  onChange={(e) => setDetOffers(e.target.value)}
                  placeholder="e.g. 20% off on weekdays! or Buy 1 Get 1 Free."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8b6508] focus:ring-2 focus:ring-[#8b6508]/20 transition-all text-sm min-h-[120px] bg-slate-50 focus:bg-white"
                />
              </div>
            )}
          </div>

        </div>

        {/* Footer with Buttons inside the single card */}
        <div className="bg-slate-50 p-6 md:p-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-4">
          <button 
            onClick={() => router.push(`/workspace/my-services/${serviceId}`)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveDetails}
            disabled={!serviceName.trim()}
            className="w-full sm:w-auto flex justify-center items-center gap-2 px-10 py-3.5 rounded-xl bg-[#8b6508] hover:bg-[#6c4e06] text-white shadow-lg shadow-[#8b6508]/20 font-bold tracking-wide transition-colors disabled:opacity-50"
          >
            <Save size={18} /> Save Listing
          </button>
        </div>

      </div>
      
    </div>
  );
}
