'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';

type Lead = {
  id: string;
  name: string;
  email: string;
  company: string;
  status: string;
};

const stages = ['new', 'contacted', 'interested', 'closed', 'lost'];

const stageColors: Record<string, string> = {
  new: 'border-t-blue-500',
  contacted: 'border-t-yellow-500',
  interested: 'border-t-purple-500',
  closed: 'border-t-green-500',
  lost: 'border-t-red-500',
};

const stageBadge: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  interested: 'bg-purple-100 text-purple-700',
  closed: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700',
};

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);

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

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('leads').update({ status }).eq('id', id);
    fetchLeads();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">CRM Pipeline</h2>
        <p className="text-gray-500 text-sm mt-1">
          Move leads through your sales pipeline
        </p>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stages.map((stage) => {
          const stageLeads = leads.filter((l) => l.status === stage);
          return (
            <div key={stage} className="space-y-3">
              {/* Column Header */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${stageBadge[stage]}`}
                >
                  {stage}
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  {stageLeads.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-2 min-h-[200px]">
                {stageLeads.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center text-xs text-gray-300">
                    No leads
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <Card
                      key={lead.id}
                      className={`p-3 border-t-4 ${stageColors[stage]} hover:shadow-md transition-shadow`}
                    >
                      <p className="font-semibold text-slate-800 text-sm">
                        {lead.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {lead.company || 'No company'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {lead.email || 'No email'}
                      </p>

                      {/* Move buttons */}
                      <div className="mt-3 flex flex-wrap gap-1">
                        {stages
                          .filter((s) => s !== stage)
                          .map((s) => (
                            <button
                              key={s}
                              onClick={() => updateStatus(lead.id, s)}
                              className="text-xs px-2 py-0.5 rounded-full bg-gray-100 hover:bg-slate-900 hover:text-white transition-colors capitalize"
                            >
                              {s}
                            </button>
                          ))}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}