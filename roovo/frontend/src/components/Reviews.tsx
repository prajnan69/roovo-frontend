"use client";

import { useState, FC } from 'react';

interface StarIconProps {
  filled: boolean;
  onClick: () => void;
}

const StarIcon: FC<StarIconProps> = ({ filled, onClick }) => (
  <svg
    onClick={onClick}
    className={`w-6 h-6 cursor-pointer ${filled ? 'text-white' : 'text-gray-600'}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
  </svg>
);

interface RatingInputProps {
  label: string;
  rating: number;
  setRating: (rating: number) => void;
}

const RatingInput: FC<RatingInputProps> = ({ label, rating, setRating }) => (
  <div className="flex justify-between items-center">
    <span className="text-lg">{label}</span>
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <StarIcon
          key={index}
          filled={index < rating}
          onClick={() => setRating(index + 1)}
        />
      ))}
    </div>
  </div>
);

const Reviews = () => {
  const [cleanliness, setCleanliness] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [location, setLocation] = useState(0);
  const [value, setValue] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Leave a Review</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Side: Review Submission Form */}
          <div className="border border-gray-700 bg-gray-900 p-8">
            <h2 className="text-2xl font-bold mb-6">Rate Your Stay</h2>
            <div className="space-y-6">
              <RatingInput label="Cleanliness" rating={cleanliness} setRating={setCleanliness} />
              <RatingInput label="Communication" rating={communication} setRating={setCommunication} />
              <RatingInput label="Accuracy" rating={accuracy} setRating={setAccuracy} />
              <RatingInput label="Location" rating={location} setRating={setLocation} />
              <RatingInput label="Value" rating={value} setRating={setValue} />
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Public Review</h3>
              <textarea
                rows={5}
                className="w-full bg-black border border-gray-700 p-3"
                placeholder="Share your experience with the community..."
              ></textarea>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4">Private Feedback</h3>
              <textarea
                rows={3}
                className="w-full bg-black border border-gray-700 p-3"
                placeholder="Share any private feedback with your host..."
              ></textarea>
            </div>

            <button className="mt-8 w-full bg-white text-black font-bold py-3 hover:bg-gray-200">
              Submit Review
            </button>
          </div>

          {/* Right Side: Existing Reviews */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold mb-6">Guest Reviews</h2>
            <div className="border border-gray-700 bg-gray-900 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-700 flex items-center justify-center font-bold mr-4">
                  JS
                </div>
                <div>
                  <h4 className="font-bold text-lg">Jane Smith</h4>
                  <span className="text-sm text-gray-400">August 2024</span>
                </div>
              </div>
              <p>
                A fantastic stay! The apartment was spotless, and the host was incredibly responsive. The location is perfect for exploring the city. Highly recommended!
              </p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => <StarIcon key={i} filled={true} onClick={() => {}} />)}
              </div>
            </div>
            <div className="border border-gray-700 bg-gray-900 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-700 flex items-center justify-center font-bold mr-4">
                  MD
                </div>
                <div>
                  <h4 className="font-bold text-lg">Mark Davis</h4>
                  <span className="text-sm text-gray-400">July 2024</span>
                </div>
              </div>
              <p>
                Great value for the price. The location was convenient, and the check-in process was smooth. The host provided excellent local recommendations.
              </p>
              <div className="flex mt-4">
                {[...Array(4)].map((_, i) => <StarIcon key={i} filled={true} onClick={() => {}} />)}
                <StarIcon filled={false} onClick={() => {}} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
