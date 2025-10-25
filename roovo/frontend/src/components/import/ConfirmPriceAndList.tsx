"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Crown,
  Wallet,
  BadgeCheck,
  TrendingUp,
} from "lucide-react";
import BestValueBadgeInfo from "../BestValueBadgeInfo";
import { SlidingNumber } from "@/components/ui/shadcn-io/sliding-number";
import { ListingData } from "@/types";
import { Switch } from "@/components/ui/switch";

interface ConfirmPriceAndListProps {
  hostName: string;
  importedListingId: string;
  scrapedData: ListingData;
  onConfirm: (price: number, model: "subscription" | "casual", autoBookable: boolean) => void;
}

// --- CONSTANTS ---
const AIRBNB_HOST_COMMISSION = 0.17;
const ROOVO_CASUAL_HOST_COMMISSION = 0.05;
const ROOVO_CASUAL_GUEST_FEE = 0.05;
const ROOVO_SUBSCRIPTION_FEE_MONTHLY = 1000;
const RECOMMENDED_DISCOUNT_PERCENT = 6;
const BADGE_UNLOCK_THRESHOLD_PERCENT = 5;

export default function ConfirmPriceAndList({
  hostName,
  scrapedData,
  onConfirm,
}: ConfirmPriceAndListProps) {
  const [discountPercent, setDiscountPercent] = useState(RECOMMENDED_DISCOUNT_PERCENT);
  const [model, setModel] = useState<"subscription" | "casual">("casual");
  const [autoBookable, setAutoBookable] = useState(true);
  const [showBadgeInfo, setShowBadgeInfo] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // --- Sticky on mobile ---
  useEffect(() => {
    const handleScroll = () => {
      if (!sliderRef.current) return;
      const top = sliderRef.current.getBoundingClientRect().top;
      setIsSticky(top <= 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- CALCULATIONS ---
  const calculations = useMemo(() => {
    const airbnbBasePrice = scrapedData.bookingAndAvailability.price.pricePerNight;
    const roovoPrice = airbnbBasePrice * (1 - discountPercent / 100);
    const airbnbHostGets = airbnbBasePrice * (1 - AIRBNB_HOST_COMMISSION);
    const roovoCasualHostGets = roovoPrice * (1 - ROOVO_CASUAL_HOST_COMMISSION);
    const roovoSubHostGets = roovoPrice;
    const roovoCasualGuestPays = roovoPrice * (1 + ROOVO_CASUAL_GUEST_FEE);
    const isBadgeUnlocked = discountPercent >= BADGE_UNLOCK_THRESHOLD_PERCENT;
    const bookingDays = 25;
    const airbnbLost = (roovoPrice * bookingDays) - (airbnbHostGets * bookingDays);
    const roovoCasualEarns = (roovoCasualHostGets * bookingDays) - (airbnbHostGets * bookingDays);
    const roovoSubEarns = (roovoSubHostGets * bookingDays) - (airbnbHostGets * bookingDays);

    return {
      airbnbBasePrice,
      roovoPrice,
      airbnbHostGets,
      roovoCasualHostGets,
      roovoSubHostGets,
      roovoCasualGuestPays,
      isBadgeUnlocked,
      airbnbLost,
      roovoCasualEarns,
      roovoSubEarns,
    };
  }, [scrapedData, discountPercent]);

  const {
    airbnbBasePrice,
    roovoPrice,
    airbnbHostGets,
    roovoCasualHostGets,
    roovoSubHostGets,
    roovoCasualGuestPays,
    isBadgeUnlocked,
    airbnbLost,
    roovoCasualEarns,
    roovoSubEarns,
  } = calculations;

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  const popIn: Variants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 250, damping: 20 },
    },
    exit: { scale: 0.95, opacity: 0 },
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* --- HEADER --- */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900">
            Welcome, {hostName}! Let’s Price Your Listing.
          </h1>
          <p className="mt-3 text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            We've imported your listing. Now, let’s unlock your true earning potential on Roovo.
          </p>
        </motion.div>

        {/* --- MOBILE STICKY SLIDER --- */}
        <div ref={sliderRef} className="md:hidden mb-8">
          <div
            className={`transition-all duration-300 ${
              isSticky
                ? "fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-md"
                : "bg-white rounded-2xl shadow-lg border border-gray-100"
            }`}
          >
            <div className="p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="text-green-500 w-5 h-5" />
                <h2 className="text-lg font-semibold text-gray-900">The Roovo Advantage</h2>
              </div>
              <p className="text-xs text-gray-600 text-center mb-4">
                What guests pay on Airbnb is{" "}
                <span className="font-semibold text-gray-800">₹{airbnbBasePrice.toFixed(2)}</span>.{" "}
                Because Roovo’s fees are lower, you can offer a better price and{" "}
                <span className="text-green-600 font-semibold">still earn more</span>.
              </p>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="1"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <div className="flex flex-col items-center justify-center w-14">
                  <span className="text-lg font-bold text-indigo-600">{discountPercent}%</span>
                  <span className="text-[10px] text-gray-500">Discount</span>
                </div>
              </div>
              <div className="mt-3 flex justify-center gap-2">
                <p className="text-sm text-gray-600">New Price:</p>
                <p className="text-lg font-bold text-gray-900">
                  ₹<SlidingNumber number={roovoPrice} decimalPlaces={2} />
                </p>
              </div>
              {isBadgeUnlocked && (
                <div className="flex items-center justify-center gap-1 mt-2">
                  <div className="flex items-center gap-1 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                    <BadgeCheck size={14} /> 'Best Value' Badge Unlocked!
                  </div>
                  <button
                    className="text-xs text-gray-500 hover:text-gray-700"
                    onClick={() => setShowBadgeInfo(true)}
                  >
                    Know More
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className={isSticky ? "h-[210px]" : ""}></div>
        </div>

        {/* --- DESKTOP SLIDER (unchanged) --- */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={1}
          variants={fadeUp}
          className="hidden md:block bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-green-500 w-7 h-7" />
            <h2 className="text-2xl font-bold text-gray-900">The Roovo Advantage Slider</h2>
          </div>
          <p className="text-gray-600 mb-6">
            What guests pay on Airbnb is{" "}
            <span className="font-bold text-gray-800">₹{airbnbBasePrice.toFixed(2)}</span>. Because
            Roovo’s fees are lower, you can offer a better price and{" "}
            <span className="font-bold text-green-600">still earn more</span>.
          </p>

          <div className="flex items-center gap-6 mb-6">
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-indigo-600">{discountPercent}%</span>
              <span className="text-sm text-gray-500">Discount</span>
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-700 text-lg font-semibold">
              New Roovo Price:{" "}
              <span className="text-2xl font-bold text-gray-900">
                ₹<SlidingNumber number={roovoPrice} decimalPlaces={2} />
              </span>
            </p>
            {isBadgeUnlocked && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold text-sm">
                  <BadgeCheck size={18} /> 'Best Value' Badge Unlocked!
                </div>
                <button
                  className="text-xs text-gray-500 hover:text-gray-700"
                  onClick={() => setShowBadgeInfo(true)}
                >
                  Know More
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {showBadgeInfo && (
          <BestValueBadgeInfo onClose={() => setShowBadgeInfo(false)} airbnbBasePrice={scrapedData.bookingAndAvailability.price.pricePerNight} />
        )}

        {/* --- EARNINGS COMPARISON --- */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
            Compare Your Earnings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Airbnb (non-clickable, lighter) */}
            <div className="bg-gray-100 p-6 rounded-2xl border text-center">
              <Building2 className="w-7 h-7 mx-auto text-gray-400 mb-2" />
              <h3 className="text-base font-semibold text-gray-700">Airbnb</h3>
              <p className="text-gray-500 text-xs mb-2">≈17% platform fee</p>
              <p className="text-2xl font-bold text-gray-800">
                ₹<SlidingNumber number={airbnbHostGets} decimalPlaces={2} />
              </p>
              <p className="text-red-500 text-xs mt-1">
                Lose ₹<SlidingNumber number={airbnbLost} decimalPlaces={2} /> / 25 days
              </p>
            </div>

            {/* Casual (clickable) */}
            <div
              onClick={() => setModel("casual")}
              className={`p-6 rounded-2xl shadow border-2 cursor-pointer text-center transition-all ${
                model === "casual"
                  ? "border-indigo-500 bg-indigo-50 scale-105 shadow-lg"
                  : "bg-white hover:border-gray-200"
              }`}
            >
              <Wallet className="w-7 h-7 mx-auto text-indigo-500 mb-2" />
              <h3 className="text-base font-semibold text-indigo-700">Roovo Casual</h3>
              <p className="text-indigo-600 text-xs mb-2">5% commission</p>
              <p className="text-2xl font-bold text-indigo-600">
                ₹<SlidingNumber number={roovoCasualHostGets} decimalPlaces={2} />
              </p>
              <p className="text-green-500 text-xs mt-1">
                Earn ₹<SlidingNumber number={roovoCasualEarns} decimalPlaces={2} /> / 25 days
              </p>
            </div>

            {/* Subscription (clickable) */}
            <div
              onClick={() => setModel("subscription")}
              className={`p-6 rounded-2xl shadow border-2 cursor-pointer text-center transition-all ${
                model === "subscription"
                  ? "border-indigo-500 bg-indigo-50 scale-105 shadow-lg"
                  : "bg-white hover:border-gray-200"
              }`}
            >
              <Crown className="w-7 h-7 mx-auto text-indigo-500 mb-2" />
              <h3 className="text-base font-semibold text-indigo-700">
                Roovo Subscription
              </h3>
              <p className="text-indigo-600 text-xs mb-2">Keep 100%</p>
              <p className="text-2xl font-bold text-indigo-600">
                ₹<SlidingNumber number={roovoSubHostGets} decimalPlaces={2} />
              </p>
              <p className="text-green-500 text-xs mt-1">
                Earn ₹<SlidingNumber number={roovoSubEarns} decimalPlaces={2} /> / 25 days
              </p>
            </div>
          </div>
        </motion.section>

        {/* --- CONFIRM SECTION --- */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3}
          className="mt-12 bg-white p-6 sm:p-8 rounded-2xl shadow border"
        >
          <div className="text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={model}
                variants={popIn}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {model === "casual" ? (
                  <>
                    <h3 className="text-xl font-bold text-indigo-600">
                      You’ve selected Casual Host
                    </h3>
                    <p className="mt-2 text-gray-600 text-sm sm:text-base">
                      Guests see <span className="font-semibold">₹{roovoCasualGuestPays.toFixed(2)}</span>.  
                      Pay nothing upfront — simple and flexible.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-indigo-600">
                      You’ve selected Subscription Host
                    </h3>
                    <p className="mt-2 text-gray-600 text-sm sm:text-base">
                      Guests see <span className="font-semibold">₹{roovoPrice.toFixed(2)}</span>.  
                      Pay <span className="font-semibold">₹{ROOVO_SUBSCRIPTION_FEE_MONTHLY}/month</span> to keep 100%.
                    </p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center mt-8 space-x-2">
            <Switch
              id="auto-bookable"
              checked={autoBookable}
              onCheckedChange={setAutoBookable}
            />
            <label htmlFor="auto-bookable" className="text-sm font-medium text-gray-700">
              {autoBookable ? "Auto Bookable" : "Manual Confirmation"}
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 8px 15px rgba(99, 102, 241, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onConfirm(roovoPrice, model, autoBookable)}
            className="w-full mt-8 inline-flex items-center justify-center gap-3 bg-indigo-500 text-white px-6 py-4 rounded-full shadow-md hover:bg-indigo-600 text-lg font-semibold"
          >
            Confirm & List on Roovo
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.section>
      </div>
    </div>
  );
}
