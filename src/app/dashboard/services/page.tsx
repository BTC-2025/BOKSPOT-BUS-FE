'use client';

import { useVendorStore, CatalogService, StaffMember } from '../../../lib/store';
import { 
  Plus, Shield, UserPlus, Clock, 
  Trash2, X, AlertCircle, Edit, CheckCircle2, ChevronRight, Mail, Key,
  MoreVertical, Briefcase, Calendar as CalIcon, Activity, Phone, MonitorPlay, Users, Settings
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getConfig } from '../../../lib/businessConfig';

export default function WorkspacePage() {
  const { currentMerchant, services, staffAccounts, addStaffMember, addService, updateService, deleteService, deleteStaffMember } = useVendorStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Modals state
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  // New Staff Form State
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('pass123');
  const [staffPhone, setStaffPhone] = useState('');

  // New Schedule Form State
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [timeSlotsInput, setTimeSlotsInput] = useState('09:00 AM, 11:00 AM, 02:00 PM, 04:30 PM');
  const [duration, setDuration] = useState('60');

  if (!currentMerchant || !mounted) {
    return (
      <div className="flex h-full min-h-[500px] items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-[#8b6508] border-t-transparent animate-spin" />
      </div>
    );
  }

  const config = getConfig(currentMerchant.category);

  const merchantStaff = staffAccounts.filter(s => s.merchantId === currentMerchant.id && s.isDoctor);
  const merchantSchedules = services.filter(s => s.merchant.toLowerCase() === currentMerchant.merchantName.toLowerCase());

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim() || !staffEmail.trim()) return;

    const newMember: StaffMember = {
      id: staffEmail.trim().toLowerCase(),
      merchantId: currentMerchant.id,
      name: staffName,
      roleTitle: staffRole || 'Staff Member',
      isDoctor: true,
      passwordHash: staffPassword,
      permissions: {
        canManageVitals: false,
        canAddPrescription: false,
        canManageBilling: false,
        canManageAppointments: true
      }
    };

    addStaffMember(newMember);
    setShowAddStaffModal(false);
    setStaffName('');
    setStaffRole('');
    setStaffEmail('');
    setStaffPhone('');
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim() || !selectedStaffId) return;

    const staffMember = staffAccounts.find(s => s.id === selectedStaffId);

    const newSchedule: CatalogService = {
      id: editingScheduleId || `sch-${Date.now()}`,
      name: serviceName.trim(),
      merchant: currentMerchant.merchantName,
      price: parseInt(consultationFee) || 0,
      duration: parseInt(duration) || 60,
      category: currentMerchant.category,
      active: true,
      rating: 5.0,
      bookingsCount: 0,
      doctorId: selectedStaffId,
      doctorName: staffMember?.name,
      timeSlots: timeSlotsInput.split(',').map(s => s.trim()).filter(Boolean)
    };

    if (editingScheduleId) {
      updateService(newSchedule);
    } else {
      addService(newSchedule);
    }
    
    setShowScheduleModal(false);
    setEditingScheduleId(null);
    setServiceName('');
    setConsultationFee('');
    setSelectedStaffId('');
    setTimeSlotsInput('09:00 AM, 11:00 AM, 02:00 PM');
  };

  const openEditSchedule = (sch: CatalogService) => {
    setEditingScheduleId(sch.id);
    setServiceName(sch.name);
    setConsultationFee(String(sch.price));
    setSelectedStaffId(sch.doctorId || '');
    setTimeSlotsInput(sch.timeSlots?.join(', ') || '09:00 AM');
    setDuration(String(sch.duration));
    setShowScheduleModal(true);
  };

  // Dummy Images logic
  const getDummyImage = (index: number) => {
    const ids = [12, 14, 25, 32, 45, 68, 89];
    return `https://i.pravatar.cc/150?img=${ids[index % ids.length]}`;
  }

  return (
    <div className="space-y-12 animate-fade-in pb-12 font-sans">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Staff & Schedules
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-2 max-w-2xl">
            Manage your staff, create resources, and assign detailed shift timings across the network.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddStaffModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-md"
          >
            <UserPlus size={16} /> Add Staff
          </button>
          <button 
            onClick={() => {
              setEditingScheduleId(null);
              setServiceName('');
              setConsultationFee('');
              setSelectedStaffId('');
              setShowScheduleModal(true);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#8b6508] hover:bg-[#6c4e06] text-white shadow-lg shadow-[#8b6508]/20 font-bold text-xs uppercase tracking-widest transition-colors"
          >
            <Plus size={16} /> New Schedule
          </button>
        </div>
      </div>

      {/* Staff Roster Grid */}
      <div>
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-6">
          <Briefcase size={20} className="text-blue-600" /> Active Staff / Resources
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {merchantStaff.map((staff, idx) => (
            <div key={staff.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-0 right-0 m-4">
                <button onClick={() => deleteStaffMember(staff.id)} className="h-8 w-8 bg-slate-50 hover:bg-red-50 hover:text-red-600 rounded-full flex items-center justify-center text-slate-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="flex flex-col items-center text-center mt-2">
                <div className="h-24 w-24 rounded-full bg-slate-100 p-1 border-2 border-slate-200 group-hover:border-[#8b6508] transition-colors mb-4 relative">
                  <img src={getDummyImage(idx)} alt={staff.name} className="h-full w-full object-cover rounded-full" />
                  <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                </div>
                <h3 className="font-black text-slate-900 text-lg">{staff.name}</h3>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1 mb-4">{staff.roleTitle}</p>
                
                <div className="w-full space-y-2 mt-2">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="flex items-center gap-1.5"><Mail size={12} /> ID</span>
                    <span className="text-slate-900 truncate max-w-[120px]">{staff.id}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-medium text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="flex items-center gap-1.5"><Activity size={12} /> Status</span>
                    <span className="text-emerald-600 font-bold">On Duty</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {merchantStaff.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
              <Users className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <span className="text-sm font-bold text-slate-700">Add New Resource</span>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Onboard resources or staff to your platform.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Consultation Schedules / Calendar */}
      <div>
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-6 mt-12">
          <CalIcon size={20} className="text-[#8b6508]" /> Resource Schedules
        </h2>

        <div className="space-y-4">
          {merchantSchedules.map(sch => {
            const staff = merchantStaff.find(d => d.id === sch.doctorId);
            return (
              <div key={sch.id} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-8 group relative overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-2 bg-[#8b6508]" />
                
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden">
                    {staff ? (
                      <img src={getDummyImage(merchantStaff.findIndex(d => d.id === staff.id))} className="h-full w-full object-cover" />
                    ) : (
                      <Settings className="text-[#8b6508]" size={20} />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Resource Management</h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Manage resources and schedules</p>
                    <p className="text-sm font-semibold text-slate-500 mt-1 flex items-center gap-2">
                      <UserPlus size={14} className="text-blue-600" /> {sch.doctorName || 'Unassigned'}
                    </p>
                  </div>
                </div>

                <div className="flex-1 w-full flex flex-col md:flex-row items-start md:items-center gap-8 justify-end">
                  <div className="grid grid-cols-2 gap-8 w-full md:w-auto text-left md:text-right">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Price</p>
                      <p className="text-xl font-black text-slate-900">₹{sch.price}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                      <p className="text-xl font-black text-slate-900">{sch.duration}m</p>
                    </div>
                  </div>

                  <div className="w-full md:w-[300px]">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Available Slots</p>
                    <div className="flex flex-wrap gap-2">
                      {sch.timeSlots?.map((time, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold hover:border-slate-400 transition-colors cursor-pointer">
                          {time}
                        </span>
                      ))}
                      {(!sch.timeSlots || sch.timeSlots.length === 0) && (
                        <span className="text-xs text-slate-400 italic">No slots defined</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => openEditSchedule(sch)} className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => deleteService(sch.id)} className="h-10 w-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
          {merchantSchedules.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white">
              <CalIcon className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">No Schedules Defined</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Create new schedules and time slots for your resources.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white shadow-2xl p-8 animate-scale-up">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Add New Staff</h3>
              <button onClick={() => setShowAddStaffModal(false)} className="h-10 w-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500 transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddStaff} className="space-y-6">
              
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block tracking-widest">Full Name</label>
                  <input required type="text" value={staffName} onChange={(e) => setStaffName(e.target.value)} placeholder="e.g. Ramesh Kumar" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block tracking-widest">Role / Department</label>
                  <input required type="text" value={staffRole} onChange={(e) => setStaffRole(e.target.value)} placeholder="e.g. Manager" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block tracking-widest">Contact Number</label>
                  <input type="tel" value={staffPhone} onChange={(e) => setStaffPhone(e.target.value)} placeholder="+91 9876543210" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 relative overflow-hidden">
                <div className="absolute right-0 top-0 p-4 opacity-10 pointer-events-none"><Shield size={64} /></div>
                <label className="text-[10px] uppercase font-black text-blue-700 mb-2 block tracking-widest">Portal Login Email</label>
                <input required type="email" value={staffEmail} onChange={(e) => setStaffEmail(e.target.value)} placeholder="staff@business.com" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                <p className="text-[10px] font-bold text-blue-600/70 mt-3 flex items-center gap-1.5"><AlertCircle size={12} /> Used by the staff to access their dashboard.</p>
              </div>

              <button type="submit" className="w-full mt-2 bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl uppercase tracking-widest text-sm transition-colors shadow-xl shadow-slate-900/20">
                Create Staff ID
              </button>
            </form>
          </div>
        </div>
      )}

      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white shadow-2xl p-8 animate-scale-up">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900">{editingScheduleId ? 'Edit Record' : 'Create Record'}</h3>
              <button onClick={() => setShowScheduleModal(false)} className="h-10 w-10 bg-slate-50 hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-500 transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveSchedule} className="space-y-6">
              
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block tracking-widest">Resource Name</label>
                  <input required type="text" value={serviceName} onChange={(e) => setServiceName(e.target.value)} placeholder="e.g. Standard Consultation" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#8b6508] focus:ring-1 focus:ring-[#8b6508] focus:bg-white transition-all" />
                </div>
                
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block tracking-widest">Pricing (₹)</label>
                  <input required type="number" value={consultationFee} onChange={(e) => setConsultationFee(e.target.value)} placeholder="500" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#8b6508] focus:ring-1 focus:ring-[#8b6508] focus:bg-white transition-all" />
                </div>
                
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block tracking-widest">Duration (Mins)</label>
                  <input required type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="60" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#8b6508] focus:ring-1 focus:ring-[#8b6508] focus:bg-white transition-all" />
                </div>
                
                <div className="col-span-2">
                  <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block tracking-widest">Assign Staff</label>
                  <select required value={selectedStaffId} onChange={(e) => setSelectedStaffId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#8b6508] focus:ring-1 focus:ring-[#8b6508] focus:bg-white transition-all appearance-none cursor-pointer">
                    <option value="">-- Select Staff --</option>
                    {merchantStaff.map(staff => (
                      <option key={staff.id} value={staff.id}>{staff.name} ({staff.roleTitle})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block tracking-widest">Available Time Slots</label>
                <textarea required value={timeSlotsInput} onChange={(e) => setTimeSlotsInput(e.target.value)} placeholder="09:00 AM, 11:30 AM" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#8b6508] focus:ring-1 focus:ring-[#8b6508] focus:bg-white transition-all min-h-[100px] resize-none" />
                <p className="text-[10px] font-bold text-slate-400 mt-2">Comma separate multiple slots.</p>
              </div>

              <button type="submit" className="w-full mt-2 bg-[#8b6508] hover:bg-[#6c4e06] text-white font-black py-4 rounded-2xl uppercase tracking-widest text-sm transition-colors shadow-xl shadow-[#8b6508]/20">
                Deploy Configuration
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
