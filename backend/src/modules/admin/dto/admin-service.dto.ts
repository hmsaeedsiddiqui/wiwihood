import { IsString, IsOptional, IsBoolean, IsNumber, IsEnum, IsArray, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class AdminServiceFiltersDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(['pending_approval', 'approved', 'rejected', 'active', 'inactive'])
  status?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  providerId?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  hasImages?: boolean;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  priceMin?: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  priceMax?: number;

  @IsOptional()
  @IsEnum(['submittedForApproval', 'approvalDate', 'name', 'price', 'provider'])
  sortBy?: string;

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}

export class AdminApproveServiceDto {
  @IsBoolean()
  approved: boolean;

  @IsOptional()
  @IsString()
  adminComments?: string;

  @IsOptional()
  @IsString()
  adminAssignedBadge?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  adminQualityRating?: number;
}

export class AdminAssignBadgeDto {
  @IsString()
  badge: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  qualityRating?: number;
}

export class AdminBulkActionDto {
  @IsArray()
  @IsString({ each: true })
  serviceIds: string[];

  @IsEnum(['approve', 'reject', 'activate', 'deactivate', 'delete'])
  action: 'approve' | 'reject' | 'activate' | 'deactivate' | 'delete';

  @IsOptional()
  @IsString()
  reason?: string;
}

export class AdminServiceStatsDto {
  @IsNumber()
  total: number;

  @IsNumber()
  pending: number;

  @IsNumber()
  approved: number;

  @IsNumber()
  rejected: number;

  @IsNumber()
  active: number;

  @IsNumber()
  inactive: number;
}