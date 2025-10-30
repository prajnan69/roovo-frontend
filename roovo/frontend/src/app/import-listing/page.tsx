"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ListingConfirmation from "@/components/import/ListingConfirmation";
import ConfirmPriceAndList from "@/components/import/ConfirmPriceAndList";
import { ListingData } from "@/types";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import Image from "next/image";
import { API_BASE_URL } from "@/services/api";
import supabase from '@/services/api';
import mockData from "../../../response.json";

console.log("💡 ImportListingPage component loaded");

const loadingStates = [
  { text: "Importing listing data" },
  { text: "Analyzing property details" },
  { text: "Analyzing with amenities" },
  { text: "Fetching house rules" },
  { text: "Finalizing import" },
];

const ImportListingPage = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState<ListingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"confirmation" | "pricing">("confirmation");
  const [importedListingId, setImportedListingId] = useState<string | null>(null);
  const [currentLoadingState, setCurrentLoadingState] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    setIsPageLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 FORM SUBMITTED");

    if (!url) {
      alert("Please enter a valid URL.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setScrapedData(null);
    setCurrentLoadingState(0);

    console.log("🟢 Starting import for URL:", url);

    try {
      if (url.toLowerCase() === "mock") {
        console.log(" MOCK DATA LOADED");
        setScrapedData(mockData as unknown as ListingData);
        setImportedListingId(mockData.id);
        setIsLoading(false);
      } else {
        console.log("📤 Sending URL to backend:", `${API_BASE_URL}/api/scrape/start`);
        const response = await fetch(`${API_BASE_URL}/api/scrape/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        const { jobId } = await response.json();

        const { data: { session } } = await supabase.auth.getSession();
        const user_id = session?.user?.id;

        const interval = setInterval(async () => {
          const statusResponse = await fetch(`${API_BASE_URL}/api/scrape/status/${jobId}`);
          const { status, data } = await statusResponse.json();

          switch (status) {
            case "scraping":
              setCurrentLoadingState(1);
              break;
            case "analyzing":
              setCurrentLoadingState(2);
              break;
            case "analyzing_gemini":
              setCurrentLoadingState(2);
              break;
            case "saving":
              setCurrentLoadingState(4);
              break;
            case "completed":
              clearInterval(interval);
              if (!user_id) {
                throw new Error("User is not logged in.");
              }
              const transformedData: ListingData = {
                id: data.id,
                host_id: user_id,
                title: data.title,
                property_type: data.propertyDetails?.propertyType,
                propertyDetails: data.propertyDetails,
                max_guests: data.bookingAndAvailability?.houseRules?.maxGuests,
                property_description: {
                  theSpace: data.propertyDetails?.description?.theSpace,
                  guestAccess: data.propertyDetails?.description?.guestAccess,
                  otherThingsToNote: data.propertyDetails?.description?.otherThingsToNote,
                },
                accommodation: {
                  sleepingArrangements: data.propertyDetails?.sleepingArrangements,
                  totalBathrooms: data.propertyDetails?.description?.totalbathrooms,
                  totalBeds: data.propertyDetails?.description?.totalBeds,
                },
                price_per_night: data.bookingAndAvailability?.price?.pricePerNight,
                booking_and_availability: data.bookingAndAvailability,
                house_rules: data.bookingAndAvailability?.houseRules,
                amenities: data.amenities,
                ratings_and_reviews: data.reviewsAndRatings,
                host_information: data.hostInformation,
                location_and_neighborhood: data.locationAndNeighborhood,
                media: data.media,
              };
              setScrapedData(transformedData);
              setImportedListingId(data.id);
              setIsLoading(false);
              break;
            case "failed":
              clearInterval(interval);
              setError("Failed to import listing. We will List it and notify you to confirm the pricing.");
              setIsLoading(false);
              break;
          }
        }, 2000);
      }
    } catch (err) {
      console.error("🔥 Error during import:", err);
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!scrapedData) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user_id = session?.user?.id;

      const response = await fetch(`${API_BASE_URL}/api/listings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...scrapedData, host_id: user_id }),
      });

      if (!response.ok) {
        throw new Error("Failed to create listing.");
      }

      setStep("pricing");
    } catch (err) {
      console.error("Error creating listing:", err);
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred while creating the listing.");
    }
  };

  const handlePriceConfirm = (price: number, model: "subscription" | "casual") => {
    console.log("✅ Listing confirmed:", {
      ...scrapedData,
      price,
      model,
    });
    alert("Listing confirmed! (Check console for data)");
    setScrapedData(null);
    setUrl("");
    setStep("confirmation");
  };

  const handleCancel = () => {
    console.log("❌ Listing import canceled.");
    setScrapedData(null);
    setUrl("");
  };

  return (
    <div className="min-h-screen bg-white">
      {isPageLoading ? (
        <div className="flex items-center justify-center h-screen">
          <Spinner size={24} />
        </div>
      ) : (
        <>
          <Loader loadingStates={loadingStates} loading={isLoading} duration={2000} currentStatus={currentLoadingState} />
          <main>
            {scrapedData && step === "confirmation" && (
              <ListingConfirmation
                data={scrapedData}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
              />
            )}
            {scrapedData && step === "pricing" && (
              <ConfirmPriceAndList
                hostName={scrapedData.host_information.name}
                importedListingId={importedListingId!}
                scrapedData={scrapedData}
                onConfirm={handlePriceConfirm}
              />
            )}
            {!scrapedData && (
              <div className="flex items-center justify-center min-h-screen">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                >
                  <div className="text-center md:text-left">
                    <Image
                      src="/icons/import_listing.png"
                      alt="Import Listing"
                      width={224}
                      height={224}
                      className="mx-auto md:mx-0 mb-6"
                    />
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">
                      Import your listing
                    </h1>
                    <p className="text-slate-600">
                      Enter the URL of your existing listing to automatically import
                      your property details, amenities, and photos.
                    </p>
                  </div>

                  <div className="w-full">
                    <form
                      onSubmit={(e) => {
                        console.log("📝 Form submitted event triggered");
                        handleSubmit(e);
                      }}
                      className="flex flex-col gap-4"
                    >
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://www.airbnb.com/rooms/..."
                        className="w-full bg-slate-100 border-2 border-slate-200 rounded-lg p-4 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="cursor-pointer bg-indigo-500 text-white font-bold py-4 px-8 rounded-lg hover:bg-indigo-600 transition-colors duration-300 disabled:bg-gray-300"
                      >
                        {isLoading ? "Importing..." : "Import"}
                      </button>
                    </form>
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                  </div>
                </motion.div>
              </div>
            )}
          </main>
        </>
      )}
    </div>
  );
};

export default ImportListingPage;
