"use client";

import { useState, useEffect } from "react";
import supabase from "@/services/api";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { API_BASE_URL } from "@/services/api";

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
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reservations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reservations.map((reservation) => (
          <div key={reservation.id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">{reservation.listing.title}</h2>
            <p>Guest: {reservation.guest.name}</p>
            <p>Check-in: {new Date(reservation.start_date).toLocaleDateString()}</p>
            <p>Check-out: {new Date(reservation.end_date).toLocaleDateString()}</p>
            <p>Total Price: ₹{reservation.total_price}</p>
            <p>Status: {reservation.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationsPage;
