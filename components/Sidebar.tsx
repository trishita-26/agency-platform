'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Phone,
  TrendingUp,
  LogOut,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ThemeToggle from '@/components/ThemeToggle';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/leads', label: 'Leads', icon: Users },
  { href: '/dashboard/calls', label: 'Calls', icon: Phone },
  { href: '/dashboard/crm', label: 'CRM', icon: TrendingUp },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <aside className="w-64 h-full bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">AgencyPro</h1>
        <p className="text-xs text-gray-400 mt-1">Management Platform</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === href
                ? 'bg-slate-900 text-white dark:bg-slate-600'
                : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
        <ThemeToggle />
      </div>
    </aside>
  );
}