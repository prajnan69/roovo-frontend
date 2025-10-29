"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const ReservationsPage = () => {
  const router = useRouter();
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);

  const handleBackNavigation = () => {
    setIsNavigatingBack(true);
    router.back();
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex items-center mb-8">
        <button onClick={handleBackNavigation} className="mr-4" disabled={isNavigatingBack}>
          {isNavigatingBack ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          )}
        </button>
        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold tracking-tight"
        >
          Reservations
        </motion.h1>
      </div>
      <div className="text-center">
        <p>Reservations UI is under construction.</p>
      </div>
    </div>
  );
};

export default ReservationsPage;
