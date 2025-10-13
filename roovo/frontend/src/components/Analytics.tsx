"use client";

const Analytics = () => {
  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Performance Analytics</h1>
          <select className="bg-black border border-gray-700 p-2">
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>All Time</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Key Metrics */}
          <div className="border border-gray-700 bg-gray-900 p-6">
            <h3 className="text-lg font-bold text-gray-400">Total Earnings</h3>
            <p className="text-4xl font-bold mt-2">$12,345</p>
          </div>
          <div className="border border-gray-700 bg-gray-900 p-6">
            <h3 className="text-lg font-bold text-gray-400">Occupancy Rate</h3>
            <p className="text-4xl font-bold mt-2">85%</p>
          </div>
          <div className="border border-gray-700 bg-gray-900 p-6">
            <h3 className="text-lg font-bold text-gray-400">Average Rating</h3>
            <p className="text-4xl font-bold mt-2">4.9 ★</p>
          </div>
        </div>

        <div className="mt-8 border border-gray-700 bg-gray-900 p-6">
          <h2 className="text-2xl font-bold mb-4">Earnings Chart</h2>
          <div className="w-full h-64 bg-gray-800">
            {/* Placeholder for a chart component */}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-gray-700 bg-gray-900 p-6">
            <h2 className="text-2xl font-bold mb-4">Optimization Tips</h2>
            <ul className="space-y-3 list-disc list-inside text-gray-300">
              <li>Offer a 10% weekly discount to attract longer stays.</li>
              <li>Update your photos to showcase recent improvements.</li>
              <li>Respond to guest reviews to improve your rating.</li>
            </ul>
          </div>
          <div className="border border-gray-700 bg-gray-900 p-6">
            <h2 className="text-2xl font-bold mb-4">Top Performing Listings</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Modern Downtown Loft</span>
                <span className="font-bold">$5,600</span>
              </div>
              <div className="flex justify-between">
                <span>Rustic Mountain Cabin</span>
                <span className="font-bold">$4,200</span>
              </div>
              <div className="flex justify-between">
                <span>Cozy Beachside Cottage</span>
                <span className="font-bold">$2,545</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
