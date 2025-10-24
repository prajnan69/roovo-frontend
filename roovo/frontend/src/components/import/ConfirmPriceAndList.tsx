"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ArrowRight,
  Coins,
  Sparkles,
  Building2,
  Info,
  BarChart3,
  Crown,
  Wallet,
  BadgeCheck,
  TrendingUp,
} from "lucide-react";
import BestValueBadgeInfo from "../BestValueBadgeInfo";

// --- INTERFACES ---
import { ListingData } from "@/types";

interface ConfirmPriceAndListProps {
  hostName: string;
  importedListingId: string;
  scrapedData: ListingData;
  onConfirm: (
    price: number,
    model: "subscription" | "casual"
  ) => void;
}

// --- CONSTANTS ---
const AIRBNB_HOST_COMMISSION = 0.17; // 14% guest fee + 3% host fee
const ROOVO_CASUAL_HOST_COMMISSION = 0.05;
const ROOVO_CASUAL_GUEST_FEE = 0.05;
const ROOVO_SUBSCRIPTION_FEE_MONTHLY = 1000;
const RECOMMENDED_DISCOUNT_PERCENT = 6;
const BADGE_UNLOCK_THRESHOLD_PERCENT = 5;

// --- COMPONENT ---
export default function ConfirmPriceAndList({
  hostName,
  importedListingId,
  scrapedData,
  onConfirm,
}: ConfirmPriceAndListProps) {
  // --- STATE ---
  const [discountPercent, setDiscountPercent] = useState(RECOMMENDED_DISCOUNT_PERCENT);
  const [model, setModel] = useState<"subscription" | "casual">("casual");
  const [showBadgeInfo, setShowBadgeInfo] = useState(false);

  // --- DERIVED VALUES & CALCULATIONS (using useMemo for performance) ---
  const calculations = useMemo(() => {
    const airbnbBasePrice = scrapedData.bookingAndAvailability.price.pricePerNight;
    const roovoPrice = airbnbBasePrice * (1 - discountPercent / 100);
    
    // Per Night Calculations
    const airbnbHostGets = airbnbBasePrice * (1 - AIRBNB_HOST_COMMISSION);
    const roovoCasualHostGets = roovoPrice * (1 - ROOVO_CASUAL_HOST_COMMISSION);
    const roovoSubHostGets = roovoPrice; // 100% of the set price

    // Guest pays...
    const airbnbGuestPays = airbnbBasePrice; // Assuming host-only fee is baked in
    const roovoCasualGuestPays = roovoPrice * (1 + ROOVO_CASUAL_GUEST_FEE);
    const roovoSubGuestPays = roovoPrice;
    
    const isBadgeUnlocked = discountPercent >= BADGE_UNLOCK_THRESHOLD_PERCENT;

    const bookingDays = 25;
    const airbnbLost = (roovoPrice * bookingDays) - (airbnbHostGets * bookingDays);
    const roovoCasualEarns = (roovoCasualHostGets * bookingDays) - (airbnbHostGets * bookingDays);
    const roovoSubEarns = (roovoSubHostGets * bookingDays) - (airbnbHostGets * bookingDays);

    return {
      roovoPrice,
      airbnbHostGets,
      roovoCasualHostGets,
      roovoSubHostGets,
      airbnbGuestPays,
      roovoCasualGuestPays,
      roovoSubGuestPays,
      isBadgeUnlocked,
      airbnbLost,
      roovoCasualEarns,
      roovoSubEarns,
    };
  }, [scrapedData, discountPercent]);

  const {
    roovoPrice,
    airbnbHostGets,
    roovoCasualHostGets,
    roovoSubHostGets,
    airbnbGuestPays,
    roovoCasualGuestPays,
    roovoSubGuestPays,
    isBadgeUnlocked,
    airbnbLost,
    roovoCasualEarns,
    roovoSubEarns,
  } = calculations;

  // --- ANIMATION VARIANTS ---
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  const popIn: Variants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    exit: { scale: 0.8, opacity: 0 },
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* --- HEADER --- */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Welcome, {hostName}! Let's Price Your Listing.
          </h1>
          <p className="mt-3 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            We've imported your listing. Now, let's unlock your true earning potential on Roovo.
          </p>
        </motion.div>

        {/* --- THE ROOVO ADVANTAGE & PRICING ENGINE --- */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={1}
          variants={fadeUp}
          className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-12"
        >
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <TrendingUp className="text-green-500 w-8 h-8" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">The Roovo Advantage Slider</h2>
          </div>
          <p className="text-gray-600 mb-6 max-w-3xl">
            Your current Airbnb price is <span className="font-bold text-gray-800">₹{scrapedData.bookingAndAvailability.price.pricePerNight.toFixed(2)}</span>. Because Roovo's fees are lower, you can offer a better price to guests and <span className="font-bold text-green-600">still earn more</span>. Use the slider to see for yourself.
          </p>

          <div className="flex items-center gap-6 mb-6">
            <input
              type="range"
              min="0"
              max="25" // Max 25% discount
              step="1"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-indigo-600">
                {discountPercent}%
              </span>
              <span className="text-sm text-gray-500">Discount</span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 p-4 bg-gray-50 rounded-xl">
             <div className="text-center">
                <p className="text-gray-600">Your New Price on Roovo</p>
                <p className="text-3xl font-extrabold text-gray-900">₹{roovoPrice.toFixed(2)}</p>
             </div>
             <AnimatePresence mode="wait">
                {isBadgeUnlocked && (
                    <motion.div
                        key="badge"
                        variants={popIn}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold"
                        onHoverStart={() => setShowBadgeInfo(true)}
                        onHoverEnd={() => setShowBadgeInfo(false)}
                        onClick={() => setShowBadgeInfo(!showBadgeInfo)}
                    >
                        <BadgeCheck size={20} />
                        'Best Value' Badge Unlocked!
                    </motion.div>
                )}
             </AnimatePresence>
          </div>
        </motion.div>

        {showBadgeInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <BestValueBadgeInfo airbnbBasePrice={scrapedData.bookingAndAvailability.price.pricePerNight} />
              <button onClick={() => setShowBadgeInfo(false)} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg">Close</button>
            </div>
          </div>
        )}

        {/* --- EARNINGS COMPARISON --- */}
        <motion.div 
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-900">Your Profit Per Night</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Airbnb Column */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border text-center">
                <Building2 className="w-8 h-8 mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-semibold text-gray-700">On Airbnb</h3>
                <p className="text-gray-500 text-sm mb-2">Platform takes ≈{AIRBNB_HOST_COMMISSION * 100}%</p>
                <p className="text-3xl font-bold text-gray-800">₹{airbnbHostGets.toFixed(2)}</p>
                <p className="text-red-500 text-sm mt-2">You lose ₹{airbnbLost.toFixed(2)} for 25 days</p>
            </div>
            
            {/* Roovo Casual Column */}
            <div 
              onClick={() => setModel('casual')}
              className={`p-6 rounded-2xl shadow-sm border-2 cursor-pointer transition-all text-center ${model === 'casual' ? 'border-indigo-500 bg-indigo-50 scale-105 shadow-xl' : 'bg-white hover:border-gray-300'}`}
            >
                <Wallet className="w-8 h-8 mx-auto text-indigo-500 mb-3" />
                <h3 className="text-lg font-semibold text-indigo-800">On Roovo (Casual)</h3>
                <p className="text-indigo-600 text-sm mb-2">You pay 5% commission</p>
                <p className="text-4xl font-extrabold text-indigo-600">₹{roovoCasualHostGets.toFixed(2)}</p>
                <p className="text-green-500 text-sm mt-2">You earn ₹{roovoCasualEarns.toFixed(2)} more for 25 days</p>
            </div>

            {/* Roovo Subscription Column */}
            <div
              onClick={() => setModel('subscription')}
              className={`p-6 rounded-2xl shadow-sm border-2 cursor-pointer transition-all text-center ${model === 'subscription' ? 'border-indigo-500 bg-indigo-50 scale-105 shadow-xl' : 'bg-white hover:border-gray-300'}`}
            >
                <Crown className="w-8 h-8 mx-auto text-indigo-500 mb-3" />
                <h3 className="text-lg font-semibold text-indigo-800">On Roovo (Subscription)</h3>
                <p className="text-indigo-600 text-sm mb-2">You keep 100%</p>
                <p className="text-4xl font-extrabold text-indigo-600">₹{roovoSubHostGets.toFixed(2)}</p>
                <p className="text-green-500 text-sm mt-2">You earn ₹{roovoSubEarns.toFixed(2)} more for 25 days</p>
            </div>
          </div>
        </motion.div>

        {/* --- FINAL MODEL SELECTION & SUMMARY --- */}
        <motion.div
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeUp}
            className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
        >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-900">Confirm Your Model</h2>
            <div className="max-w-xl mx-auto text-center">
                <AnimatePresence mode="wait">
                    <motion.div key={model} variants={popIn} initial="hidden" animate="visible" exit="exit">
                        {model === 'casual' ? (
                            <div>
                                <h3 className="text-2xl font-bold text-indigo-700">You've selected Casual Host</h3>
                                <p className="mt-2 text-gray-600">
                                    Guests will see a price of <span className="font-semibold">₹{roovoCasualGuestPays.toFixed(2)}</span>. You pay nothing upfront and we handle the GST for you. It's the simplest way to get started.
                                </p>
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-2xl font-bold text-indigo-700">You've selected Subscription Host</h3>
                                <p className="mt-2 text-gray-600">
                                    Guests will see your price of <span className="font-semibold">₹{roovoPrice.toFixed(2)}</span>. You pay a fixed <span className="font-semibold">₹{ROOVO_SUBSCRIPTION_FEE_MONTHLY}/month</span> to keep 100% of your earnings. This is the most profitable choice for active hosts.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>


        {/* --- CONFIRM BUTTON --- */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={4}
          variants={fadeUp}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(99, 102, 241, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onConfirm(roovoPrice, model)}
            className="inline-flex items-center justify-center gap-3 bg-indigo-600 text-white px-12 py-4 rounded-full shadow-lg hover:bg-indigo-700 active:scale-95 transition-transform text-xl font-bold"
          >
            Confirm & List on Roovo
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
