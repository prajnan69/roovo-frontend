"use client";

import { motion } from 'framer-motion';

const BookingBar = ({ price }: { price: number }) => {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex items-center justify-between z-10"
    >
      <div>
        <p className="text-lg font-bold">₹{price}{" "}</p>
        <p className="text-sm text-gray-600">/ night</p>
      </div>
      <button className="cursor-pointer inline-flex items-center justify-center gap-2 bg-indigo-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-600 active:scale-95 transition text-base font-bold">
        Reserve
      </button>
    </motion.div>
  );
};

export default BookingBar;
