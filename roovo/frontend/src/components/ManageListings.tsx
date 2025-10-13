"use client";

const listings = [
  {
    title: 'Modern Downtown Loft',
    status: 'Published',
    bookings: 12,
    imageUrl: '/placeholder.svg',
  },
  {
    title: 'Cozy Beachside Cottage',
    status: 'Unpublished',
    bookings: 3,
    imageUrl: '/placeholder.svg',
  },
  {
    title: 'Rustic Mountain Cabin',
    status: 'Published',
    bookings: 21,
    imageUrl: '/placeholder.svg',
  },
];

interface Listing {
  title: string;
  status: string;
  bookings: number;
  imageUrl: string;
}

const ListingRow = ({ listing }: { listing: Listing }) => (
  <div className="grid grid-cols-5 items-center p-4 border-b border-gray-800 bg-gray-900 hover:bg-gray-800">
    <div className="col-span-2 flex items-center">
      <div className="w-24 h-16 bg-gray-700 mr-4">
        {/* <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover" /> */}
      </div>
      <span className="font-bold">{listing.title}</span>
    </div>
    <div className="text-center">
      <span className={`px-3 py-1 text-sm font-semibold ${listing.status === 'Published' ? 'bg-green-800 text-green-200' : 'bg-yellow-800 text-yellow-200'}`}>
        {listing.status}
      </span>
    </div>
    <div className="text-center">{listing.bookings}</div>
    <div className="text-center">
      <button className="font-bold text-white hover:underline">Edit</button>
    </div>
  </div>
);

const ManageListings = () => {
  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Listings</h1>
          <button className="bg-white text-black font-bold py-2 px-6 hover:bg-gray-200">
            Create Listing
          </button>
        </div>

        <div className="border border-gray-700">
          <div className="grid grid-cols-5 p-4 bg-gray-800 font-bold border-b border-gray-700">
            <div className="col-span-2">Listing</div>
            <div className="text-center">Status</div>
            <div className="text-center">Bookings</div>
            <div className="text-center">Actions</div>
          </div>
          <div>
            {listings.map((listing, index) => (
              <ListingRow key={index} listing={listing} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageListings;
