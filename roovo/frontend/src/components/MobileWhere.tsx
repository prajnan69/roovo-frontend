"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const destinations = [
  { name: "Bengaluru", img: "/bengaluru.png" },
  { name: "Mumbai", img: "/mumbai.png" },
  { name: "Pondicherry", img: "/pondicherry.png" },
  { name: "Goa", img: "/goa.png" },
  { name: "Chennai", img: "/chennai.png" },
];

interface MobileWhereProps {
  selectedCity: { name: string; img: string };
  setSelectedCity: (city: { name: string; img: string }) => void;
}

const MobileWhere: React.FC<MobileWhereProps> = ({ selectedCity, setSelectedCity }) => {
  const [hoveredCity, setHoveredCity] = useState<typeof destinations[0] | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2">
        {destinations.map((city) => (
          <motion.div
            key={city.name}
            onMouseEnter={() => setHoveredCity(city)}
            onMouseLeave={() => setHoveredCity(null)}
            onClick={() => setSelectedCity(city)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`cursor-pointer p-2 rounded-lg relative transition-colors duration-200 font-semibold text-center ${selectedCity.name === city.name ? "text-white bg-indigo-600" : "bg-slate-100 hover:bg-slate-200 text-slate-800"}`}
          >
            {city.name}
          </motion.div>
        ))}
      </div>
      <div className="flex items-center justify-center h-48">
        <AnimatePresence mode="wait">
          <motion.div
            key={hoveredCity ? hoveredCity.name : selectedCity.name}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={hoveredCity ? hoveredCity.img : selectedCity.img}
              alt={hoveredCity ? hoveredCity.name : selectedCity.name}
              width={200}
              height={200}
              className="object-contain rounded-xl"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MobileWhere;
