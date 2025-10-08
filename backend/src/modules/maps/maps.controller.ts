import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { MapsService } from './maps.service';
import { GeocodeAddressDto } from './dto/geocode-address.dto';
import { SearchNearbyDto } from './dto/search-nearby.dto';
import { CalculateDistanceDto } from './dto/calculate-distance.dto';

@ApiTags('Maps & Location')
@ApiBearerAuth('JWT-auth')
@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @ApiOperation({ summary: 'Geocode address to coordinates' })
  @ApiResponse({ status: 200, description: 'Address geocoded successfully' })
  @Post('geocode')
  async geocodeAddress(@Body() geocodeAddressDto: GeocodeAddressDto) {
    return this.mapsService.geocodeAddress(geocodeAddressDto);
  }

  @ApiOperation({ summary: 'Reverse geocode coordinates to address' })
  @ApiResponse({ status: 200, description: 'Coordinates reverse geocoded successfully' })
  @ApiQuery({ name: 'lat', description: 'Latitude', example: 40.7128 })
  @ApiQuery({ name: 'lng', description: 'Longitude', example: -74.0060 })
  @Get('reverse-geocode')
  async reverseGeocode(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
  ) {
    return this.mapsService.reverseGeocode(parseFloat(lat), parseFloat(lng));
  }

  @ApiOperation({ summary: 'Search nearby places' })
  @ApiResponse({ status: 200, description: 'Nearby places found successfully' })
  @Post('search-nearby')
  async searchNearby(@Body() searchNearbyDto: SearchNearbyDto) {
    return this.mapsService.searchNearby(searchNearbyDto);
  }

  @ApiOperation({ summary: 'Calculate distance between locations' })
  @ApiResponse({ status: 200, description: 'Distance calculated successfully' })
  @Post('calculate-distance')
  async calculateDistance(@Body() calculateDistanceDto: CalculateDistanceDto) {
    return this.mapsService.calculateDistance(calculateDistanceDto);
  }

  @ApiOperation({ summary: 'Get place details by place ID' })
  @ApiResponse({ status: 200, description: 'Place details retrieved successfully' })
  @Get('place/:placeId')
  async getPlaceDetails(@Param('placeId') placeId: string) {
    return this.mapsService.getPlaceDetails(placeId);
  }
}