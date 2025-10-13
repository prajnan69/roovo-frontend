"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Users,
  CheckCircle2,
  Home,
  ArrowRight,
  Star,
  ChevronDown,
  Award,
  XCircle,
  Bath
} from "lucide-react";
import { ListingData } from "@/types";
import CircularGallery from "../CircularGallery";
import { FireworksBackground } from "../Fireworks";
import Image from "next/image";

const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeInOut" as const, delay }
});

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

const BedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 10V7a3 3 0 013-3h10a3 3 0 013 3v3M4 10h16M4 10v10m16-10v10M4 20h16"
    />
  </svg>
);

export default function ListingConfirmationRedesigned({
  data,
  onConfirm,
}: {
  data: ListingData;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [propertyDescription, setPropertyDescription] = useState(data.propertyDescription?.summary || '');
  const [hostAbout, setHostAbout] = useState(data.hostInfo?.about || '');
  const [currentAmenities, setCurrentAmenities] = useState(data.amenities?.included || []);
  const [imageIndex, setImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [showFireworks, setShowFireworks] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFireworks(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setPropertyDescription(data.propertyDescription?.summary || '');
    setHostAbout(data.hostInfo?.about || '');
    setCurrentAmenities(data.amenities?.included || []);
    setImageIndex(0);
  }, [data]);

  const images = data.additionalInfo.imageUrls || [];
  const amenitiesToShow = showAllAmenities
    ? currentAmenities
    : currentAmenities.slice(0, 8);

  const handleRemoveAmenity = (amenityToRemove: string) => {
    setCurrentAmenities((prevAmenities) =>
      prevAmenities.filter((amenity) => amenity !== amenityToRemove)
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {showFireworks && (
        <FireworksBackground className="fixed inset-0 z-50 pointer-events-none" />
      )}
      <motion.div className="mx-auto max-w-7xl py-12 px-4" {...fadeInUp(0)}>
        {/* Image Banner */}
        <div className="relative h-[450px] mb-12">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={imageIndex}
              className={`grid gap-2 h-full rounded-2xl overflow-hidden shadow-xl ${
                images.slice(imageIndex, imageIndex + 5).length === 1 ? "grid-cols-1 grid-rows-1" :
                images.slice(imageIndex, imageIndex + 5).length === 2 ? "grid-cols-2 grid-rows-1" :
                images.slice(imageIndex, imageIndex + 5).length === 3 ? "grid-cols-3 grid-rows-1" :
                images.slice(imageIndex, imageIndex + 5).length === 4 ? "grid-cols-2 grid-rows-2" :
                "grid-cols-4 grid-rows-2"
              }`}
              variants={imageContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {images.slice(imageIndex, imageIndex + 5).map((img, i) => (
                <motion.div
                  key={imageIndex + i}
                  className={`${
                    images.slice(imageIndex, imageIndex + 5).length >= 5 && i === 0 ? "col-span-2 row-span-2" : ""
                  } bg-cover bg-center relative cursor-pointer`}
                  style={{ backgroundImage: `url(${img.url})` }}
                  variants={imageVariants}
                  whileHover={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setShowGallery(true)}
                >
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {img.alt}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
          {imageIndex + 5 < images.length ? (
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

        {showGallery && (
          <CircularGallery
            items={images.map((img) => ({
              image: img.url,
              text: img.alt
            }))}
            font=" 34px 'roboto'"
            textColor="#ffffff"
            borderRadius={0.06}
            bend={2.5}
            onClose={() => setShowGallery(false)}
          />
        )}


        {/* Hero Section */}
        <motion.div {...fadeInUp(0.2)} className="mb-2">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 font-montserrat">
            {data.propertyDetails.title}
          </h1>
          <p className="text-xl text-gray-600 mt-4 flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-gray-500" />
            {data.propertyDetails.location}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            {/* Accommodation Info */}
            <motion.div
              {...fadeInUp(0.25)}
              className="flex flex-wrap items-center gap-6 bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-2 text-gray-700 text-lg">
                <Users className="w-6 h-6 text-gray-500" />
                {data.accommodation.guests} {data.accommodation.guests > 1 ? "guests" : "guest"}
              </div>
              <div className="flex items-center gap-2 text-gray-700 text-lg">
                <Home className="w-6 h-6 text-gray-500" />
                {data.accommodation.bedrooms} {data.accommodation.bedrooms > 1 ? "bedrooms" : "bedroom"}
              </div>
              <div className="flex items-center gap-2 text-gray-700 text-lg">
                <BedIcon />
                {data.accommodation.beds} {data.accommodation.beds > 1 ? "beds" : "bed"}
              </div>
              <div className="flex items-center gap-2 text-gray-700 text-lg">
                <Bath className="w-6 h-6 text-gray-500" />
                {data.accommodation.bathrooms} {data.accommodation.bathrooms > 1 ? "baths" : "bath"}
              </div>
            </motion.div>

            {/* About this property */}
            <motion.div {...fadeInUp(0.35)}>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                About this property
              </h2>
              {isDescriptionExpanded ? (
                <textarea
                  value={propertyDescription}
                  onChange={(e) => setPropertyDescription(e.target.value)}
                  className="w-full text-gray-700 text-lg leading-relaxed border rounded-md p-2"
                  rows={6}
                />
              ) : (
                <p
                  className={`text-gray-700 text-lg leading-relaxed  line-clamp-5`}
                >
                  {propertyDescription}
                </p>
              )}
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className=" cursor-pointer mt-4 inline-flex items-center gap-2 text-indigo-600 font-semibold text-lg hover:text-indigo-800 transition-colors"
              >
                {isDescriptionExpanded ? "Save & Show less" : "Edit & Read more"}{" "}
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    isDescriptionExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            </motion.div>

            {/* Host Section (Moved Below Description) */}
            <motion.div
              {...fadeInUp(0.45)}
              className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg border border-gray-100"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-50/40 to-transparent pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                {/* Host Info */}
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-indigo-100 shadow-lg">
                    {data.hostInfo.photoUrl ? (
                      <Image
                        src={data.hostInfo.photoUrl}
                        alt={data.hostInfo.name}
                        className="w-full h-full object-cover"
                        layout="fill"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-4xl font-bold text-gray-600">
                          {data.hostInfo.name ? data.hostInfo.name.charAt(0).toUpperCase() : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-1">
                      Hosted by {data.hostInfo.name}
                    </h2>

                    <div className="flex items-center flex-wrap text-lg text-gray-600 gap-x-4 gap-y-2">
                      {data.hostInfo?.details && data.hostInfo.details.includes("Superhost") && (
                        <span className="inline-flex items-center">
                          <Award className="w-5 h-5 text-yellow-500 mr-1" />
                          Superhost
                        </span>
                      )}
                      <span className="inline-flex items-center">
                        <Star className="w-5 h-5 text-yellow-500 mr-1" />
                        {data.ratingsAndReviews.overallRating} (
                        {data.ratingsAndReviews.totalReviews} reviews)
                      </span>
                    </div>

                    {data.hostInfo.about && (
                      <p className="text-gray-500 text-base mt-3 max-w-lg leading-relaxed">
                        {hostAbout}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Amenities */}
            <motion.div {...fadeInUp(0.55)}>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                What this place offers
              </h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-lg text-gray-700">
                {amenitiesToShow.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-4 group relative"
                  >
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    <span>{amenity}</span>
                    <button
                      onClick={() => handleRemoveAmenity(amenity)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      aria-label={`Remove ${amenity}`}
                    >
                      <XCircle className="w-5 h-5 text-red-500 cursor-pointer" />
                    </button>
                  </div>
                ))}
              </div>
              {data.amenities.included.length > 8 && (
                <button
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                  className=" cursor-pointer mt-6 inline-flex items-center gap-2 text-indigo-600 font-semibold text-lg hover:text-indigo-800 transition-colors"
                >
                  {showAllAmenities
                    ? "Show less"
                    : `Show all ${data.amenities.included.length} amenities`}
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      showAllAmenities ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}
            </motion.div>

            {/* Reviews */}
            <motion.div {...fadeInUp(0.7)}>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Reviews</h2>
              <div className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-6">
                <Star className="w-7 h-7 text-yellow-500" />
                <span>
                  {data.ratingsAndReviews.overallRating} ·{" "}
                  {data.ratingsAndReviews.totalReviews} reviews
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                {data.ratingsAndReviews.categoryRatings.map((rating, index) => (
                  <div key={`${rating.category}-${index}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-lg text-gray-700">
                        {rating.category}
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        {rating.rating.toFixed(1)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-gray-800 h-1.5 rounded-full"
                        style={{ width: `${(rating.rating / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sticky Confirmation Card */}
          <div className="lg:col-span-1">
            <motion.div
              className="sticky top-24 bg-white p-8 rounded-2xl shadow-2xl mt-28"
              {...fadeInUp(0.8)}
            >
              <h3 className="text-2xl font-bold text-gray-900">Ready to list?</h3>
              <p className="text-gray-600 mt-2 mb-6">
                Confirm the details and get your property live.
              </p>
              <button
                onClick={onConfirm}
                className=" cursor-pointer w-full inline-flex items-center justify-center gap-2 bg-indigo-500 text-white px-6 py-4 rounded-xl shadow-lg hover:bg-indigo-600 active:scale-95 transition text-lg font-bold"
              >
                Confirm pricing & List <ArrowRight className="w-5 h-5" />
              </button>
              {/* <button
                onClick={onCancel}
                className="  w-full text-center text-gray-600 mt-4 hover:text-gray-900 transition"
              >
                Edit details
              </button> */}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
