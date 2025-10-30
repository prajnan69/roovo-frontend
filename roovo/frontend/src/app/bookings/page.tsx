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

const BookingsPage = () => {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');

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

  const filteredBookings = bookings.filter(booking => {
    const endDate = new Date(booking.end_date);
    if (filter === 'upcoming') {
      return endDate >= new Date();
    } else {
      return endDate < new Date();
    }
  });

  return (
    <div className="h-screen bg-white text-black p-6 pt-8">
      <div className="flex h-full">
        <aside className="w-48 pr-8 border-r flex flex-col justify-center">
          <nav className="flex flex-col space-y-2">
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-lg text-left ${filter === 'upcoming' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-4 py-2 rounded-lg text-left ${filter === 'past' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
            >
              Past
            </button>
          </nav>
        </aside>
        <main className="flex-1 pl-8 flex">
          {loading ? (
            <div className="m-auto">
              <Spinner />
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredBookings.map((booking) => (
                <Link href={`/listing/${booking.listing.id}`} key={booking.id}>
                  <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
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

                {booking.listing.guest_access && (
                  <div className="mt-4">
                    <h4 className="font-semibold">Guest Access</h4>
                    <p className="text-sm text-gray-600">{booking.listing.guest_access}</p>
                  </div>
                )}

                {booking.listing.other_things_to_note && (
                  <div className="mt-4">
                    <h4 className="font-semibold">Other Things to Note</h4>
                    <p className="text-sm text-gray-600">{booking.listing.other_things_to_note}</p>
                  </div>
                )}

                {booking.listing.additional_rules && booking.listing.additional_rules.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold">House Rules</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {booking.listing.additional_rules.map((rule: string, index: number) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {booking.listing.neighborhood_description && (
                  <div className="mt-4">
                    <h4 className="font-semibold">Neighborhood</h4>
                    <p className="text-sm text-gray-600">{booking.listing.neighborhood_description}</p>
                  </div>
                )}

                {booking.listing.getting_around && (
                  <div className="mt-4">
                    <h4 className="font-semibold">Getting Around</h4>
                    <p className="text-sm text-gray-600">{booking.listing.getting_around}</p>
                  </div>
                )}

                <div className="flex justify-between mt-4">
                  {filter === 'upcoming' ? (
                    <>
                      <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                        Cancel
                      </button>
                      <button className=" cursor-pointer  bg-indigo-500 text-white px-4 py-2 rounded-4xl hover:bg-indigo-700 transition-colors">
                        Chat with Host
                      </button>
                    </>
                  ) : (
                    <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                      Rate the Host
                    </button>
                  )}
                </div>
              </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="m-auto text-center">
              {filter === 'upcoming' && (
                <Image src="/icons/no_upcoming_booking.png" alt="No upcoming bookings" width={200} height={200} />
              )}
              <p className="text-gray-500 mt-4">No {filter} bookings found.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BookingsPage;
