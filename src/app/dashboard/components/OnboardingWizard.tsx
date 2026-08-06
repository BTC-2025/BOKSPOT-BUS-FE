'use client';

import React, { useState } from 'react';
import { useVendorStore } from '@/lib/store';
import { Users, CalendarDays, Contact, Map as MapIcon, ArrowRight, Save, Layers, Stethoscope, Bed, Scissors, Wrench, Activity } from 'lucide-react';

const ARCHETYPES = [
  { id: 'Healthcare', name: 'Healthcare & Medical', desc: 'Hospital wards, ICUs, clinics, and patient beds', icon: Stethoscope },
  { id: 'Accommodation', name: 'Hotels & Lodging', desc: 'Hotel rooms, check-ins, and guest stays', icon: Bed },
  { id: 'Beauty', name: 'Salon & Spa', desc: 'Chairs, therapies, and beauty appointments', icon: Scissors },
  { id: 'ResourceBooking', name: 'Sports & Turf', desc: 'Pitches, courts, and time-slot allocations', icon: Activity },
  { id: 'Service', name: 'General Service', desc: 'Field ops, mechanic shops, or generic scheduling', icon: Wrench },
];

export default function OnboardingWizard() {
  const { currentMerchant, completeOnboarding } = useVendorStore();
  const [step, setStep] = useState(1);
  
  // Step 1: Business Profile
  const [merchantName, setMerchantName] = useState(currentMerchant?.merchantName || '');
  
  // Step 2: Architecture
  const [archetype, setArchetype] = useState(currentMerchant?.archetype || 'Service');

  // Step 3: Modules
  const [activeModules, setActiveModules] = useState<string[]>(['bookings', 'staff', 'customers', 'map']);
  
  // Step 4: Custom Dictionary
  const [customDictionary, setCustomDictionary] = useState<Record<string, string>>({
    bookingTitle: 'Bookings',
    staffTitle: 'Staff',
    customerDirLabel: 'Customers',
    managementLabel: 'Field Map',
    servicesDesc: 'Manage your services and schedules',
  });

  if (!currentMerchant) return null;

  const handleToggleModule = (module: string) => {
    setActiveModules((prev) =>
      prev.includes(module) ? prev.filter((m) => m !== module) : [...prev, module]
    );
  };

  const handleDictChange = (key: string, value: string) => {
    setCustomDictionary((prev) => ({ ...prev, [key]: value }));
  };

  const handleComplete = () => {
    completeOnboarding(currentMerchant.id, { merchantName, archetype, activeModules, customDictionary });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex items-center justify-center overflow-y-auto">
      <div className="max-w-2xl w-full mx-auto p-6 md:p-8 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 my-10">
        
        <div className="mb-8 text-center">
          <div className="h-16 w-16 bg-[#8b6508] rounded-2xl mx-auto flex items-center justify-center mb-4">
            <Layers className="text-white h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome to BOKSPOT</h1>
          <p className="text-slate-500 mt-2">Let's configure your workspace.</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={'h-2 w-12 rounded-full ' + (step >= s ? 'bg-[#8b6508]' : 'bg-slate-200')}></div>
          ))}
        </div>

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Business Profile</h2>
            <p className="text-sm text-slate-500 mb-6">What is the name of your organization?</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Business Name</label>
                <input 
                  type="text" 
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#8b6508]/30 focus:border-[#8b6508] transition-all bg-slate-50 focus:bg-white"
                  placeholder="e.g. Acme Corporation"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => setStep(2)}
                disabled={!merchantName}
                className="bg-slate-200 hover:bg-slate-300 disabled:opacity-50 text-slate-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Layout Architecture</h2>
            <p className="text-sm text-slate-500 mb-6">Select the base template that closely matches your industry layout.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ARCHETYPES.map((arch) => (
                <div 
                  key={arch.id}
                  onClick={() => setArchetype(arch.id as any)}
                  className={'p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ' + (archetype === arch.id ? 'border-[#8b6508] bg-yellow-50/30' : 'border-slate-200 hover:border-slate-300')}
                >
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
                      <arch.icon className="h-5 w-5 text-slate-700" />
                    </div>
                    <div className={'h-5 w-5 rounded-full border flex items-center justify-center ' + (archetype === arch.id ? 'bg-[#8b6508] border-[#8b6508]' : 'border-slate-300')}>
                      {archetype === arch.id && <div className="h-2 w-2 bg-white rounded-full"></div>}
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 mt-4">{arch.name}</h3>
                  <p className="text-sm text-slate-500 mt-1 leading-snug">{arch.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(1)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold transition-all">Back</button>
              <button onClick={() => setStep(3)} className="bg-slate-200 hover:bg-slate-300 text-slate-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Select your modules</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div 
                onClick={() => handleToggleModule('bookings')}
                className={'p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ' + (activeModules.includes('bookings') ? 'border-[#8b6508] bg-yellow-50/30' : 'border-slate-200 hover:border-slate-300')}
              >
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <CalendarDays className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className={'h-5 w-5 rounded-full border flex items-center justify-center ' + (activeModules.includes('bookings') ? 'bg-[#8b6508] border-[#8b6508]' : 'border-slate-300')}>
                    {activeModules.includes('bookings') && <div className="h-2 w-2 bg-white rounded-full"></div>}
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 mt-4">Orders & Bookings</h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">Manage appointments, work orders, and reservations.</p>
              </div>

              <div 
                onClick={() => handleToggleModule('staff')}
                className={'p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ' + (activeModules.includes('staff') ? 'border-[#8b6508] bg-yellow-50/30' : 'border-slate-200 hover:border-slate-300')}
              >
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className={'h-5 w-5 rounded-full border flex items-center justify-center ' + (activeModules.includes('staff') ? 'bg-[#8b6508] border-[#8b6508]' : 'border-slate-300')}>
                    {activeModules.includes('staff') && <div className="h-2 w-2 bg-white rounded-full"></div>}
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 mt-4">Workforce & Staff</h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">Manage employees, agents, doctors, or technicians.</p>
              </div>

              <div 
                onClick={() => handleToggleModule('customers')}
                className={'p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ' + (activeModules.includes('customers') ? 'border-[#8b6508] bg-yellow-50/30' : 'border-slate-200 hover:border-slate-300')}
              >
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Contact className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className={'h-5 w-5 rounded-full border flex items-center justify-center ' + (activeModules.includes('customers') ? 'bg-[#8b6508] border-[#8b6508]' : 'border-slate-300')}>
                    {activeModules.includes('customers') && <div className="h-2 w-2 bg-white rounded-full"></div>}
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 mt-4">Customer Directory</h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">Maintain client databases and patient records.</p>
              </div>

              <div 
                onClick={() => handleToggleModule('map')}
                className={'p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ' + (activeModules.includes('map') ? 'border-[#8b6508] bg-yellow-50/30' : 'border-slate-200 hover:border-slate-300')}
              >
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 bg-rose-100 rounded-lg flex items-center justify-center">
                    <MapIcon className="h-5 w-5 text-rose-600" />
                  </div>
                  <div className={'h-5 w-5 rounded-full border flex items-center justify-center ' + (activeModules.includes('map') ? 'bg-[#8b6508] border-[#8b6508]' : 'border-slate-300')}>
                    {activeModules.includes('map') && <div className="h-2 w-2 bg-white rounded-full"></div>}
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 mt-4">Live Field Map</h3>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">Real-time resource tracking and bed/asset occupancy.</p>
              </div>

            </div>
            
            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(2)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold transition-all">Back</button>
              <button 
                onClick={() => setStep(4)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
              >
                Continue Setup <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Custom Terminology</h2>
            <p className="text-sm text-slate-500 mb-6">What do you call these in your business? We will rename them across the entire dashboard.</p>
            
            <div className="space-y-5">
              {activeModules.includes('bookings') && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Bookings / Orders</label>
                  <input 
                    type="text" 
                    value={customDictionary.bookingTitle || ''}
                    onChange={(e) => handleDictChange('bookingTitle', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#8b6508]/30 focus:border-[#8b6508] transition-all bg-slate-50 focus:bg-white"
                    placeholder="e.g. Appointments, Work Orders"
                  />
                </div>
              )}
              
              {activeModules.includes('staff') && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Workforce / Staff</label>
                  <input 
                    type="text" 
                    value={customDictionary.staffTitle || ''}
                    onChange={(e) => handleDictChange('staffTitle', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#8b6508]/30 focus:border-[#8b6508] transition-all bg-slate-50 focus:bg-white"
                    placeholder="e.g. Agents, Trainers, Doctors"
                  />
                </div>
              )}

              {activeModules.includes('customers') && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Customer Directory</label>
                  <input 
                    type="text" 
                    value={customDictionary.customerDirLabel || ''}
                    onChange={(e) => handleDictChange('customerDirLabel', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#8b6508]/30 focus:border-[#8b6508] transition-all bg-slate-50 focus:bg-white"
                    placeholder="e.g. Patients, Clients"
                  />
                </div>
              )}

              {activeModules.includes('map') && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Live Map Module</label>
                  <input 
                    type="text" 
                    value={customDictionary.managementLabel || ''}
                    onChange={(e) => handleDictChange('managementLabel', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#8b6508]/30 focus:border-[#8b6508] transition-all bg-slate-50 focus:bg-white"
                    placeholder="e.g. ER Layout, Field Map, Tables"
                  />
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-between">
              <button 
                onClick={() => setStep(3)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold transition-all"
              >
                Back
              </button>
              <button 
                onClick={handleComplete}
                className="bg-[#8b6508] hover:bg-[#7a5907] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl shadow-[#8b6508]/20"
              >
                Launch Dashboard <Save className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
