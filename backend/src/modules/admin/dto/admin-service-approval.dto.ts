import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsNumber, IsEnum, MinLength, MaxLength, Min, Max } from 'class-validator';

export class ApproveServiceDto {
  @ApiProperty({ description: 'Whether to approve the service' })
  @IsBoolean()
  isApproved: boolean;

  @ApiProperty({ description: 'Admin comments for approval/rejection', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  adminComments?: string;

  @ApiProperty({ description: 'Badge assigned by admin', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  adminAssignedBadge?: string;

  @ApiProperty({ description: 'Admin rating for service quality (1-5)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  adminQualityRating?: number;
}

export class AdminServiceQueryDto {
  @ApiProperty({ description: 'Filter by approval status', required: false })
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;

  @ApiProperty({ description: 'Filter by service status', required: false })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'draft', 'pending_approval', 'approved', 'rejected'])
  status?: string;

  @ApiProperty({ description: 'Search term for service name or description', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: 'Filter by provider ID', required: false })
  @IsOptional()
  @IsString()
  providerId?: string;

  @ApiProperty({ description: 'Filter by category ID', required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ description: 'Page number for pagination', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({ description: 'Number of items per page', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({ description: 'Sort by field', required: false })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ description: 'Sort order', required: false })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';
}

export class BulkServiceActionDto {
  @ApiProperty({ description: 'Array of service IDs' })
  @IsString({ each: true })
  serviceIds: string[];

  @ApiProperty({ description: 'Action to perform', enum: ['approve', 'reject', 'delete', 'feature', 'unfeature'] })
  @IsEnum(['approve', 'reject', 'delete', 'feature', 'unfeature'])
  action: string;

  @ApiProperty({ description: 'Admin comments for bulk action', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  adminComments?: string;
}