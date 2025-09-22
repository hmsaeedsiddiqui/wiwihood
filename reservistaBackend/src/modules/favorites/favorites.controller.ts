import { Controller, Get, Post, Delete, Param, Headers, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiHeader } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';

@ApiTags('favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'Get user favorites' })
  @ApiHeader({ name: 'x-user-id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Returns user favorites' })
  async getFavorites(@Headers('x-user-id') userId: string) {
    return this.favoritesService.getFavorites(userId || 'test-user-id');
  }

  @Get('services')
  @ApiOperation({ summary: 'Get favorite services' })
  @ApiHeader({ name: 'x-user-id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Returns favorite services' })
  async getFavoriteServices(@Headers('x-user-id') userId: string) {
    return this.favoritesService.getFavoriteServices(userId || 'test-user-id');
  }

  @Post(':providerId')
  @ApiOperation({ summary: 'Add provider to favorites' })
  @ApiParam({ name: 'providerId', description: 'Provider ID' })
  @ApiHeader({ name: 'x-user-id', description: 'User ID' })
  @ApiResponse({ status: 201, description: 'Provider added to favorites' })
  async addToFavorites(
    @Headers('x-user-id') userId: string,
    @Param('providerId') providerId: string,
  ) {
    return this.favoritesService.addToFavorites(userId || 'test-user-id', providerId);
  }

  @Delete(':providerId')
  @ApiOperation({ summary: 'Remove provider from favorites' })
  @ApiParam({ name: 'providerId', description: 'Provider ID' })
  @ApiHeader({ name: 'x-user-id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Provider removed from favorites' })
  async removeFromFavorites(
    @Headers('x-user-id') userId: string,
    @Param('providerId') providerId: string,
  ) {
    return this.favoritesService.removeFromFavorites(userId || 'test-user-id', providerId);
  }

  @Get('check/:providerId')
  @ApiOperation({ summary: 'Check if provider is favorited' })
  @ApiParam({ name: 'providerId', description: 'Provider ID' })
  @ApiHeader({ name: 'x-user-id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Returns favorite status' })
  async isFavorite(
    @Headers('x-user-id') userId: string,
    @Param('providerId') providerId: string,
  ) {
    const isFav = await this.favoritesService.isFavorite(userId || 'test-user-id', providerId);
    return { isFavorite: isFav };
  }

  @Delete()
  @ApiOperation({ summary: 'Clear all favorites' })
  @ApiHeader({ name: 'x-user-id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'All favorites cleared' })
  async clearFavorites(@Headers('x-user-id') userId: string) {
    return this.favoritesService.clearFavorites(userId || 'test-user-id');
  }
}
