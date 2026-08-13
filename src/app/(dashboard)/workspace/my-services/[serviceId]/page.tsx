'use client';

import { useVendorStore, CatalogListing } from '@/lib/store';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Plus, ArrowLeft, Image as ImageIcon, Trash2 } from 'lucide-react';

export default function ServiceListingsPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.serviceId as string;
  const { services, updateService, currentMerchant } = useVendorStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !currentMerchant) {
    return (
      <div className="flex h-full min-h-[500px] items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-[#8b6508] border-t-transparent animate-spin" />
      </div>
    );
  }

  const category = services.find(s => s.id === serviceId);

  if (!category) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Category Not Found</h2>
        <button onClick={() => router.push('/workspace/my-services')} className="px-6 py-2 bg-slate-900 text-white rounded-xl">Go Back</button>
      </div>
    );
  }

  const listings = category.listings || [];

  const handleDeleteListing = (e: React.MouseEvent, listId: string) => {
    e.stopPropagation();
    const updatedCategory = {
      ...category,
      listings: category.listings!.filter(l => l.id !== listId)
    };
    updateService(updatedCategory);
  };

  const getFallbackImage = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=150`;
  }

  return (
    <div className="space-y-12 animate-fade-in pb-12 font-sans">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <button 
            onClick={() => router.push('/workspace/my-services')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Categories
          </button>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            {category.name} Listings
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-2 max-w-2xl">
            Manage individual items (listings) inside the {category.name} category.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push(`/workspace/my-services/${serviceId}/listing/new`)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#8b6508] hover:bg-[#6c4e06] text-white shadow-lg shadow-[#8b6508]/20 font-bold text-xs uppercase tracking-widest transition-colors"
          >
            <Plus size={16} /> My Listing
          </button>
        </div>
      </div>

      {/* Listings Grid */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(list => (
            <div 
              key={list.id} 
              onClick={() => router.push(`/workspace/my-services/${serviceId}/listing/${list.id}`)}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col cursor-pointer group"
            >
              <div className="h-40 w-full bg-slate-100 relative">
                {list.imageUrl ? (
                  <img src={list.imageUrl} alt={list.name} className="h-full w-full object-cover" />
                ) : (
                  <img src={getFallbackImage(list.name)} alt={list.name} className="h-full w-full object-cover" />
                )}
                <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => handleDeleteListing(e, list.id)} className="h-8 w-8 bg-white/90 hover:bg-red-50 hover:text-red-600 rounded-full flex items-center justify-center text-slate-700 shadow-sm transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-extrabold text-lg text-slate-900">{list.name}</h3>
                {list.description && <p className="text-sm text-slate-500 mt-2 line-clamp-2">{list.description}</p>}
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {list.isTimingEnabled && <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">Timing</span>}
                  {list.isAddonsEnabled && <span className="px-2 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold rounded">Add-ons</span>}
                  {list.isRulesEnabled && <span className="px-2 py-1 bg-orange-50 text-orange-700 text-[10px] font-bold rounded">Rules</span>}
                  {list.isOffersEnabled && <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded">Offers</span>}
                </div>
              </div>
            </div>
          ))}

          {listings.length === 0 && (
            <div className="col-span-full py-20 px-6 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 bg-slate-200 rounded-2xl flex items-center justify-center mb-4 text-slate-400 rotate-3">
                <ImageIcon size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Listings Yet</h3>
              <p className="text-slate-500 max-w-md text-sm mb-6">
                Click "My Listing" to create the first listing for {category.name}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
