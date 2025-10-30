"use client";

import { ArrowLeft, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import supabase from "@/services/api";
import { API_BASE_URL } from "@/services/api";
interface ConfirmAndPayProps {
  listing: {
    id: string;
    title: string;
    primary_image_url: string;
    overall_rating: number;
    total_reviews: number;
    cancellation_policy: string;
  };
  bookingDetails: {
    startDate: string;
    endDate: string;
    guests: number;
    nights: number;
  };
  priceDetails: {
    pricePerNight: number;
    totalPrice: number;
    taxes: number;
  };
  onBack: () => void;
  host_id: string;
}

const ConfirmAndPay = ({ listing, bookingDetails, priceDetails, onBack, host_id }: ConfirmAndPayProps) => {
  const router = useRouter();

  const handleBooking = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      // or show a login modal
      return;
    }
    const guest_id = session.user.id;

    const bookingData = {
      listing_id: listing.id,
      guest_id,
      host_id,
      start_date: bookingDetails.startDate,
      end_date: bookingDetails.endDate,
      total_price: priceDetails.totalPrice + priceDetails.taxes,
    };

    console.log('Booking Data:', bookingData);

    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      // Redirect to reservations page or show a success message
      router.push('/hosting/reservations');
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const formattedStartDate = new Date(bookingDetails.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const formattedEndDate = new Date(bookingDetails.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-3xl font-bold ml-4">Confirm and pay</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Payment Details */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Proceed to payment</h2>
            <p className="text-gray-600 mb-6">You'll be directed to Razorpay to complete payment.</p>

            <div className="border-t border-gray-200 my-6" />

            <p className="text-sm text-gray-600 mb-8">
              By selecting the button, I agree to the{" "}
              <a href="#" className="text-indigo-600 hover:underline">booking terms</a>.
            </p>

            <button 
              onClick={handleBooking}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Continue to Razorpay
            </button>
          </div>

          {/* Right Column: Booking Summary */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center mb-6">
              <Image
                src={listing.primary_image_url}
                alt={listing.title}
                width={100}
                height={80}
                className="rounded-lg object-cover mr-4"
              />
              <div>
                <h3 className="text-lg font-semibold">{listing.title}</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span>{listing.overall_rating} ({listing.total_reviews})</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 my-6" />

            <h4 className="text-md font-semibold mb-2">Cancellation policy</h4>
            <p className="text-sm text-gray-700">{listing.cancellation_policy}</p>

            <div className="border-t border-gray-200 my-6" />

            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-semibold">Dates</h4>
              <div className="flex items-center">
                <span className="text-gray-700 mr-2">{formattedStartDate} - {formattedEndDate}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-semibold">Guests</h4>
              <div className="flex items-center">
                <span className="text-gray-700 mr-2">{bookingDetails.guests} adult{bookingDetails.guests > 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 my-6" />

            <h4 className="text-md font-semibold mb-4">Price details</h4>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">{bookingDetails.nights} nights x ₹{priceDetails.pricePerNight.toFixed(2)}</span>
              <span className="text-gray-700">₹{priceDetails.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-700">Taxes</span>
              <span className="text-gray-700">₹{priceDetails.taxes.toFixed(2)}</span>
            </div>

            <div className="border-t border-gray-200 my-6" />

            <div className="flex justify-between font-bold text-lg">
              <span>Total INR</span>
              <span>₹{(priceDetails.totalPrice + priceDetails.taxes).toFixed(2)}</span>
            </div>
            <button className="text-indigo-600 hover:underline text-sm mt-4">Price breakdown</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAndPay;
