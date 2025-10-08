import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsOptional } from 'class-validator';

export class CalculateDistanceDto {
  @ApiProperty({ 
    description: 'Origin addresses or coordinates', 
    example: ['New York, NY', '40.7128,-74.0060'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  origins: string[];

  @ApiProperty({ 
    description: 'Destination addresses or coordinates', 
    example: ['Los Angeles, CA', '34.0522,-118.2437'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  destinations: string[];

  @ApiProperty({ 
    description: 'Travel mode', 
    example: 'driving',
    enum: ['driving', 'walking', 'bicycling', 'transit'],
    required: false 
  })
  @IsString()
  @IsOptional()
  mode?: 'driving' | 'walking' | 'bicycling' | 'transit';
}