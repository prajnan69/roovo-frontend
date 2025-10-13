"use client";

import { useState } from 'react';

const Profile = () => {
  const [isHost, setIsHost] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Profile</h1>
          <div className="flex items-center border border-gray-700">
            <button
              onClick={() => setIsHost(false)}
              className={`px-4 py-2 ${!isHost ? 'bg-white text-black' : 'bg-black text-white'}`}
            >
              Guest
            </button>
            <button
              onClick={() => setIsHost(true)}
              className={`px-4 py-2 ${isHost ? 'bg-white text-black' : 'bg-black text-white'}`}
            >
              Host
            </button>
          </div>
        </header>

        {/* Profile Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-800 border-2 border-gray-600 mb-4">
              {/* Placeholder for photo upload */}
            </div>
            <button className="w-full bg-gray-800 text-white py-2 border border-gray-600 hover:bg-gray-700">
              Upload Photo
            </button>
            <div className="mt-6 w-full">
              <h3 className="font-bold text-lg mb-2">Identity Verification</h3>
              <div className="p-4 border border-gray-700 bg-gray-900">
                <p className="text-sm text-gray-400 mb-2">
                  Verify your identity to build trust and enhance security.
                </p>
                <button className="w-full bg-blue-600 text-white py-2 hover:bg-blue-500">
                  Get Verified
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="border border-gray-700 p-6 bg-gray-900">
              <h2 className="text-2xl font-bold mb-4">Alex Doe</h2>
              <p className="text-gray-400 mb-6">Joined in 2024</p>

              <div>
                <h3 className="font-bold text-lg mb-4">Personal Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Full Name</label>
                    <input type="text" defaultValue="Alex Doe" className="w-full bg-black border border-gray-700 p-2 mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Email Address</label>
                    <input type="email" defaultValue="alex.doe@example.com" className="w-full bg-black border border-gray-700 p-2 mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">Phone Number</label>
                    <input type="tel" defaultValue="+1 234 567 890" className="w-full bg-black border border-gray-700 p-2 mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400">About You</label>
                    <textarea rows={4} className="w-full bg-black border border-gray-700 p-2 mt-1" placeholder="Tell us something about yourself..."></textarea>
                  </div>
                </div>
                <button className="mt-6 w-full bg-white text-black py-2 font-bold hover:bg-gray-200">
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
