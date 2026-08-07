'use client';

import { useVendorStore, PRESET_MERCHANTS } from '../../lib/store';
import { Ticket, CheckCircle2, Clock, ShieldAlert, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect } from 'react';

export default function AdminOverviewPage() {
  const { supportTickets, resolveSupportTicket, customMerchants, fetchSupportTickets } = useVendorStore();

  useEffect(() => {
    fetchSupportTickets();
  }, [fetchSupportTickets]);

  const totalTickets = supportTickets.length;
  const openTickets = supportTickets.filter(t => t.status === 'open').length;
  const resolvedTickets = supportTickets.filter(t => t.status === 'resolved').length;

  return (
    <div className="space-y-8 animate-fade-in text-text-primary">
      
      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-bg-secondary p-6 rounded-2xl shadow-sm border border-border-brand flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Ticket size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Total Tickets</p>
            <h3 className="text-3xl font-black text-text-primary">{totalTickets}</h3>
          </div>
        </div>

        <div className="bg-bg-secondary p-6 rounded-2xl shadow-sm border border-border-brand flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Open Issues</p>
            <h3 className="text-3xl font-black text-amber-500">{openTickets}</h3>
          </div>
        </div>

        <div className="bg-bg-secondary p-6 rounded-2xl shadow-sm border border-border-brand flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Resolved</p>
            <h3 className="text-3xl font-black text-emerald-400">{resolvedTickets}</h3>
          </div>
        </div>
      </div>

      {/* Ticket List */}
      <div className="bg-bg-secondary rounded-3xl border border-border-brand shadow-sm overflow-hidden backdrop-blur-sm">
        <div className="p-6 border-b border-border-brand/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert size={20} className="text-indigo-400" />
            <h2 className="text-lg font-black text-text-primary">Recent Support Tickets</h2>
          </div>
        </div>
        
        <div className="divide-y divide-border-brand/20">
          {supportTickets.length === 0 ? (
            <div className="p-12 text-center text-text-secondary font-medium">
              No support tickets found in the system.
            </div>
          ) : (
            supportTickets.map((ticket) => {
              // Lookup merchant info
              const merchantData = PRESET_MERCHANTS.find(m => m.id === ticket.merchantId) || customMerchants[ticket.merchantId] || {};
              const accountId = merchantData.vendorId || ticket.merchantId;

              return (
              <div key={ticket.id} className="p-6 hover:bg-white/5 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                
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
                    <p className="text-sm text-text-secondary mt-1 line-clamp-2">{ticket.message}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2">
                    <div className="h-6 w-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                      {ticket.merchantName ? ticket.merchantName.charAt(0) : 'A'}
                    </div>
                    <span className="text-xs font-bold text-text-primary">{ticket.merchantName || 'BOKSPOT Admin'}</span>
                    <span className="text-xs text-text-muted">({accountId || 'SYSTEM'})</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  {ticket.status === 'open' && (
                    <button 
                      onClick={() => resolveSupportTicket(ticket.id)}
                      className="shrink-0 flex items-center gap-2 px-4 py-2 bg-[#8b6508] hover:brightness-110 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                    >
                      <CheckCircle2 size={16} />
                      Mark Resolved
                    </button>
                  )}
                  
                  {ticket.status === 'resolved' && (
                    <div className="shrink-0 flex items-center gap-1.5 text-emerald-400 font-bold text-xs bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                      <CheckCircle2 size={14} />
                      Resolved
                    </div>
                  )}

                  {ticket.status === 'pending' && (
                    <div className="shrink-0 flex items-center gap-1.5 text-blue-400 font-bold text-xs bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
                      <Clock size={14} />
                      Pending
                    </div>
                  )}

                  <a href="/admin/tickets" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-text-primary rounded-xl text-xs font-bold transition-all">
                    View Details
                  </a>
                </div>

              </div>
            );
            })
          )}
        </div>
      </div>

    </div>
  );
}
