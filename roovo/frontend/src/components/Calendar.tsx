"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const bookings = [
    { id: 1, date: new Date(2025, 10, 12), guest: "John Doe" },
    { id: 2, date: new Date(2025, 10, 18), guest: "Jane Smith" },
    { id: 3, date: new Date(2025, 11, 5), guest: "Peter Jones" },
  ];

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg">
          Import Calendar
        </button>
      </div>
      <div className="bg-gray-900 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <button onClick={goToPreviousMonth}>
            <ChevronLeft />
          </button>
          <h2 className="text-xl font-semibold">
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button onClick={goToNextMonth}>
            <ChevronRight />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="font-semibold">
              {day}
            </div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const booking = bookings.find(
              (b) =>
                b.date.getDate() === day &&
                b.date.getMonth() === currentDate.getMonth() &&
                b.date.getFullYear() === currentDate.getFullYear()
            );
            return (
              <div
                key={day}
                className={`p-2 rounded-lg ${
                  booking ? "bg-indigo-500" : "bg-gray-800"
                }`}
              >
                {day}
                {booking && (
                  <p className="text-xs mt-1">{booking.guest}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
