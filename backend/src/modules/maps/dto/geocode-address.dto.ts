import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GeocodeAddressDto {
  @ApiProperty({ description: 'Address to geocode', example: '1600 Amphitheatre Parkway, Mountain View, CA' })
  @IsString()
  @IsNotEmpty()
  address: string;
}