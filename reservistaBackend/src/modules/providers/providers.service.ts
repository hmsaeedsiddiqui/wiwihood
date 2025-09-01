import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provider, ProviderStatus } from '../../entities/provider.entity';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ProviderResponseDto } from './dto/provider-response.dto';
import { ProvidersListResponseDto } from './dto/providers-list-response.dto';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
  ) {}

  async create(userId: string, createProviderDto: CreateProviderDto): Promise<ProviderResponseDto> {
    // Check if user already has a provider profile
    const existingProvider = await this.providerRepository.findOne({
      where: { userId },
    });

    if (existingProvider) {
      throw new ConflictException('User already has a provider profile');
    }

    // Create provider
    const provider = this.providerRepository.create({
      userId,
      status: ProviderStatus.PENDING_VERIFICATION,
      isVerified: false,
      acceptsOnlinePayments: true,
      acceptsCashPayments: false,
      requiresDeposit: false,
      cancellationPolicyHours: 24,
      commissionRate: 10.00,
      totalReviews: 0,
      totalBookings: 0,
      ...createProviderDto,
    });

    const savedProvider = await this.providerRepository.save(provider);
    return this.formatProviderResponse(savedProvider);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: ProviderStatus,
    categoryId?: string,
    location?: string,
  ): Promise<ProvidersListResponseDto> {
    const queryBuilder = this.providerRepository.createQueryBuilder('provider')
      .leftJoinAndSelect('provider.user', 'user');

    // Apply search filter
    if (search) {
      queryBuilder.where(
        '(provider.businessName ILIKE :search OR provider.description ILIKE :search OR provider.city ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply status filter
    if (status) {
      queryBuilder.andWhere('provider.status = :status', { status });
    }

    // Apply location filter
    if (location) {
      queryBuilder.andWhere(
        '(provider.city ILIKE :location OR provider.state ILIKE :location OR provider.country ILIKE :location)',
        { location: `%${location}%` },
      );
    }

    // TODO: Add category filter when service-provider relationship is implemented
    // if (categoryId) {
    //   queryBuilder.innerJoin('provider.services', 'service')
    //     .andWhere('service.categoryId = :categoryId', { categoryId });
    // }

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Order by creation date (newest first)
    queryBuilder.orderBy('provider.createdAt', 'DESC');

    const [providers, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      providers: providers.map(provider => this.formatProviderResponse(provider)),
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev,
    };
  }

  async findOne(id: string): Promise<ProviderResponseDto> {
    const provider = await this.providerRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    return this.formatProviderResponse(provider);
  }

  async findByUserId(userId: string): Promise<ProviderResponseDto> {
    const provider = await this.providerRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!provider) {
      throw new NotFoundException('Provider profile not found');
    }

    return this.formatProviderResponse(provider);
  }

  async update(id: string, updateProviderDto: UpdateProviderDto): Promise<ProviderResponseDto> {
    const provider = await this.providerRepository.findOne({
      where: { id },
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    // Update provider
    Object.assign(provider, updateProviderDto);
    const updatedProvider = await this.providerRepository.save(provider);

    return this.formatProviderResponse(updatedProvider);
  }

  async remove(id: string): Promise<void> {
    const provider = await this.providerRepository.findOne({
      where: { id },
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    await this.providerRepository.remove(provider);
  }

  private formatProviderResponse(provider: Provider): ProviderResponseDto {
    return {
      id: provider.id,
      businessName: provider.businessName,
      providerType: provider.providerType,
      description: provider.description,
      address: provider.address,
      city: provider.city,
      state: provider.state,
      country: provider.country,
      postalCode: provider.postalCode,
      latitude: provider.latitude,
      longitude: provider.longitude,
      phone: provider.phone,
      website: provider.website,
      licenseNumber: provider.licenseNumber,
      taxId: provider.taxId,
      logo: provider.logo,
      coverImage: provider.coverImage,
      status: provider.status,
      isVerified: provider.isVerified,
      acceptsOnlinePayments: provider.acceptsOnlinePayments,
      acceptsCashPayments: provider.acceptsCashPayments,
      requiresDeposit: provider.requiresDeposit,
      depositPercentage: provider.depositPercentage,
      cancellationPolicyHours: provider.cancellationPolicyHours,
      commissionRate: provider.commissionRate,
      averageRating: provider.averageRating,
      totalReviews: provider.totalReviews,
      totalBookings: provider.totalBookings,
      verificationNotes: provider.verificationNotes,
      verifiedAt: provider.verifiedAt,
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt,
      userId: provider.userId,
      fullAddress: provider.fullAddress,
    };
  }
}
