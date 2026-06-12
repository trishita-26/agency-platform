'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Search, Phone } from 'lucide-react';

type Call = {
  id: string;
  lead_name: string;
  duration: string;
  notes: string;
  status: string;
  created_at: string;
};

const statusColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  missed: 'bg-red-100 text-red-700',
  scheduled: 'bg-blue-100 text-blue-700',
};

export default function CallsPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    lead_name: '',
    duration: '',
    notes: '',
    status: 'completed',
  });

  const fetchCalls = async () => {
    const { data } = await supabase
      .from('calls')
      .select('*')
      .order('created_at', { ascending: false });
    setCalls(data || []);
  };

  useEffect(() => {
    fetchCalls();
  }, []);

  const handleSubmit = async () => {
    if (!form.lead_name) return;
    await supabase.from('calls').insert([form]);
    setForm({ lead_name: '', duration: '', notes: '', status: 'completed' });
    setOpen(false);
    fetchCalls();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('calls').delete().eq('id', id);
    fetchCalls();
  };

  const filtered = calls.filter((c) =>
    c.lead_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Calls</h2>
          <p className="text-gray-500 text-sm mt-1">Track all your client calls</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 hover:bg-slate-700 text-white gap-2">
              <Plus size={16} /> Log Call
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log a Call</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <div>
                <Label>Lead Name</Label>
                <Input
                  placeholder="Who did you call?"
                  value={form.lead_name}
                  onChange={(e) => setForm({ ...form, lead_name: e.target.value })}
                />
              </div>
              <div>
                <Label>Duration</Label>
                <Input
                  placeholder="e.g. 10 mins"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                />
              </div>
              <div>
                <Label>Status</Label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm mt-1"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {['completed', 'missed', 'scheduled'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Notes</Label>
                <Input
                  placeholder="What was discussed?"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
              <Button onClick={handleSubmit} className="w-full bg-slate-900 text-white">
                Save Call
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        <Input
          placeholder="Search calls..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Lead Name', 'Duration', 'Status', 'Notes', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    No calls logged yet. Log your first one!
                  </td>
                </tr>
              ) : (
                filtered.map((call) => (
                  <tr key={call.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-400" />
                        {call.lead_name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{call.duration}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[call.status] || 'bg-gray-100 text-gray-600'}`}>
                        {call.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{call.notes}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(call.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(call.id)}
                        className="text-red-400 hover:text-red-600 text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}