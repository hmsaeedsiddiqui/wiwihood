import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { GiftCard, GiftCardUsage, GiftCardStatus } from '../../entities/gift-card.entity';
import { CreateGiftCardDto, RedeemGiftCardDto } from './dto/gift-card.dto';

@Injectable()
export class GiftCardsService {
  constructor(
    @InjectRepository(GiftCard)
    private readonly giftCardRepository: Repository<GiftCard>,
    @InjectRepository(GiftCardUsage)
    private readonly giftCardUsageRepository: Repository<GiftCardUsage>,
  ) {}

  private generateGiftCardCode(): string {
    // Generate unique gift card code
    const prefix = 'GC';
    const year = new Date().getFullYear();
    const randomString = Math.random().toString(36).substr(2, 8).toUpperCase();
    return `${prefix}${year}${randomString}`;
  }

  async createGiftCard(createGiftCardDto: CreateGiftCardDto, purchaserId: string): Promise<GiftCard> {
    let code: string;
    let isUnique = false;
    
    // Ensure unique code generation
    while (!isUnique) {
      code = this.generateGiftCardCode();
      const existingCard = await this.giftCardRepository.findOne({ where: { code } });
      if (!existingCard) {
        isUnique = true;
      }
    }

    const expiresAt = createGiftCardDto.expiresAt 
      ? new Date(createGiftCardDto.expiresAt)
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year from now

    const giftCard = this.giftCardRepository.create({
      code,
      originalAmount: createGiftCardDto.amount,
      currentBalance: createGiftCardDto.amount,
      recipientName: createGiftCardDto.recipientName,
      recipientEmail: createGiftCardDto.recipientEmail,
      message: createGiftCardDto.message,
      expiresAt,
      purchaserId,
      status: GiftCardStatus.ACTIVE,
    });

    return await this.giftCardRepository.save(giftCard);
  }

  async getGiftCardByCode(code: string): Promise<GiftCard> {
    const giftCard = await this.giftCardRepository.findOne({
      where: { code },
      relations: ['purchaser', 'recipient', 'usageHistory'],
    });

    if (!giftCard) {
      throw new NotFoundException('Gift card not found');
    }

    return giftCard;
  }

  async checkBalance(code: string): Promise<{ balance: number; status: GiftCardStatus; expiresAt: Date }> {
    const giftCard = await this.getGiftCardByCode(code);
    
    return {
      balance: giftCard.currentBalance,
      status: giftCard.status,
      expiresAt: giftCard.expiresAt,
    };
  }

  async redeemGiftCard(redeemDto: RedeemGiftCardDto): Promise<GiftCard> {
    const giftCard = await this.getGiftCardByCode(redeemDto.code);

    // Validate gift card
    if (giftCard.status !== GiftCardStatus.ACTIVE) {
      throw new BadRequestException('Gift card is not active');
    }

    if (giftCard.expiresAt && new Date() > giftCard.expiresAt) {
      giftCard.status = GiftCardStatus.EXPIRED;
      await this.giftCardRepository.save(giftCard);
      throw new BadRequestException('Gift card has expired');
    }

    if (giftCard.currentBalance < redeemDto.amount) {
      throw new BadRequestException('Insufficient gift card balance');
    }

    // Create usage record
    const usage = this.giftCardUsageRepository.create({
      giftCardId: giftCard.id,
      amountUsed: redeemDto.amount,
      remainingBalance: giftCard.currentBalance - redeemDto.amount,
      usedInBookingId: redeemDto.bookingId,
      description: redeemDto.description || 'Gift card redemption',
    });

    await this.giftCardUsageRepository.save(usage);

    // Update gift card balance
    giftCard.currentBalance -= redeemDto.amount;
    
    // Mark as redeemed if fully used
    if (giftCard.currentBalance === 0) {
      giftCard.status = GiftCardStatus.REDEEMED;
      giftCard.redeemedAt = new Date();
    }

    return await this.giftCardRepository.save(giftCard);
  }

  async getUserGiftCards(userId: string): Promise<GiftCard[]> {
    return await this.giftCardRepository.find({
      where: [
        { purchaserId: userId },
        { recipientId: userId },
      ],
      relations: ['usageHistory'],
      order: { purchasedAt: 'DESC' },
    });
  }

  async getActiveGiftCards(userId: string): Promise<GiftCard[]> {
    return await this.giftCardRepository.find({
      where: [
        { 
          purchaserId: userId, 
          status: GiftCardStatus.ACTIVE,
          currentBalance: MoreThan(0),
        },
        { 
          recipientId: userId, 
          status: GiftCardStatus.ACTIVE,
          currentBalance: MoreThan(0),
        },
      ],
      order: { purchasedAt: 'DESC' },
    });
  }

  async transferGiftCard(code: string, newRecipientEmail: string): Promise<GiftCard> {
    const giftCard = await this.getGiftCardByCode(code);

    if (giftCard.status !== GiftCardStatus.ACTIVE) {
      throw new BadRequestException('Only active gift cards can be transferred');
    }

    giftCard.recipientEmail = newRecipientEmail;
    
    return await this.giftCardRepository.save(giftCard);
  }

  async cancelGiftCard(code: string, reason?: string): Promise<GiftCard> {
    const giftCard = await this.getGiftCardByCode(code);

    if (giftCard.status !== GiftCardStatus.ACTIVE) {
      throw new BadRequestException('Only active gift cards can be cancelled');
    }

    giftCard.status = GiftCardStatus.CANCELLED;
    
    return await this.giftCardRepository.save(giftCard);
  }

  async getGiftCardUsageHistory(code: string): Promise<GiftCardUsage[]> {
    const giftCard = await this.getGiftCardByCode(code);
    
    return await this.giftCardUsageRepository.find({
      where: { giftCardId: giftCard.id },
      order: { usedAt: 'DESC' },
    });
  }
}