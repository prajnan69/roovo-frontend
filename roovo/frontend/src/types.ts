export interface ListingData {
  propertyDetails: {
    title: string;
    propertyType: string;
    location: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  accommodation: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  ratingsAndReviews: {
    overallRating: number;
    totalReviews: number;
    categoryRatings: {
      label: string;
      localizedRating: string;
    }[];
    reviewTags: string[];
  };
  hostInfo: {
    name: string;
    details: string[];
    about: string;
    photoUrl?: string;
  };
  propertyDescription: {
    summary: string;
    space: string;
    guestAccess: string;
  };
  amenities: {
    included: string[];
    notIncluded: string[];
  };
  houseRules: {
    checkIn: string;
    checkOut: string;
    otherRules: string[];
  };
  safetyInfo: {
    security: string; // Corrected to string
    alarms: string[];
  };
  additionalInfo: {
    imageUrls: {
      url: string;
      alt: string;
    }[];
    nearbyCities: string[]; // Corrected to string[]
    breadcrumbs: string[];
  };
}
