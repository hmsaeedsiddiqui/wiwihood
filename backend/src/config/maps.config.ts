import { registerAs } from '@nestjs/config';

export default registerAs('maps', () => ({
  googleApiKey: process.env.GOOGLE_MAPS_API_KEY,
  defaultCenter: {
    lat: parseFloat(process.env.DEFAULT_LATITUDE) || 40.7128,
    lng: parseFloat(process.env.DEFAULT_LONGITUDE) || -74.0060,
  },
  defaultRadius: parseInt(process.env.DEFAULT_SEARCH_RADIUS) || 10, // km
  geocodingEnabled: process.env.GEOCODING_ENABLED === 'true',
  placesEnabled: process.env.PLACES_ENABLED === 'true',
}));