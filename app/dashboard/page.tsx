'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Users, Phone, TrendingUp, UserCheck } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const areaData = [
  { month: 'Jan', leads: 30, calls: 20 },
  { month: 'Feb', leads: 45, calls: 35 },
  { month: 'Mar', leads: 60, calls: 50 },
  { month: 'Apr', leads: 40, calls: 30 },
  { month: 'May', leads: 80, calls: 65 },
  { month: 'Jun', leads: 100, calls: 80 },
];

const COLORS = ['#0f172a', '#3b82f6', '#10b981', '#f59e0b'];

export default function DashboardPage() {
  const [leadCount, setLeadCount] = useState(0);
  const [callCount, setCallCount] = useState(0);
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const { count: leads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });

      const { count: calls } = await supabase
        .from('calls')
        .select('*', { count: 'exact', head: true });

      const { data: statusData } = await supabase
        .from('leads')
        .select('status');

      setLeadCount(leads || 0);
      setCallCount(calls || 0);

      if (statusData) {
        const counts: Record<string, number> = {};
        statusData.forEach(({ status }) => {
          counts[status] = (counts[status] || 0) + 1;
        });
        setPieData(
          Object.entries(counts).map(([name, value]) => ({ name, value }))
        );
      }
    };

    fetchStats();
  }, []);

  const stats = [
    { label: 'Total Leads', value: leadCount, icon: Users, color: 'text-blue-600' },
    { label: 'Total Calls', value: callCount, icon: Phone, color: 'text-green-600' },
    { label: 'Converted', value: 0, icon: UserCheck, color: 'text-purple-600' },
    { label: 'In Progress', value: 0, icon: TrendingUp, color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="p-5 flex items-center gap-4">
            <div className={`${color} bg-gray-100 p-3 rounded-xl`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-2xl font-bold text-slate-800">{value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Leads & Calls Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={areaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="leads" stroke="#0f172a" fill="#e2e8f0" strokeWidth={2} />
              <Area type="monotone" dataKey="calls" stroke="#3b82f6" fill="#dbeafe" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Lead Status Breakdown</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400 text-sm">
              No lead data yet
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}