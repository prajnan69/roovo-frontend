"use client";

import { Star } from "lucide-react";
import StickerPeel from "./StickerPeel";
import { ListingData } from "@/types";

export default function DetailedRatings({ ratings }: { ratings: ListingData }) {
  if (!ratings) return null;

  const detailedRatings = {
    cleanliness: ratings.cleanliness_rating,
    accuracy: ratings.accuracy_rating,
    checkin: ratings.checkin_rating,
    communication: ratings.communication_rating,
    location: ratings.location_rating,
    value: ratings.value_rating,
  };

  const isTopTier = Object.values(detailedRatings).every(
    (value) => value !== undefined && value >= 4.8
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Ratings</h2>
        {isTopTier && (
          <div >
            <StickerPeel
              imageSrc="/icons/top_tier.png"
              width={150}
              peelDirection={-45}
            />
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.entries(detailedRatings).map(([key, value]) => {
          if (value === null || value === undefined) {
            return null;
          }
          return (
            <div key={key} className="border border-gray-200 rounded-lg p-4 text-center">
              <h3 className="font-bold capitalize mb-2">{key}</h3>
              <div className="flex items-center justify-center">
                <Star className="w-6 h-6 mr-2 text-yellow-500" />
                <p className="text-2xl font-bold">{value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
