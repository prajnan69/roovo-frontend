"use client";

import { useState, useEffect, FC } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Message {
  id: number;
  message: string;
  agent_id: number | null;
  sender_id: string | null;
}

interface SupportChatPageProps {
  params: { id: string };
}

const SupportChatPage: FC<SupportChatPageProps> = ({ params }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [agentId, setAgentId] = useState<number | null>(null);
  const router = useRouter();
  const ticketId = params.id;

  useEffect(() => {
    // This should be replaced with a proper auth solution
    // that provides the agentId without a direct supabase call.
    // For now, we'll simulate it.
    setAgentId(1);
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`/api/support/tickets/${ticketId}/messages`);
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [ticketId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !agentId) return;

    try {
      await axios.post(`/api/support/tickets/${ticketId}/messages`, {
        agentId,
        message: newMessage,
      });
      setNewMessage('');
      // Refetch messages
      const { data } = await axios.get(`/api/support/tickets/${ticketId}/messages`);
      setMessages(data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Ticket #{ticketId}</h1>
        <button
          onClick={() => router.push('/support/tickets')}
          className="p-2 bg-gray-500 text-white rounded"
        >
          Back to Tickets
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4 h-96 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.agent_id ? 'justify-end' : 'justify-start'} mb-2`}
          >
            <div
              className={`rounded-lg px-3 py-2 ${
                message.agent_id ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.message}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full p-2 border rounded-l"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className="p-2 bg-indigo-500 text-white rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default SupportChatPage;
