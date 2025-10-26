"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import DatePicker from './DatePicker';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

const BookingCard = ({ price, max_guests }: { price: number, max_guests: number }) => {
  const [guests, setGuests] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuests, setShowGuests] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);

  const handleDateSelect = (date: Date) => {
    if (!checkInDate || (checkInDate && checkOutDate)) {
      setCheckInDate(date);
      setCheckOutDate(null);
    } else if (date > checkInDate) {
      setCheckOutDate(date);
      setShowCalendar(false);
    } else {
      setCheckInDate(date);
    }
  };

  const calendarRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(calendarRef, () => setShowCalendar(false));

  const guestsRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(guestsRef, () => setShowGuests(false));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-2xl shadow-2xl sticky top-24"
    >
      <div className="flex items-baseline mb-4">
        <span className="text-2xl font-bold">₹{price.toLocaleString()}</span>
        <span className="text-gray-600 ml-1">/ night</span>
      </div>
      <div className="border rounded-lg relative">
        <div className="grid grid-cols-2">
          <div className="p-3 border-r" onClick={() => setShowCalendar(true)}>
            <label htmlFor="checkin" className="text-xs font-semibold text-gray-600">CHECK-IN</label>
            <input type="text" id="checkin" value={checkInDate ? checkInDate.toLocaleDateString() : 'Add date'} className="w-full text-sm" readOnly />
          </div>
          <div className="p-3" onClick={() => setShowCalendar(true)}>
            <label htmlFor="checkout" className="text-xs font-semibold text-gray-600">CHECKOUT</label>
            <input type="text" id="checkout" value={checkOutDate ? checkOutDate.toLocaleDateString() : 'Add date'} className="w-full text-sm" readOnly />
          </div>
        </div>
        <AnimatePresence>
          {showCalendar && (
            <motion.div
              ref={calendarRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-10 top-full mt-2"
            >
              <DatePicker onSelect={handleDateSelect} checkIn={checkInDate} checkOut={checkOutDate} />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="p-3 border-t relative">
          <div onClick={() => setShowGuests(!showGuests)}>
            <label htmlFor="guests" className="text-xs font-semibold text-gray-600">GUESTS</label>
            <div className="flex justify-between items-center">
              <span className="text-sm">{guests} guest{guests > 1 && 's'} (Max {max_guests})</span>
              <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${showGuests ? 'rotate-180' : ''}`} />
            </div>
          </div>
          <AnimatePresence>
            {showGuests && (
              <motion.div
                ref={guestsRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 top-full mt-2 bg-white p-4 rounded-lg shadow-lg border"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Guests</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setGuests(Math.max(1, guests - 1))} className="p-1 rounded-full border hover:bg-gray-100">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span>{guests}</span>
                    <button onClick={() => setGuests(Math.min(max_guests, guests + 1))} className="p-1 rounded-full border hover:bg-gray-100">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <button className=" cursor-pointer w-full mt-4 bg-indigo-500 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors">
        Reserve
      </button>
      <p className="text-center text-sm text-gray-600 mt-2">You won't be charged yet</p>
    </motion.div>
  );
};

export default BookingCard;
