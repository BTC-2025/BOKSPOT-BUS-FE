'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Ticket, Activity, Users, Settings, LogOut as LogOutIcon, Sparkles, User, ChevronDown, UserCog } from 'lucide-react';
import { useVendorStore } from '../../lib/store';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logoutMerchant } = useVendorStore();
  
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { href: '/admin', icon: Activity, label: 'Overview' },
    { href: '/admin/tickets', icon: Ticket, label: 'Support Tickets' },
    { href: '/admin/users', icon: Users, label: 'Manage Users' },
    { href: '/admin/settings', icon: Settings, label: 'Platform Settings' },
  ];

  const handleLogout = () => {
    logoutMerchant();
    router.push('/');
  };

  return (
    <div className="flex flex-col h-screen bg-bg-primary font-sans text-text-primary overflow-hidden">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between vendor-navbar px-6 shadow-md border-b border-border-brand/40 shrink-0 backdrop-blur-md">
        
        {/* Left Column: Logo & Badge */}
        <div className="flex-1 flex items-center gap-4">
          <Link href="/admin" className="flex items-center hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shrink-0">
            <img src="/logo.png?v=3" alt="BokSpot Logo" className="h-10 lg:h-12 object-contain" />
          </Link>
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 shadow-sm select-none hidden md:block">
            Super Admin Console
          </span>
        </div>

        {/* Center Column: Navigation Links */}
        <div className="hidden lg:flex flex-none justify-center">
          <nav className="custom-nav-capsule shadow-lg relative flex">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-36 text-center py-1 text-[13px] font-extrabold tracking-wide hover:scale-[1.02] active:scale-[0.98] relative z-10 custom-nav-link flex items-center justify-center gap-1.5 ${
                    isActive 
                      ? 'custom-nav-link-active' 
                      : 'custom-nav-link-inactive'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeAdminNavIndicator"
                      className="absolute inset-0 rounded-full bg-[#8b6508]/20 border border-[#8b6508]/45 shadow-[0_0_12px_rgba(255,215,0,0.15)] backdrop-blur-md -z-10 custom-nav-active-bg"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <item.icon size={14} className={isActive ? 'text-white' : 'text-slate-400'} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Column: Profile Dropdown */}
        <div className="flex-1 flex items-center justify-end gap-4">
          <div className="relative animate-fade-in" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-full border border-white/25 hover:border-white/40 bg-white/10 hover:bg-white/20 px-3.5 py-1.5 text-xs font-bold text-white hover:text-white transition-all cursor-pointer select-none shadow-md"
              aria-label="Toggle profile menu"
              title="Admin Profile Settings"
            >
              <div className="h-5 w-5 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                <Shield size={12} strokeWidth={2.5} className="text-indigo-500" />
              </div>
              <span>System Admin</span>
              <ChevronDown className={`h-3 w-3 text-white transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-[320px] bg-bg-secondary rounded-2xl shadow-2xl border border-border-brand z-50 overflow-hidden animate-fade-in text-left profile-dropdown-card">
                {/* Profile Header */}
                <div className="px-6 py-4 flex flex-col items-center min-w-0 text-center bg-bg-secondary">
                  <div className="relative mb-2">
                    <div className="h-14 w-14 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center text-2xl font-bold">
                      A
                    </div>
                    <button className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm hover:bg-slate-50">
                      <Shield size={10} className="text-indigo-500" />
                    </button>
                  </div>
                  <span className="font-extrabold text-[15px] truncate max-w-full text-text-primary capitalize">
                    System Admin
                  </span>
                  <span className="text-xs text-indigo-400 mt-0.5 font-bold uppercase tracking-widest truncate max-w-full">
                    God Mode
                  </span>
                  
                  <Link 
                    href="/admin/settings" 
                    onClick={() => setProfileOpen(false)}
                    className="mt-3 px-4 py-1.5 flex items-center justify-center gap-2 rounded-full border border-border-brand text-sm font-semibold text-text-secondary hover:bg-white/5 transition-colors"
                  >
                    <UserCog className="h-4 w-4" />
                    <span>Manage your account</span>
                  </Link>
                </div>

                <div className="border-t border-border-brand py-1">
                  <button 
                    onClick={() => {
                      setProfileOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-4 px-6 py-2 hover:bg-red-500/10 transition-colors text-left cursor-pointer"
                  >
                    <LogOutIcon className="h-5 w-5 text-red-400 shrink-0" />
                    <span className="text-[13px] font-semibold text-red-400">Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
        {/* Subtle Background Gradients */}
        <div className="absolute top-[-30%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#0a3161]/8 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#8b6508]/6 blur-[120px] pointer-events-none" />
        
        {/* Clean Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-[0.02]" />
        
        <div className="relative z-10 max-w-7xl mx-auto animate-fade-up">
          {children}
        </div>
      </main>

    </div>
  );
}
