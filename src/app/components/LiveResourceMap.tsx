'use client';

import { useVendorStore } from '../../lib/store';
import { Activity, Users, Info } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LiveResourceMap() {
  const { currentMerchant } = useVendorStore();
  const [hoveredResource, setHoveredResource] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!currentMerchant || !mounted) return null;

  const isTurf = currentMerchant.archetype === 'ResourceBooking';
  const isHospital = currentMerchant.archetype === 'Healthcare';
  const isHotel = currentMerchant.archetype === 'Accommodation';

  // --- TURF (STADIUM) MAP LAYOUT ---
  if (isTurf) {
    const pitches = [
      { id: 'Pitch A', type: '5A-Side', status: 'Available', color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-600', icon: '🟢', details: 'Ready for booking' },
      { id: 'Pitch B', type: '5A-Side', status: 'Booked', color: 'bg-red-500/20 border-red-500/40 text-red-600', icon: '🔴', details: 'Ongoing Match - Team X vs Team Y (Ends in 20m)' },
      { id: 'Pitch C', type: '7A-Side', status: 'Maintenance', color: 'bg-amber-500/20 border-amber-500/40 text-amber-600', icon: '🟡', details: 'Net repair in progress' }
    ];

    return (
      <div className="bg-[#0a0a0a] rounded-3xl p-8 border border-[#22c55e]/20 shadow-sm relative text-white">
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <h2 className="text-lg font-black flex items-center gap-2">
              <Users size={18} className="text-[#22c55e]" /> Live Pitch Map
            </h2>
            <p className="text-xs font-semibold text-gray-400">Real-time stadium occupancy view.</p>
          </div>
          <div className="flex gap-4 text-[10px] font-bold text-gray-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Booked</span>
          </div>
        </div>

        <div className="relative w-full h-64 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl p-4 flex gap-4 overflow-visible items-center justify-center">
          {pitches.map((pitch) => (
            <div 
              key={pitch.id}
              onMouseEnter={() => setHoveredResource(pitch.id)}
              onMouseLeave={() => setHoveredResource(null)}
              className={`relative flex flex-col items-center justify-center w-32 h-48 border-2 rounded-xl transition-all cursor-pointer ${pitch.color} ${hoveredResource === pitch.id ? 'scale-105 shadow-lg' : ''}`}
            >
              <div className="absolute inset-2 border border-current/20 rounded-lg pointer-events-none" />
              <div className="absolute inset-y-1/2 w-full border-t border-current/20 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-current/20 pointer-events-none" />
              
              <span className="text-xl mb-2">{pitch.icon}</span>
              <span className="font-black text-sm">{pitch.id}</span>
              <span className="text-[10px] font-bold opacity-70">{pitch.type}</span>

              {/* Tooltip */}
              {hoveredResource === pitch.id && (
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-56 bg-[#1a1a1a] text-white border border-[#22c55e]/30 text-xs p-3 rounded-xl shadow-2xl shadow-[#22c55e]/10 z-[100] pointer-events-none animate-fade-in text-center">
                  <div className="font-bold text-[#22c55e] mb-1 text-sm">{pitch.status}</div>
                  <div className="text-gray-300 text-[11px] leading-relaxed">{pitch.details}</div>
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1a1a1a] border-b border-r border-[#22c55e]/30 rotate-45" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- HOSPITAL (CLINIC) MAP LAYOUT ---
  if (isHospital) {
    const beds = [
      { id: 'Bed 01', type: 'ICU', status: 'Occupied', color: 'bg-red-50 border-red-200 text-red-600', icon: '🔴', details: 'Patient: Ram Kumar | Vitals: Stable' },
      { id: 'Bed 02', type: 'ICU', status: 'Available', color: 'bg-emerald-50 border-emerald-200 text-emerald-600', icon: '🟢', details: 'Sanitized & Ready' },
      { id: 'Bed 03', type: 'ICU', status: 'Occupied', color: 'bg-red-50 border-red-200 text-red-600', icon: '🔴', details: 'Patient: Priya | Vitals: Critical' },
      { id: 'Bed 04', type: 'General', status: 'Available', color: 'bg-emerald-50 border-emerald-200 text-emerald-600', icon: '🟢', details: 'Sanitized & Ready' },
      { id: 'Bed 05', type: 'General', status: 'Cleaning', color: 'bg-amber-50 border-amber-200 text-amber-600', icon: '🟡', details: 'Housekeeping in progress' },
    ];

    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative">
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Activity size={18} className="text-[#0ea5e9]" /> Live Ward Map
            </h2>
            <p className="text-xs font-semibold text-slate-500">Real-time floor plan and bed occupancy.</p>
          </div>
          <div className="flex gap-4 text-[10px] font-bold text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Occupied</span>
          </div>
        </div>

        <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {beds.map((bed) => (
              <div 
                key={bed.id}
                onMouseEnter={() => setHoveredResource(bed.id)}
                onMouseLeave={() => setHoveredResource(null)}
                className={`relative flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${bed.color} ${hoveredResource === bed.id ? 'scale-105 shadow-md z-10' : ''}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="font-black text-sm">{bed.id}</span>
                  <span className="text-xs">{bed.icon}</span>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase opacity-80">{bed.type}</span>
                  <Info size={14} className="opacity-50" />
                </div>

                {/* Tooltip */}
                {hoveredResource === bed.id && (
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-56 bg-white text-slate-800 border border-slate-200 text-xs p-3 rounded-xl shadow-xl z-[100] pointer-events-none animate-fade-in text-center">
                    <div className={`font-bold mb-1 text-sm ${bed.status === 'Occupied' ? 'text-red-500' : 'text-emerald-500'}`}>{bed.status}</div>
                    <div className="text-slate-500 text-[11px] leading-relaxed">{bed.details}</div>
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-slate-200 rotate-45" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- GENERIC MAP LAYOUT (Bus/Cinema/Restaurant) ---
  const seats = Array.from({ length: 24 }).map((_, i) => ({
    id: `Seat ${i + 1}`,
    status: Math.random() > 0.5 ? 'Available' : 'Booked',
  }));

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-black text-slate-900">Live Resource Layout</h2>
          <p className="text-xs font-semibold text-slate-500">Interactive floor plan mapping.</p>
        </div>
      </div>

      <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-8 flex items-center justify-center">
        <div className="grid grid-cols-6 gap-3">
          {seats.map((seat) => (
            <div 
              key={seat.id}
              title={seat.status}
              className={`h-12 w-12 rounded-lg border flex items-center justify-center text-[10px] font-bold cursor-pointer transition-colors ${
                seat.status === 'Available' ? 'bg-white border-emerald-200 text-emerald-600 hover:bg-emerald-50' : 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed'
              }`}
            >
              {seat.id.replace('Seat ', '')}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
