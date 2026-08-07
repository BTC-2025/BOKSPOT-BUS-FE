'use client';

import { useVendorStore, PRESET_MERCHANTS } from '../../../lib/store';
import { Ticket, Search, Filter, ShieldAlert, CheckCircle2, ChevronDown, ChevronUp, User, Mail, Building2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';

export default function SupportTicketsPage() {
  const { supportTickets, resolveSupportTicket, updateSupportTicketStatus, customMerchants, fetchSupportTickets } = useVendorStore();
  
  useEffect(() => {
    fetchSupportTickets();
  }, [fetchSupportTickets]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'pending' | 'resolved'>('all');
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);

  const filteredTickets = supportTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ticket.merchantName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in text-text-primary">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">Support Tickets</h1>
          <p className="text-sm text-text-secondary">Manage and resolve issues reported by merchants.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search tickets..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-bg-secondary border border-border-brand rounded-xl text-sm w-full sm:w-64 focus:outline-none focus:border-[#8b6508] transition-colors"
            />
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 bg-bg-secondary border border-border-brand rounded-xl text-sm focus:outline-none focus:border-[#8b6508] appearance-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="open">Open Issues</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="bg-bg-secondary rounded-3xl border border-border-brand shadow-sm overflow-hidden backdrop-blur-sm">
        <div className="p-6 border-b border-border-brand/40 flex items-center gap-3">
          <Ticket size={20} className="text-amber-500" />
          <h2 className="text-lg font-black text-text-primary">Ticket Queue</h2>
        </div>
        
        <div className="divide-y divide-border-brand/20">
          {filteredTickets.length === 0 ? (
            <div className="p-12 text-center text-text-secondary font-medium">
              No support tickets found matching your criteria.
            </div>
          ) : (
            filteredTickets.map((ticket) => {
              const isExpanded = expandedTicket === ticket.id;
              
              // Lookup merchant info
              const merchantData = PRESET_MERCHANTS.find(m => m.id === ticket.merchantId) || customMerchants[ticket.merchantId] || {};
              const accountId = merchantData.vendorId || ticket.merchantId;
              const email = merchantData.email || `${(ticket.merchantName || 'admin').toLowerCase().replace(/\s+/g, '')}@example.com`;
              const businessType = merchantData.category || 'Service & Resource';

              return (
                <div key={ticket.id} className="flex flex-col border-b border-white/5 last:border-0">
                  <div 
                    onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}
                    className="p-6 hover:bg-white/5 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-6 cursor-pointer"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                          ticket.status === 'open' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                          ticket.status === 'pending' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {ticket.status}
                        </span>
                        <span className="text-xs font-bold text-text-muted">ID: {ticket.id.toUpperCase()}</span>
                        <span className="text-xs font-medium text-text-muted">
                          {format(new Date(ticket.createdAt), 'MMM d, yyyy - h:mm a')}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="text-base font-black text-text-primary">{ticket.subject}</h3>
                        {!isExpanded && <p className="text-sm text-text-secondary mt-1 max-w-3xl line-clamp-1">{ticket.message}</p>}
                      </div>
                      
                      {!isExpanded && (
                        <div className="flex items-center gap-2 pt-2">
                          <div className="h-6 w-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                            {ticket.merchantName ? ticket.merchantName.charAt(0) : 'A'}
                          </div>
                          <span className="text-xs font-bold text-text-primary">{ticket.merchantName || 'BOKSPOT Admin'}</span>
                          <span className="text-xs text-text-muted">({accountId || 'SYSTEM'})</span>
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-4">
                      {ticket.status === 'resolved' && !isExpanded && (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                          <CheckCircle2 size={14} />
                          Resolved
                        </div>
                      )}
                      
                      <button className="text-xs font-bold text-indigo-400 flex items-center gap-1 hover:text-indigo-300 transition-colors">
                        {isExpanded ? (
                          <>Hide Details <ChevronUp size={16} /></>
                        ) : (
                          <>See all details <ChevronDown size={16} /></>
                        )}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-6 bg-white/[0.02] border-t border-white/5 space-y-6">
                      
                      {/* Detailed Message */}
                      <div>
                        <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Complaint Description</h4>
                        <div className="p-4 bg-bg-primary rounded-xl border border-border-brand/50 text-sm text-text-primary whitespace-pre-wrap">
                          {ticket.message}
                        </div>
                      </div>

                      {/* Business Info Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-bg-primary rounded-xl border border-border-brand/50 flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1"><User size={12} /> Account Info</span>
                          <span className="text-sm font-bold text-text-primary mt-1">{ticket.merchantName || 'BOKSPOT Admin'}</span>
                          <span className="text-xs text-indigo-400 font-mono">{accountId || 'SYSTEM'}</span>
                        </div>
                        <div className="p-4 bg-bg-primary rounded-xl border border-border-brand/50 flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1"><Mail size={12} /> Contact Email</span>
                          <span className="text-sm font-medium text-text-primary mt-1">{email}</span>
                        </div>
                        <div className="p-4 bg-bg-primary rounded-xl border border-border-brand/50 flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-1"><Building2 size={12} /> Business Type</span>
                          <span className="text-sm font-medium text-text-primary mt-1">{businessType}</span>
                        </div>
                      </div>

                      {/* Reply Box */}
                      <div className="pt-4 border-t border-border-brand/40">
                        <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">Reply to Business</h4>
                        <div className="flex gap-3">
                          <textarea 
                            placeholder={`Type your reply to ${ticket.merchantName || 'BOKSPOT Admin'}...`}
                            className="flex-1 bg-bg-primary border border-border-brand rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-[#8b6508] transition-colors min-h-[100px] resize-none"
                          />
                        </div>
                        <div className="flex items-center justify-end mt-3 gap-3">
                          <button className="px-5 py-2 bg-[#8b6508] hover:brightness-110 text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-95">
                            Send Reply
                          </button>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border-brand/40">
                        {ticket.status !== 'resolved' && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); updateSupportTicketStatus(ticket.id, 'resolved'); setExpandedTicket(null); }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:brightness-110 text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-95"
                          >
                            <CheckCircle2 size={16} />
                            Mark as Resolved
                          </button>
                        )}
                        
                        {ticket.status !== 'pending' && ticket.status !== 'resolved' && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); updateSupportTicketStatus(ticket.id, 'pending'); setExpandedTicket(null); }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-bg-primary hover:bg-white/5 border border-border-brand text-text-primary rounded-xl text-sm font-bold transition-all active:scale-95"
                          >
                            <Clock size={16} />
                            Mark Pending
                          </button>
                        )}
                        
                        {ticket.status !== 'open' && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); updateSupportTicketStatus(ticket.id, 'open'); }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-bg-primary hover:bg-amber-500/10 border border-border-brand text-amber-500 rounded-xl text-sm font-bold transition-all active:scale-95"
                          >
                            Reopen Ticket
                          </button>
                        )}
                        
                        {ticket.status === 'resolved' && (
                          <div className="ml-auto flex items-center gap-2 text-emerald-400 font-bold text-sm bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
                            <CheckCircle2 size={16} />
                            Issue Resolved
                          </div>
                        )}
                        
                        {ticket.status === 'pending' && (
                          <div className="ml-auto flex items-center gap-2 text-amber-500 font-bold text-sm bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20">
                            <Clock size={16} />
                            Pending Business Reply
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
