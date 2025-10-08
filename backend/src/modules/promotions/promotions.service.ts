import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion, PromotionType, PromotionStatus } from '../../entities/promotion.entity';
import { PromotionUsage } from '../../entities/promotion-usage.entity';
import { Provider } from '../../entities/provider.entity';
import { 
  CreatePromotionDto, 
  UpdatePromotionDto, 
  ValidatePromotionDto,
  PromotionResponseDto 
} from './dto/promotion.dto';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
    @InjectRepository(PromotionUsage)
    private readonly promotionUsageRepository: Repository<PromotionUsage>,
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
  ) {}

  async create(createPromotionDto: CreatePromotionDto): Promise<PromotionResponseDto> {
    // Check if promotion code already exists
    const existingPromotion = await this.promotionRepository.findOne({
      where: { code: createPromotionDto.code }
    });

    if (existingPromotion) {
      throw new ConflictException('Promotion code already exists');
    }

    // Validate provider if provided
    if (createPromotionDto.providerId) {
      const provider = await this.providerRepository.findOne({
        where: { id: createPromotionDto.providerId }
      });
      if (!provider) {
        throw new NotFoundException('Provider not found');
      }
    }

    // Validate dates
    const startDate = new Date(createPromotionDto.startDate);
    const endDate = new Date(createPromotionDto.endDate);
    
    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    const promotion = this.promotionRepository.create({
      ...createPromotionDto,
      startDate,
      endDate,
      usageCount: 0,
      status: startDate > new Date() ? PromotionStatus.SCHEDULED : PromotionStatus.ACTIVE,
    });

    const savedPromotion = await this.promotionRepository.save(promotion);
    return this.formatPromotionResponse(savedPromotion);
  }

  async findAll(providerId?: string, status?: PromotionStatus): Promise<PromotionResponseDto[]> {
    const queryBuilder = this.promotionRepository.createQueryBuilder('promotion')
      .leftJoinAndSelect('promotion.provider', 'provider');

    if (providerId) {
      queryBuilder.where('promotion.providerId = :providerId OR promotion.providerId IS NULL', { providerId });
    }

    if (status) {
      queryBuilder.andWhere('promotion.status = :status', { status });
    }

    queryBuilder.orderBy('promotion.createdAt', 'DESC');

    const promotions = await queryBuilder.getMany();
    return promotions.map(promotion => this.formatPromotionResponse(promotion));
  }

  async findActivePromotions(providerId?: string): Promise<PromotionResponseDto[]> {
    const currentDate = new Date();
    
    const queryBuilder = this.promotionRepository.createQueryBuilder('promotion')
      .leftJoinAndSelect('promotion.provider', 'provider')
      .where('promotion.status = :status', { status: PromotionStatus.ACTIVE })
      .andWhere('promotion.startDate <= :currentDate', { currentDate })
      .andWhere('promotion.endDate >= :currentDate', { currentDate })
      .andWhere('(promotion.usageLimit IS NULL OR promotion.usageCount < promotion.usageLimit)');

    if (providerId) {
      queryBuilder.andWhere('(promotion.providerId = :providerId OR promotion.providerId IS NULL)', { providerId });
    }

    queryBuilder.orderBy('promotion.discountValue', 'DESC');

    const promotions = await queryBuilder.getMany();
    return promotions.map(promotion => this.formatPromotionResponse(promotion));
  }

  async findOne(id: string): Promise<PromotionResponseDto> {
    const promotion = await this.promotionRepository.findOne({
      where: { id },
      relations: ['provider'],
    });

    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    return this.formatPromotionResponse(promotion);
  }

  async findByCode(code: string): Promise<PromotionResponseDto> {
    const promotion = await this.promotionRepository.findOne({
      where: { code },
      relations: ['provider'],
    });

    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    return this.formatPromotionResponse(promotion);
  }

  async validatePromotion(validateDto: ValidatePromotionDto): Promise<{
    valid: boolean;
    promotion?: PromotionResponseDto;
    discountAmount?: number;
    finalAmount?: number;
    reason?: string;
  }> {
    try {
      const promotion = await this.promotionRepository.findOne({
        where: { code: validateDto.code },
        relations: ['provider'],
      });

      if (!promotion) {
        return { valid: false, reason: 'Promotion code not found' };
      }

      // Check if promotion is active
      if (promotion.status !== PromotionStatus.ACTIVE) {
        return { valid: false, reason: 'Promotion is not active' };
      }

      // Check date validity
      const currentDate = new Date();
      if (currentDate < promotion.startDate || currentDate > promotion.endDate) {
        return { valid: false, reason: 'Promotion has expired or not yet started' };
      }

      // Check usage limit
      if (promotion.usageLimit && promotion.usageCount >= promotion.usageLimit) {
        return { valid: false, reason: 'Promotion usage limit reached' };
      }

      // Check minimum order amount
      if (promotion.minOrderAmount && validateDto.orderAmount < promotion.minOrderAmount) {
        return { 
          valid: false, 
          reason: `Minimum order amount of $${promotion.minOrderAmount} required` 
        };
      }

      // Check provider-specific promotion
      if (promotion.providerId && validateDto.providerId && promotion.providerId !== validateDto.providerId) {
        return { valid: false, reason: 'Promotion not valid for this provider' };
      }

      // Calculate discount
      const discountAmount = this.calculateDiscount(promotion, validateDto.orderAmount);
      const finalAmount = validateDto.orderAmount - discountAmount;

      return {
        valid: true,
        promotion: this.formatPromotionResponse(promotion),
        discountAmount,
        finalAmount,
      };
    } catch (error) {
      return { valid: false, reason: 'Error validating promotion' };
    }
  }

  async applyPromotion(promotionId: string, userId: string, bookingId: string, discountAmount: number, originalAmount: number): Promise<void> {
    const promotion = await this.promotionRepository.findOne({
      where: { id: promotionId }
    });

    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    // Check if user already used this promotion
    const existingUsage = await this.promotionUsageRepository.findOne({
      where: { 
        promotionId,
        userId,
      }
    });

    if (existingUsage) {
      throw new BadRequestException('Promotion already used by this user');
    }

    // Record promotion usage
    const promotionUsage = this.promotionUsageRepository.create({
      promotionId,
      userId,
      bookingId,
      discountAmount,
      originalAmount,
      finalAmount: originalAmount - discountAmount,
    });

    await this.promotionUsageRepository.save(promotionUsage);

    // Increment usage count
    await this.promotionRepository.update(promotionId, {
      usageCount: () => 'usage_count + 1'
    });
  }

  async update(id: string, updatePromotionDto: UpdatePromotionDto): Promise<PromotionResponseDto> {
    const promotion = await this.promotionRepository.findOne({
      where: { id }
    });

    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    // Validate dates if provided
    if (updatePromotionDto.startDate || updatePromotionDto.endDate) {
      const startDate = updatePromotionDto.startDate ? new Date(updatePromotionDto.startDate) : promotion.startDate;
      const endDate = updatePromotionDto.endDate ? new Date(updatePromotionDto.endDate) : promotion.endDate;
      
      if (startDate >= endDate) {
        throw new BadRequestException('Start date must be before end date');
      }

      updatePromotionDto.startDate = startDate.toISOString();
      updatePromotionDto.endDate = endDate.toISOString();
    }

    await this.promotionRepository.update(id, updatePromotionDto);
    
    const updatedPromotion = await this.promotionRepository.findOne({
      where: { id },
      relations: ['provider'],
    });

    return this.formatPromotionResponse(updatedPromotion!);
  }

  async remove(id: string): Promise<void> {
    const promotion = await this.promotionRepository.findOne({
      where: { id }
    });

    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    await this.promotionRepository.remove(promotion);
  }

  async getPromotionUsage(promotionId: string): Promise<any[]> {
    const usages = await this.promotionUsageRepository.find({
      where: { promotionId },
      relations: ['user', 'booking'],
      order: { usedAt: 'DESC' }
    });

    return usages.map(usage => ({
      id: usage.id,
      userId: usage.userId,
      userName: usage.user?.firstName + ' ' + usage.user?.lastName,
      userEmail: usage.user?.email,
      bookingId: usage.bookingId,
      discountAmount: usage.discountAmount,
      originalAmount: usage.originalAmount,
      finalAmount: usage.finalAmount,
      usedAt: usage.usedAt,
    }));
  }

  private calculateDiscount(promotion: Promotion, orderAmount: number): number {
    let discountAmount = 0;

    switch (promotion.type) {
      case PromotionType.PERCENTAGE:
        discountAmount = (orderAmount * promotion.discountValue) / 100;
        if (promotion.maxDiscountAmount && discountAmount > promotion.maxDiscountAmount) {
          discountAmount = promotion.maxDiscountAmount;
        }
        break;
      
      case PromotionType.FIXED_AMOUNT:
        discountAmount = Math.min(promotion.discountValue, orderAmount);
        break;
      
      case PromotionType.BUY_ONE_GET_ONE:
        // For simplicity, treat as 50% discount
        discountAmount = orderAmount * 0.5;
        break;
      
      case PromotionType.FREE_SERVICE:
        // Apply full discount up to promotion value
        discountAmount = Math.min(promotion.discountValue, orderAmount);
        break;
      
      default:
        discountAmount = 0;
    }

    return Math.round(discountAmount * 100) / 100; // Round to 2 decimal places
  }

  private formatPromotionResponse(promotion: Promotion): PromotionResponseDto {
    return {
      id: promotion.id,
      name: promotion.name,
      description: promotion.description,
      code: promotion.code,
      type: promotion.type,
      discountValue: promotion.discountValue,
      maxDiscountAmount: promotion.maxDiscountAmount,
      minOrderAmount: promotion.minOrderAmount,
      usageLimit: promotion.usageLimit,
      usedCount: promotion.usageCount,
      status: promotion.status,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      providerId: promotion.providerId,
      providerName: promotion.provider?.businessName,
      createdAt: promotion.createdAt,
      updatedAt: promotion.updatedAt,
    };
  }
}