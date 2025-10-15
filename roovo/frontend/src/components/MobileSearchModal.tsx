"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MobileWhere from './MobileWhere';
import MobileWhen from './MobileWhen';
import MobileWho from './MobileWho';

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: { name: string; img: string };
  setSelectedCity: (city: { name: string; img: string }) => void;
  dates: { checkIn: Date | null; checkOut: Date | null };
  setDates: (dates: { checkIn: Date | null; checkOut: Date | null }) => void;
  adults: number;
  setAdults: (n: number) => void;
  childrenState: number;
  setChildrenState: (n: number) => void;
  infants: number;
  setInfants: (n: number) => void;
  pets: number;
  setPets: (n: number) => void;
}

const MobileSearchModal: React.FC<MobileSearchModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  setSelectedCity,
  dates,
  setDates,
  adults,
  setAdults,
  childrenState,
  setChildrenState,
  infants,
  setInfants,
  pets,
  setPets,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed inset-0 bg-white z-50 flex flex-col"
        >
          <header className="flex items-center justify-between p-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold">Plan your trip</h2>
            <button onClick={onClose} className="text-2xl">&times;</button>
          </header>

          <main className="flex-grow p-4 space-y-6 overflow-y-auto">
            <section>
              <h3 className="font-semibold mb-2 text-slate-800">Where to?</h3>
              <MobileWhere selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
            </section>
            <section>
              <h3 className="font-semibold mb-2 text-slate-800">When&apos;s your trip?</h3>
              <MobileWhen dates={dates} setDates={setDates} />
            </section>
            <section>
              <h3 className="font-semibold mb-2 text-slate-800">Who&apos;s coming?</h3>
              <MobileWho 
                adults={adults}
                setAdults={setAdults}
                childrenState={childrenState}
                setChildrenState={setChildrenState}
                infants={infants}
                setInfants={setInfants}
                pets={pets}
                setPets={setPets}
              />
            </section>
          </main>

          <footer className="p-4 border-t border-slate-200">
            <button 
              onClick={onClose} // Should trigger search in a real app
              className="w-full bg-indigo-500 text-white font-semibold py-3 rounded-md hover:bg-indigo-600 transition-colors duration-300"
            >
              Search
            </button>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileSearchModal;
