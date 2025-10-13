"use client";

"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import ListingConfirmation from '@/components/import/ListingConfirmation';
import { ListingData } from '@/types';
import { MultiStepLoader as Loader } from '@/components/ui/multi-step-loader';
import Image from 'next/image';
import { API_BASE_URL } from '@/services/api';

const loadingStates = [
  {
    text: "Importing listing data",
  },
  {
    text: "Analyzing property details",
  },
  {
    text: "Fetching amenities and house rules",
  },
  {
    text: "Finalizing import",
  },
];

const ImportListingPage = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState<ListingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setScrapedData(null);

    setTimeout(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/scrape`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) {
          throw new Error('Failed to scrape the listing.');
        }

        const responseData = await response.json();
        console.log('Scraped data:', responseData);

        // Transform the response to match the ListingData interface
        const transformedData: ListingData = {
          propertyDetails: responseData['Property Details'],
          accommodation: responseData.Accommodation,
          ratingsAndReviews: responseData['Ratings and Reviews'],
          hostInfo: responseData['Host Information'],
          propertyDescription: responseData['Property Description'],
          amenities: responseData.Amenities,
          houseRules: responseData['House Rules'],
          safetyInfo: responseData['Safety Information'],
          additionalInfo: responseData['Additional Information'],
        };

        setScrapedData(transformedData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleConfirm = () => {
    // TODO: Implement the logic to save the listing
    console.log('Listing confirmed:', scrapedData);
    alert('Listing confirmed! (Check console for data)');
    setScrapedData(null);
    setUrl('');
  };

  const handleCancel = () => {
    setScrapedData(null);
    setUrl('');
  };

  return (
    <div className="min-h-screen bg-white">
      <Loader loadingStates={loadingStates} loading={isLoading} duration={2000} />
      <main className="px-8">
        {scrapedData ? (
          <ListingConfirmation data={scrapedData} onConfirm={handleConfirm} onCancel={handleCancel} />
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            >
              <div className="text-center md:text-left">
                <Image src="/icons/import_listing.png" alt="Import Listing" width={224} height={224} className="mx-auto md:mx-0 mb-6" />
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Import your listing</h1>
                <p className="text-slate-600">
                  Enter the URL of your existing listing to automatically import your property details, amenities, and photos.
                </p>
              </div>
              <div className="w-full">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                    className=" cursor-pointer bg-indigo-500 text-white font-bold py-4 px-8 rounded-lg hover:bg-indigo-600 transition-colors duration-300 disabled:bg-gray-300"
                  >
                    {isLoading ? 'Importing...' : 'Import'}
                  </button>
                </form>
                {error && <p className="text-red-500 mt-4">{error}</p>}
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ImportListingPage;
