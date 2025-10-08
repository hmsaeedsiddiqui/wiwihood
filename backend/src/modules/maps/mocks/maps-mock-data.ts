// Mock Maps Service for Testing
// This file provides mock responses when Google Maps API is not available

export const mockGeocodeResponse = {
  address: "1600 Amphitheatre Parkway, Mountain View, CA 94043, USA",
  coordinates: {
    lat: 37.422388,
    lng: -122.084057,
  },
  components: [
    {
      long_name: "1600",
      short_name: "1600",
      types: ["street_number"]
    },
    {
      long_name: "Amphitheatre Parkway",
      short_name: "Amphitheatre Pkwy",
      types: ["route"]
    },
    {
      long_name: "Mountain View",
      short_name: "Mountain View",
      types: ["locality", "political"]
    },
    {
      long_name: "Santa Clara County",
      short_name: "Santa Clara County",
      types: ["administrative_area_level_2", "political"]
    },
    {
      long_name: "California",
      short_name: "CA",
      types: ["administrative_area_level_1", "political"]
    },
    {
      long_name: "United States",
      short_name: "US",
      types: ["country", "political"]
    },
    {
      long_name: "94043",
      short_name: "94043",
      types: ["postal_code"]
    }
  ],
  placeId: "ChIJtYuu0V25j4ARwu5e4wwRYgE",
};

export const mockReverseGeocodeResponse = {
  address: "1600 Amphitheatre Parkway, Mountain View, CA 94043, USA",
  coordinates: {
    lat: 37.422388,
    lng: -122.084057,
  },
  components: mockGeocodeResponse.components,
  placeId: "ChIJtYuu0V25j4ARwu5e4wwRYgE",
};

export const mockNearbySearchResponse = {
  results: [
    {
      name: "Google Campus",
      address: "1600 Amphitheatre Parkway, Mountain View, CA",
      coordinates: {
        lat: 37.422388,
        lng: -122.084057,
      },
      rating: 4.4,
      types: ["establishment", "point_of_interest"],
      placeId: "ChIJtYuu0V25j4ARwu5e4wwRYgE",
      distance: 0,
    },
    {
      name: "Charleston Shopping Center",
      address: "2960 Stevens Creek Blvd, San Jose, CA",
      coordinates: {
        lat: 37.421503,
        lng: -122.083659,
      },
      rating: 4.2,
      types: ["shopping_mall", "establishment"],
      placeId: "ChIJ_____MockPlace2_____",
      distance: 0.5,
    }
  ],
  nextPageToken: null,
};

export const mockDistanceResponse = {
  distance: {
    text: "2.5 km",
    value: 2500, // meters
  },
  duration: {
    text: "8 mins",
    value: 480, // seconds
  },
  status: "OK",
};

export const mockPlaceDetailsResponse = {
  placeId: "ChIJtYuu0V25j4ARwu5e4wwRYgE",
  name: "Google Campus",
  address: "1600 Amphitheatre Parkway, Mountain View, CA 94043, USA",
  coordinates: {
    lat: 37.422388,
    lng: -122.084057,
  },
  phoneNumber: "+1 650-253-0000",
  website: "https://www.google.com",
  rating: 4.4,
  userRatingsTotal: 2500,
  types: ["establishment", "point_of_interest"],
  openingHours: {
    openNow: true,
    weekdayText: [
      "Monday: 9:00 AM – 6:00 PM",
      "Tuesday: 9:00 AM – 6:00 PM", 
      "Wednesday: 9:00 AM – 6:00 PM",
      "Thursday: 9:00 AM – 6:00 PM",
      "Friday: 9:00 AM – 6:00 PM",
      "Saturday: Closed",
      "Sunday: Closed"
    ]
  },
  photos: [
    {
      photoReference: "mock_photo_reference_1",
      height: 400,
      width: 400,
    }
  ],
};