"use client";

import React, { useState } from 'react';
import MobileSearchModal from './MobileSearchModal';

const MobileSearchBar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState({ name: "Anywhere", img: "/bengaluru.png" });
  const [dates, setDates] = useState<{ checkIn: Date | null; checkOut: Date | null }>({ checkIn: null, checkOut: null });
  const [adults, setAdults] = useState(0);
  const [childrenState, setChildrenState] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);

  const handleSearch = () => {
    localStorage.setItem('lastSearchedCity', selectedCity.name);
    setIsModalOpen(false);
    window.location.reload(); // Reload to reflect changes
  };

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)} 
        className="bg-white p-3 rounded-full shadow-md flex items-center justify-between cursor-pointer mx-4"
      >
        <div className="flex items-center">
          <svg className="w-6 h-6 text-slate-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <div>
            <div className="font-semibold text-slate-800">Where to?</div>
            <div className="text-sm text-slate-500">Anywhere • Any week • Add guests</div>
          </div>
        </div>
      </div>
      <MobileSearchModal
        isOpen={isModalOpen}
        onClose={handleSearch}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        dates={dates}
        setDates={setDates}
        adults={adults}
        setAdults={setAdults}
        childrenState={childrenState}
        setChildrenState={setChildrenState}
        infants={infants}
        setInfants={setInfants}
        pets={pets}
        setPets={setPets}
      />
    </>
  );
};

export default MobileSearchBar;
