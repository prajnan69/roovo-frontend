"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getListingsByHostId, fetchListingById } from "@/services/api";
import { ListingData } from "@/types";
import Counter from "./Counter";
import { Spinner } from "./ui/shadcn-io/spinner";

export default function ManageListings() {
  const [listings, setListings] = useState<ListingData[]>([]);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [guestCount, setGuestCount] = useState(selectedListing?.guests || 1);
  const [activeTab, setActiveTab] = useState("Property Type");
  const [propertyType, setPropertyType] = useState(selectedListing?.property_type || "");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleBackNavigation = () => {
    if (document.referrer.includes("/hosting")) {
      setIsNavigatingBack(true);
      router.back();
    } else {
      router.back();
    }
  };

  const handleScroll = (direction: "left" | "right") => {
    if (tabsRef.current) {
      const scrollAmount = 200;
      tabsRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

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

  // When a new listing is selected, update the property type in the state
  // so the dropdown defaults to the correct value.
  useEffect(() => {
    if (selectedListing) {
      setPropertyType(selectedListing.property_type || "");
      setGuestCount(selectedListing.guests || 1);
      // Correctly access nested property
      setCheckInTime(selectedListing.booking_and_availability?.houseRules?.checkIn || "");
      setCheckOutTime(selectedListing.booking_and_availability?.houseRules?.checkOut || "");
    }
  }, [selectedListing]);

  useEffect(() => {
    if (selectedListing && guestCount !== selectedListing.guests) {
      setSelectedListing({ ...selectedListing, guests: guestCount });
    }
  }, [guestCount, selectedListing]);

  const handlePriceChange = (newPrice: number) => {
    if (!selectedListing) return;
    const updatedListing = { ...selectedListing, price_per_night: newPrice };
    if (selectedListing.weekend_price !== null && typeof selectedListing.weekend_price !== 'undefined') {
      updatedListing.weekend_price = parseFloat((newPrice * 1.07).toFixed(2));
    }
    setSelectedListing(updatedListing);
  };

  const handleWeekendPriceChange = (newWeekendPrice: number) => {
    if (!selectedListing) return;
    setSelectedListing({ ...selectedListing, weekend_price: newWeekendPrice });
  };

  const deleteWeekendPrice = () => {
    if (!selectedListing) return;
    // Create a copy of the object and set weekend_price to null
    const updatedListing = { ...selectedListing, weekend_price: null };
    setSelectedListing(updatedListing);
  };

  const addWeekendPrice = () => {
    if (!selectedListing || !selectedListing.price_per_night) return;
    const weekendPrice = parseFloat((selectedListing.price_per_night * 1.07).toFixed(2));
    setSelectedListing({ ...selectedListing, weekend_price: weekendPrice });
  };

  const handleGuestChange = (newGuestCount: number) => {
    if (newGuestCount >= 1 && newGuestCount <= selectedListing.max_guests) {
      setGuestCount(newGuestCount);
    }
  };

  const handleCheckInChange = (time: string) => {
    setCheckInTime(time);
    if (selectedListing) {
      setSelectedListing({
        ...selectedListing,
        booking_and_availability: {
          ...selectedListing.booking_and_availability,
          houseRules: {
            ...selectedListing.booking_and_availability?.houseRules,
            checkIn: time,
          },
        },
      });
    }
  };

  const handleCheckOutChange = (time: string) => {
    setCheckOutTime(time);
    if (selectedListing) {
      setSelectedListing({
        ...selectedListing,
        booking_and_availability: {
          ...selectedListing.booking_and_availability,
          houseRules: {
            ...selectedListing.booking_and_availability?.houseRules,
            checkOut: time,
          },
        },
      });
    }
  };

  const handleSave = () => {
    if (selectedListing) {
      console.log("Saving listing:", selectedListing);
      // Here you would typically make an API call to save the updated listing data
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <Spinner size={24} />
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
  console.log("Listings fetched:", selectedListing);
  console.log("Selected listing:", listings);
  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-black via-[#0d0d0f] to-black text-white overflow-hidden">
      {/* Page Heading */}
      <div className="flex items-center mb-8">
        <button onClick={handleBackNavigation} className="mr-4" disabled={isNavigatingBack}>
          {isNavigatingBack ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          )}
        </button>
        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold tracking-tight"
        >
          Manage Listings
        </motion.h1>
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[calc(100vh-8rem)]">
        {/* LEFT LISTINGS PANEL */}
        <div className="space-y-4 overflow-y-auto pr-2">
          {listings.map((listing) => (
            <motion.div
              key={listing.id}
              onClick={async () => {
                try {
                  const detailedListing = await fetchListingById(listing.id);
                  setSelectedListing(detailedListing);
                  setActiveTab("Overview");
                } catch (error) {
                  console.error("Failed to fetch listing details", error);
                  // Optionally, set an error state here to show a message to the user
                }
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`cursor-pointer rounded-2xl p-3 flex gap-3 
                backdrop-blur-xl bg-white/10 border border-white/20 
                shadow-lg transition-all duration-300
                ${selectedListing?.id === listing.id ? "ring-2 ring-inset ring-indigo-400" : ""}
              `}
            >
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-700">
                <Image
                  src={listing.primary_image_url ?? "/placeholder.svg"}
                  alt="Listing"
                  fill
                  sizes="100%"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col justify-center">
                <h3 className="text-base font-semibold">{listing.title}</h3>
                <p className="text-gray-400 text-xs line-clamp-2">
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
      {/* Image */}
      <div className="relative w-full h-56 rounded-2xl overflow-hidden mt-2">
        <Image
          src={selectedListing.primary_image_url ?? "/placeholder.svg"}
          alt={selectedListing.title}
          fill
          sizes="100%"
          className="object-cover"
        />
        {/* Save Button */}
        <button
          onClick={handleSave}
          className="absolute top-4 right-4 bg-indigo-500 hover:bg-indigo-600 text-white 
            font-bold py-2 px-6 rounded-full transition-all z-10"
        >
          Save
        </button>
      </div>

      <h2 className="text-2xl font-semibold mt-4">{selectedListing.title}</h2>

      {/* ✅ Section Tabs */}
      <div className="relative flex items-center mt-6">
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-0 z-10 p-2 bg-gray-800/50 rounded-full shadow-md hover:bg-gray-700/70 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      <div ref={tabsRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {[
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
        <button
          onClick={() => handleScroll("right")}
          className="absolute right-0 z-10 p-2 bg-gray-800/50 rounded-full shadow-md hover:bg-gray-700/70 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ✅ Animated Content Area */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mt-6 text-gray-300 leading-relaxed overflow-y-auto pr-2 flex-1"
      >
        {activeTab === "Overview" && (
          <p>{selectedListing.the_space || "No overview available"}</p>
        )}

        {activeTab === "Property Type" && (
          <div>
            <label htmlFor="property-type" className="block text-sm font-medium text-gray-400">Property Type</label>
            <select
              id="property-type"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option>{selectedListing.property_type}</option>
              <option>Entire Place</option>
              <option>Room</option>
              <option>Shared Room</option>
            </select>
          </div>
        )}

        {activeTab === "Pricing" && (
          <div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-400">Current Price</label>
              <input
                type="number"
                value={selectedListing.price_per_night || ''}
                onChange={(e) => handlePriceChange(parseFloat(e.target.value))}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
              />
            </div>
            <div className="mt-4">
              {(selectedListing.weekend_price !== null && typeof selectedListing.weekend_price !== 'undefined') ? (
                <div>
                  <label className="block text-sm font-medium text-gray-400">Weekend Price</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={selectedListing.weekend_price || ''}
                      onChange={(e) => handleWeekendPriceChange(parseFloat(e.target.value))}
                      className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
                    />
                    <button
                      onClick={deleteWeekendPrice}
                      className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={addWeekendPrice}
                  className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add Weekend Price
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === "Availability" && (
          <div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-400">Check-in Time</label>
              <input
                type="text"
                value={checkInTime}
                onChange={(e) => handleCheckInChange(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-400">Check-out Time</label>
              <input
                type="text"
                value={checkOutTime}
                onChange={(e) => handleCheckOutChange(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
              />
            </div>
          </div>
        )}

        {activeTab === "Guests" && (
          <div className="flex flex-col items-center justify-center">
            <label className="block text-sm font-medium text-gray-400 mb-4">Guests</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleGuestChange(guestCount - 1)}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full"
              >
                -
              </button>
              <Counter value={guestCount} fontSize={48} />
              <button
                onClick={() => handleGuestChange(guestCount + 1)}
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full"
              >
                +
              </button>
            </div>
          </div>
        )}
        
        {activeTab === "Description" && (
          <p>{selectedListing.the_space || "No description available"}</p>
        )}

        {activeTab === "Amenities" && (
          <ul className="list-disc ml-5 space-y-1">
            {(selectedListing.included_amenities || []).map(
              (item: string, i: number) => (
                <li key={i}>{item}</li>
              )
            )}
          </ul>
        )}

        {activeTab === "House Rules" && (
          <ul className="list-disc ml-5 space-y-1">
            {(selectedListing.additional_rules || []).map(
              (item: string, i: number) => (
                <li key={i}>{item}</li>
              )
            )}
          </ul>
        )}

        {activeTab === "Host Details" && (
          <p>Hosted by {selectedListing.host_name || "N/A"}</p>
        )}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

      </div>
    </div>
  );
}
