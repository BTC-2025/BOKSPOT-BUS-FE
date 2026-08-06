'use client';

import { useVendorStore } from '../../lib/store';
import { getArchetypeConfig } from '@/lib/businessDictionary';
import {
  Users, User, Activity, ShieldAlert, CheckCircle2, ChevronRight, Phone, HeartPulse,
  Bed, Stethoscope, Syringe, Ambulance, FileText, IndianRupee, Clock,
  ArrowUpRight, ArrowDownRight, TrendingUp, Goal, Medal, MonitorPlay, Zap,
  CloudSun, Wind, Thermometer, AlertTriangle, Calendar, Settings, Plus
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LiveResourceMap from '../components/LiveResourceMap';

export default function DashboardPage() {
  const router = useRouter();
  const { currentMerchant, staffAccounts, bookings, loginRole, supervisorId, currentStaff, checkInBooking, completeBooking } = useVendorStore();
  const baseConfig = getArchetypeConfig(currentMerchant?.archetype || 'Service');
  const archetypeConfig = { ...baseConfig, ...(currentMerchant?.customDictionary || {}) };
  const activeModules = currentMerchant?.activeModules || ['bookings', 'staff', 'customers', 'map'];
  const showMap = !currentMerchant?.isCustomized || activeModules.includes('map');
  const showStaff = !currentMerchant?.isCustomized || activeModules.includes('staff');
  const showBookings = !currentMerchant?.isCustomized || activeModules.includes('bookings');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  

  // Real Data mixed with impressive dummy data for a premium look
  let merchantBookings = bookings.filter(
    (b) => b.merchantName.toLowerCase() === currentMerchant.merchantName.toLowerCase()
  );

  const staffList = staffAccounts.filter(s => s.merchantId === currentMerchant.id);
  const isStaffView = loginRole === 'staff';

  if (isStaffView && currentStaff) {
    merchantBookings = merchantBookings.filter((b) =>
      b.assignedDoctorId === currentStaff.id || b.refereeAssigned === currentStaff.name
    );
  }

  const activeBookings = merchantBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'CHECKED_IN');
  const completedBookings = merchantBookings.filter(b => b.status === 'COMPLETED');
  const totalRevenue = merchantBookings.reduce((sum, b) => b.status === 'COMPLETED' ? sum + b.amount : sum, 0);

  // --- DUMMY METRICS ---
  const occupancy = Math.floor(Math.random() * (95 - 70) + 70);
  const metric3 = Math.floor(Math.random() * 50) + 10;
  const metric4 = Math.floor(Math.random() * 20) + 5;
  const weeklyData = [45, 52, 38, 65, 80, 42, 60];
  const maxWeekly = Math.max(...weeklyData);

  // --- OWNER COMMAND CENTER VIEW ---
  if (!isStaffView) {
    return (
      <div className="space-y-8 pb-12 font-sans animate-fade-in">

        {/* Dynamic Header with Archetype Specific Image & Framer Motion */}
        <div className={`flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border p-8 rounded-3xl shadow-sm relative overflow-hidden ${archetypeConfig.themeClass || 'bg-white border-slate-200 text-slate-900'
          }`}>
          {/* Background Images / Gradients */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-center mix-blend-overlay"
            style={{
              backgroundImage: (currentMerchant.archetype === "ResourceBooking")
                ? 'url(https://images.unsplash.com/photo-1574629810360-7efbb49fec90?q=80&w=1200&auto=format&fit=crop)' // Turf / Stadium
                : 'url(https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop)' // Clinic / Hospital
            }}
          />
          <div className={`absolute inset-0 opacity-80 pointer-events-none ${archetypeConfig.gradientClass || 'bg-gradient-to-r from-white via-white/80 to-transparent'
            }`} />

          <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
            {archetypeConfig.servicesIcon ? <archetypeConfig.servicesIcon size={220} className="text-[#0ea5e9]" /> : <Activity size={220} className="text-[#0ea5e9]" />}
          </div>

          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
              Dashboard Home
            </h1>
            <div className={`flex flex-wrap items-center gap-3 text-sm font-semibold ${'text-slate-500'}`}>
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${'bg-slate-100 text-slate-700'}`}>
                <ShieldAlert size={14} className={'text-blue-600'} /> {archetypeConfig.dashboardTitle || 'Admin Console'}
              </span>
              <span>•</span>
              <span className={'text-slate-700'}>{currentMerchant.merchantName}</span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-emerald-500"><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span> Systems Operational</span>
            </div>
          </div>

          <div className="relative z-10 flex gap-3">
            <button className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-2 ${'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}>
              <FileText size={14} /> Reports
            </button>
            <button className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 ${'bg-[#0ea5e9] hover:bg-[#0284c7] text-white shadow-[#0ea5e9]/20'
              }`}>
              <Activity size={14} /> Live Monitor
            </button>
          </div>
        </div>

        {/* Premium KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              {archetypeConfig.servicesIcon ? <archetypeConfig.servicesIcon size={80} /> : <Activity size={80} />}
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center border border-amber-100">
                {archetypeConfig.servicesIcon ? <archetypeConfig.servicesIcon size={18} className="text-amber-600" /> : <Activity size={18} className="text-amber-600" />}
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md"><ArrowUpRight size={12} /> 4.2%</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              {archetypeConfig.metric1Title || 'Total Bookings'}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-900">{occupancy}%</h3>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-4 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> {archetypeConfig.activeStaffLabel || 'Live Capacity'}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Calendar size={80} />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                <Calendar size={18} className="text-emerald-600" />
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md"><ArrowUpRight size={12} /> 12.5%</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              {archetypeConfig.metric2Title || 'Active Customers'}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-900">{merchantBookings.length + 42}</h3>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-4 flex items-center gap-1">
              <CheckCircle2 size={14} className="text-emerald-500" /> {completedBookings.length + 30} Completed
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              {archetypeConfig.bookingIcon ? <archetypeConfig.bookingIcon size={80} /> : <Activity size={80} />}
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
                {archetypeConfig.bookingIcon ? <archetypeConfig.bookingIcon size={18} className="text-red-600" /> : <Activity size={18} className="text-red-600" />}
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md"><ArrowUpRight size={12} /> High</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              {archetypeConfig.metric3Title || 'Performance Index'}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-900">{metric3}</h3>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-4 flex items-center gap-1">
              <Zap size={14} className="text-slate-400" /> {metric4} {archetypeConfig.metric4Title || 'Weekly Growth'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] rounded-3xl p-6 shadow-lg shadow-[var(--primary)]/20 relative overflow-hidden group text-white">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <IndianRupee size={80} />
            </div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm">
                <IndianRupee size={18} className="text-white" />
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold text-white bg-white/20 px-2 py-1 rounded-md backdrop-blur-sm"><TrendingUp size={12} /> Target Met</span>
            </div>
            <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1 relative z-10">Daily Revenue</p>
            <div className="flex items-baseline gap-2 relative z-10">
              <h3 className="text-3xl font-black">₹{(totalRevenue + 125000).toLocaleString()}</h3>
            </div>
            <p className="text-xs font-semibold text-white/80 mt-4 relative z-10 flex items-center gap-1">
              +₹{totalRevenue.toLocaleString()} from Bookings
            </p>
          </div>

        </div>

        {/* Main Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Patient Timeline & Activity */}
          <div className="lg:col-span-2 space-y-8">

            {/* Activity Chart */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-lg font-black text-slate-900">{archetypeConfig.trendTitle || 'Trend'}</h2>
                  <p className="text-sm text-slate-500 font-medium">Weekly statistics vs capacity limits.</p>
                </div>
                <select className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 rounded-xl px-4 py-2 outline-none focus:border-[#8b6508]">
                  <option>This Week</option>
                  <option>Last Week</option>
                </select>
              </div>

              <div className="h-48 flex items-end justify-between gap-2 px-2">
                {weeklyData.map((val, idx) => {
                  const heightPercentage = (val / maxWeekly) * 100;
                  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                  return (
                    <div key={idx} className="h-full flex flex-col items-center gap-3 flex-1 group">
                      <div className="w-full relative flex justify-center items-end h-full">
                        <div
                          className="w-full max-w-[40px] bg-blue-100 rounded-t-xl relative group-hover:bg-blue-200 transition-colors"
                          style={{ height: `${heightPercentage}%` }}
                        >
                          <div
                            className="absolute bottom-0 w-full bg-[#8b6508] rounded-t-xl group-hover:bg-[#6c4e06] transition-colors"
                            style={{ height: `${heightPercentage * 0.6}%` }}
                          />
                        </div>
                        {/* Tooltip */}
                        <div className="absolute -top-10 bg-white border border-slate-200 text-slate-900 shadow-sm text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                          {val} {archetypeConfig.chartLabel || 'Count'}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-slate-900 transition-colors">{days[idx]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Resource Map */}
            {showMap && <LiveResourceMap />}

            {/* Live Queue */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                <Clock size={18} className="text-[#8b6508]" /> {archetypeConfig.liveQueueTitle || 'Live Queue'}
              </h2>

              <div className="space-y-4">
                {activeBookings.slice(0, 5).map((booking, i) => {
                  const doc = staffList.find(d => d.id === booking.assignedDoctorId);
                  return (
                    <div key={booking.id} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                      <div className="text-center w-16 shrink-0">
                        <p className="text-sm font-black text-slate-900 group-hover:text-[#8b6508] transition-colors">{booking.time.split(' ')[0]}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{booking.time.split(' ')[1]}</p>
                      </div>
                      <div className="w-px h-10 bg-slate-200 group-hover:bg-[#8b6508]/30 transition-colors shrink-0" />
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-slate-900 text-base">{booking.teamName || booking.customerName}</h3>
                          <p className="text-xs font-semibold text-slate-500 mt-0.5">{booking.serviceName}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {true && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-100">
                              {archetypeConfig.staffIcon === 'Stethoscope' ? <Stethoscope size={12} className="text-blue-600" /> : <User size={12} className="text-slate-400" />}
                              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">{archetypeConfig.staffPrefix || ''}{doc?.name || 'Unassigned'}</span>
                            </div>
                          )}
                          <span className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-bold uppercase tracking-widest">
                            {booking.status === 'CHECKED_IN' ? 'In Progress' : 'Waiting'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {activeBookings.length === 0 && (
                  <div className="py-12 text-center bg-slate-50 rounded-2xl border border-slate-100">
                    <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-3" />
                    <p className="text-sm font-bold text-slate-900">All Clear</p>
                    <p className="text-xs text-slate-500 font-medium mt-1">No pending bookings in the queue.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right: Dept Status & Quick Actions */}
          <div className="space-y-8">

            {/* Quick Actions & Widgets */}
            <div className="space-y-6">

              {/* Dynamic Feature Widget (Lightweight CSS/SVGs to prevent lag) */}
              {archetypeConfig.hasOutdoorConditions && (
                <div className="bg-[#0a0a0a] rounded-3xl p-6 border border-[#22c55e]/20 shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <CloudSun size={100} className="text-[#22c55e]" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                    <Thermometer size={14} className="text-[#22c55e]" /> Live Pitch Conditions
                  </h3>
                  <div className="flex items-center gap-6">
                    <div>
                      <h2 className="text-4xl font-black text-white">28°C</h2>
                      <p className="text-xs text-gray-400 font-medium mt-1">Clear Sky, Optimal</p>
                    </div>
                    <div className="flex flex-col gap-2 border-l border-white/10 pl-6">
                      <span className="flex items-center gap-2 text-xs text-gray-300 font-bold"><Wind size={12} className="text-gray-500" /> 12 km/h NW</span>
                      <span className="flex items-center gap-2 text-xs text-gray-300 font-bold"><Activity size={12} className="text-[#22c55e]" /> Turf Dry</span>
                    </div>
                  </div>
                </div>
              )}
              {archetypeConfig.hasHealthVitals && (
                <div className="bg-red-50 rounded-3xl p-6 border border-red-200 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <AlertTriangle size={100} className="text-red-600" />
                  </div>
                  <h3 className="text-sm font-bold text-red-600 uppercase tracking-widest flex items-center gap-2 mb-4">
                    <AlertTriangle size={14} /> ER & Trauma Status
                  </h3>
                  <div className="flex items-center gap-6">
                    <div>
                      <h2 className="text-4xl font-black text-slate-900">03</h2>
                      <p className="text-xs text-red-500 font-bold mt-1">Active Critical Cases</p>
                    </div>
                    <div className="flex flex-col gap-2 border-l border-red-200 pl-6">
                      <span className="flex items-center gap-2 text-xs text-slate-700 font-bold"><Ambulance size={12} className="text-red-500" /> 2 Ambulances En Route</span>
                      <span className="flex items-center gap-2 text-xs text-slate-700 font-bold"><Bed size={12} className="text-slate-400" /> 4 ICU Beds Available</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => router.push('/dashboard/staff')} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 transition-all group border border-blue-100 hover:border-blue-600">
                  <Users size={24} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-center">{archetypeConfig.action1Title || 'Manage Team'}</span>
                </button>
                <button onClick={() => router.push('/dashboard/bookings')} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 transition-all group border border-emerald-100 hover:border-emerald-600">
                  <FileText size={24} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-center">{archetypeConfig.action2Title || 'All Records'}</span>
                </button>
                <button onClick={() => router.push('/dashboard/services')} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-[#8b6508]/10 hover:bg-[#8b6508] hover:text-white text-[#8b6508] transition-all group border border-[#8b6508]/20 hover:border-[#8b6508]">
                  <Activity size={24} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-center">{archetypeConfig.action3Title || 'Services'}</span>
                </button>
                <button onClick={() => router.push('/dashboard/settings')} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 transition-all group border border-red-100 hover:border-red-600">
                  <ShieldAlert size={24} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-center">{archetypeConfig.action4Title || 'Alerts'}</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-base font-black text-slate-900 mb-6">{archetypeConfig.liveWidgetTitle || 'Status'}</h2>
              <div className="space-y-5">
                {[
                  { name: 'Zone A', active: 4, status: 'Busy', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' },
                  { name: 'Zone B', active: 2, status: 'Normal', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
                  { name: 'Zone C', active: 3, status: 'High Volume', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
                  { name: 'Zone D', active: 5, status: 'Normal', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                ].map((dept, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${dept.bg} ${dept.border} border`}>
                        {archetypeConfig.servicesIcon ? <archetypeConfig.servicesIcon size={16} className={dept.color} /> : <Activity size={16} className={dept.color} />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{dept.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{dept.active} 'Active'</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${dept.bg} ${dept.color}`}>
                      {dept.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // --- STAFF VIEW (Doctor / Referee) ---
  return (
    <div className="space-y-8 animate-fade-in pb-12 font-sans">
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Clock size={18} className="text-blue-600" /> {archetypeConfig.bookingHeaderTitle || 'Tasks Today'}
          </h2>
        </div>

        <div className="space-y-4">
          {activeBookings.map((booking, index) => (
            <div key={booking.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col md:flex-row items-center gap-6 group cursor-pointer">

              <div className="flex flex-col items-center justify-center w-20 shrink-0 border-r border-slate-100 pr-6">
                <span className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{booking.time.split(' ')[0]}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{booking.time.split(' ')[1]}</span>
              </div>

              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-slate-900">{booking.teamName || booking.customerName}</h3>
                  {index === 0 && (
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-widest animate-pulse">Up Next</span>
                  )}
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
                  <button
                    onClick={(e) => { e.stopPropagation(); checkInBooking(booking.id); }}
                    className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold text-xs uppercase tracking-widest transition-all"
                  >
                    Start
                  </button>
                )}
                {booking.status === 'CHECKED_IN' && (
                  <button
                    onClick={(e) => { e.stopPropagation(); completeBooking(booking.id); }}
                    className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
                  >
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
