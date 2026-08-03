'use client';

import { useVendorStore } from '../../../lib/store';
import { getConfig } from '../../../lib/businessConfig';
import { 
  Building2, Mail, Phone, Globe, MapPin, Save, Info, User,
  CheckCircle2, Clock, Camera, Settings, ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const { currentMerchant, loginRole, supervisorId } = useVendorStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getBnxMailId = () => {
    if (!currentMerchant) return '';
    const originalEmail = currentMerchant.email || '';
    if (loginRole === 'supervisor') {
      const supName = supervisorId || 'SUPERVISOR';
      return `${supName}/${originalEmail}`;
    }
    return originalEmail;
  };

  const [name, setName] = useState(currentMerchant?.merchantName || '');
  const [email, setEmail] = useState(getBnxMailId() || '');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [website, setWebsite] = useState('www.beta-booking.com');
  const [address, setAddress] = useState('42 Anna Nagar, Chennai');
  const [about, setAbout] = useState(currentMerchant?.aboutText || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!currentMerchant || !mounted) {
    return (
      <div className="flex h-full min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="h-16 w-16 rounded-full border-4 border-[#8b6508] border-t-transparent animate-spin" />
          <p className="text-[#8b6508] font-bold tracking-widest uppercase text-xs">Initializing Secure Network...</p>
        </div>
      </div>
    );
  }

  const config = getConfig(currentMerchant.category);

  return (
    <div className="space-y-8 animate-fade-in pb-12 font-sans">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white border border-slate-200 p-8 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-[40%] h-full bg-gradient-to-l from-[#fdfcf8] to-transparent pointer-events-none" />
        <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <Settings size={200} />
        </div>
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
            {config.words.settingsTitle}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-500">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100"><Building2 size={14} className="text-blue-600" /> Business Profile</span>
            <span>•</span>
            <span className="text-slate-700">{currentMerchant.merchantName}</span>
          </div>
        </div>

        <div className="relative z-10 flex gap-3">
          <button 
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-[#8b6508] hover:bg-[#6c4e06] text-white shadow-lg shadow-[#8b6508]/20 font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            {isSaved ? <CheckCircle2 size={16} /> : <Save size={16} />} 
            {isSaved ? 'Saved successfully' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Main Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <Building2 size={18} className="text-[#8b6508]" /> Core Business Details
            </h2>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Business Name</label>
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-[#8b6508] focus-within:ring-1 focus-within:ring-[#8b6508] transition-all">
                  <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                  <input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm text-slate-900 font-bold" 
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Company Email</label>
                    <span className="text-[8px] bg-blue-50 text-blue-600 font-black px-2 py-0.5 rounded uppercase tracking-wider">BNX Integrated</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-[#8b6508] focus-within:ring-1 focus-within:ring-[#8b6508] transition-all">
                    <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                    <input 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm text-slate-900 font-bold" 
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Telephone / Support Line</label>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-[#8b6508] focus-within:ring-1 focus-within:ring-[#8b6508] transition-all">
                    <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                    <input 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm text-slate-900 font-bold" 
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Website URL</label>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-[#8b6508] focus-within:ring-1 focus-within:ring-[#8b6508] transition-all">
                    <Globe className="h-4 w-4 text-slate-400 shrink-0" />
                    <input 
                      value={website} 
                      onChange={(e) => setWebsite(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm text-slate-900 font-bold" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Address Coordinates</label>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-[#8b6508] focus-within:ring-1 focus-within:ring-[#8b6508] transition-all">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                    <input 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-sm text-slate-900 font-bold" 
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">About Description</label>
                <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-[#8b6508] focus-within:ring-1 focus-within:ring-[#8b6508] transition-all">
                  <Info className="h-4 w-4 text-slate-400 shrink-0 mt-1" />
                  <textarea 
                    rows={4}
                    value={about} 
                    onChange={(e) => setAbout(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm text-slate-900 font-bold resize-none leading-relaxed" 
                    required
                  />
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-sm font-black text-slate-900 mb-4">Operations & Preferences</h3>
                
                <div className="space-y-4">
                  {config.themeClass === 'theme-hotel' && (
                    <>
                      <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-all">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#8b6508]" />
                        <span className="text-sm font-bold text-slate-700">Enable Auto-Checkout at 11:00 AM</span>
                      </label>
                      <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-all">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#8b6508]" />
                        <span className="text-sm font-bold text-slate-700">Notify Housekeeping upon checkout</span>
                      </label>
                    </>
                  )}
                  {config.themeClass === 'theme-turf' && (
                    <>
                      <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-all">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#22c55e]" />
                        <span className="text-sm font-bold text-slate-700">Enable Automated Floodlights Integration</span>
                      </label>
                      <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-all">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#22c55e]" />
                        <span className="text-sm font-bold text-slate-700">Allow Rain Bookings (Non-Refundable)</span>
                      </label>
                    </>
                  )}
                  {config.themeClass === 'theme-medical' && (
                    <>
                      <label className="flex items-center gap-3 p-4 rounded-xl border border-red-200 bg-red-50 cursor-pointer hover:bg-red-100 transition-all">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-red-600" />
                        <span className="text-sm font-bold text-red-900">Require CMO Authorization for ER transfers</span>
                      </label>
                      <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-all">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600" />
                        <span className="text-sm font-bold text-slate-700">Enable Patient Portal Sync</span>
                      </label>
                    </>
                  )}
                  {config.themeClass !== 'theme-turf' && config.themeClass !== 'theme-medical' && config.themeClass !== 'theme-hotel' && (
                    <>
                      <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-all">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#8b6508]" />
                        <span className="text-sm font-bold text-slate-700">Enable Auto-Confirmation for {config.words.bookings}</span>
                      </label>
                      <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-all">
                        <input type="checkbox" className="w-4 h-4 accent-[#8b6508]" />
                        <span className="text-sm font-bold text-slate-700">Send SMS Reminders 2 Hours Before</span>
                      </label>
                    </>
                  )}
                </div>
              </div>

            </form>
          </div>
        </div>

        {/* Right: Sidebar Meta */}
        <div className="space-y-8">
          
          {/* Logo Upload Box */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <Camera size={18} className="text-[#8b6508]" /> Brand Logo
            </h2>
            <div className="aspect-square w-full max-w-[200px] mx-auto rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-slate-100 hover:border-[#8b6508] transition-all">
              <div className="h-20 w-20 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm mb-4">
                <span className="text-3xl font-black text-[#8b6508]">{currentMerchant.logoLetter}</span>
              </div>
              <p className="text-xs font-bold text-slate-500">Click to upload new logo</p>
              <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 2MB</p>
            </div>
          </div>

          {/* Supervisor details */}
          {(loginRole === 'supervisor' || currentMerchant.assignSupervisor) && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <User size={18} className="text-[#8b6508]" /> Supervisor Access
              </h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Supervisor Name</span>
                  <span className="text-sm text-slate-900 font-black block">{currentMerchant.supervisorName || supervisorId || 'Supervisor Agent'}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Contact Details</span>
                  <span className="text-sm text-slate-900 font-black block">{currentMerchant.supervisorPhone || '+91 98765 43210'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Business Hours */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
              <Clock size={18} className="text-[#8b6508]" /> Operating Hours
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold text-slate-600">Mon - Fri</span>
                <span className="text-xs font-black text-slate-900">{config.themeClass === 'theme-medical' ? '24 Hours Open' : '09:00 AM - 08:00 PM'}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold text-slate-600">Saturday</span>
                <span className="text-xs font-black text-slate-900">10:00 AM - 05:00 PM</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-red-50 border border-red-100">
                <span className="text-xs font-bold text-red-600">Sunday</span>
                <span className="text-xs font-black text-red-700">{config.themeClass === 'theme-medical' ? 'Emergency Only' : 'Closed'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
