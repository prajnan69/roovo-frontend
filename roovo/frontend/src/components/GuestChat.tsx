"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { API_BASE_URL } from '@/services/api';
import supabase from "@/services/api";
import { User } from "@supabase/supabase-js";
import { Spinner } from "./ui/shadcn-io/spinner";

interface Message {
  id: number;
  sender_id: string;
  content: string;
  is_verified: boolean;
  status?: 'sending' | 'sent' | 'failed';
}

interface GuestChatProps {
  conversationId: number;
}

const GuestChat = ({ conversationId }: GuestChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };
    getUser();
    const fetchMessages = async () => {
      const response = await fetch(`${API_BASE_URL}/api/chat/messages/${conversationId}`);
      const data = await response.json();
      setMessages(data);
    };
    fetchMessages();

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, (payload) => {
        setMessages((messages) => [...messages, payload.new as Message]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const tempId = Math.random();
    const newMessageObj = {
      id: tempId,
      sender_id: session.user.id,
      content: newMessage,
      is_verified: true,
      status: 'sending',
    };

    setMessages([...messages, newMessageObj as Message]);
    setNewMessage("");

    const response = await fetch(`${API_BASE_URL}/api/chat/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversation_id: conversationId,
        sender_id: session.user.id,
        content: newMessage,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Message sent successfully:', data);
      setMessages(messages.map(msg => msg.id === tempId ? { ...data, status: 'sent' } : msg) as Message[]);
    } else {
      console.error('Failed to send message:', response);
      setMessages(messages.map(msg => msg.id === tempId ? { ...newMessageObj, status: 'failed' } : msg) as Message[]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white text-black rounded-lg">
      <div className="flex-1 p-4 overflow-y-auto flex flex-col-reverse">
        <div ref={messagesEndRef} />
        {messages.slice().reverse().map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg mb-2 max-w-xs ${
              msg.sender_id === user?.id
                ? "bg-indigo-500 text-white ml-auto"
                : "bg-gray-200"
            }`}
          >
            <p>{msg.content}</p>
            {msg.status === 'sending' && <Spinner size={12} />}
            {msg.status === 'failed' && <p className="text-xs text-red-500 mt-1">Not sent</p>}
          </motion.div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="p-4 flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 bg-gray-100 border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="ml-4 bg-indigo-500 hover:bg-indigo-600 rounded-full p-3 text-white"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default GuestChat;
