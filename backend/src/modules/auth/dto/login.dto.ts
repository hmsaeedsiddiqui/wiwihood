import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'admin@reservista.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'Admin@123',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: '2FA token from authenticator app',
    example: '123456',
    required: false,
  })
  @IsString()
  @IsOptional()
  twoFactorToken?: string;
}
