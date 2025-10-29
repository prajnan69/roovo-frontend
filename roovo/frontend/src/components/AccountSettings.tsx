"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Bell, CreditCard, Globe, FileText, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Spinner } from './ui/shadcn-io/spinner';
import supabase from '@/services/api';

const AccountSettings = () => {
  const [activeSection, setActiveSection] = useState('personal-info');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    sessionStorage.setItem('fromHosting', 'true');
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const response = await fetch(`/api/users/${session.user.id}`);
        const data = await response.json();
        setUserData(data.data);
      }
    };
    fetchUserData();
  }, []);

  const sections = [
    { id: 'personal-info', label: 'Personal information', icon: User },
    { id: 'login-security', label: 'Login & security', icon: Shield },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'taxes', label: 'Taxes', icon: FileText },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'languages-currency', label: 'Languages & currency', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-8">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Account settings</h1>
          <button
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            onClick={() => {
              setLoading(true);
              router.push('/hosting');
            }}
          >
            {loading ? <Spinner /> : 'Done'}
          </button>
        </div>

        <div className="flex gap-8">
          <aside className="w-1/4">
            <nav className="flex flex-col gap-2">
              {sections.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    activeSection === id ? 'bg-gray-800' : 'hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </aside>

          <main className="w-3/4">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {activeSection === 'personal-info' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Personal information</h2>
                  <div className="border-b border-gray-700 pb-4">
                    <p className="font-semibold">Legal name</p>
                    <p className="text-gray-400">{userData?.full_name || 'Not provided'}</p>
                  </div>
                  <div className="border-b border-gray-700 pb-4">
                    <p className="font-semibold">Preferred first name</p>
                    <p className="text-gray-400">{userData?.preferred_name || 'Not provided'}</p>
                  </div>
                  <div className="border-b border-gray-700 pb-4">
                    <p className="font-semibold">Email address</p>
                    <p className="text-gray-400">{userData?.email || 'Not provided'}</p>
                  </div>
                  <div className="border-b border-gray-700 pb-4">
                    <p className="font-semibold">Phone number</p>
                    <p className="text-gray-400">{userData?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Identity verification</p>
                    <p className="text-gray-400">{userData?.identity_verified ? 'Verified' : 'Not verified'}</p>
                  </div>
                </div>
              )}
              {/* Add other sections here as needed */}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
