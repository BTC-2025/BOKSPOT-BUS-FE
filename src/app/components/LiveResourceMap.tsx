'use client';

import { useVendorStore } from '../../lib/store';
import { useState, useEffect } from 'react';
import { getConfig } from '../../lib/businessConfig';

export default function LiveResourceMap() {
  const { currentMerchant } = useVendorStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!currentMerchant || !mounted) return null;

  const config = getConfig(currentMerchant.category);
  
  const resourceLabel = 'Unit';
  const seats = Array.from({ length: 24 }).map((_, i) => ({
    id: `${resourceLabel} ${i + 1}`,
    status: Math.random() > 0.5 ? 'Available' : 'Occupied',
  }));

  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-black text-slate-900">{config.words.dashboardMap}</h2>
          <p className="text-xs font-semibold text-slate-500">Interactive live occupancy view.</p>
        </div>
      </div>

      <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-8 flex items-center justify-center">
        <div className="grid grid-cols-6 md:grid-cols-8 gap-3">
          {seats.map((seat) => (
            <div 
              key={seat.id}
              title={seat.status}
              className={`h-12 w-12 rounded-lg border flex flex-col items-center justify-center cursor-pointer transition-colors ${
                seat.status === 'Available' ? 'bg-white border-emerald-200 text-emerald-600 hover:bg-emerald-50' : 'bg-slate-200 border-slate-300 text-slate-400 hover:bg-slate-300'
              }`}
            >
              <span className="text-[10px] font-bold">{seat.id.replace(resourceLabel + ' ', '')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
