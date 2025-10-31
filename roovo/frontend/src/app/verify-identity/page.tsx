"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/services/api';
import { API_BASE_URL } from '@/services/api';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { ArrowRight } from 'lucide-react';

const VerifyIdentityPage = () => {
  const router = useRouter();
  const [aadharFile, setAadharFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kycComplete, setKycComplete] = useState(false);

  useEffect(() => {
    const checkKyc = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data, error } = await supabase
          .from('kyc')
          .select('id')
          .eq('user_id', session.user.id)
          .single();
        if (data) {
          setKycComplete(true);
        }
      }
    };
    checkKyc();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aadharFile || !selfieFile) {
      setError('Please upload both documents.');
      return;
    }

    setLoading(true);
    setError(null);

    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const formData = new FormData();
      formData.append('aadhar', aadharFile);
      formData.append('selfie', selfieFile);

      try {
        const response = await fetch(`${API_BASE_URL}/api/kyc/${session.user.id}`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload documents.');
        }

        router.push('/profile');
      } catch (error) {
        setError('An error occurred during the KYC process.');
        console.error('Error processing KYC:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (kycComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold">KYC Already Completed</h1>
          <p className="mt-2 text-gray-600">Your identity has already been verified.</p>
          <button onClick={() => router.push('/')} className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-lg">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Verify Your Identity</h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Aadhar Card</label>
            <input
              type="file"
              onChange={(e) => setAadharFile(e.target.files ? e.target.files[0] : null)}
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Selfie</label>
            <input
              type="file"
              onChange={(e) => setSelfieFile(e.target.files ? e.target.files[0] : null)}
              className="mt-1 block w-full"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? <Spinner /> : 'Complete Identity Verification'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyIdentityPage;
