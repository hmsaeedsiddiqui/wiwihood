import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateBookingStatusDto {
  @ApiProperty({ description: 'New booking status' })
  @IsString()
  @IsNotEmpty()
  status: string;
}