import { ApiProperty } from '@nestjs/swagger';
import { ProviderResponseDto } from './provider-response.dto';

export class ProvidersListResponseDto {
  @ApiProperty({
    description: 'List of providers',
    type: [ProviderResponseDto],
  })
  providers: ProviderResponseDto[];

  @ApiProperty({
    description: 'Total number of providers',
    example: 150,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 15,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Has next page',
    example: true,
  })
  hasNext: boolean;

  @ApiProperty({
    description: 'Has previous page',
    example: false,
  })
  hasPrev: boolean;
}
