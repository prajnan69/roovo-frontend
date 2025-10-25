export interface ListingData {
  id: string;
  title: string;
  property_type: string;
  property_description: {
    theSpace: string;
    guestAccess: string | null;
    otherThingsToNote: string | null;
  };
  accommodation: {
    sleepingArrangements: {
      room: string;
      beds: string;
    }[];
    totalBathrooms: number;
  };
  price_per_night: number;
  booking_and_availability: {
    price: {
      pricePerNight: number;
      priceBreakdown: {
        basePrice: string;
        total: string;
      };
      priceDisclaimer: string;
    };
    availability: {
      selectedDates: {
        checkIn: string;
        checkOut: string;
        nights: number;
      };
    };
    cancellationPolicy: string;
  };
  house_rules: {
    checkIn: string;
    checkOut: string;
    maxGuests: number;
    petsAllowed: boolean;
    smokingAllowed: boolean;
    commercialPhotographyAllowed: boolean;
    additionalRules: string[];
  };
  amenities: {
    included: string[];
    notIncluded: string[];
  };
  ratings_and_reviews: {
    overallRating: number;
    totalReviews: number;
    detailedRatings: {
      cleanliness: number;
      accuracy: number;
      checkIn: number;
      communication: number;
      location: number;
      value: number;
    };
    individualReviews: IndividualReview[];
  };
  host_information: {
    name: string;
    profilePictureUrl: string;
    isSuperhost: boolean;
    hostingSince: string;
    stats: {
      reviews: number;
      averageRating: number;
      responseRate: number | null;
      responseTime: number | null;
    };
    bio: string[];
  };
  location_and_neighborhood: {
    address: string;
    latitude: number;
    longitude: number;
    neighborhoodDescription: string;
    gettingAround: string;
  };
  media: {
    primaryImageUrl: string;
    allImageUrls: string[];
  };
}

export interface IndividualReview {
  reviewerName: string;
  reviewDate: string;
  reviewText: string;
}
