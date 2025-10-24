export interface ListingData {
  id: string;
  title: string;
  propertyDetails: {
    propertyType: string;
    description: {
      theSpace: string;
      guestAccess: string | null;
      otherThingsToNote: string | null;
    };
    sleepingArrangements: {
      room: string;
      beds: string;
    }[];
    totalbathrooms: number;
  };
  bookingAndAvailability: {
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
    houseRules: {
      checkIn: string;
      checkOut: string;
      maxGuests: number;
      petsAllowed: boolean;
      smokingAllowed: boolean;
      commercialPhotographyAllowed: boolean;
      additionalRules: string[];
    };
  };
  amenities: {
    included: string[];
    notIncluded: string[];
  };
  reviewsAndRatings: {
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
  hostInformation: {
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
  locationAndNeighborhood: {
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
