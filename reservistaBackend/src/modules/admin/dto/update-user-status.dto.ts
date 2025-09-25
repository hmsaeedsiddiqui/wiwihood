import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateUserStatusDto {
  @ApiProperty({ description: 'New user status' })
  @IsString()
  @IsNotEmpty()
  status: string;
}