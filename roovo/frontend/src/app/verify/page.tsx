"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import supabase from '@/services/api';
import { API_BASE_URL } from '@/services/api';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { ArrowRight } from 'lucide-react';
import { Shimmer } from '@/components/ui/shimmer';

const VerifyPage = () => {
  const router = useRouter();
  const aadharFrontInputRef = useRef<HTMLInputElement>(null);
  const aadharBackInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);
  const [aadharFrontFile, setAadharFrontFile] = useState<File | null>(null);
  const [aadharBackFile, setAadharBackFile] = useState<File | null>(null);
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
    if (!aadharFrontFile || !aadharBackFile || !selfieFile) {
      setError('Please upload all three documents.');
      return;
    }

    setLoading(true);
    setError(null);

    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const formData = new FormData();
      formData.append('aadhar_front', aadharFrontFile);
      formData.append('aadhar_back', aadharBackFile);
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
      <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Please Verify Your Identity</h1>
        <span className="block text-center text-gray-600 mt-2">This is one time process.</span>
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700">Aadhar Front</label>
              <input
                type="file"
                ref={aadharFrontInputRef}
                onChange={(e) => setAadharFrontFile(e.target.files ? e.target.files[0] : null)}
                className="hidden"
              />
              <div className="cursor-pointer flex justify-center mt-4" onClick={() => aadharFrontInputRef.current?.click()}>
                {aadharFrontFile ? (
                  <Image src={URL.createObjectURL(aadharFrontFile)} alt="Aadhar Front Preview" width={200} height={100} />
                ) : (
                  <Image src="/icons/aadhar.png" alt="Aadhar Front" width={200} height={100} />
                )}
              </div>
            </div>
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700">Aadhar Back</label>
              <input
                type="file"
                ref={aadharBackInputRef}
                onChange={(e) => setAadharBackFile(e.target.files ? e.target.files[0] : null)}
                className="hidden"
              />
              <div className="cursor-pointer flex justify-center mt-4" onClick={() => aadharBackInputRef.current?.click()}>
                {aadharBackFile ? (
                  <Image src={URL.createObjectURL(aadharBackFile)} alt="Aadhar Back Preview" width={200} height={100} />
                ) : (
                  <Image src="/icons/aadhar.png" alt="Aadhar Back" width={200} height={100} />
                )}
              </div>
            </div>
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700">Selfie</label>
              <input
                type="file"
                ref={selfieInputRef}
                onChange={(e) => setSelfieFile(e.target.files ? e.target.files[0] : null)}
                className="hidden"
              />
              <div className="cursor-pointer flex justify-center mt-4" onClick={() => selfieInputRef.current?.click()}>
                {selfieFile ? (
                  <Image src={URL.createObjectURL(selfieFile)} alt="Selfie Preview" width={200} height={100} />
                ) : (
                  <Image src="/icons/selfie.png" alt="Selfie" width={200} height={100} />
                )}
              </div>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg mt-8"
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

export default VerifyPage;
