"use client";

import React, { useEffect, useState } from 'react';
import ListingSection from './ListingSection';
import { API_BASE_URL } from '@/services/api';

// --- Type Definitions (can be moved to a types.ts file) ---
interface ApiLocation {
  lat: number;
  lng: number;
  city: string;
  address: string;
}
export interface Listing {
  id: string;
  title: string;
  description: string;
  price_per_night: number;
  images: string[];
  location: ApiLocation;
  rating: number;
}

// --- Main HomeFeed Component ---
const HomeFeed: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);
      try {
        // NOTE: Make sure your local server is running at this address
        const response = await fetch(`${API_BASE_URL}/api/listings`);
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }
        const data = await response.json();
        // Add a random rating for demonstration purposes if not present
        const listingsWithExtras = (data.data || []).map((listing: Listing) => ({
          ...listing,
          rating: listing.rating || (Math.random() * (5.0 - 4.2) + 4.2).toFixed(1),
        }));
        setListings(listingsWithExtras);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setError("We couldn't load the listings. Please try again later.");
      } finally {
        // Add a small delay to prevent jarring loading flashes
        setTimeout(() => setLoading(false), 1000);
      }
    };

    fetchListings();
  }, []);

  // --- Slicing data into sections to simulate curated feeds ---
  const popularHomes = listings.slice(0, 8);
  const weekendHomes = listings.slice(8, 16);
  const newHomes = listings.slice(4, 12); // Overlapping for variety

  // --- Conditional Rendering Logic ---
  const renderContent = () => {
    if (loading) {
      // Show skeletons for all sections while initial data is loading
      return (
        <div className="flex flex-col space-y-12">
          <ListingSection title="Popular homes in your area" listings={[]} loading={true} />
          <ListingSection title="Available this weekend" listings={[]} loading={true} />
          <ListingSection title="New homes on Roovo" listings={[]} loading={true} />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center text-center py-12 h-64">
          <p className="text-red-500 font-semibold">{error}</p>
        </div>
      );
    }

    if (listings.length === 0) {
      return (
        <div className="flex items-center justify-center text-center py-12 h-64">
          <p className="text-slate-600">No homes available at the moment. Please check back later!</p>
        </div>
      );
    }

    // --- Render the sections with actual data ---
    return (
      <div className="flex flex-col space-y-12">
        {popularHomes.length > 0 && <ListingSection title="Popular homes in your area" listings={popularHomes} loading={false} />}
        {weekendHomes.length > 0 && <ListingSection title="Available this weekend" listings={weekendHomes} loading={false} />}
        {newHomes.length > 0 && <ListingSection title="New homes on Roovo" listings={newHomes} loading={false} />}
      </div>
    );
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-12">
      {renderContent()}
    </main>
  );
};

export default HomeFeed;
