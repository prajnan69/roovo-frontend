"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import supabase from '@/services/api';

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  title?: string;
  subtitle?: string;
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

const Login = ({ isOpen, onClose, onLoginSuccess, title, subtitle }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      onLoginSuccess();
      onClose();
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-3xl bg-white rounded-4xl shadow-2xl overflow-hidden flex relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 text-2xl text-slate-400 hover:text-slate-800 p-1 rounded-full leading-none hover:bg-slate-100 z-10 cursor-pointer"
            >
              &times;
            </button>

            {/* Left Panel */}
            <div className="w-1/2 bg-slate-100 p-12 flex flex-col justify-center items-center text-center">
              <img src="/icons/login.png" alt="Login illustration" className="w-48 h-48 mb-6" />
              <h2 className="text-3xl font-bold text-slate-900">{title || "Welcome Back"}</h2>
              <p className="mt-2 text-slate-600">{subtitle || "Log in to continue your journey with Roovo."}</p>
            </div>

            {/* Right Panel - Form */}
            <div className="w-1/2 p-12 flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Log In</h2>
              <form className="space-y-6" onSubmit={handleLogin}>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-100 border-2 border-slate-200 rounded-lg p-3 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-100 border-2 border-slate-200 rounded-lg p-3 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-500 text-white font-bold py-3 rounded-lg hover:bg-indigo-600 transition-colors duration-300 text-lg cursor-pointer"
                >
                  Login
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Login;
