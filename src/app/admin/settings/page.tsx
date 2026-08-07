'use client';

import { Settings, Save, Bell, Shield, Globe, Database } from 'lucide-react';
import { useState } from 'react';

export default function PlatformSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="space-y-8 animate-fade-in text-text-primary">
      
      <div>
        <h1 className="text-2xl font-black">Platform Settings</h1>
        <p className="text-sm text-text-secondary">Manage global configurations for BOKSPOT.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Settings Navigation */}
        <div className="lg:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left font-bold text-sm ${
              activeTab === 'general' ? 'bg-bg-secondary border border-border-brand shadow-sm text-[#ff6325]' : 'hover:bg-white/5 text-text-secondary'
            }`}
          >
            <Globe size={18} /> General Setup
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left font-bold text-sm ${
              activeTab === 'security' ? 'bg-bg-secondary border border-border-brand shadow-sm text-[#ff6325]' : 'hover:bg-white/5 text-text-secondary'
            }`}
          >
            <Shield size={18} /> Security & Roles
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left font-bold text-sm ${
              activeTab === 'notifications' ? 'bg-bg-secondary border border-border-brand shadow-sm text-[#ff6325]' : 'hover:bg-white/5 text-text-secondary'
            }`}
          >
            <Bell size={18} /> Notifications
          </button>
          <button 
            onClick={() => setActiveTab('backups')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left font-bold text-sm ${
              activeTab === 'backups' ? 'bg-bg-secondary border border-border-brand shadow-sm text-[#ff6325]' : 'hover:bg-white/5 text-text-secondary'
            }`}
          >
            <Database size={18} /> Backups
          </button>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-2">
          <div className="bg-bg-secondary rounded-3xl border border-border-brand shadow-sm overflow-hidden backdrop-blur-sm p-6 space-y-6">
            
            {activeTab === 'general' && (
              <>
                <div className="flex items-center gap-3 border-b border-border-brand/40 pb-4">
                  <Settings size={20} className="text-[#8b6508]" />
                  <h2 className="text-lg font-black text-text-primary">General Configuration</h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Platform Name</label>
                    <input 
                      type="text" 
                      defaultValue="BOKSPOT Global"
                      className="w-full bg-bg-primary border border-border-brand rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-[#ff6325] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">Support Email</label>
                    <input 
                      type="email" 
                      defaultValue="support@bokspot.com"
                      className="w-full bg-bg-primary border border-border-brand rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-[#ff6325] transition-colors"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-border-brand/40 bg-white/5">
                    <div>
                      <div className="font-bold text-sm">Maintenance Mode</div>
                      <div className="text-xs text-text-muted">Temporarily disable public access.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff6325]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-border-brand/40 bg-white/5">
                    <div>
                      <div className="font-bold text-sm">Require Business Verification</div>
                      <div className="text-xs text-text-muted">All new merchants must be manually approved.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff6325]"></div>
                    </label>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'security' && (
              <>
                <div className="flex items-center gap-3 border-b border-border-brand/40 pb-4">
                  <Shield size={20} className="text-indigo-400" />
                  <h2 className="text-lg font-black text-text-primary">Security & Roles</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border-brand/40 bg-white/5">
                    <div>
                      <div className="font-bold text-sm">Two-Factor Authentication</div>
                      <div className="text-xs text-text-muted">Require 2FA for all Admin accounts.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                    </label>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'notifications' && (
              <>
                <div className="flex items-center gap-3 border-b border-border-brand/40 pb-4">
                  <Bell size={20} className="text-amber-500" />
                  <h2 className="text-lg font-black text-text-primary">Global Notifications</h2>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-widest">System Announcement</label>
                    <textarea 
                      placeholder="Type an announcement to broadcast to all users..."
                      className="w-full bg-bg-primary border border-border-brand rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-[#ff6325] transition-colors min-h-[100px]"
                    />
                  </div>
                  <button className="px-4 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold rounded-lg text-sm hover:bg-amber-500/20 transition-colors">
                    Broadcast Message
                  </button>
                </div>
              </>
            )}

            {activeTab === 'backups' && (
              <>
                <div className="flex items-center gap-3 border-b border-border-brand/40 pb-4">
                  <Database size={20} className="text-emerald-400" />
                  <h2 className="text-lg font-black text-text-primary">Database Backups</h2>
                </div>
                <div className="space-y-4">
                  <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-center space-y-3">
                    <Database size={32} className="mx-auto text-emerald-400" />
                    <div>
                      <div className="font-bold text-text-primary">Last Backup: Today at 2:00 AM</div>
                      <div className="text-xs text-text-muted mt-1">Total size: 2.4 GB</div>
                    </div>
                    <button className="mt-2 px-6 py-2 bg-emerald-500 hover:brightness-110 text-white font-bold rounded-lg text-sm transition-all shadow-md active:scale-95">
                      Run Manual Backup
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="pt-4 flex justify-end border-t border-border-brand/20 mt-4">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#ff6325] to-[#ff8c3a] text-white font-bold rounded-xl text-sm hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSaving ? (
                  <span className="animate-pulse">Saving...</span>
                ) : (
                  <>
                    <Save size={16} /> Save Changes
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
