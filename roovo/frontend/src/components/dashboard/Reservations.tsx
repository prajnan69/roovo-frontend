"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const Reservations = () => {
  const [activeTab, setActiveTab] = useState("today");

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("today")}
            className={`font-semibold pb-2 ${
              activeTab === "today"
                ? "border-b-2 border-black"
                : "text-gray-500"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`font-semibold pb-2 ${
              activeTab === "upcoming"
                ? "border-b-2 border-black"
                : "text-gray-500"
            }`}
          >
            Upcoming
          </button>
        </div>
        <button className="flex items-center space-x-2 border rounded-full px-4 py-2 hover:shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 16a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"
            />
          </svg>
          <span>Filter</span>
        </button>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="text-center py-16"
      >
        <Image
          src="/icons/reservations.png"
          alt="No reservations"
          width={128}
          height={128}
          className="mx-auto mb-4"
        />
        <h3 className="text-xl font-semibold">You don't have any reservations</h3>
      </motion.div>
    </div>
  );
};

export default Reservations;
