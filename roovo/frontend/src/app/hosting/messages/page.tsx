"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Chat from "@/components/Chat";
import supabase from "@/services/api";
import { API_BASE_URL } from "@/services/api";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

const MessagesPage = () => {
  const router = useRouter();
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: host } = await supabase
          .from("hosts")
          .select("id")
          .eq("user_id", session.user.id)
          .single();

        if (host) {
          try {
            const res = await fetch(`${API_BASE_URL}/api/chat/conversations/${host.id}`);
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data)) setConversations(data);
            }
          } catch (err) {
            console.error("Error fetching conversations:", err);
          }
        }
      }
      setLoading(false);
    };
    fetchConversations();

    const channel = supabase
      .channel('conversations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, (payload) => {
        fetchConversations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleBackNavigation = () => {
    setIsNavigatingBack(true);
    router.back();
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-4 mb-8"
      >
        <motion.button
          onClick={handleBackNavigation}
          whileTap={{ scale: 0.8 }}
          animate={{ rotate: isNavigatingBack ? 360 : 0 }}
          transition={{ duration: 0.5 }}
          disabled={isNavigatingBack}
          className="rounded-full p-2 bg-gray-900 hover:bg-gray-800 transition"
        >
          {isNavigatingBack ? (
            <Spinner />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          )}
        </motion.button>

        <motion.h1
          className="text-4xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Messages
          </span>
        </motion.h1>
      </motion.div>

      {/* Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-[calc(100vh-10rem)]">
        {/* Conversation List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="md:block hidden bg-gray-900/40 backdrop-blur-xl rounded-xl p-4 border border-white/5 overflow-y-auto relative"
        >
          {/* fade top + bottom mask */}
          <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-black to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black to-transparent pointer-events-none" />

          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Spinner />
            </div>
          ) : (
            <AnimatePresence>
              {conversations.map((convo) => {
                const isSelected = selectedConversation?.id === convo.id;
                return (
                  <motion.div
                    key={convo.id}
                    layoutScroll
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 120 }}
                    onClick={() => setSelectedConversation(convo)}
                    className={`p-3 rounded-lg cursor-pointer mb-2 flex items-center gap-4 transition-all border 
                      ${isSelected ? "bg-indigo-600 border-indigo-500" : "bg-gray-900/60 border-transparent hover:bg-gray-800/60"}
                    `}
                  >
                    <motion.div whileHover={{ rotate: 2 }} className="relative">
                      <Image
                        src={convo.listing.primary_image_url ?? "/placeholder.svg"}
                        alt="Listing"
                        width={48}
                        height={48}
                        className="rounded-lg"
                      />
                      {/* unread pulse */}
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-purple-400 animate-pulse"
                      ></motion.span>
                    </motion.div>

                    <span className="text-sm">{convo.guest.name}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </motion.div>

        {/* Chat Panel */}
        <AnimatePresence>
          {selectedConversation && (
            <div
              className="col-span-1 md:col-span-2 h-full bg-gray-950/60 rounded-xl border border-white/5 shadow-xl shadow-black/30 overflow-hidden"
            >
              <Chat conversationId={selectedConversation.id} />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MessagesPage;
