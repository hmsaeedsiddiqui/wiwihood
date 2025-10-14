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

    // Process image fields - convert public IDs to full URLs if they're not already URLs
    const processedData = { ...createProviderDto };
    
    // Handle empty strings by removing them (since fields are optional)
    if (processedData.logo === '') {
      delete processedData.logo;
    } else if (processedData.logo && !processedData.logo.startsWith('http')) {
      // Convert public ID to full Cloudinary URL
      processedData.logo = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${processedData.logo}`;
    }
    
    if (processedData.coverImage === '') {
      delete processedData.coverImage;
    } else if (processedData.coverImage && !processedData.coverImage.startsWith('http')) {
      // Convert public ID to full Cloudinary URL
      processedData.coverImage = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${processedData.coverImage}`;
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
      ...processedData,
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

    // Process image fields - convert public IDs to full URLs if they're not already URLs
    const processedData = { ...updateProviderDto };
    
    // Handle empty strings by removing them (since fields are optional)
    if (processedData.logo === '') {
      delete processedData.logo;
    } else if (processedData.logo && !processedData.logo.startsWith('http')) {
      // Convert public ID to full Cloudinary URL
      processedData.logo = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${processedData.logo}`;
    }
    
    if (processedData.coverImage === '') {
      delete processedData.coverImage;
    } else if (processedData.coverImage && !processedData.coverImage.startsWith('http')) {
      // Convert public ID to full Cloudinary URL
      processedData.coverImage = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${processedData.coverImage}`;
    }

    // Update provider
    Object.assign(provider, processedData);
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
      timezone: provider.timezone,
      latitude: provider.latitude,
      longitude: provider.longitude,
      phone: provider.phone,
      website: provider.website,
      licenseNumber: provider.licenseNumber,
      taxId: provider.taxId,
      logo: provider.logo,
      logoPublicId: provider.logoPublicId,
      coverImage: provider.coverImage,
      coverImagePublicId: provider.coverImagePublicId,
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

  async getAvailability(userId: string): Promise<any> {
    const provider = await this.providerRepository.findOne({
      where: { userId },
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    // Return default availability structure if none exists
    // In a real implementation, you might have a separate ProviderAvailability entity
    return {
      workingHours: [
        { dayOfWeek: 'Monday', isWorkingDay: true, startTime: '09:00', endTime: '17:00', breakStartTime: '', breakEndTime: '' },
        { dayOfWeek: 'Tuesday', isWorkingDay: true, startTime: '09:00', endTime: '17:00', breakStartTime: '', breakEndTime: '' },
        { dayOfWeek: 'Wednesday', isWorkingDay: true, startTime: '09:00', endTime: '17:00', breakStartTime: '', breakEndTime: '' },
        { dayOfWeek: 'Thursday', isWorkingDay: true, startTime: '09:00', endTime: '17:00', breakStartTime: '', breakEndTime: '' },
        { dayOfWeek: 'Friday', isWorkingDay: true, startTime: '09:00', endTime: '17:00', breakStartTime: '', breakEndTime: '' },
        { dayOfWeek: 'Saturday', isWorkingDay: false, startTime: '', endTime: '', breakStartTime: '', breakEndTime: '' },
        { dayOfWeek: 'Sunday', isWorkingDay: false, startTime: '', endTime: '', breakStartTime: '', breakEndTime: '' },
      ],
      bookingSettings: {
        maxAdvanceBookingDays: 30,
        minAdvanceBookingHours: 24,
        maxDailyBookings: 10,
        bufferTimeBetweenBookings: 15,
        autoConfirmBookings: true,
        allowSameDayBookings: true,
      },
      blockedTimes: [],
    };
  }

  async updateAvailability(userId: string, availabilityData: any): Promise<any> {
    const provider = await this.providerRepository.findOne({
      where: { userId },
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    // In a real implementation, you would save this to a separate ProviderAvailability entity
    // For now, we'll just return the updated data
    console.log('Updating availability for provider:', provider.id, availabilityData);
    
    return {
      message: 'Availability updated successfully',
      data: availabilityData,
    };
  }

  async getDashboardStats(userId: string) {
    const provider = await this.providerRepository.findOne({
      where: { userId },
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    // Mock dashboard stats - in real implementation, these would come from actual bookings/earnings data
    return {
      totalAppointments: 156,
      todayAppointments: 8,
      monthlyEarnings: 12450.75,
      completedServices: 133,
      rating: 4.8,
      pendingBookings: 5,
      provider: {
        id: provider.id,
        businessName: provider.businessName,
        status: provider.status,
      },
    };
  }
}
