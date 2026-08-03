'use client';

import { useState } from 'react';
import { useVendorStore, StaffMember, StaffPermissions } from '../../../lib/store';
import { 
  Users, UserPlus, Search, Star, Phone, Mail, Clock, 
  CheckCircle2, X, Plus, Trash2, Shield, Lock
} from 'lucide-react';

export default function StaffPage() {
  const { currentMerchant, staffAccounts, addStaffMember, deleteStaffMember, updateStaffPermissions, loginRole } = useVendorStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Filter for current merchant only
  const merchantStaff = staffAccounts.filter(s => s.merchantId === currentMerchant?.id);

  // Form states
  const [subIdEmail, setSubIdEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newIsDoctor, setNewIsDoctor] = useState(false);
  const [newPassword, setNewPassword] = useState('pass123'); // Default dummy password for sub-id
  
  const [permissions, setPermissions] = useState<StaffPermissions>({
    canManageVitals: false,
    canAddPrescription: false,
    canManageBilling: false,
    canManageAppointments: false
  });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subIdEmail.trim() || !newName.trim() || !newRole.trim() || !currentMerchant) return;

    const newMember: StaffMember = {
      id: subIdEmail.trim().toLowerCase(),
      merchantId: currentMerchant.id,
      name: newName,
      roleTitle: newRole,
      isDoctor: newIsDoctor,
      passwordHash: newPassword, // In a real app this would be securely handled
      permissions: { ...permissions }
    };

    addStaffMember(newMember);
    setShowAddModal(false);
    
    // Reset form
    setSubIdEmail('');
    setNewName('');
    setNewRole('');
    setNewIsDoctor(false);
    setPermissions({
      canManageVitals: false,
      canAddPrescription: false,
      canManageBilling: false,
      canManageAppointments: false
    });
  };

  const filteredStaff = merchantStaff.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.roleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!currentMerchant) {
    return <div className="text-center text-text-secondary py-12">Loading staff dashboard...</div>;
  }

  // ONLY THE BUSINESS OWNER (Vendor) can manage staff
  if (loginRole === 'staff') {
    return (
      <div className="flex h-full flex-col items-center justify-center text-text-secondary space-y-4">
        <Lock size={48} className="text-amber-500/50" />
        <h2 className="text-xl font-bold text-text-primary">Access Restricted</h2>
        <p className="text-sm">Only the verified Business Owner can access the Staff Management portal.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-text-primary flex items-center gap-2">
            <Shield size={24} className="text-[#8b6508]" /> Staff Access Control
          </h1>
          <p className="text-xs text-text-secondary">Grant access to existing Sub-IDs and configure Role-Based Access for your portal.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8b6508] to-[#d4af37] hover:brightness-110 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-md cursor-pointer"
        >
          <UserPlus size={15} />
          <span>Grant Access</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="rounded-xl border border-border-brand bg-bg-secondary p-4">
        <div className="relative">
          <input 
            type="text"
            placeholder="Search by name, role or sub-id email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-border-brand bg-bg-tertiary/20 pl-10 pr-4 py-2 text-xs text-text-primary outline-none focus:border-[#8b6508] transition-all"
          />
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        </div>
      </div>

      {/* Staff list card */}
      <div className="rounded-xl border border-border-brand bg-bg-secondary overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-bg-tertiary/40 border-b border-border-brand text-[10px] uppercase font-bold tracking-wider text-text-secondary">
                <th className="py-3 px-5">Staff Member</th>
                <th className="py-3 px-5">Verified Sub-ID (Login)</th>
                <th className="py-3 px-5">Active Permissions</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-white/[0.01] transition-colors text-xs">
                  {/* Name & Role */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#8b6508]/15 border border-[#8b6508]/30 flex items-center justify-center font-bold text-[#d4af37] text-sm uppercase shrink-0">
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-text-primary flex items-center gap-2">
                          {staff.name} 
                          {staff.isDoctor && <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] px-1.5 py-0.5 rounded uppercase">Doctor</span>}
                        </div>
                        <div className="text-[10px] text-text-secondary font-medium">{staff.roleTitle}</div>
                      </div>
                    </div>
                  </td>

                  {/* Sub-ID */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-1.5 text-text-secondary font-mono text-[11px] bg-bg-tertiary/30 px-2 py-1 rounded inline-block">
                      <Mail size={11} className="inline mr-1" />
                      <span className="text-[#9cc3f5]">{staff.id}</span>
                    </div>
                  </td>

                  {/* Permissions Badges */}
                  <td className="py-4 px-5">
                    <div className="flex flex-wrap gap-1.5">
                      {staff.permissions.canManageVitals && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">Vitals</span>
                      )}
                      {staff.permissions.canAddPrescription && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase">Prescriptions</span>
                      )}
                      {staff.permissions.canManageBilling && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">Billing</span>
                      )}
                      {staff.permissions.canManageAppointments && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">Appointments</span>
                      )}
                      {!Object.values(staff.permissions).some(Boolean) && (
                        <span className="text-[10px] text-slate-500 italic">Read-only Access</span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right">
                    <button 
                      onClick={() => deleteStaffMember(staff.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Revoke Access & Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-text-secondary text-sm">
                    No staff access granted yet. Click "Grant Access" to add an existing Sub-ID.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs px-4">
          <div className="w-full max-w-lg bg-bg-secondary border border-border-brand rounded-2xl p-6 shadow-2xl space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                <Shield size={16} className="text-[#d4af37]" /> Grant Staff Access
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-text-secondary hover:text-text-primary p-1 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-4 pt-1">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Full Name</label>
                  <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Priya"
                    className="w-full rounded-lg border border-border-brand bg-bg-tertiary/20 px-3 py-2 text-xs text-text-primary outline-none focus:border-[#8b6508]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-text-secondary">Role Title</label>
                  <input 
                    type="text" 
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    placeholder="e.g. Senior Nurse"
                    className="w-full rounded-lg border border-border-brand bg-bg-tertiary/20 px-3 py-2 text-xs text-text-primary outline-none focus:border-[#8b6508]"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                <input 
                  type="checkbox" 
                  id="isDoctor"
                  checked={newIsDoctor}
                  onChange={(e) => setNewIsDoctor(e.target.checked)}
                  className="rounded border-border-brand bg-transparent text-[#8b6508] focus:ring-[#8b6508]"
                />
                <label htmlFor="isDoctor" className="text-xs font-bold text-text-primary cursor-pointer">This staff member is a Doctor</label>
              </div>

              {/* Sub-ID Generation */}
              <div className="space-y-1 p-3 rounded-xl border border-[#0a3161]/30 bg-[#0a3161]/5">
                <label className="text-[10px] uppercase font-bold text-text-secondary">Existing Sub-ID Email (BNX Mail)</label>
                <div className="flex items-center mt-1">
                  <input 
                    type="email" 
                    value={subIdEmail}
                    onChange={(e) => setSubIdEmail(e.target.value)}
                    placeholder="e.g. nurse/hospital@bnxmail.com"
                    className="w-full rounded-lg border border-border-brand bg-bg-tertiary/40 px-3 py-2 text-xs text-text-primary outline-none focus:border-[#8b6508]"
                    required
                  />
                </div>
                <p className="text-[9px] text-text-muted mt-2 leading-relaxed">
                  Enter the sub-ID email you created in your Business Mail. This will grant them access to this portal.
                </p>
              </div>

              {/* Permissions Configuration */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <label className="text-[10px] uppercase font-bold text-text-secondary">Role-Based Feature Access</label>
                
                <div className="space-y-2">
                  {/* Toggle: Vitals */}
                  <label className="flex items-center justify-between p-3 rounded-lg border border-border-brand bg-bg-tertiary/20 hover:bg-bg-tertiary/40 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="text-blue-400 bg-blue-400/10 p-1.5 rounded-md"><CheckCircle2 size={14} /></div>
                      <div>
                        <div className="text-xs font-bold text-text-primary">Manage Patient Vitals & Triage</div>
                        <div className="text-[9px] text-text-secondary">Can update BP, Temp, Pulse and view queue. (Ideal for Nurses)</div>
                      </div>
                    </div>
                    <div className={`w-8 h-4 rounded-full transition-colors relative ${permissions.canManageVitals ? 'bg-[#0a3161]' : 'bg-slate-700'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${permissions.canManageVitals ? 'left-4.5' : 'left-0.5'}`} />
                    </div>
                    {/* Hidden actual checkbox to control state */}
                    <input type="checkbox" className="hidden" checked={permissions.canManageVitals} onChange={(e) => setPermissions({...permissions, canManageVitals: e.target.checked})} />
                  </label>

                  {/* Toggle: Prescriptions */}
                  <label className="flex items-center justify-between p-3 rounded-lg border border-border-brand bg-bg-tertiary/20 hover:bg-bg-tertiary/40 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="text-purple-400 bg-purple-400/10 p-1.5 rounded-md"><Plus size={14} /></div>
                      <div>
                        <div className="text-xs font-bold text-text-primary">Write Prescriptions & EMR</div>
                        <div className="text-[9px] text-text-secondary">Can add medicines, view medical reports. (Ideal for Sub-Doctors)</div>
                      </div>
                    </div>
                    <div className={`w-8 h-4 rounded-full transition-colors relative ${permissions.canAddPrescription ? 'bg-[#0a3161]' : 'bg-slate-700'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${permissions.canAddPrescription ? 'left-4.5' : 'left-0.5'}`} />
                    </div>
                    <input type="checkbox" className="hidden" checked={permissions.canAddPrescription} onChange={(e) => setPermissions({...permissions, canAddPrescription: e.target.checked})} />
                  </label>

                  {/* Toggle: Billing */}
                  <label className="flex items-center justify-between p-3 rounded-lg border border-border-brand bg-bg-tertiary/20 hover:bg-bg-tertiary/40 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="text-emerald-400 bg-emerald-400/10 p-1.5 rounded-md"><Star size={14} /></div>
                      <div>
                        <div className="text-xs font-bold text-text-primary">View Financials & Earnings</div>
                        <div className="text-[9px] text-text-secondary">Can see revenue KPIs and billing. (Ideal for Accountants)</div>
                      </div>
                    </div>
                    <div className={`w-8 h-4 rounded-full transition-colors relative ${permissions.canManageBilling ? 'bg-[#0a3161]' : 'bg-slate-700'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${permissions.canManageBilling ? 'left-4.5' : 'left-0.5'}`} />
                    </div>
                    <input type="checkbox" className="hidden" checked={permissions.canManageBilling} onChange={(e) => setPermissions({...permissions, canManageBilling: e.target.checked})} />
                  </label>
                  
                  {/* Toggle: Appointments */}
                  <label className="flex items-center justify-between p-3 rounded-lg border border-border-brand bg-bg-tertiary/20 hover:bg-bg-tertiary/40 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="text-amber-400 bg-amber-400/10 p-1.5 rounded-md"><Clock size={14} /></div>
                      <div>
                        <div className="text-xs font-bold text-text-primary">Manage Bookings/Appointments</div>
                        <div className="text-[9px] text-text-secondary">Can approve/cancel/check-in slots. (Ideal for Receptionists)</div>
                      </div>
                    </div>
                    <div className={`w-8 h-4 rounded-full transition-colors relative ${permissions.canManageAppointments ? 'bg-[#0a3161]' : 'bg-slate-700'}`}>
                      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${permissions.canManageAppointments ? 'left-4.5' : 'left-0.5'}`} />
                    </div>
                    <input type="checkbox" className="hidden" checked={permissions.canManageAppointments} onChange={(e) => setPermissions({...permissions, canManageAppointments: e.target.checked})} />
                  </label>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-white/5">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-text-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#8b6508] to-[#d4af37] text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md cursor-pointer"
                >
                  Grant Access & Configure Permissions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
