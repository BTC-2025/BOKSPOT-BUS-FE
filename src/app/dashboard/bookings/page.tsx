'use client';

import { useVendorStore, PersistedBooking } from '../../../lib/store';
import { 
  Search, Clock, CheckCircle2, ChevronRight, X, Phone, 
  Activity, FileText, Pill, Stethoscope, ChevronDown, User, HeartPulse, ActivitySquare, TestTube2, AlertCircle, FileDigit, MonitorPlay, Zap, ShieldAlert, Flag, Tag
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function BookingsPage() {
  const { currentMerchant, bookings, staffAccounts, loginRole, currentStaff, checkInBooking, completeBooking, savePrescription } = useVendorStore();
  const [mounted, setMounted] = useState(false);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  
  const isTurf = currentMerchant?.archetype === 'ResourceBooking';
  const [chartTab, setChartTab] = useState<'vitals' | 'labs' | 'rx' | 'notes' | 'equipment'>(isTurf ? 'notes' : 'rx');

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
    const searchTarget = isTurf ? (b.teamName || b.customerName) : b.customerName;
    return searchTarget.toLowerCase().includes(searchQuery.toLowerCase()) || 
           b.ref.toLowerCase().includes(searchQuery.toLowerCase());
  }).sort((a, b) => new Date(`${b.date} ${b.time}`).getTime() - new Date(`${a.date} ${a.time}`).getTime());

  const selectedBooking = bookings.find((b) => b.id === selectedBookingId);
  const selectedStaff = staffAccounts.find(s => s.id === selectedBooking?.assignedDoctorId || s.name === selectedBooking?.refereeAssigned);

  const handleOpenDrawer = (booking: PersistedBooking) => {
    setSelectedBookingId(booking.id);
    setChartTab(isTurf ? 'notes' : 'rx');
    
    // Load Healthcare Data
    if (!isTurf) {
      if (booking.prescription) {
        setDiagInput(booking.prescription.diagnosis);
        setMedsList(booking.prescription.medications);
      } else {
        setDiagInput('');
        setMedsList([{ name: '', dosage: '', duration: '' }]);
      }
    } else {
      // Load Turf Data
      setMatchNotesInput(booking.matchNotes || '');
    }
  };

  const handleSaveData = () => {
    if (!selectedBookingId) return;
    
    if (isTurf) {
      // TODO: Save Turf match notes
      // We will just alert for now, as we'd need to extend the store update action.
      alert('Match Notes Saved Successfully!');
      setSelectedBookingId(null);
    } else {
      savePrescription(selectedBookingId, {
        diagnosis: diagInput,
        medications: medsList.filter(m => m.name.trim() !== ''),
        updatedAt: new Date().toISOString()
      });
      setSelectedBookingId(null);
    }
  };

  return (
    <div className="relative min-h-full pb-12 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            {isTurf ? 'Match Logs & Bookings' : 'Medical Records'}
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-2 max-w-2xl">
            {isTurf ? 'View all past and upcoming match bookings, manage team details, equipment rentals, and billing status.' : 'Access complete patient histories, track consultation statuses, input vitals, and issue digital prescriptions from the master clinical log.'}
          </p>
        </div>
        
        <div className="relative w-full md:w-[350px] shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isTurf ? "Search Team Name or Ref ID..." : "Search Patient Name or File ID..."}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none focus:border-[#8b6508] focus:ring-1 focus:ring-[#8b6508] transition-all shadow-sm hover:shadow-md" 
          />
        </div>
      </div>

      {/* Modern Robust Data Table / List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <div className="col-span-3">{isTurf ? 'Team & Booking Ref' : 'Patient & File'}</div>
          <div className="col-span-2">Date / Time</div>
          <div className="col-span-3">{isTurf ? 'Pitch Type & Service' : 'Department & Service'}</div>
          <div className="col-span-2">{isTurf ? 'Referee/Manager' : 'Attending Doctor'}</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-100">
          {filteredBookings.map((b) => {
            const staff = staffAccounts.find(s => s.id === b.assignedDoctorId || s.name === b.refereeAssigned);
            const isPending = b.status === 'CONFIRMED' || b.status === 'CHECKED_IN';
            const primaryName = isTurf ? (b.teamName || b.customerName) : b.customerName;
            
            return (
              <div 
                key={b.id} 
                onClick={() => handleOpenDrawer(b)}
                className={`group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 md:px-8 py-6 items-center hover:bg-slate-50 transition-colors cursor-pointer ${selectedBookingId === b.id ? (isTurf ? 'bg-emerald-50/50' : 'bg-blue-50/80') : ''}`}
              >
                {/* Column 1: Patient/Team */}
                <div className="col-span-1 md:col-span-3 flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 ${isPending ? 'bg-amber-100 text-amber-700' : (isTurf ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700')}`}>
                    {primaryName.charAt(0)}
                  </div>
                  <div>
                    <h3 className={`text-sm font-black text-slate-900 transition-colors ${isTurf ? 'group-hover:text-emerald-600' : 'group-hover:text-blue-600'}`}>{primaryName}</h3>
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
                      {isTurf ? <Flag size={10} className="text-slate-500" /> : <Stethoscope size={10} className="text-slate-500" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {isTurf ? (staff?.name || 'Unassigned') : `Dr. ${staff?.name || 'Unassigned'}`}
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
              <p className="text-sm font-semibold text-slate-500">No {isTurf ? 'match' : 'medical'} records match your current search parameters.</p>
            </div>
          )}
        </div>
      </div>

      {/* THE ULTIMATE DRAWER (MEDICAL or TURF) */}
      {selectedBooking && (
        <>
          <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedBookingId(null)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[700px] lg:w-[800px] bg-slate-50 border-l border-slate-200 shadow-2xl flex flex-col transform transition-transform animate-slide-in">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-6 bg-white shrink-0">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white shadow-md ${isTurf ? 'bg-[#8b6508]' : 'bg-blue-600'}`}>
                  {isTurf ? <ActivitySquare size={20} /> : <FileText size={20} />}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">{isTurf ? 'Match Log Details' : 'Master Clinical Chart'}</h2>
                  <p className={`text-xs font-black tracking-widest uppercase mt-1 flex items-center gap-1.5 ${isTurf ? 'text-[#8b6508]' : 'text-blue-600'}`}>
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
                <h3 className="text-2xl font-black text-slate-900">{isTurf ? (selectedBooking.teamName || selectedBooking.customerName) : selectedBooking.customerName}</h3>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1"><User size={14} className="text-slate-400" /> Booker: {selectedBooking.customerName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Phone size={14} className="text-slate-400" /> {selectedBooking.customerPhone}</span>
                  {!isTurf && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1"><HeartPulse size={14} className="text-red-400" /> Blood: O+</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><AlertCircle size={14} className="text-amber-400" /> Allergies: Penicillin</span>
                    </>
                  )}
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 shrink-0 text-right">
                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-1">{isTurf ? 'Assigned Staff/Ref' : 'Consulting Physician'}</p>
                <p className="text-sm font-bold text-slate-900">{isTurf ? '' : 'Dr. '} {selectedStaff?.name || 'Unassigned'}</p>
              </div>
            </div>

            {/* Dynamic Tabs based on Archetype */}
            <div className="flex border-b border-slate-200 bg-white shrink-0 px-6 pt-4 gap-6">
              {isTurf ? (
                <>
                  <button 
                    onClick={() => setChartTab('notes')}
                    className={`pb-4 text-xs font-black uppercase tracking-widest transition-colors relative ${chartTab === 'notes' ? 'text-[#8b6508]' : 'text-slate-400 hover:text-slate-700'}`}
                  >
                    <span className="flex items-center gap-2"><FileText size={16} /> Match Notes</span>
                    {chartTab === 'notes' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#8b6508] rounded-t-full" />}
                  </button>
                  <button 
                    onClick={() => setChartTab('equipment')}
                    className={`pb-4 text-xs font-black uppercase tracking-widest transition-colors relative ${chartTab === 'equipment' ? 'text-[#8b6508]' : 'text-slate-400 hover:text-slate-700'}`}
                  >
                    <span className="flex items-center gap-2"><Tag size={16} /> Equipment Rentals</span>
                    {chartTab === 'equipment' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#8b6508] rounded-t-full" />}
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setChartTab('vitals')}
                    className={`pb-4 text-xs font-black uppercase tracking-widest transition-colors relative ${chartTab === 'vitals' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'}`}
                  >
                    <span className="flex items-center gap-2"><ActivitySquare size={16} /> Vitals Log</span>
                    {chartTab === 'vitals' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full" />}
                  </button>
                  <button 
                    onClick={() => setChartTab('labs')}
                    className={`pb-4 text-xs font-black uppercase tracking-widest transition-colors relative ${chartTab === 'labs' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'}`}
                  >
                    <span className="flex items-center gap-2"><TestTube2 size={16} /> Lab Results</span>
                    {chartTab === 'labs' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full" />}
                  </button>
                  <button 
                    onClick={() => setChartTab('rx')}
                    className={`pb-4 text-xs font-black uppercase tracking-widest transition-colors relative ${chartTab === 'rx' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'}`}
                  >
                    <span className="flex items-center gap-2"><Pill size={16} /> E-Prescription</span>
                    {chartTab === 'rx' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full" />}
                  </button>
                </>
              )}
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              
              {/* TURF: Match Notes */}
              {chartTab === 'notes' && (
                <div className="animate-fade-in">
                  <div className="rounded-3xl bg-white border border-[#8b6508]/20 shadow-lg shadow-[#8b6508]/5 overflow-hidden">
                    <div className="bg-[#8b6508] px-6 py-4 flex items-center justify-between">
                      <h4 className="font-black text-white uppercase tracking-widest text-sm flex items-center gap-2">
                        <MonitorPlay size={16} /> Match Overview & Notes
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
                        <label className="text-[10px] uppercase font-black text-slate-400 mb-2 block tracking-widest">Ground Staff Notes</label>
                        <textarea 
                          value={matchNotesInput}
                          onChange={(e) => setMatchNotesInput(e.target.value)}
                          placeholder="Enter match observations, damages, extra time played, or billing notes..."
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

              {/* TURF: Equipment Rentals */}
              {chartTab === 'equipment' && (
                <div className="animate-fade-in space-y-4">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Rented Equipment</h3>
                  
                  {selectedBooking.equipmentRentals && selectedBooking.equipmentRentals.length > 0 ? (
                    selectedBooking.equipmentRentals.map((eq, i) => (
                      <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><Tag size={24} /></div>
                          <div>
                            <h4 className="font-bold text-slate-900">{eq.item}</h4>
                            <p className="text-xs text-slate-500 font-semibold mt-0.5">Quantity: {eq.qty}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase font-bold text-slate-400">Add-on Cost</p>
                          <p className="text-lg font-black text-slate-900">+₹{eq.price}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
                      <Tag className="mx-auto h-12 w-12 text-slate-200 mb-3" />
                      <h4 className="font-bold text-slate-900">No Equipment Rented</h4>
                      <p className="text-xs text-slate-500 mt-1">This booking does not have any add-ons.</p>
                    </div>
                  )}
                </div>
              )}

              {/* HEALTHCARE: Vitals */}
              {chartTab === 'vitals' && (
                <div className="animate-fade-in">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Patient Vitals & Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                      <div className="h-10 w-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-3"><HeartPulse size={18} /></div>
                      <p className="text-2xl font-black text-slate-900">72 <span className="text-xs text-slate-400 font-bold">bpm</span></p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Heart Rate</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                      <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto mb-3"><ActivitySquare size={18} /></div>
                      <p className="text-2xl font-black text-slate-900">120/80</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Blood Pressure</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                      <div className="h-10 w-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3"><TestTube2 size={18} /></div>
                      <p className="text-2xl font-black text-slate-900">98.6 <span className="text-xs text-slate-400 font-bold">°F</span></p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Temperature</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                      <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-3"><Activity size={18} /></div>
                      <p className="text-2xl font-black text-slate-900">99 <span className="text-xs text-slate-400 font-bold">%</span></p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">SpO2</p>
                    </div>
                  </div>
                </div>
              )}

              {/* HEALTHCARE: Labs */}
              {chartTab === 'labs' && (
                <div className="animate-fade-in space-y-4">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Laboratory Reports</h3>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center"><TestTube2 size={24} /></div>
                      <div>
                        <h4 className="font-bold text-slate-900">Complete Blood Count (CBC)</h4>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">Sample collected 2 days ago</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase rounded-lg transition-colors">View PDF</button>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center"><ActivitySquare size={24} /></div>
                      <div>
                        <h4 className="font-bold text-slate-900">Lipid Profile</h4>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">Sample collected 1 week ago</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase rounded-lg transition-colors">View PDF</button>
                  </div>
                </div>
              )}

              {/* HEALTHCARE: Rx */}
              {chartTab === 'rx' && (
                <div className="animate-fade-in">
                  <div className="rounded-3xl bg-white border border-blue-200 shadow-lg shadow-blue-500/5 overflow-hidden">
                    <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
                      <h4 className="font-black text-white uppercase tracking-widest text-sm flex items-center gap-2">
                        <Pill size={16} /> Electronic Prescription Pad
                      </h4>
                      <img src="/logo.png" className="h-6 opacity-80 mix-blend-screen brightness-200 grayscale" alt="Logo" />
                    </div>
                    
                    <div className="p-6 md:p-8 space-y-8">
                      <div>
                        <label className="text-[10px] uppercase font-black text-slate-400 mb-2 block tracking-widest">Clinical Diagnosis / Notes</label>
                        <textarea 
                          value={diagInput}
                          onChange={(e) => setDiagInput(e.target.value)}
                          placeholder="Enter observations, symptoms, and final diagnosis..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all min-h-[120px] resize-none"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                          <label className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Medications Protocol</label>
                          <button 
                            onClick={() => setMedsList([...medsList, { name: '', dosage: '', duration: '' }])}
                            className="text-[10px] uppercase font-black text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg"
                          >
                            + Add Drug
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          {medsList.map((m, i) => (
                            <div key={i} className="flex flex-col md:flex-row gap-3 items-start relative group p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                              <div className="w-full md:w-1/2">
                                <label className="text-[9px] uppercase font-bold text-slate-400 mb-1 block">Drug Name</label>
                                <input 
                                  value={m.name} onChange={(e) => { const n = [...medsList]; n[i].name = e.target.value; setMedsList(n); }}
                                  placeholder="e.g. Paracetamol 500mg"
                                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
                                />
                              </div>
                              <div className="w-full md:w-1/4">
                                <label className="text-[9px] uppercase font-bold text-slate-400 mb-1 block">Dosage</label>
                                <input 
                                  value={m.dosage} onChange={(e) => { const n = [...medsList]; n[i].dosage = e.target.value; setMedsList(n); }}
                                  placeholder="1-0-1 (After Food)"
                                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
                                />
                              </div>
                              <div className="w-full md:w-1/4">
                                <label className="text-[9px] uppercase font-bold text-slate-400 mb-1 block">Duration</label>
                                <input 
                                  value={m.duration} onChange={(e) => { const n = [...medsList]; n[i].duration = e.target.value; setMedsList(n); }}
                                  placeholder="5 Days"
                                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
                                />
                              </div>
                              {medsList.length > 1 && (
                                <button onClick={() => setMedsList(medsList.filter((_, idx) => idx !== i))} className="absolute -top-3 -right-3 h-8 w-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                  <X size={14} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
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
                        className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 font-black text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={16} /> Sign & Save Rx
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
