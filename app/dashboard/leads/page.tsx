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
import { Plus, Search, Sparkles } from 'lucide-react';

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

type LeadAnalysis = {
  score: number;
  priority: string;
  reasons: string[];
  recommended_action: string;
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

  // analysis states
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<LeadAnalysis | null>(null);
  const [analyzedLead, setAnalyzedLead] = useState<Lead | null>(null);
  const [analysisOpen, setAnalysisOpen] = useState(false);

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
    setForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'new',
      source: '',
      notes: '',
    });
    setOpen(false);
    fetchLeads();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('leads').delete().eq('id', id);
    fetchLeads();
  };

  const handleAnalyze = async (lead: Lead) => {
  setAnalyzing(lead.id);
  setAnalyzedLead(lead);
  setAnalysisOpen(true);
  setAnalysis(null);

  try {
    const res = await fetch('/api/analyze-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead }),
    });

    const data = await res.json();

    // make sure all fields exist
    setAnalysis({
      score: data.score || 50,
      priority: data.priority || 'Medium',
      reasons: Array.isArray(data.reasons) ? data.reasons : ['Lead data analyzed'],
      recommended_action: data.recommended_action || 'Follow up with the lead',
    });
  } catch (err) {
    console.error(err);
    setAnalysis({
      score: 50,
      priority: 'Medium',
      reasons: ['Could not analyze lead at this time'],
      recommended_action: 'Please try again later',
    });
  }

  setAnalyzing(null);
};

  const filtered = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Leads
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage your potential clients
          </p>
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
                    onChange={(e) =>
                      setForm({ ...form, [field]: e.target.value })
                    }
                  />
                </div>
              ))}
              <div>
                <Label>Status</Label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm mt-1 dark:bg-slate-700 dark:text-white"
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                >
                  {['new', 'contacted', 'interested', 'closed', 'lost'].map(
                    (s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div>
                <Label>Notes</Label>
                <Input
                  placeholder="Any notes..."
                  value={form.notes}
                  onChange={(e) =>
                    setForm({ ...form, notes: e.target.value })
                  }
                />
              </div>
              <Button
                onClick={handleSubmit}
                className="w-full bg-slate-900 text-white"
              >
                Save Lead
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* AI Analysis Dialog */}
      <Dialog open={analysisOpen} onOpenChange={setAnalysisOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles size={18} className="text-purple-500" />
              AI Lead Analysis
            </DialogTitle>
          </DialogHeader>

          {analyzedLead && (
            <p className="text-sm text-gray-500 -mt-2">
              Analyzing:{' '}
              <span className="font-medium text-slate-800 dark:text-white">
                {analyzedLead.name}
              </span>
            </p>
          )}

          {!analysis ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-400">
                Analyzing lead with AI...
              </p>
            </div>
          ) : (
            <div className="space-y-4 mt-2">
              {/* Score */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-700">
                <div>
                  <p className="text-xs text-gray-400">Lead Score</p>
                  <p className="text-3xl font-bold text-slate-800 dark:text-white">
                    {analysis.score}
                    <span className="text-lg text-gray-400">/100</span>
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    analysis.priority === 'High'
                      ? 'bg-green-100 text-green-700'
                      : analysis.priority === 'Medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {analysis.priority} Priority
                </span>
              </div>

              {/* Score bar */}
              <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    analysis.score >= 70
                      ? 'bg-green-500'
                      : analysis.score >= 40
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${analysis.score}%` }}
                />
              </div>

              {/* Reasons */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Reasons
                </p>
                <ul className="space-y-1.5">
                  {analysis.reasons.map((reason, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-200"
                    >
                      <span className="text-green-500 mt-0.5">✓</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Action */}
              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800">
                <p className="text-xs font-semibold text-purple-600 mb-1">
                  Recommended Action
                </p>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  {analysis.recommended_action}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
            <thead className="bg-gray-50 dark:bg-slate-700 border-b">
              <tr>
                {[
                  'Name',
                  'Email',
                  'Phone',
                  'Company',
                  'Source',
                  'Status',
                  'Actions',
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-gray-500 dark:text-slate-300 font-medium"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-8 text-gray-400"
                  >
                    No leads yet. Add your first one!
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">
                      {lead.name}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-slate-300">
                      {lead.email}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-slate-300">
                      {lead.phone}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-slate-300">
                      {lead.company}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-slate-300">
                      {lead.source}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          statusColors[lead.status] ||
                          'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleAnalyze(lead)}
                          disabled={analyzing === lead.id}
                          className="flex items-center gap-1 text-purple-500 hover:text-purple-700 text-xs font-medium"
                        >
                          <Sparkles size={12} />
                          Analyze
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="text-red-400 hover:text-red-600 text-xs"
                        >
                          Delete
                        </button>
                      </div>
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