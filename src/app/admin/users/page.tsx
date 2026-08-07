'use client';

import { Users, Shield, MoreVertical, Search, CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';

const DUMMY_USERS = [
  { id: 'USR-1001', name: 'Karthik Raja', businessName: 'Karthik Salon & Spa', email: 'karthik@example.com', role: 'Business Owner', status: 'Active', date: 'Oct 12, 2026' },
  { id: 'USR-1002', name: 'Meena Kumari', businessName: '-', email: 'meena@example.com', role: 'Customer', status: 'Active', date: 'Oct 14, 2026' },
  { id: 'USR-1003', name: 'Ramesh Singh', businessName: 'Singh Fitness Center', email: 'ramesh@example.com', role: 'Business Owner', status: 'Suspended', date: 'Nov 02, 2026' },
  { id: 'USR-1004', name: 'Anita Patel', businessName: '-', email: 'anita@example.com', role: 'Customer', status: 'Active', date: 'Nov 10, 2026' },
  { id: 'USR-1005', name: 'John Doe', businessName: '-', email: 'john@example.com', role: 'Admin', status: 'Active', date: 'Jan 01, 2025' },
];

export default function ManageUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = DUMMY_USERS.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in text-text-primary">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">Manage Users</h1>
          <p className="text-sm text-text-secondary">View and manage all registered platform users.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search users or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-bg-secondary border border-border-brand rounded-xl text-sm w-full md:w-64 focus:outline-none focus:border-[#8b6508] transition-colors"
          />
        </div>
      </div>

      <div className="bg-bg-secondary rounded-3xl border border-border-brand shadow-sm overflow-hidden backdrop-blur-sm">
        <div className="p-6 border-b border-border-brand/40 flex items-center gap-3">
          <Users size={20} className="text-indigo-400" />
          <h2 className="text-lg font-black text-text-primary">User Directory</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-border-brand/20 text-xs uppercase tracking-widest text-text-secondary font-bold">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-brand/20">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-[#8b6508]/20 flex items-center justify-center text-[#8b6508] font-bold text-sm shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm">
                          {user.name} <span className="text-[10px] text-indigo-400 font-mono ml-2 font-black tracking-wider bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">{user.id}</span>
                        </div>
                        <div className="text-xs text-text-muted mt-0.5">
                          {user.email}
                          {user.role === 'Business Owner' && (
                            <span className="ml-2 text-[#8b6508] font-semibold border-l border-border-brand/50 pl-2">
                              {user.businessName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold bg-white/5 px-2 py-1 rounded-md text-text-secondary border border-border-brand/50">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.status === 'Active' ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20 w-max">
                        <CheckCircle2 size={12} /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded-md border border-red-500/20 w-max">
                        <XCircle size={12} /> Suspended
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{user.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white/10 rounded-lg text-text-muted hover:text-text-primary transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="p-12 text-center text-text-secondary font-medium">
              No users found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
