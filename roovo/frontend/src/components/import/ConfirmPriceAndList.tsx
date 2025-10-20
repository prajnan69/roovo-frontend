"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  Coins,
  Sparkles,
  Building2,
  CreditCard,
  Info,
  Wallet,
  BarChart3,
  Crown,
} from "lucide-react";

interface ConfirmPriceAndListProps {
  hostName: string;
  onConfirm: (
    price: number,
    weekendPercentage: number,
    model: "subscription" | "casual"
  ) => void;
}

export default function ConfirmPriceAndList({
  hostName,
  onConfirm,
}: ConfirmPriceAndListProps) {
  const [price, setPrice] = useState(1000);
  const [weekendPercentage, setWeekendPercentage] = useState(10);
  const [model, setModel] = useState<"subscription" | "casual">("casual");

  // Pricing calculations
  const bookingDays = 25;
  const weekendPrice = price * (1 + weekendPercentage / 100);
  const airbnbUserPays = price * 1.25; 
  const airbnbHostGets = price * 0.85;
  const roovoCasualUserPays = price * 1.05;
  const roovoCasualHostGets = price * 0.95;
  const roovoSubUserPays = price;
  const roovoSubHostGets = price;

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
    }),
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <motion.div
        className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        {/* Header */}
        <motion.div
          custom={0}
          variants={fadeUp}
          className="text-center mb-12 space-y-2"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Hi {hostName} 👋, let’s set your price
          </h1>
          <p className="text-lg text-gray-600">
            Choose your pricing style and see how <span className="font-semibold text-indigo-600">Roovo</span> helps you earn more.
          </p>
        </motion.div>

        {/* Pricing Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Base Price */}
          <motion.div
            custom={1}
            variants={fadeUp}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <Coins className="text-indigo-500 w-6 h-6" />
              <h2 className="text-xl font-semibold">Base Price per Night</h2>
            </div>
            <div className="relative mt-2">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full text-3xl font-bold p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all"
              />
              <span className="absolute right-5 top-4 text-gray-500 font-semibold text-xl">
                ₹
              </span>
            </div>
          </motion.div>

          {/* Weekend Pricing */}
          <motion.div
            custom={2}
            variants={fadeUp}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="text-indigo-500 w-6 h-6" />
              <h2 className="text-xl font-semibold">Weekend Price Boost</h2>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={weekendPercentage}
                onChange={(e) => setWeekendPercentage(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <motion.span
                key={weekendPercentage}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-2xl font-bold text-indigo-600"
              >
                {weekendPercentage}%
              </motion.span>
            </div>
            <p className="mt-2 text-gray-600">
              Weekend rate will be{" "}
              <span className="font-semibold">₹{weekendPrice.toFixed(2)}</span>
            </p>
          </motion.div>
        </div>

        {/* Plan Selection */}
        <motion.div
          custom={3}
          variants={fadeUp}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          <motion.div
            onClick={() => setModel("subscription")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`cursor-pointer border rounded-2xl p-8 transition-all shadow-sm ${
              model === "subscription"
                ? "border-indigo-500 ring-2 ring-indigo-300 bg-indigo-50"
                : "border-gray-200 bg-white hover:border-indigo-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <Crown className="text-indigo-500 w-6 h-6" />
              <h3 className="text-2xl font-bold">Subscription Host</h3>
            </div>
            <p className="text-gray-600">
              Pay <span className="font-semibold text-indigo-600">₹1000/month</span> and keep 100% of what you earn.
            </p>
            <p className="mt-4 text-sm text-gray-500 flex items-center gap-2">
              <Info size={16} /> Guests pay exactly what you set. No markup.
            </p>
          </motion.div>

          <motion.div
            onClick={() => setModel("casual")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`cursor-pointer border rounded-2xl p-8 transition-all shadow-sm ${
              model === "casual"
                ? "border-indigo-500 ring-2 ring-indigo-300 bg-indigo-50"
                : "border-gray-200 bg-white hover:border-indigo-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <Wallet className="text-indigo-500 w-6 h-6" />
              <h3 className="text-2xl font-bold">Casual Host</h3>
            </div>
            <p className="text-gray-600">
              No subscription fee. Guests pay 5% extra, you get 95%.
            </p>
            <p className="mt-4 text-sm text-gray-500 flex items-center gap-2">
              <Info size={16} /> Good for occasional listings.
            </p>
          </motion.div>
        </motion.div>

        {/* Comparison Section */}
        <motion.div
          custom={4}
          variants={fadeUp}
          className="bg-white p-8 rounded-2xl shadow-md border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-indigo-500 w-6 h-6" />
            <h2 className="text-2xl font-bold">Earnings Comparison</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            {/* Airbnb */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <Building2 className="w-8 h-8 mx-auto text-gray-500 mb-2" />
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Airbnb</h3>
              <div className="space-y-1">
                <p className="text-gray-600">Guest pays: <span className="font-bold">₹{airbnbUserPays.toFixed(2)}</span></p>
                <p className="text-gray-600">Host gets: <span className="font-bold">₹{airbnbHostGets.toFixed(2)}</span></p>
              </div>
              <p className="text-red-500 font-semibold mt-4 text-sm">
                You lose ₹{(price * bookingDays - airbnbHostGets * bookingDays).toFixed(0)} / month
              </p>
            </div>

            {/* Roovo */}
            <div
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                model === "casual" ? "border-indigo-500 bg-indigo-50 shadow-lg" : "border-indigo-500 bg-indigo-50 shadow-lg"
              }`}
            >
              {model === "casual" ? (
                <CreditCard className="w-8 h-8 mx-auto text-indigo-500 mb-2" />
              ) : (
                <Crown className="w-8 h-8 mx-auto text-indigo-500 mb-2" />
              )}
              <h3 className="text-lg font-semibold mb-2 text-indigo-700">
                Roovo {model === "casual" ? "Casual" : "Subscription"}
              </h3>
              <div className="space-y-1">
                <p className="text-gray-600">Guest pays: <span className="font-bold">₹{model === "casual" ? roovoCasualUserPays.toFixed(2) : roovoSubUserPays.toFixed(2)}</span></p>
                <p className="text-gray-600">Host gets: <span className="font-bold">₹{model === "casual" ? roovoCasualHostGets.toFixed(2) : roovoSubHostGets.toFixed(2)}</span></p>
              </div>
              <p className="text-green-600 font-semibold mt-4 text-sm">
                You earn ₹{( (model === "casual" ? roovoCasualHostGets * bookingDays : roovoSubHostGets * bookingDays) - airbnbHostGets * bookingDays).toFixed(0)} more
              </p>
            </div>
          </div>
        </motion.div>

        {/* Confirm Button */}
        <motion.div
          custom={5}
          variants={fadeUp}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onConfirm(price, weekendPercentage, model)}
            className="inline-flex items-center justify-center gap-2 bg-indigo-500 text-white px-10 py-4 rounded-xl shadow-lg hover:bg-indigo-600 active:scale-95 transition text-lg font-bold"
          >
            Confirm & List Your Property
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
