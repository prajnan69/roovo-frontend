"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

const HostingPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full max-w-4xl text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Join our hosting community</h1>
        <p className="text-slate-600 mb-12">Choose the path that's right for you.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/import-listing">
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
          <Link href="/become-a-host">
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
  );
};

export default HostingPage;
