"use client";

import React, { useState } from 'react';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';

interface MobileWhenProps {
  dates: { checkIn: Date | null; checkOut: Date | null };
  setDates: (dates: { checkIn: Date | null; checkOut: Date | null }) => void;
}

const MobileWhen: React.FC<MobileWhenProps> = ({ dates, setDates }) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const handleDateClick = (date: dayjs.Dayjs) => {
    const selectedDate = date.toDate();
    if (!dates.checkIn || (dates.checkIn && dates.checkOut)) {
      setDates({ checkIn: selectedDate, checkOut: null });
    } else {
      if (dayjs(selectedDate).isBefore(dates.checkIn, 'day')) {
        setDates({ checkIn: selectedDate, checkOut: dates.checkIn });
      } else {
        setDates({ ...dates, checkOut: selectedDate });
      }
    }
  };

  const isInRange = (date: dayjs.Dayjs) => {
    if (!dates.checkIn || !dates.checkOut) return false;
    return date.isAfter(dayjs(dates.checkIn)) && date.isBefore(dayjs(dates.checkOut));
  };

  const renderCalendar = (month: dayjs.Dayjs) => {
    const monthStart = month.startOf('month');
    const monthEnd = month.endOf('month');
    const startDate = monthStart.startOf('week');
    const endDate = monthEnd.endOf('week');
    const calendarDays = [];
    let day = startDate;

    while (day.isBefore(endDate, 'day') || day.isSame(endDate, 'day')) {
      calendarDays.push(day);
      day = day.add(1, 'day');
    }

    return (
      <div key={month.format('YYYY-MM')}>
        <h4 className="text-lg font-bold text-slate-900 text-center mb-4">{month.format("MMMM YYYY")}</h4>
        <div className="grid grid-cols-7 text-center text-sm font-semibold text-slate-700 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, idx) => {
            const isCurrentMonth = date.isSame(month, 'month');
            const isPastDate = date.isBefore(dayjs(), 'day');
            const inRange = isInRange(date);
            const isCheckIn = dates.checkIn && date.isSame(dates.checkIn, "day");
            const isCheckOut = dates.checkOut && date.isSame(dates.checkOut, "day");
            const isToday = date.isSame(dayjs(), 'day');

            return (
              <motion.div
                key={idx}
                onClick={() => isCurrentMonth && !isPastDate && handleDateClick(date)}
                whileHover={{ scale: isPastDate ? 1 : 1.1 }}
                whileTap={{ scale: isPastDate ? 1 : 0.95 }}
                className={`h-10 flex items-center justify-center rounded-full transition-all duration-200 font-semibold ${
                  !isCurrentMonth ? 'text-slate-300' :
                  isPastDate ? "text-slate-400 cursor-not-allowed" :
                  isCheckIn || isCheckOut ? "bg-indigo-600 text-white shadow-md" :
                  inRange ? "bg-indigo-100 text-indigo-700" :
                  isToday ? "border-2 border-indigo-400" : "hover:bg-slate-100"
                }`}
              >
                {date.date()}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))} className="p-2 rounded-full hover:bg-slate-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </motion.button>
        <div className="flex-1 text-center">
          <h4 className="text-lg font-bold text-slate-900">{currentMonth.format("MMMM YYYY")}</h4>
        </div>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setCurrentMonth(currentMonth.add(1, "month"))} className="p-2 rounded-full hover:bg-slate-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </motion.button>
      </div>
      {renderCalendar(currentMonth)}
    </div>
  );
};

export default MobileWhen;
