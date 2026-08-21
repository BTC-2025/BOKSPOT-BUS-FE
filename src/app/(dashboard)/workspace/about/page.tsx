'use client';

import { useState, useEffect } from 'react';
import { useVendorStore } from '@/lib/store';
import { Building2, Info, CheckSquare, Image as ImageIcon, Plus, X, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VenueProfilePage() {
  const router = useRouter();
  const { currentMerchant, updateMerchantProfile } = useVendorStore();
  const [mounted, setMounted] = useState(false);

  // Form State
  const [aboutText, setAboutText] = useState('');
  const [thingsToKnow, setThingsToKnow] = useState<string[]>([]);
  const [newThing, setNewThing] = useState('');
  
  const [gallery, setGallery] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    setMounted(true);
    if (currentMerchant) {
      // Fetch the real data from the backend to avoid stale localStorage data
      const fetchProfile = async () => {
        try {
          const isProd = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || (isProd ? 'https://bokspot-be.onrender.com/api/v1' : '/api/v1');
          
          const res = await fetch(`${baseUrl}/merchants/${currentMerchant.id}`);
          if (res.ok) {
            const data = await res.json();
            setAboutText(data.description || '');
            setThingsToKnow(data.amenities || []);
            setGallery(data.images || []);
          } else {
            // Fallback to local state if backend fetch fails
            setAboutText(currentMerchant.aboutText || '');
            setThingsToKnow(currentMerchant.thingsToKnow || []);
            setGallery(currentMerchant.gallery || []);
          }
        } catch (err) {
          console.error('Failed to fetch merchant profile', err);
        }
      };
      fetchProfile();
    }
  }, [currentMerchant?.id]);

  if (!mounted || !currentMerchant) return null;

  const handleAddThing = () => {
    if (newThing.trim() && !thingsToKnow.includes(newThing.trim())) {
      setThingsToKnow([...thingsToKnow, newThing.trim()]);
      setNewThing('');
    }
  };

  const handleRemoveThing = (item: string) => {
    setThingsToKnow(thingsToKnow.filter(t => t !== item));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
          setGallery(prev => [...prev, compressedBase64]);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    updateMerchantProfile(currentMerchant.id, {
      aboutText,
      thingsToKnow,
      gallery
    });
    alert('Venue Profile saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24 animate-fade-in">
      <div className="py-6">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <Building2 className="text-[#8b6508]" size={32} />
          Venue Profile
        </h1>
        <p className="text-slate-500 font-medium mt-2">
          Manage the global details for {currentMerchant.merchantName}. This information will be displayed at the top of your public page.
        </p>
      </div>

      <div className="space-y-6">
        {/* About Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Info className="text-blue-500" /> About Us
          </h2>
          <textarea
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
            placeholder="Welcome to our facility. We provide..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8b6508] focus:ring-2 focus:ring-[#8b6508]/20 transition-all font-medium bg-slate-50 focus:bg-white min-h-[120px]"
          />
        </div>

        {/* Things To Know */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
            <CheckSquare className="text-green-500" /> Things to Know (Amenities & Rules)
          </h2>
          <p className="text-sm text-slate-500 mb-4">Add global amenities like Parking, Washrooms, Drinking Water, etc.</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {thingsToKnow.map((thing, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-bold border border-green-200">
                {thing}
                <button onClick={() => handleRemoveThing(thing)} className="hover:text-red-500 ml-1">
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newThing}
              onChange={(e) => setNewThing(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddThing()}
              placeholder="e.g. Free Parking"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-green-500 transition-colors font-medium"
            />
            <button onClick={handleAddThing} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl font-bold transition-colors">
              Add
            </button>
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
            <ImageIcon className="text-purple-500" /> Venue Gallery
          </h2>
          <p className="text-sm text-slate-500 mb-4">Add high-quality images of your entire venue to showcase it to users.</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
            {gallery.map((url, idx) => (
              <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 group">
                <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                <button 
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 items-center">
            <input
              type="file"
              accept="image/*"
              id="gallery-upload"
              onChange={handleFileChange}
              className="hidden"
            />
            <label 
              htmlFor="gallery-upload" 
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Plus size={18} /> Select Local Image
            </label>
            <span className="text-xs text-slate-400">or upload multiple images</span>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-3.5 bg-[#8b6508] text-white rounded-xl font-bold hover:bg-[#6c4e06] shadow-lg shadow-[#8b6508]/20 transition-all"
          >
            <Save size={20} /> Save Venue Profile
          </button>
        </div>
      </div>
    </div>
  );
}
