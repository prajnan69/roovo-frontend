"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';

interface BecomeAHostProps {
  isOpen: boolean;
  onClose: () => void;
}

const BecomeAHost = ({ isOpen, onClose }: BecomeAHostProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer z-10">
              <X size={24} />
            </button>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900">Join our hosting community</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link href="/import-listing" onClick={onClose}>
                <motion.div
                  className="flex flex-col items-center justify-center p-8 border-2 rounded-2xl transition-all duration-200 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 h-64"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src="/icons/rehost.png" alt="Already hosted" className="w-24 h-24 mb-4" />
                  <span className="text-xl font-semibold text-slate-800">Already hosted</span>
                  <p className="text-slate-500 mt-2">Import your existing listing from another site.</p>
                </motion.div>
              </Link>
              <Link href="/become-a-host" onClick={onClose}>
                <motion.div
                  className="flex flex-col items-center justify-center p-8 border-2 rounded-2xl transition-all duration-200 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 h-64"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src="/icons/newhost.png" alt="New to hosting" className="w-24 h-24 mb-4" />
                  <span className="text-xl font-semibold text-slate-800">New to hosting</span>
                  <p className="text-slate-500 mt-2">Create a new listing from scratch.</p>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BecomeAHost;
