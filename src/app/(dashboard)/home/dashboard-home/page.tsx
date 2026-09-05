'use client';

import { useVendorStore } from '@/lib/store';
import { getArchetypeConfig } from '@/lib/businessDictionary';
import {
  Users, User, Activity, CheckCircle2, ChevronRight, Phone,
  Stethoscope, FileText, IndianRupee, Clock,
  ArrowUpRight, TrendingUp, Calendar, MapPin, ChevronLeft
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LiveResourceMap from '@/app/components/LiveResourceMap';

const DEFAULT_CAROUSEL_IMAGES = {
  ResourceBooking: [
    'https://images.unsplash.com/photo-1574629810360-7efbb49fec90?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518605368461-1ee7c515a4c9?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1536122985607-4fea00b8d5a8?q=80&w=1200&auto=format&fit=crop'
  ],
  HealthcareBooking: [
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1200&auto=format&fit=crop'
  ],
  ServiceBooking: [
    'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop'
  ]
};

export default function DashboardPage() {
  const router = useRouter();
  const { currentMerchant, staffAccounts, bookings, loginRole, currentStaff, checkInBooking, completeBooking } = useVendorStore();
  const baseConfig = getArchetypeConfig(currentMerchant?.archetype || 'Service');
  const archetypeConfig = { ...baseConfig, ...(currentMerchant?.customDictionary || {}) };
  const activeModules = currentMerchant?.activeModules || ['bookings', 'staff', 'customers', 'map'];
  const showMap = !currentMerchant?.isCustomized || activeModules.includes('map');

  const [mounted, setMounted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('This Week');
  const [liveBookings, setLiveBookings] = useState<any[]>([]);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  // ── Live Bookings Poller ────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        const res = await fetch(`/api/v1/bookings/sync?t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) return;
        const all: any = await res.json();
        const dataArr = all?.data || all;
        if (!cancelled) setLiveBookings(Array.isArray(dataArr) ? dataArr : []);
      } catch {}
    };
    poll();
    const id = setInterval(poll, 3000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  useEffect(() => { setMounted(true); }, []);

  // Carousel Auto-slide
  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % 3), 5000);
    return () => clearInterval(timer);
  }, []);

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

  let merchantBookings = bookings.filter(
    b => b.merchantName.toLowerCase() === currentMerchant.merchantName.toLowerCase()
  );
  const staffList = staffAccounts.filter(s => s.merchantId === currentMerchant.id);
  const isStaffView = loginRole === 'staff';

  if (isStaffView && currentStaff) {
    merchantBookings = merchantBookings.filter(b =>
      b.assignedDoctorId === currentStaff.id || b.refereeAssigned === currentStaff.name
    );
  }

  // Merge live bookings (from backend) with local bookings for this merchant
  const liveForMerchant = (Array.isArray(liveBookings) ? liveBookings : []).filter(b =>
    (b.merchantId === currentMerchant.id || b.merchantName?.toLowerCase() === currentMerchant.merchantName?.toLowerCase()) &&
    (b.status === 'PENDING' || b.status === 'CONFIRMED' || b.status === 'CHECKED_IN' || b.status === 'CANCELLED')
  );
  const localActive = merchantBookings.filter(b =>
    (b.status === 'PENDING' || b.status === 'CONFIRMED' || b.status === 'CHECKED_IN' || b.status === 'CANCELLED') &&
    !liveForMerchant.find((lb: any) => lb.ref === b.ref)
  );
  const activeBookings = [...liveForMerchant, ...localActive];

  const completedBookings = merchantBookings.filter(b => b.status === 'COMPLETED');
  const totalRevenue = merchantBookings.reduce((sum, b) => b.status === 'COMPLETED' ? sum + b.amount : sum, 0);

  const occupancy = 78;
  const metric3 = 42;
  const weeklyData = [45, 52, 38, 65, 80, 42, 60];
  const maxWeekly = Math.max(...weeklyData);
  const carouselImages = DEFAULT_CAROUSEL_IMAGES[currentMerchant.archetype as keyof typeof DEFAULT_CAROUSEL_IMAGES] || DEFAULT_CAROUSEL_IMAGES.ServiceBooking;

  const handleAccept = async (booking: any) => {
    setAcceptingId(booking.id);
    try {
      await fetch('/api/v1/bookings/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...booking, status: 'CONFIRMED' }),
      });
      setLiveBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: 'CONFIRMED' } : b));
    } catch {}
    setAcceptingId(null);
  };

  // ── STAFF VIEW ──────────────────────────────────────────────────────────────
  if (isStaffView) {
    return (
      <div className="space-y-8 animate-fade-in pb-12 font-sans max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-[30%] bg-gradient-to-l from-blue-50 to-transparent pointer-events-none" />
          <div className="flex items-center gap-6 relative z-10">
            <div className="h-24 w-24 rounded-3xl bg-blue-600 p-1 shadow-lg shadow-blue-600/30">
              <div className="h-full w-full rounded-2xl bg-white flex items-center justify-center font-black text-4xl text-blue-600 uppercase border-2 border-transparent">
                {currentStaff?.name.charAt(0)}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{`${archetypeConfig.staffPrefix || ''} ${currentStaff?.name || ''}`}</h1>
              <p className="text-sm text-blue-600 font-bold uppercase tracking-widest mt-1">{currentStaff?.roleTitle}</p>
              <div className="flex items-center gap-3 mt-3 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 size={14} /> Active Shift</span>
              </div>
            </div>
          </div>
          <div className="relative z-10 flex gap-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center min-w-[120px]">
              <h3 className="text-3xl font-black text-slate-900">{activeBookings.length}</h3>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Pending</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 text-center min-w-[120px]">
              <h3 className="text-3xl font-black text-blue-700">{completedBookings.length}</h3>
              <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-1">Completed</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Clock size={18} className="text-blue-600" /> {archetypeConfig.bookingHeaderTitle || 'Tasks Today'}
            </h2>
          </div>
          <div className="space-y-4">
            {activeBookings.map((booking, index) => (
              <div key={booking.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col md:flex-row items-center gap-6 group cursor-pointer">
                <div className="flex flex-col items-center justify-center w-20 shrink-0 border-r border-slate-100 pr-6">
                  <span className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{booking.time?.split(' ')[0]}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{booking.time?.split(' ')[1]}</span>
                </div>
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-slate-900">{booking.teamName || booking.customerName}</h3>
                    {index === 0 && <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-widest animate-pulse">Up Next</span>}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1"><User size={12} /> ID: {booking.ref}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Phone size={12} /> {booking.customerPhone}</span>
                    <span>•</span>
                    <span className="text-[#8b6508] font-bold">{booking.serviceName}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {booking.status === 'CONFIRMED' && (
                    <button onClick={e => { e.stopPropagation(); checkInBooking(booking.id); }} className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold text-xs uppercase tracking-widest transition-all">Start</button>
                  )}
                  {booking.status === 'CHECKED_IN' && (
                    <button onClick={e => { e.stopPropagation(); completeBooking(booking.id); }} className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2">
                      <CheckCircle2 size={16} /> Finish
                    </button>
                  )}
                  <button className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── OWNER COMMAND CENTER VIEW ──────────────────────────────────────────────
  return (
    <div className="space-y-6 pb-12 font-sans animate-fade-in max-w-7xl mx-auto">

      {/* 1. Header */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">{currentMerchant.merchantName}</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Live System Active
          </p>
        </div>
      </div>

      {/* 2. Carousel */}
      <div className="relative w-full h-[280px] md:h-[350px] rounded-3xl overflow-hidden shadow-sm group">
        {carouselImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${img})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-transparent" />
          </div>
        ))}
        <div className="absolute bottom-0 left-0 p-8 w-full">
          <h2 className="text-3xl md:text-4xl font-black text-black mb-2 drop-shadow-sm">
            Welcome back to {archetypeConfig.dashboardTitle || 'Admin Console'}
          </h2>
          <p className="text-black/80 font-medium text-sm md:text-base max-w-xl line-clamp-2">
            Monitor your {archetypeConfig.activeStaffLabel?.toLowerCase() || 'live capacity'}, track revenue, and manage daily operations from your centralized command center.
          </p>
        </div>
        <div className="absolute bottom-6 right-8 flex gap-2">
          {carouselImages.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        <button onClick={() => setCurrentSlide(prev => (prev === 0 ? 2 : prev - 1))}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all">
          <ChevronLeft size={24} />
        </button>
        <button onClick={() => setCurrentSlide(prev => (prev + 1) % 3)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* 3. Finance KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-[#8b6508]/30 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20"><IndianRupee size={20} /></div>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full"><TrendingUp size={12} /> +12.5%</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Today's Revenue</p>
          <h3 className="text-2xl font-black text-slate-900">₹{(totalRevenue + 15400).toLocaleString()}</h3>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-[#8b6508]/30 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20"><Calendar size={20} /></div>
            <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full"><ArrowUpRight size={12} /> +4.2%</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{archetypeConfig.metric1Title || 'Total Bookings'}</p>
          <h3 className="text-2xl font-black text-slate-900">{merchantBookings.length + 84}</h3>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-[#8b6508]/30 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20"><Users size={20} /></div>
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full"><ArrowUpRight size={12} /> High</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{archetypeConfig.metric2Title || 'Active Customers'}</p>
          <h3 className="text-2xl font-black text-slate-900">{occupancy}</h3>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group hover:border-[#8b6508]/30 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20"><Activity size={20} /></div>
            <span className="flex items-center gap-1 text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full"><TrendingUp size={12} /> Peak</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{archetypeConfig.activeStaffLabel || 'Live Capacity'}</p>
          <h3 className="text-2xl font-black text-slate-900">{metric3}%</h3>
        </div>
      </div>

      {/* 4. Statistics Trend */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 px-6 sm:px-8 bg-slate-50/50">
          <div className="py-5">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-[#8b6508]" />
              {archetypeConfig.trendTitle || 'Booking Statistics & Trends'}
            </h2>
          </div>
          <div className="flex items-center gap-1 pb-4 sm:pb-0">
            {['Today', 'This Week', 'This Month'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === tab ? 'bg-[#8b6508] text-white shadow-md' : 'text-slate-500 hover:text-[#8b6508] hover:bg-[#8b6508]/10'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-4">
            {weeklyData.map((val, idx) => {
              const hp = (val / maxWeekly) * 100;
              const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
              return (
                <div key={idx} className="h-full flex flex-col items-center gap-3 flex-1 group">
                  <div className="w-full relative flex justify-center items-end h-full">
                    <div className="w-full max-w-[60px] bg-slate-100 rounded-t-xl relative group-hover:bg-[#8b6508]/20 transition-colors" style={{ height: `${hp}%` }}>
                      <div className="absolute bottom-0 w-full bg-[#8b6508] rounded-t-xl group-hover:bg-[#6c4e06] transition-all shadow-[0_0_15px_rgba(139,101,8,0.3)]" style={{ height: `${hp * 0.7}%` }} />
                    </div>
                    <div className="absolute -top-10 bg-[#8b6508] text-white shadow-xl text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {val} Bookings
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#8b6508]" />
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase text-slate-400 group-hover:text-slate-900 transition-colors">{days[idx]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Live Booking Queue with Accept button */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 sm:px-8 py-5 bg-slate-50/50">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <FileText size={18} className="text-[#8b6508]" />
            {archetypeConfig.liveQueueTitle || 'Live Booking Queue'}
            {liveForMerchant.filter(b => b.status === 'PENDING').length > 0 && (
              <span className="ml-2 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black animate-pulse">
                {liveForMerchant.filter(b => b.status === 'PENDING').length} New
              </span>
            )}
          </h2>
          <button onClick={() => router.push('/tracks/bookings')} className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
            View All <ChevronRight size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                <th className="py-4 px-6 sm:px-8 text-[11px] font-black uppercase tracking-widest text-slate-400">Customer Details</th>
                <th className="py-4 px-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Service / Ref</th>
                <th className="py-4 px-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Time & Date</th>
                <th className="py-4 px-6 text-[11px] font-black uppercase tracking-widest text-slate-400">Assigned To</th>
                <th className="py-4 px-6 sm:px-8 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Status / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {activeBookings.length > 0 ? (
                activeBookings.slice(0, 8).map(booking => {
                  const doc = staffList.find(d => d.id === booking.assignedDoctorId);
                  const isPending = booking.status === 'PENDING';
                  
                  const formatDate = (iso: string) => {
                    if (!iso) return '';
                    try {
                      return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
                    } catch { return iso; }
                  };
                  
                  const formatDateTime = (iso: string) => {
                    if (!iso) return '';
                    try {
                      return new Date(iso).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
                    } catch { return iso; }
                  };

                  return (
                    <tr key={booking.id} className={`hover:bg-slate-50/50 transition-colors group ${isPending ? 'bg-amber-50/40' : ''}`}>
                      <td className="py-4 px-6 sm:px-8">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${isPending ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                            {(booking.teamName || booking.customerName || '?').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{booking.teamName || booking.customerName || 'N/A'}</p>
                            <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                              {booking.customerPhone && <span className="block">{booking.customerPhone}</span>}
                              {booking.customerEmail && <span className="block">{booking.customerEmail}</span>}
                              <span className="block">{booking.customerAddress || '123 Test St, Chennai, 600001'}</span>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded mb-1 inline-block">
                          {currentMerchant.category || 'Cricket Ground'} - {booking.category || 'Category'}
                        </span>
                        <p className="font-bold text-slate-900 text-sm">{booking.serviceName}</p>
                        <p className="text-[11px] text-slate-500 font-medium">Ref: #{booking.ref}</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-start gap-2">
                          <Clock size={14} className="text-slate-400 mt-0.5" />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{formatDate(booking.date)}</p>
                            <p className="text-[11px] font-bold text-[color:var(--color-primary)] mt-0.5">{booking.time}</p>
                            {booking.bookedAt && (
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                Placed: {formatDateTime(booking.bookedAt)}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {doc ? (
                          <div className="flex items-center gap-2">
                            <Stethoscope size={14} className="text-[#8b6508]" />
                            <span className="text-xs font-bold text-slate-700">{archetypeConfig.staffPrefix || ''}{doc.name}</span>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-slate-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-4 px-6 sm:px-8 text-right">
                        {isPending ? (
                          <button
                            disabled={acceptingId === booking.id}
                            onClick={() => handleAccept(booking)}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
                              acceptingId === booking.id
                                ? 'bg-gray-100 text-gray-400 cursor-wait'
                                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/30 hover:scale-105 active:scale-95'
                            }`}
                          >
                            {acceptingId === booking.id ? (
                              <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Accepting...</>
                            ) : (
                              <>✓ Accept</>
                            )}
                          </button>
                        ) : booking.status === 'CANCELLED' ? (
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-red-50 text-red-700 border-red-200">
                            Cancelled
                          </span>
                        ) : (
                          <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                            booking.status === 'CHECKED_IN'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {booking.status === 'CHECKED_IN' ? 'In Progress' : 'Confirmed'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <CheckCircle2 size={32} className="text-slate-300 mb-3" />
                      <p className="text-sm font-bold text-slate-600">All Clear</p>
                      <p className="text-xs mt-1">No pending bookings right now.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Live Map */}
      {showMap && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 sm:px-8 py-5 bg-slate-50/50">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <MapPin size={18} className="text-[#8b6508]" />
              Facility & Resource Map
            </h2>
          </div>
          <div className="p-4 sm:p-6 bg-slate-50">
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
              <LiveResourceMap />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
