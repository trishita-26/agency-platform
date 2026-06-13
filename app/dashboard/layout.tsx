'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Menu } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      {/* mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* sidebar */}
      <div
        className={`fixed z-30 h-full transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={22} className="text-slate-700 dark:text-white" />
          </button>
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">AgencyPro</h1>
        </div>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}