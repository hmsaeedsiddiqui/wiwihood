import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SubmissionStatus } from '../../../entities/form-submission.entity';

export class CreateFormResponseDto {
  @ApiProperty({ description: 'Field name/key' })
  @IsString()
  fieldName: string;

  @ApiProperty({ description: 'Response value' })
  @IsString()
  value: string;

  @ApiProperty({ description: 'File URL if applicable', required: false })
  @IsString()
  @IsOptional()
  fileUrl?: string;
}

export class CreateFormSubmissionDto {
  @ApiProperty({ description: 'Customer name' })
  @IsString()
  customerName: string;

  @ApiProperty({ description: 'Customer email' })
  @IsString()
  customerEmail: string;

  @ApiProperty({ description: 'Customer phone', required: false })
  @IsString()
  @IsOptional()
  customerPhone?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: 'Form responses', type: [CreateFormResponseDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFormResponseDto)
  responses: CreateFormResponseDto[];
}

export class UpdateFormSubmissionDto {
  @ApiProperty({ description: 'Submission status', enum: SubmissionStatus, required: false })
  @IsEnum(SubmissionStatus)
  @IsOptional()
  status?: SubmissionStatus;

  @ApiProperty({ description: 'Provider notes', required: false })
  @IsString()
  @IsOptional()
  providerNotes?: string;
}