"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Ticket {
  id: number;
  status: string;
  created_at: string;
  user: {
    name: string;
  }[];
}

const SupportTicketsPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await axios.get('/api/support/tickets');
        setTickets(data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };
    fetchTickets();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/support/logout');
      router.push('/support');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <button
          onClick={handleLogout}
          className="p-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tickets.map((ticket) => (
          <Link key={ticket.id} href={`/support/tickets/${ticket.id}`}>
            <div className="bg-white rounded-lg shadow-md p-4 cursor-pointer">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">Ticket #{ticket.id}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  ticket.status === 'open' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                }`}>
                  {ticket.status}
                </span>
              </div>
              <p><strong>User:</strong> {ticket.user[0].name}</p>
              <p><strong>Created:</strong> {new Date(ticket.created_at).toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SupportTicketsPage;
