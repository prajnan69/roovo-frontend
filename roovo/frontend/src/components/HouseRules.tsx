"use client";

import { Clock, Users,Dog,Ban } from "lucide-react";

export default function HouseRules({ rules }: any) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">House Rules</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Clock className="w-6 h-6 mr-2" />
            <h3 className="font-bold">Check-in</h3>
          </div>
          <p>{rules.checkIn}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Clock className="w-6 h-6 mr-2" />
            <h3 className="font-bold">Check-out</h3>
          </div>
          <p>{rules.checkOut}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Users className="w-6 h-6 mr-2" />
            <h3 className="font-bold">Max Guests</h3>
          </div>
          <p>{rules.maxGuests}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            {rules.petsAllowed ? <Dog className="w-6 h-6 mr-2" /> : <Ban className="w-6 h-6 mr-2" />}
            <h3 className="font-bold">Pets</h3>
          </div>
          <p>{rules.petsAllowed ? "Allowed" : "Not Allowed"}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            {rules.smokingAllowed ? <Check className="w-6 h-6 mr-2" /> : <Ban className="w-6 h-6 mr-2" />}
            <h3 className="font-bold">Smoking</h3>
          </div>
          <p>{rules.smokingAllowed ? "Allowed" : "Not Allowed"}</p>
        </div>
      </div>
    </div>
  );
}
