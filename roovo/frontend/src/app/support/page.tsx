"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const SupportLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const { data } = await axios.post('/api/support/login', { email, password });
      if (data.success) {
        router.push('/support/tickets');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Error logging in. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Support Agent Login</h1>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full max-w-xs p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full max-w-xs p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full max-w-xs p-2 bg-indigo-500 text-white rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default SupportLoginPage;
