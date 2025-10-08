import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateContactMessageDto {
  @ApiProperty({
    description: 'Full name of the person sending the message',
    example: 'John Doe',
    maxLength: 255
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Email address of the person sending the message',
    example: 'john.doe@example.com',
    maxLength: 255
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    description: 'The contact message content',
    example: 'Hello, I would like to inquire about your services...'
  })
  @IsNotEmpty()
  @IsString()
  message: string;
}

export class ReplyContactDto {
  @ApiProperty({
    description: 'Admin response to the contact message',
    example: 'Thank you for your inquiry. We will get back to you soon.'
  })
  @IsNotEmpty()
  @IsString()
  adminResponse: string;
}