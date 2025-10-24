"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchListingById } from '@/services/api';
import { Listing } from '@/components/HomeFeed';

const ListingDetailsPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const getListingDetails = async () => {
        try {
          console.log(`Fetching listing details for id: ${id}`);
          const data = await fetchListingById(id);
          console.log('Received listing data:', data);
          setListing(data);
        } catch (err) {
          console.error('Error fetching listing details:', err);
          setError('Failed to fetch listing details.');
        } finally {
          setLoading(false);
        }
      };
      getListingDetails();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!listing) {
    return <div>Listing not found.</div>;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <div className="mx-auto max-w-7xl py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="relative h-[300px] sm:h-[450px] mb-8 sm:mb-12">
          <div
            className={`grid gap-2 h-full rounded-2xl overflow-hidden shadow-xl ${
              listing.images.slice(0, 5).length === 1
                ? "grid-cols-1 grid-rows-1"
                : listing.images.slice(0, 5).length === 2
                ? "grid-cols-2 grid-rows-1"
                : listing.images.slice(0, 5).length === 3
                ? "grid-cols-3 grid-rows-1"
                : listing.images.slice(0, 5).length === 4
                ? "grid-cols-2 grid-rows-2"
                : "grid-cols-4 grid-rows-2"
            }`}
          >
            {listing.images.slice(0, 5).map((img, i) => (
              <div
                key={i}
                className={`${
                  listing.images.slice(0, 5).length >= 5 && i === 0
                    ? "col-span-2 row-span-2"
                    : ""
                } bg-cover bg-center relative cursor-pointer`}
                style={{ backgroundImage: `url(${img})` }}
              >
                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-8 sm:space-y-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 font-montserrat">
              {listing.title}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mt-2 sm:mt-4 flex items-start sm:items-center">
              {listing.location.address}
            </p>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              {listing.description}
            </p>
          </div>
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-white p-8 rounded-2xl shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900">
                ${listing.price_per_night}{" "}
                <span className="text-base font-normal">/ night</span>
              </h3>
              <button className="cursor-pointer w-full inline-flex items-center justify-center gap-2 bg-indigo-500 text-white px-6 py-4 rounded-xl shadow-lg hover:bg-indigo-600 active:scale-95 transition text-lg font-bold mt-6">
                Reserve
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailsPage;
