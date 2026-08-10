'use client';

import { useVendorStore, CatalogService } from '../../../lib/store'; 
import { getArchetypeConfig } from '@/lib/businessDictionary';
import { Plus, Trash2, Edit, X, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkspacePage() {
  const router = useRouter();
  const { currentMerchant, services, addService, updateService, deleteService } = useVendorStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Modals state
  const [showServiceModal, setShowServiceModal] = useState(false);
  
  // New Service Form State
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceName, setServiceName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  if (!currentMerchant || !mounted) {
    return (
      <div className="flex h-full min-h-[500px] items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-[#8b6508] border-t-transparent animate-spin" />
      </div>
    );
  }

  const merchantServices = services.filter(s => s.merchant.toLowerCase() === currentMerchant.merchantName.toLowerCase());

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim()) return;

    const newService: CatalogService = {
      id: editingServiceId || `srv-${Date.now()}`,
      name: serviceName.trim(),
      merchant: currentMerchant.merchantName,
      price: 0,
      duration: 30,
      category: currentMerchant.category,
      active: true,
      rating: 5.0,
      bookingsCount: 0,
      imageUrl: imageUrl.trim() || undefined,
      description: description.trim() || undefined,
      listings: []
    };

    if (editingServiceId) {
      updateService(newService);
    } else {
      addService(newService);
    }
    
    setShowServiceModal(false);
    setEditingServiceId(null);
    setServiceName('');
    setImageUrl('');
    setDescription('');
  };

  const openEditService = (e: React.MouseEvent, srv: CatalogService) => {
    e.stopPropagation();
    setEditingServiceId(srv.id);
    setServiceName(srv.name);
    setImageUrl(srv.imageUrl || '');
    setDescription(srv.description || '');
    setShowServiceModal(true);
  };

  const handleDeleteService = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteService(id);
  };

  const openCategoryPage = (srv: CatalogService) => {
    router.push(`/dashboard/services/${srv.id}`);
  };

  const getFallbackImage = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=150`;
  }

  return (
    <div className="space-y-12 animate-fade-in pb-12 font-sans">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            My Services
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-2 max-w-2xl">
            Create categories for your services. Click a category to manage its specific listings.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => {
              setEditingServiceId(null);
              setServiceName('');
              setImageUrl('');
              setDescription('');
              setShowServiceModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8b6508] hover:bg-[#6c4e06] text-white font-bold tracking-wide transition-all shadow-md active:scale-95"
          >
            <Plus size={18} /> Add Category
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {merchantServices.map(srv => (
            <div 
              key={srv.id} 
              onClick={() => openCategoryPage(srv)}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden flex flex-col cursor-pointer"
            >
              
              {/* Image Section */}
              <div className="h-48 w-full bg-slate-100 relative">
                <img 
                  src={srv.imageUrl || getFallbackImage(srv.name)} 
                  alt={srv.name} 
                  className="h-full w-full object-cover" 
                  onError={(e) => { e.currentTarget.src = getFallbackImage(srv.name); }}
                />
                
                <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => openEditService(e, srv)} className="h-8 w-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-slate-700 shadow-sm transition-colors">
                    <Edit size={14} />
                  </button>
                  <button onClick={(e) => handleDeleteService(e, srv.id)} className="h-8 w-8 bg-white/90 hover:bg-red-50 hover:text-red-600 rounded-full flex items-center justify-center text-slate-700 shadow-sm transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
                    {srv.name}
                  </h3>
                </div>
                {srv.description && (
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {srv.description}
                  </p>
                )}
                
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Package size={14} className="text-[#8b6508]" />
                    <span className="text-xs font-bold">{srv.listings?.length || 0} Listings</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {merchantServices.length === 0 && (
            <div className="col-span-full py-20 px-6 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 bg-slate-200 rounded-2xl flex items-center justify-center mb-4 text-slate-400 rotate-3">
                <Package size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Categories Yet</h3>
              <p className="text-slate-500 max-w-md text-sm mb-6">
                Start by creating a category. Once created, you can add individual listings to it.
              </p>
              <button 
                onClick={() => setShowServiceModal(true)}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors"
              >
                Create First Category
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category Modal (Create/Edit) */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-900">
                {editingServiceId ? 'Edit Category' : 'Create Category'}
              </h2>
              <button 
                onClick={() => setShowServiceModal(false)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <form id="categoryForm" onSubmit={handleSaveService} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Category Name</label>
                  <input
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder="e.g. Deluxe Room, Consultation"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8b6508] focus:ring-2 focus:ring-[#8b6508]/20 transition-all font-medium"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Category Image</label>
                  <div 
                    onClick={() => document.getElementById('cat-image-upload')?.click()}
                    className="w-full h-32 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#8b6508] bg-slate-50 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden group"
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
                    id="cat-image-upload"
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
                  />
                  <div className="mt-3">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Or enter Image URL</label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8b6508] focus:ring-2 focus:ring-[#8b6508]/20 transition-all font-medium text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short description of this category..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8b6508] focus:ring-2 focus:ring-[#8b6508]/20 transition-all font-medium min-h-[100px]"
                  />
                </div>
  
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button 
                type="button"
                onClick={() => setShowServiceModal(false)}
                className="px-5 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="categoryForm"
                className="px-6 py-2.5 rounded-xl bg-[#8b6508] hover:bg-[#6c4e06] text-white font-bold transition-colors shadow-lg shadow-[#8b6508]/20"
              >
                Save Category
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
