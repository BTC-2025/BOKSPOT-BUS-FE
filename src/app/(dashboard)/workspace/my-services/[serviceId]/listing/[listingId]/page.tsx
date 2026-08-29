'use client';

import { useVendorStore, CatalogListing } from '@/lib/store';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Package, AlertTriangle, Tag, Users, CheckSquare, Info, X, Save, Bed, Image as ImageIcon, Activity, Heart, Car, Ticket, Briefcase, Zap, CheckCircle2 } from 'lucide-react';
import DynamicForm from '@/components/DynamicForm';
import { CATEGORY_TO_ARCHETYPE_MAP, Archetype } from '@/lib/archetypes';

export default function ListingEditorPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.serviceId as string;
  const listingId = params.listingId as string;
  const isCreating = listingId === 'new';
  
  const { services, updateService, currentMerchant } = useVendorStore();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);

  // Form State
  const [serviceName, setServiceName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('0');
  
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
          setBasePrice(list.price?.toString() || '0');
          setMetadata(list.metadata || {});
        }
      }
    }
  }, [services, serviceId, listingId, isCreating, currentMerchant]);

  if (!mounted || !currentMerchant) return null;

  const category = services.find(s => s.id === serviceId);
  if (!category) return null;

  const catSlug = category?.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const merchantSlug = currentMerchant?.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const archetype: Archetype = CATEGORY_TO_ARCHETYPE_MAP[catSlug || ''] || CATEGORY_TO_ARCHETYPE_MAP[merchantSlug || ''] || 'EVENT';

  const handleSaveDetails = () => {
    if (!serviceName.trim()) {
      alert("Please enter a Listing Name");
      setStep(1);
      return;
    }

    const updatedListing: CatalogListing = {
      id: isCreating ? `list-${Date.now()}` : listingId,
      name: serviceName.trim(),
      imageUrl: imageUrl.trim() || undefined,
      description: description.trim() || undefined,
      active: true,
      price: parseFloat(basePrice) || 0,
      duration: 30, // Default duration
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
      
      {/* Header */}
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
          Listing in category: <strong>{category.name}</strong>
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between relative mb-12 px-4">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 z-0 rounded-full overflow-hidden">
          <div className="h-full bg-[#8b6508] transition-all duration-500" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
        </div>
        {[
          { num: 1, label: 'Basic Info', icon: Info },
          { num: 2, label: 'Dynamic Details', icon: Zap },
          { num: 3, label: 'Publish', icon: CheckCircle2 }
        ].map((s) => (
          <div key={s.num} className="relative z-10 flex flex-col items-center gap-2" onClick={() => setStep(s.num)} style={{ cursor: 'pointer' }}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-colors shadow-sm
              ${step >= s.num ? 'bg-[#8b6508] text-white' : 'bg-white text-slate-400 border-2 border-slate-200'}
            `}>
              <s.icon size={20} />
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${step >= s.num ? 'text-[#8b6508]' : 'text-slate-400'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-[2rem] shadow-lg border border-slate-200/60 overflow-hidden">
        
        {step === 1 && (
          <div className="p-8 md:p-10 space-y-8 animate-fade-in">
            <h2 className="text-2xl font-black text-slate-900 border-b border-slate-100 pb-4">1. Basic Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Listing Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g. Deluxe Room, Full Body Massage, VIP Table"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8b6508] focus:ring-2 focus:ring-[#8b6508]/20 transition-all font-medium bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Listing Image</label>
                <div 
                  onClick={() => document.getElementById('listing-image-upload')?.click()}
                  className="w-full h-32 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#8b6508] bg-slate-50 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden group mb-3"
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
                      <span className="font-bold text-sm">Click to choose local image</span>
                      <span className="text-xs mt-1 opacity-70">PNG, JPG up to 5MB</span>
                    </div>
                  )}
                </div>
                <input 
                  id="listing-image-upload"
                  type="file" 
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setImageUrl(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  accept="image/*"
                />
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Or enter Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8b6508] focus:ring-2 focus:ring-[#8b6508]/20 transition-all font-medium bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Base Price (₹) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="e.g. 500"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8b6508] focus:ring-2 focus:ring-[#8b6508]/20 transition-all font-medium bg-slate-50 focus:bg-white"
                    required
                  />
                  <p className="text-[10px] text-slate-500 mt-1">The starting price shown to customers.</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Short Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this listing..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8b6508] focus:ring-2 focus:ring-[#8b6508]/20 transition-all font-medium bg-slate-50 focus:bg-white min-h-[120px]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button 
                onClick={() => setStep(2)}
                disabled={!serviceName}
                className="px-8 py-3 bg-[#8b6508] text-white rounded-xl font-bold disabled:opacity-50 hover:bg-[#6c4e06] transition-colors"
              >
                Next: Dynamic Details
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-8 md:p-10 space-y-8 animate-fade-in bg-indigo-50/30">
            <h2 className="text-2xl font-black text-slate-900 border-b border-indigo-100 pb-4 flex items-center gap-2">
              <Zap className="text-indigo-600" /> 2. Dynamic Details ({archetype})
            </h2>
            <p className="text-sm text-slate-600">
              These fields are specifically tailored for your business category type ({archetype}). Fill them out accurately.
            </p>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <DynamicForm 
                archetype={archetype}
                initialData={metadata}
                onSubmit={(data) => {
                  setMetadata(data);
                  setStep(3);
                }}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-8 md:p-10 space-y-8 animate-fade-in bg-green-50/30">
            <h2 className="text-2xl font-black text-slate-900 border-b border-green-100 pb-4 flex items-center gap-2">
              <CheckCircle2 className="text-green-600" /> 3. Review & Publish
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-lg">Basic Info</h3>
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                  <p className="text-sm"><span className="text-slate-500">Name:</span> <strong>{serviceName}</strong></p>
                  <p className="text-sm"><span className="text-slate-500">Category:</span> <strong>{category.name}</strong></p>
                  <p className="text-sm"><span className="text-slate-500">Archetype:</span> <strong>{archetype}</strong></p>
                  <p className="text-sm"><span className="text-slate-500">Base Price:</span> <strong>₹{basePrice || '0'}</strong></p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-lg">Dynamic Config</h3>
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 max-h-64 overflow-y-auto">
                  {Object.entries(metadata).length > 0 ? (
                    Object.entries(metadata).map(([key, val]) => (
                      <div key={key} className="text-sm border-b border-slate-100 pb-2 last:border-0">
                        <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span> <br/>
                        <strong>{Array.isArray(val) ? val.join(', ') : String(val)}</strong>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 italic">No dynamic details provided.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-200">
              <button 
                onClick={() => setStep(2)}
                className="px-6 py-3 text-slate-500 hover:bg-slate-100 rounded-xl font-bold transition-colors"
              >
                Back to Edit
              </button>
              <button 
                onClick={handleSaveDetails}
                className="flex items-center gap-2 px-8 py-3 bg-[#8b6508] text-white rounded-xl font-bold hover:bg-[#6c4e06] shadow-lg shadow-[#8b6508]/20 transition-all"
              >
                <Save size={18} /> Publish Listing
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
