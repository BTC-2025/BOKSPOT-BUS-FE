'use client';

import { useVendorStore, PersistedBooking } from '../../../lib/store';
import { 
  Search, Clock, CheckCircle2, ChevronRight, X, Phone, 
  Activity, FileText, Pill, Stethoscope, ChevronDown, User, HeartPulse, ActivitySquare, TestTube2, AlertCircle, FileDigit, MonitorPlay, Zap, ShieldAlert, Flag, Tag, FileBarChart
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { getConfig } from '../../../lib/businessConfig';

export default function BookingsPage() {
  const { currentMerchant, bookings, staffAccounts, loginRole, currentStaff, checkInBooking, completeBooking, savePrescription } = useVendorStore();
  const [mounted, setMounted] = useState(false);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  
  const config = getConfig(currentMerchant?.category);
  const [chartTab, setChartTab] = useState<'vitals' | 'labs' | 'rx' | 'notes' | 'equipment'>('notes');

  // Prescription Form (Healthcare)
  const [diagInput, setDiagInput] = useState('');
  const [medsList, setMedsList] = useState([{ name: '', dosage: '', duration: '' }]);

  // Match Notes (Turf)
  const [matchNotesInput, setMatchNotesInput] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!currentMerchant || !mounted) {
    return (
      <div className="flex h-full min-h-[500px] items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-[#8b6508] border-t-transparent animate-spin" />
      </div>
    );
  }

  // Filter logic
  let merchantBookings = bookings.filter(
    (b) => b.merchantName.toLowerCase() === currentMerchant.merchantName.toLowerCase()
  );

  const isStaffView = loginRole === 'staff';
  if (isStaffView && currentStaff) {
    merchantBookings = merchantBookings.filter((b) => 
      b.assignedDoctorId === currentStaff.id || b.refereeAssigned === currentStaff.name
    );
  }

  const filteredBookings = merchantBookings.filter((b) => {
    const searchTarget = b.teamName || b.customerName;
    return searchTarget.toLowerCase().includes(searchQuery.toLowerCase()) || 
           b.ref.toLowerCase().includes(searchQuery.toLowerCase());
  }).sort((a, b) => new Date(`${b.date} ${b.time}`).getTime() - new Date(`${a.date} ${a.time}`).getTime());

  const selectedBooking = bookings.find((b) => b.id === selectedBookingId);
  const selectedStaff = staffAccounts.find(s => s.id === selectedBooking?.assignedDoctorId || s.name === selectedBooking?.refereeAssigned);

  const handleOpenDrawer = (booking: PersistedBooking) => {
    setSelectedBookingId(booking.id);
    setChartTab('notes');
    
    setDiagInput(booking.prescription?.diagnosis || '');
    setMedsList(booking.prescription?.medications || [{ name: '', dosage: '', duration: '' }]);
    setMatchNotesInput(booking.matchNotes || '');
  };

  const handleSaveData = () => {
    if (!selectedBookingId) return;
    
    alert('Logs Saved Successfully!');
    setSelectedBookingId(null);
  };

  return (
    <div className="relative min-h-full pb-12 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            {config.words.booking} Logs
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-2 max-w-2xl">
            View all past and upcoming {config.words.bookings.toLowerCase()}, manage details, and billing status.
          </p>
        </div>
        
        <div className="relative w-full md:w-[350px] shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${config.words.customer} Name or Ref ID...`}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none focus:border-[#8b6508] focus:ring-1 focus:ring-[#8b6508] transition-all shadow-sm hover:shadow-md" 
          />
        </div>
      </div>

      {/* Modern Robust Data Table / List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <div className="col-span-3">{config.words.customer} & Ref</div>
          <div className="col-span-2">Date / Time</div>
          <div className="col-span-3">Department & Service</div>
          <div className="col-span-2">Assigned Staff</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-100">
          {filteredBookings.map((b) => {
            const staff = staffAccounts.find(s => s.id === b.assignedDoctorId || s.name === b.refereeAssigned);
            const isPending = b.status === 'CONFIRMED' || b.status === 'CHECKED_IN';
            const primaryName = b.teamName || b.customerName;
            
            return (
              <div 
                key={b.id} 
                onClick={() => handleOpenDrawer(b)}
                className={`group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 md:px-8 py-6 items-center hover:bg-slate-50 transition-colors cursor-pointer ${selectedBookingId === b.id ? 'bg-slate-100' : ''}`}
              >
                {/* Column 1: Patient/Team */}
                <div className="col-span-1 md:col-span-3 flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 ${isPending ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                    {primaryName.charAt(0)}
                  </div>
                  <div>
                    <h3 className={`text-sm font-black text-slate-900 transition-colors group-hover:text-slate-600`}>{primaryName}</h3>
                    <p className="text-[10px] font-bold text-slate-500 flex items-center gap-1 mt-0.5"><FileDigit size={12} /> {b.ref}</p>
                  </div>
                </div>

                {/* Column 2: DateTime */}
                <div className="col-span-1 md:col-span-2">
                  <p className="text-xs font-black text-slate-900">{b.date}</p>
                  <p className="text-[10px] font-bold text-[#8b6508]">{b.time}</p>
                </div>

                {/* Column 3: Service */}
                <div className="col-span-1 md:col-span-3">
                  <p className="text-xs font-bold text-slate-900 line-clamp-1">{b.serviceName}</p>
                  <p className="text-[10px] font-semibold text-slate-500">{currentMerchant.category}</p>
                </div>

                {/* Column 4: Doctor/Staff */}
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                      <FileBarChart size={10} className="text-slate-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {staff?.name || 'Unassigned'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Column 5: Status */}
                <div className="col-span-1 md:col-span-2 flex justify-end">
                  <div className={`px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest border ${
                    b.status === 'COMPLETED' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                    b.status === 'CHECKED_IN' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                    'bg-amber-50 border-amber-100 text-amber-600'
                  }`}>
                    {b.status === 'COMPLETED' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                    {b.status.replace('_', ' ')}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredBookings.length === 0 && (
            <div className="py-24 text-center bg-slate-50">
              <Search className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-black text-slate-900 mb-2">No Records Found</h3>
              <p className="text-sm font-semibold text-slate-500">No records match your current search parameters.</p>
            </div>
          )}
        </div>
      </div>

      {/* THE ULTIMATE DRAWER (GENERIC) */}
      {selectedBooking && (
        <>
          <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedBookingId(null)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[700px] lg:w-[800px] bg-slate-50 border-l border-slate-200 shadow-2xl flex flex-col transform transition-transform animate-slide-in">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-6 bg-white shrink-0">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white shadow-md bg-[#8b6508]`}>
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">{config.words.booking} Details</h2>
                  <p className={`text-xs font-black tracking-widest uppercase mt-1 flex items-center gap-1.5 text-[#8b6508]`}>
                    <FileDigit size={12} /> REF ID: {selectedBooking.ref}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedBookingId(null)} className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Entity Snapshot */}
            <div className="bg-white border-b border-slate-200 p-6 shrink-0 flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="h-20 w-20 rounded-[2rem] bg-slate-100 border-2 border-white shadow-md flex items-center justify-center overflow-hidden shrink-0">
                <img src={`https://i.pravatar.cc/150?u=${selectedBooking.id}`} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-slate-900">{selectedBooking.teamName || selectedBooking.customerName}</h3>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1"><User size={14} className="text-slate-400" /> Booker: {selectedBooking.customerName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Phone size={14} className="text-slate-400" /> {selectedBooking.customerPhone}</span>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 shrink-0 text-right">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Assigned Resource</p>
                <p className="text-sm font-bold text-slate-900">{selectedStaff?.name || 'Unassigned'}</p>
              </div>
            </div>

            {/* Dynamic Tabs */}
            <div className="flex border-b border-slate-200 bg-white shrink-0 px-6 pt-4 gap-6">
              <button 
                onClick={() => setChartTab('notes')}
                className={`pb-4 text-xs font-black uppercase tracking-widest transition-colors relative ${chartTab === 'notes' ? 'text-[#8b6508]' : 'text-slate-400 hover:text-slate-700'}`}
              >
                <span className="flex items-center gap-2"><FileText size={16} /> Log & Notes</span>
                {chartTab === 'notes' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#8b6508] rounded-t-full" />}
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              
              {/* Notes */}
              {chartTab === 'notes' && (
                <div className="animate-fade-in">
                  <div className="rounded-3xl bg-white border border-[#8b6508]/20 shadow-lg shadow-[#8b6508]/5 overflow-hidden">
                    <div className="bg-[#8b6508] px-6 py-4 flex items-center justify-between">
                      <h4 className="font-black text-white uppercase tracking-widest text-sm flex items-center gap-2">
                        <MonitorPlay size={16} /> Overview & Notes
                      </h4>
                    </div>
                    
                    <div className="p-6 md:p-8 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Total Amount</p>
                          <p className="text-2xl font-black text-slate-900">₹{selectedBooking.amount}</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Payment Status</p>
                          <p className="text-xl font-black text-emerald-600">Partially Paid</p>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-black text-slate-400 mb-2 block tracking-widest">Internal Notes</label>
                        <textarea 
                          value={matchNotesInput}
                          onChange={(e) => setMatchNotesInput(e.target.value)}
                          placeholder="Enter observations, notes, damages, or requests..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#8b6508] focus:ring-1 focus:ring-[#8b6508] focus:bg-white transition-all min-h-[120px] resize-none"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-50 border-t border-slate-200 p-6 flex flex-col sm:flex-row justify-end gap-3">
                      <button 
                        onClick={() => setSelectedBookingId(null)}
                        className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveData}
                        className="px-8 py-3 rounded-xl bg-[#8b6508] hover:bg-[#6c4e06] text-white shadow-lg shadow-[#8b6508]/20 font-black text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={16} /> Save Notes
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </>
      )}
    </div>
  );
}
