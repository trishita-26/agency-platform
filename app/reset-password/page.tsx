'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/dashboard`,
    });
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Reset Password</h1>
          <p className="text-gray-500 text-sm mt-1">
            Enter your email to receive a reset link
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-3">
            <p className="text-green-600 font-medium">✅ Reset link sent!</p>
            <p className="text-gray-500 text-sm">Check your email inbox</p>
            <Link href="/login" className="text-sm text-slate-800 underline">
              Back to login
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              onClick={handleReset}
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-700 text-white"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
            <p className="text-xs text-center">
              <Link href="/login" className="text-gray-500 hover:text-slate-800">
                Back to login
              </Link>
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}