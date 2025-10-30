"use client";

import { useState, useEffect } from "react";
import supabase from "@/services/api";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { API_BASE_URL } from "@/services/api";
import BackButton from "@/components/BackButton";

const ReservationsPage = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: host } = await supabase
          .from('hosts')
          .select('id')
          .eq('user_id', session.user.id)
          .single();

        if (host) {
          try {
            const response = await fetch(`${API_BASE_URL}/api/reservations/host/${host.id}`);
            if (!response.ok) {
              throw new Error('Failed to fetch reservations');
            }
            const data = await response.json();
            setReservations(data);
          } catch (error) {
            console.error('Error fetching reservations:', error);
          }
        }
      }
      setLoading(false);
    };

    fetchReservations();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Reservations</h1>
        <BackButton variant="dark" />
      </div>
      <div className="space-y-6">
        {reservations.map((reservation) => (
          <div key={reservation.id} className="bg-gray-900 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{reservation.listing.title}</h2>
                <p className="text-gray-400">Guest: {reservation.guest.name}</p>
              </div>
              <div className={`text-sm font-semibold px-3 py-1 rounded-full ${
                reservation.status === 'confirmed' ? 'bg-green-500' :
                reservation.status === 'pending' ? 'bg-yellow-500' :
                'bg-gray-500'
              }`}>
                {reservation.status}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-gray-300">
              <p><strong>Check-in:</strong> {new Date(reservation.start_date).toLocaleDateString()}</p>
              <p><strong>Check-out:</strong> {new Date(reservation.end_date).toLocaleDateString()}</p>
              <p><strong>Total Price:</strong> ₹{reservation.total_price}</p>
              <p><strong>Booked on:</strong> {new Date(reservation.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationsPage;
