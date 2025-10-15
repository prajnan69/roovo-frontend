"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';
import ProgressBar from '@/components/onboarding/ProgressBar';
import Step1_Intro from '@/components/onboarding/Step1_Intro';
import Step2_PropertyType from '@/components/onboarding/Step2_PropertyType';
import Step3_HostingType from '@/components/onboarding/Step3_HostingType';
import Step4_Basics from '@/components/onboarding/Step4_Basics';
import Step5_Amenities from '@/components/onboarding/Step5_Amenities';
import Link from 'next/link';

const BecomeAHostPage = () => {
  const [step, setStep] = useState(1);
  const [guests, setGuests] = useState(0);
  const [bedrooms, setBedrooms] = useState(1);
  const [beds, setBeds] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [direction, setDirection] = useState(1);

  const titles = [
    "Why Host on Roovo?",
    "Tell us about your place",
    "What do you want to host?",
    "Share some basics about your place",
    "What amenities do you offer?",
  ];

  const nextStep = () => {
    setDirection(1);
    setStep(step + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(step - 1);
  };

  const handlePropertyTypeSelect = () => {
    nextStep();
  };

  const handleHostingTypeSelect = () => {
    nextStep();
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 30 : -30,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 w-full bg-white z-10">
        <ProgressBar step={step} totalSteps={5} />
        <div className="flex items-center justify-between h-16 px-8 relative">
          {step > 1 ? (
            <button onClick={prevStep} className="text-gray-500 hover:text-gray-900 transition-colors cursor-pointer z-10">
              <ArrowLeft size={24} />
            </button>
          ) : <div />}
          <h2 className="text-xl font-bold text-slate-900">{titles[step - 1]}</h2>
          <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors cursor-pointer z-10 border border-gray-300 rounded-full px-4 py-2 text-sm font-semibold">
            Exit
          </Link>
        </div>
      </header>
      <main className="pt-16">
        <div className="relative overflow-hidden px-8 py-4">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={step}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="w-full"
                >
              {step === 1 && <Step1_Intro onNext={nextStep} />}
              {step === 2 && <Step2_PropertyType onBack={prevStep} onSelect={handlePropertyTypeSelect} />}
              {step === 3 && <Step3_HostingType onBack={prevStep} onSelect={handleHostingTypeSelect} />}
              {step === 4 && (
                <Step4_Basics
                  guests={guests}
                  bedrooms={bedrooms}
                  beds={beds}
                  bathrooms={bathrooms}
                  setGuests={setGuests}
                  setBedrooms={setBedrooms}
                  setBeds={setBeds}
                  setBathrooms={setBathrooms}
                  onBack={prevStep}
                  onFinish={nextStep}
                />
              )}
              {step === 5 && (
                <Step5_Amenities
                  onBack={prevStep}
                  onFinish={() => {
                    // In a real app, you'd submit the form here.
                    window.location.href = '/';
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default BecomeAHostPage;
