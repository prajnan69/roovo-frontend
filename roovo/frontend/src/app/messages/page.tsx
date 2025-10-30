"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GuestChat from "@/components/GuestChat";
import supabase from "@/services/api";
import { API_BASE_URL } from "@/services/api";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

const UserMessagesPage = () => {
  const router = useRouter();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/chat/conversations/guest/${session.user.id}`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) setConversations(data);
          }
        } catch (err) {
          console.error("Error fetching conversations:", err);
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

  return (
    <div className="flex flex-col h-screen bg-white text-black p-6 pt-8 scrollbar-hide">
      {/* Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-grow">
        
        {/* Conversation List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="md:block hidden bg-gray-100 rounded-xl p-4 border border-gray-200 overflow-y-auto relative"
        >
          {/* fade top + bottom mask */}
          <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />

          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Spinner />
            </div>
          ) : (
            <AnimatePresence>
              {conversations.map((convo) => {
                console.log('convo', convo);
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
                      ${isSelected ? "bg-indigo-500 text-white border-indigo-500" : "bg-white border-transparent hover:bg-gray-200"}
                    `}
                  >
                    <motion.div whileHover={{ rotate: 2 }} className="relative">
                      <Image
                        src={convo.listing.primary_image_url ?? "/placeholder.svg"}
                        alt="Listing"
                        width={48}
                        height={48}
                        className="rounded-lg w-12 h-12 object-cover"
                      />
                      {/* unread pulse */}
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-purple-400 animate-pulse"
                      ></motion.span>
                    </motion.div>

                    <span className="text-sm">{convo.listing?.host?.name || 'Host'}</span>
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
              className="col-span-1 md:col-span-2 h-full bg-white rounded-xl border border-gray-200 shadow-xl shadow-black/10 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200">
                <div>
                  <h2 className="text-lg font-bold">{selectedConversation.listing.title}</h2>
                  <p className="text-sm text-gray-500">{selectedConversation.listing.property_type}</p>
                </div>
              </div>
              <GuestChat conversationId={selectedConversation.id} />
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default UserMessagesPage;
