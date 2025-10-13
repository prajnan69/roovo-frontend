"use client";

import Image from "next/image";

interface Step1IntroProps {
  onNext: () => void;
}

const Step1_Intro = ({ onNext }: Step1IntroProps) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Save More, Earn More</h3>
          <p className="text-slate-600">
            Competitors can take up to 30% of your earnings. At Roovo, we believe you deserve to keep what you earn. Our industry-low fees mean hosts can save up to 70%, putting more money back in your pocket.
          </p>
          <h3 className="text-xl font-semibold">A Win-Win for Everyone</h3>
          <p className="text-slate-600">
            Lower fees for you mean you can offer more competitive pricing for guests. This attracts more bookings, increases your occupancy rate, and creates a thriving marketplace where both hosts and guests benefit.
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <Image src="/icons/host_benefit_1.png" alt="Lower fees illustration" width={500} height={300} className="rounded-lg bg-gray-200 w-full h-48 object-cover" />
          <Image src="/icons/host_benefit_2.png" alt="More bookings illustration" width={500} height={300} className="rounded-lg bg-gray-200 w-full h-48 object-cover" />
        </div>
      </div>
      <div className="mt-8 text-center">
        <button 
          onClick={onNext}
          className="bg-indigo-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-600 transition-colors duration-300 text-lg cursor-pointer"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Step1_Intro;
