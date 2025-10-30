"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import supabase from "@/services/api";
import { API_BASE_URL } from "@/services/api";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import BackButton from "@/components/BackButton";
import Link from "next/link";

const ManageBookingsPage = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/bookings/guest/${session.user.id}`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              setBookings(data);
            }
          }
        } catch (err) {
          console.error("Error fetching bookings:", err);
        }
      }
      setLoading(false);
    };
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black p-6 pt-8">
      <header className="flex items-center justify-between mb-8">
        <Link href="/" className="text-2xl font-bold">
          roovo.bookings
        </Link>
        <BackButton />
      </header>

      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <Image
                src={booking.listing.primary_image_url ?? "/placeholder.svg"}
                alt={booking.listing.title}
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold">{booking.listing.title}</h3>
                <p className="text-sm text-gray-600">{booking.listing.property_type}</p>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1">{booking.listing.overall_rating?.toFixed(1) ?? 'N/A'}</span>
                  <span className="text-gray-600 ml-2">({booking.listing.total_reviews ?? 0} reviews)</span>
                </div>
                <p className="text-sm mt-2">
                  <span className="font-semibold">Cancellation Policy:</span> {booking.listing.cancellation_policy}
                </p>
                <div className="flex justify-between mt-4">
                  <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
                    Cancel
                  </button>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                    Chat with Host
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageBookingsPage;
