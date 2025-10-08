import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const { Client } = require('@googlemaps/google-maps-services-js');
import { GeocodeAddressDto } from './dto/geocode-address.dto';
import { SearchNearbyDto } from './dto/search-nearby.dto';
import { CalculateDistanceDto } from './dto/calculate-distance.dto';
import { 
  mockGeocodeResponse, 
  mockReverseGeocodeResponse, 
  mockNearbySearchResponse, 
  mockDistanceResponse, 
  mockPlaceDetailsResponse 
} from './mocks/maps-mock-data';

@Injectable()
export class MapsService {
  private readonly logger = new Logger(MapsService.name);
  private readonly googleMapsClient: any;

  constructor(private configService: ConfigService) {
    this.googleMapsClient = new Client({});
  }

  private shouldUseMockData(): boolean {
    const apiKey = this.configService.get('maps.googleApiKey');
    return !apiKey || apiKey.includes('DUMMY') || apiKey.includes('TEST');
  }

  private handleApiError(error: any, mockData: any, operation: string) {
    this.logger.error(`Failed to ${operation}`, error);
    
    // If it's a 403 error (invalid API key), return mock data instead of throwing
    if (error.response?.status === 403) {
      this.logger.warn(`Google Maps API returned 403 for ${operation} - using mock data instead`);
      return mockData;
    }
    
    throw error;
  }

  // Geocode address to coordinates
  async geocodeAddress(geocodeAddressDto: GeocodeAddressDto) {
    try {
      const { address } = geocodeAddressDto;

      // Check if we should use mock data
      if (this.shouldUseMockData()) {
        this.logger.warn('Using mock geocoding data - Google Maps API key not configured properly');
        
        return {
          ...mockGeocodeResponse,
          address: address.includes('1600 Amphitheatre') 
            ? mockGeocodeResponse.address 
            : `Mock result for: ${address}`,
        };
      }

      const apiKey = this.configService.get('maps.googleApiKey');
      const request: any = {
        params: {
          address,
          key: apiKey,
        },
      };

      const response = await this.googleMapsClient.geocode(request);
      
      if (response.data.results.length === 0) {
        throw new Error('Address not found');
      }

      const result = response.data.results[0];
      return {
        address: result.formatted_address,
        coordinates: {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
        },
        components: result.address_components,
        placeId: result.place_id,
      };
    } catch (error) {
      const mockResponse = {
        ...mockGeocodeResponse,
        address: `Mock result for: ${geocodeAddressDto.address}`,
      };
      return this.handleApiError(error, mockResponse, 'geocode address');
    }
  }

  // Reverse geocode coordinates to address
  async reverseGeocode(lat: number, lng: number) {
    try {
      const apiKey = this.configService.get('maps.googleApiKey');

      const request: any = {
        params: {
          latlng: `${lat},${lng}`,
          key: apiKey,
        },
      };

      const response = await this.googleMapsClient.reverseGeocode(request);
      
      if (response.data.results.length === 0) {
        throw new Error('Location not found');
      }

      const result = response.data.results[0];
      return {
        address: result.formatted_address,
        coordinates: { lat, lng },
        components: result.address_components,
        placeId: result.place_id,
      };
    } catch (error) {
      this.logger.error('Failed to reverse geocode', error);
      throw error;
    }
  }

  // Search nearby places
  async searchNearby(searchNearbyDto: SearchNearbyDto) {
    try {
      const { lat, lng, radius, type, keyword } = searchNearbyDto;
      const apiKey = this.configService.get('maps.googleApiKey');

      const request: any = {
        params: {
          location: `${lat},${lng}`,
          radius: radius || 5000, // 5km default
          type,
          keyword,
          key: apiKey,
        },
      };

      const response = await this.googleMapsClient.placesNearby(request);
      
      return {
        results: response.data.results.map(place => ({
          placeId: place.place_id,
          name: place.name,
          address: place.vicinity,
          coordinates: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
          },
          rating: place.rating,
          userRatingsTotal: place.user_ratings_total,
          priceLevel: place.price_level,
          types: place.types,
          photos: place.photos?.map(photo => ({
            reference: photo.photo_reference,
            width: photo.width,
            height: photo.height,
          })),
          openingHours: place.opening_hours,
        })),
        nextPageToken: response.data.next_page_token,
      };
    } catch (error) {
      this.logger.error('Failed to search nearby places', error);
      throw error;
    }
  }

  // Calculate distance between two points
  async calculateDistance(calculateDistanceDto: CalculateDistanceDto) {
    try {
      const { origins, destinations, mode } = calculateDistanceDto;
      const apiKey = this.configService.get('maps.googleApiKey');

      const response = await this.googleMapsClient.distancematrix({
        params: {
          origins,
          destinations,
          mode: mode || 'driving',
          units: 'metric',
          key: apiKey,
        },
      });

      return {
        origins: response.data.origin_addresses,
        destinations: response.data.destination_addresses,
        rows: response.data.rows.map(row => ({
          elements: row.elements.map(element => ({
            distance: element.distance,
            duration: element.duration,
            status: element.status,
          })),
        })),
      };
    } catch (error) {
      this.logger.error('Failed to calculate distance', error);
      throw error;
    }
  }

  // Get place details
  async getPlaceDetails(placeId: string) {
    try {
      const apiKey = this.configService.get('maps.googleApiKey');

      const response = await this.googleMapsClient.placeDetails({
        params: {
          place_id: placeId,
          fields: [
            'name',
            'formatted_address',
            'geometry',
            'rating',
            'user_ratings_total',
            'formatted_phone_number',
            'website',
            'opening_hours',
            'photos',
            'reviews',
          ],
          key: apiKey,
        },
      });

      const place = response.data.result;
      return {
        placeId: place.place_id,
        name: place.name,
        address: place.formatted_address,
        coordinates: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        },
        rating: place.rating,
        userRatingsTotal: place.user_ratings_total,
        phone: place.formatted_phone_number,
        website: place.website,
        openingHours: place.opening_hours,
        photos: place.photos?.map(photo => ({
          reference: photo.photo_reference,
          width: photo.width,
          height: photo.height,
        })),
        reviews: place.reviews,
      };
    } catch (error) {
      this.logger.error('Failed to get place details', error);
      throw error;
    }
  }
}