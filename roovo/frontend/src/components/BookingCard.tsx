"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import DatePicker from './DatePicker';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

const BookingCard = ({ price }: { price: number }) => {
  const [guests, setGuests] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);
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
          <label htmlFor="guests" className="text-xs font-semibold text-gray-600">GUESTS</label>
          <div className="flex justify-between items-center">
            <span className="text-sm">{guests} guest{guests > 1 && 's'}</span>
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </div>
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
