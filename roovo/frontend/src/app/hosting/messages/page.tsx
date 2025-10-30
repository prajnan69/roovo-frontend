"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Chat from "@/components/Chat";
import supabase from "@/services/api";
import { API_BASE_URL } from "@/services/api";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import BackButton from "@/components/BackButton";

const MessagesPage = () => {
  const router = useRouter();
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hostNames, setHostNames] = useState<Record<string, string>>({});

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
              if (Array.isArray(data)) {
                console.log('Conversations data:', data);
                setConversations(data);
                const hostIds = [...new Set(data.map((c) => c.host_id))];
                const response = await fetch(`${API_BASE_URL}/api/users/by-ids`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ ids: hostIds }),
                });
                if (response.ok) {
                  const { data: users } = await response.json();
                  console.log('Users data:', users);
                  const namesMap = users.reduce((acc: Record<string, string>, user: { id: string; name: string }) => {
                    acc[user.id] = user.name;
                    return acc;
                  }, {});
                  setHostNames(namesMap);
                }
              }
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

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-4 mb-8"
      >
        <BackButton variant="dark" />
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
                        className="rounded-lg w-12 h-12 object-cover"
                      />
                      {/* unread pulse */}
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-purple-400 animate-pulse"
                      ></motion.span>
                    </motion.div>

                    <span className="text-sm">{convo.guest.name || 'Host'}</span>
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
              <div className="p-4 border-b border-gray-800 sticky top-0 bg-gray-950/60 backdrop-blur-xl z-10">
                <div className="flex items-center">
                  <Image
                    src={selectedConversation.listing.primary_image_url ?? "/placeholder.svg"}
                    alt="Listing"
                    width={64}
                    height={64}
                    className="rounded-lg w-16 h-16 object-cover"
                  />
                  <div className="ml-4">
                    <h2 className="text-lg font-bold">{selectedConversation.listing.title}</h2>
                    <p className="text-sm text-gray-400">{selectedConversation.listing.property_type}</p>
                  </div>
                </div>
              </div>
              <Chat conversationId={selectedConversation.id} />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MessagesPage;
