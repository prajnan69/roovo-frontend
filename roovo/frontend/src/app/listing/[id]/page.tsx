"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { fetchListingById } from '@/services/api';
import { ListingData as Listing } from '@/types';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import HostInfoCard from '@/components/HostInfoCard';
import SleepingArrangements from '@/components/SleepingArrangements';
import HouseRules from '@/components/HouseRules';
import DetailedRatings from '@/components/DetailedRatings';
import ImageGallery from '@/components/import/ImageGallery';
import CircularGallery from '@/components/CircularGallery';
import { useWindowSize } from '@/hooks/useWindowSize';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, XCircle, Share, Heart, ArrowLeft } from 'lucide-react';
import MobileImageCarousel from '@/components/MobileImageCarousel';
import BookingBar from '@/components/BookingBar';
import BookingCard from '@/components/BookingCard';
import { useRouter } from 'next/navigation';

const imageContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.2,
      staggerDirection: -1,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeInOut" as const, delay }
});

const ListingDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [showNotIncluded, setShowNotIncluded] = useState(false);
  const { width } = useWindowSize();
  const isMobile = width < 768;

  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = 'auto';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [isMobile]);
  
  useEffect(() => {
    if (listing) {
      // Preload next set of images
      if (listing.media && imageIndex + 5 < listing.media.allImageUrls.length) {
        const nextImages = listing.media.allImageUrls.slice(imageIndex + 5, imageIndex + 10);
        nextImages.forEach((src: string) => {
          const img = new window.Image();
          img.src = src;
        });
      }
    }
  }, [imageIndex, listing]);

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
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size={24} />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!listing) {
    return <div>Listing not found.</div>;
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {isMobile ? (
        <>
          <div className="bg-gray-100">
          <div className="relative h-[40vh]">
            <MobileImageCarousel images={listing.media.allImageUrls} />
            <div className="absolute top-4 left-4 z-10">
              <button onClick={() => router.back()} className="bg-white/70 backdrop-blur-sm p-2 rounded-full shadow-md">
                <ArrowLeft className="w-5 h-5 text-gray-800" />
              </button>
            </div>
            <div className="absolute top-4 right-4 flex space-x-2 z-10">
              <button className="bg-white/70 backdrop-blur-sm p-2 rounded-full shadow-md">
                <Share className="w-5 h-5 text-gray-800" />
              </button>
              <button className="bg-white/70 backdrop-blur-sm p-2 rounded-full shadow-md">
                <Heart className="w-5 h-5 text-gray-800" />
              </button>
            </div>
          </div>
            <div className="bg-white rounded-t-2xl -mt-8 p-6 relative z-10 pb-24">
              <motion.h1 {...fadeInUp(0.1)} className="text-2xl font-bold tracking-tight text-gray-900 font-montserrat">
                {listing.title}
              </motion.h1>
              <motion.p {...fadeInUp(0.2)} className="text-sm text-gray-600 mt-1">
                {listing.location_and_neighborhood?.address}
              </motion.p>
              <motion.p {...fadeInUp(0.25)} className="text-sm text-gray-600 mt-2">
                {listing.property_type} · {listing.accommodation?.sleepingArrangements.reduce((acc, curr) => acc + parseInt(curr.beds), 0)} beds · {listing.accommodation?.totalBathrooms} bath · {listing.house_rules?.maxGuests} guests max
              </motion.p>
              <motion.div {...fadeInUp(0.3)} className="flex items-center text-sm text-gray-600 mt-2">
                {listing.ratings_and_reviews?.overallRating ? (
                  <>
                    <span>★ {listing.ratings_and_reviews.overallRating.toFixed(1)}</span>
                  </>
                ) : null}
              </motion.div>
              <div className="border-t border-gray-200 my-6" />
              <motion.p {...fadeInUp(0.3)} className="text-gray-700 text-base leading-relaxed">
                {listing.property_description?.theSpace}
              </motion.p>
              <div className="border-t border-gray-200 my-6" />
              <motion.div {...fadeInUp(0.4)}>
                <HostInfoCard hostInformation={listing.host_information} reviewsAndRatings={listing.ratings_and_reviews} />
              </motion.div>
              <div className="border-t border-gray-200 my-6" />
              <motion.div {...fadeInUp(0.5)}>
                <SleepingArrangements arrangements={listing.accommodation?.sleepingArrangements} />
              </motion.div>
              <div className="border-t border-gray-200 my-6" />
              <motion.div {...fadeInUp(0.6)}>
                <h2 className="text-xl font-bold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {listing.amenities.included.slice(0, 6).map((amenity: string) => (
                    <div key={amenity} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
                {listing.amenities.included.length > 6 && (
                  <button className="mt-4 text-sm font-semibold underline">Show all amenities</button>
                )}
                <div className="mt-4">
                  <button
                    onClick={() => setShowNotIncluded(!showNotIncluded)}
                    className="cursor-pointer inline-flex items-center gap-2 text-gray-600 font-semibold text-base hover:text-gray-800 transition-colors"
                  >
                    Show not included amenities
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        showNotIncluded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {showNotIncluded && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-700 mt-4">
                      {listing.amenities.notIncluded.map((amenity: string) => (
                        <div
                          key={amenity}
                          className="flex items-center gap-4 group relative"
                        >
                          <XCircle className="w-5 h-5 text-red-500" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
              <div className="border-t border-gray-200 my-6" />
              <motion.div {...fadeInUp(0.7)}>
                <HouseRules rules={listing.house_rules} />
              </motion.div>
              <div className="border-t border-gray-200 my-6" />
              <motion.div {...fadeInUp(0.8)} id="reviews">
                <DetailedRatings ratings={listing.ratings_and_reviews} />
              </motion.div>
            </div>
          </div>
          <BookingBar price={listing.price_per_night} />
        </>
      ) : (
        <div className="mx-auto max-w-7xl py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
          {showGallery && (
            <CircularGallery
              items={listing.media.allImageUrls.map((img: string) => ({
                image: img,
                text: "Listing image",
              }))}
              font=" 34px 'roboto'"
              textColor="#ffffff"
              borderRadius={0.06}
              bend={2.5}
              onClose={() => setShowGallery(false)}
            />
          )}
          <div className="relative h-[300px] sm:h-[450px] mb-8 sm:mb-12 z-0">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={imageIndex}
                className={`grid gap-2 h-full rounded-2xl overflow-hidden shadow-xl ${
                  listing.media.allImageUrls.slice(imageIndex, imageIndex + 5).length === 1 ? "grid-cols-1 grid-rows-1" :
                  listing.media.allImageUrls.slice(imageIndex, imageIndex + 5).length === 2 ? "grid-cols-2 grid-rows-1" :
                  listing.media.allImageUrls.slice(imageIndex, imageIndex + 5).length === 3 ? "grid-cols-3 grid-rows-1" :
                  listing.media.allImageUrls.slice(imageIndex, imageIndex + 5).length === 4 ? "grid-cols-2 grid-rows-2" :
                  "grid-cols-4 grid-rows-2"
                }`}
                variants={imageContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {listing.media.allImageUrls.slice(imageIndex, imageIndex + 5).map((img: string, i: number) => (
                  <motion.div
                    key={imageIndex + i}
                    className={`${
                      listing.media.allImageUrls.slice(imageIndex, imageIndex + 5).length >= 5 && i === 0 ? "col-span-2 row-span-2" : ""
                    } bg-cover bg-center relative cursor-pointer`}
                    style={{ backgroundImage: `url(${img})` }}
                    variants={imageVariants}
                    onClick={() => setShowGallery(true)}
                  >
                    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
            {imageIndex + 5 < listing.media.allImageUrls.length ? (
              <button
                onClick={() => setImageIndex(imageIndex + 5)}
                className="absolute bottom-4 right-4 bg-white/50 backdrop-blur-sm text-gray-800 font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-white/75 transition-colors cursor-pointer"
              >
                Show more pictures
              </button>
            ) : (
              <button
                onClick={() => setImageIndex(0)}
                className="absolute bottom-4 right-4 bg-white/50 backdrop-blur-sm text-gray-800 font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-white/75 transition-colors cursor-pointer"
              >
                Back to start
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-8 sm:space-y-12">
              <motion.h1 {...fadeInUp(0.1)} className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 font-montserrat">
                {listing.title}
              </motion.h1>
              <motion.p {...fadeInUp(0.2)} className="text-base sm:text-lg lg:text-xl text-gray-600 mt-2 sm:mt-4 flex items-start sm:items-center">
                {listing.location_and_neighborhood.address}
              </motion.p>
            <motion.p {...fadeInUp(0.3)} className="text-gray-700 text-base sm:text-lg leading-relaxed">
              {listing.property_description?.theSpace}
            </motion.p>
            <motion.div {...fadeInUp(0.4)}>
              <HostInfoCard hostInformation={listing.host_information} reviewsAndRatings={listing.ratings_and_reviews} />
            </motion.div>
            <motion.div {...fadeInUp(0.5)}>
              <SleepingArrangements arrangements={listing.accommodation?.sleepingArrangements} />
            </motion.div>
            <motion.div {...fadeInUp(0.6)}>
              <h2 className="text-2xl font-bold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-4">
                {listing.amenities.included.map((amenity: string) => (
                  <div key={amenity} className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setShowNotIncluded(!showNotIncluded)}
                  className="cursor-pointer inline-flex items-center gap-2 text-gray-600 font-semibold text-lg hover:text-gray-800 transition-colors"
                >
                  Show not included amenities
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      showNotIncluded ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showNotIncluded && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-base sm:text-lg text-gray-700 mt-4">
                    {listing.amenities.notIncluded.map((amenity: string) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-4 group relative"
                      >
                        <XCircle className="w-6 h-6 text-red-500" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
            <motion.div {...fadeInUp(0.7)}>
              <HouseRules rules={listing.house_rules} />
            </motion.div>
            <motion.div {...fadeInUp(0.8)}>
              <DetailedRatings ratings={listing.ratings_and_reviews} />
            </motion.div>
          </div>
          <div className="hidden lg:block lg:col-span-1">
            <BookingCard price={listing.price_per_night} />
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default ListingDetailsPage;
