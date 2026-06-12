'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Search } from 'lucide-react';

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  source: string;
  notes: string;
  created_at: string;
};

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  interested: 'bg-purple-100 text-purple-700',
  closed: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700',
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'new',
    source: '',
    notes: '',
  });

  const fetchLeads = async () => {
    const { data } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    setLeads(data || []);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSubmit = async () => {
    if (!form.name) return;
    await supabase.from('leads').insert([form]);
    setForm({ name: '', email: '', phone: '', company: '', status: 'new', source: '', notes: '' });
    setOpen(false);
    fetchLeads();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('leads').delete().eq('id', id);
    fetchLeads();
  };

  const filtered = leads.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Leads</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your potential clients</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 hover:bg-slate-700 text-white gap-2">
              <Plus size={16} /> Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              {['name', 'email', 'phone', 'company', 'source'].map((field) => (
                <div key={field}>
                  <Label className="capitalize">{field}</Label>
                  <Input
                    placeholder={field}
                    value={form[field as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  />
                </div>
              ))}
              <div>
                <Label htmlFor="lead-status">Status</Label>
                <select
                  id="lead-status"
                  className="w-full border rounded-md px-3 py-2 text-sm mt-1"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {['new', 'contacted', 'interested', 'closed', 'lost'].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Notes</Label>
                <Input
                  placeholder="Any notes..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
              <Button onClick={handleSubmit} className="w-full bg-slate-900 text-white">
                Save Lead
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        <Input
          placeholder="Search leads..."
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
                {['Name', 'Email', 'Phone', 'Company', 'Source', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    No leads yet. Add your first one!
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{lead.name}</td>
                    <td className="px-4 py-3 text-gray-500">{lead.email}</td>
                    <td className="px-4 py-3 text-gray-500">{lead.phone}</td>
                    <td className="px-4 py-3 text-gray-500">{lead.company}</td>
                    <td className="px-4 py-3 text-gray-500">{lead.source}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[lead.status] || 'bg-gray-100 text-gray-600'}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(lead.id)}
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