"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getListingsByHostId } from "@/services/api";
import { ListingData } from "@/types";

export default function ManageListings() {
  const [listings, setListings] = useState<ListingData[]>([]);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHostListings = async () => {
      try {
        // TODO: Replace with actual host ID from user session
        const hostId = "177c6740-80fd-48f1-869e-cc12fcde2ab1";
        const data = await getListingsByHostId(hostId);
        setListings(data);
      } catch (err) {
        setError("Failed to fetch listings. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHostListings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p>Loading your listings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-black via-[#0d0d0f] to-black text-white">
      {/* Page Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 tracking-tight"
      >
        Manage Listings
      </motion.h1>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[calc(100vh-8rem)]">
        {/* LEFT LISTINGS PANEL */}
        <div className="space-y-4 overflow-y-auto pr-2">
          {listings.map((listing) => (
            <motion.div
              key={listing.id}
              onClick={() => {
  setSelectedListing(listing);
  setActiveTab("Overview");
}}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`cursor-pointer rounded-2xl p-4 flex gap-4 
                backdrop-blur-xl bg-white/10 border border-white/20 
                shadow-lg transition-all duration-300
                ${selectedListing?.id === listing.id ? "ring-2 ring-indigo-400" : ""}
              `}
            >
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-700">
                <Image
                  src={listing.primary_image_url ?? "/placeholder.svg"}
                  alt="Listing"
                  fill
                  sizes="100%"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col justify-center">
                <h3 className="text-lg font-semibold">{listing.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {listing.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* RIGHT DETAILS PANEL (Animated) */}
        <AnimatePresence mode="wait">
  {selectedListing && (
    <motion.div
      key="details-panel"
      initial={{ x: 200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 200, opacity: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
      className="hidden lg:flex flex-col bg-white/10 backdrop-blur-2xl 
        p-6 rounded-2xl border border-white/20 shadow-xl overflow-hidden"
    >
      {/* Close Button */}
      <button
        onClick={() => setSelectedListing(null)}
        className="ml-auto text-gray-300 hover:text-white 
          transition-all text-xl"
      >
        ✕
      </button>

      {/* Image */}
      <div className="relative w-full h-56 rounded-2xl overflow-hidden mt-2">
        <Image
          src={selectedListing.primary_image_url ?? "/placeholder.svg"}
          alt={selectedListing.title}
          fill
          sizes="100%"
          className="object-cover"
        />
      </div>

      <h2 className="text-2xl font-semibold mt-4">{selectedListing.title}</h2>

      {/* ✅ Section Tabs */}
      <div className="flex gap-3 mt-6 overflow-x-auto pb-2">
        {[
          "Overview",
          "Property Type",
          "Pricing",
          "Availability",
          "Guests",
          "Description",
          "Amenities",
          "House Rules",
          "Host Details"
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all
              ${activeTab === tab 
                ? "bg-white/30 text-white font-semibold shadow-lg"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ✅ Animated Content Area */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mt-6 text-gray-300 leading-relaxed overflow-y-auto pr-2"
      >
        {activeTab === "Overview" && (
          <p>{selectedListing.the_space || "No overview available"}</p>
        )}

        {activeTab === "Property Type" && (
          <p>{selectedListing.property_type || "Not specified"}</p>
        )}

        {activeTab === "Pricing" && (
          <p>₹{selectedListing.price_per_night} / night</p>
        )}

        {activeTab === "Availability" && (
          <p>Check-in after 1 PM • Checkout before 11 AM</p>
        )}

        {activeTab === "Guests" && (
          <p>Up to {selectedListing.guests || 1} guests</p>
        )}

        {activeTab === "Description" && (
          <p>{selectedListing.description || "No description available"}</p>
        )}

        {activeTab === "Amenities" && (
          <ul className="list-disc ml-5 space-y-1">
            {(selectedListing.amenities || ["WiFi", "AC", "Kitchen"]).map(
              (item: string, i: number) => (
                <li key={i}>{item}</li>
              )
            )}
          </ul>
        )}

        {activeTab === "House Rules" && (
          <ul className="list-disc ml-5 space-y-1">
            <li>No parties</li>
            <li>No smoking</li>
          </ul>
        )}

        {activeTab === "Host Details" && (
          <p>Hosted by You</p>
        )}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      </div>
    </div>
  );
}
