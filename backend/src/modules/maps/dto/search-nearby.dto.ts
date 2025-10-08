import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchNearbyDto {
  @ApiProperty({ description: 'Latitude', example: 40.7128 })
  @IsNumber()
  lat: number;

  @ApiProperty({ description: 'Longitude', example: -74.0060 })
  @IsNumber()
  lng: number;

  @ApiProperty({ description: 'Search radius in meters', example: 5000, required: false })
  @IsNumber()
  @IsOptional()
  radius?: number;

  @ApiProperty({ description: 'Place type', example: 'beauty_salon', required: false })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ description: 'Search keyword', example: 'hair salon', required: false })
  @IsString()
  @IsOptional()
  keyword?: string;
}