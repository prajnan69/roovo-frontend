"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Chat from "@/components/Chat";

const UserChatPage = ({ params }: any) => {
  const router = useRouter();
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);

  const handleBackNavigation = () => {
    setIsNavigatingBack(true);
    router.back();
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white p-8">
      <div className="flex items-center mb-8 flex-shrink-0">
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
          Chat
        </motion.h1>
      </div>

      <div className="flex-grow">
        <Chat conversationId={Number(params.conversationId)} />
      </div>
    </div>
  );
};

export default UserChatPage;
