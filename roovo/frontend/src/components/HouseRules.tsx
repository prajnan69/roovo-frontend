"use client";

import { useState } from "react";
import { Clock, Users, Dog, Ban, Check, ChevronDown } from "lucide-react";
import { ListingData } from "@/types";

export default function HouseRules({ rules }: { rules: ListingData }) {
  const [showAdditionalRules, setShowAdditionalRules] = useState(false);

  if (!rules) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">House Rules</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Clock className="w-6 h-6 mr-2" />
            <h3 className="font-bold">Check-in</h3>
          </div>
          <p>{rules.gemini_response?.house_rules?.checkIn}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Clock className="w-6 h-6 mr-2" />
            <h3 className="font-bold">Check-out</h3>
          </div>
          <p>{rules.gemini_response?.house_rules?.checkOut}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Users className="w-6 h-6 mr-2" />
            <h3 className="font-bold">Max Guests</h3>
          </div>
          <p>{rules.max_guests}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            {rules.pets_allowed ? <Dog className="w-6 h-6 mr-2" /> : <Ban className="w-6 h-6 mr-2" />}
            <h3 className="font-bold">Pets</h3>
          </div>
          <p>{rules.pets_allowed ? "Allowed" : "Not Allowed"}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            {rules.smoking_allowed ? <Check className="w-6 h-6 mr-2" /> : <Ban className="w-6 h-6 mr-2" />}
            <h3 className="font-bold">Smoking</h3>
          </div>
          <p>{rules.smoking_allowed ? "Allowed" : "Not Allowed"}</p>
        </div>
      </div>
      {rules.additional_rules && rules.additional_rules.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setShowAdditionalRules(!showAdditionalRules)}
            className="cursor-pointer inline-flex items-center gap-2 text-gray-600 font-semibold text-lg hover:text-gray-800 transition-colors"
          >
            Show additional rules
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                showAdditionalRules ? "rotate-180" : ""
              }`}
            />
          </button>
          {showAdditionalRules && (
            <ul className="list-disc list-inside mt-2 space-y-1">
              {rules.additional_rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
