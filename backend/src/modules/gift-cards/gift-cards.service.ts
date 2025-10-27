import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { GiftCard, GiftCardTransaction, GiftCardStatus } from '../../entities/gift-card.entity';
import { CreateGiftCardDto, RedeemGiftCardDto } from './dto/gift-card.dto';

@Injectable()
export class GiftCardsService {
  constructor(
    @InjectRepository(GiftCard)
    private readonly giftCardRepository: Repository<GiftCard>,
    @InjectRepository(GiftCardTransaction)
    private readonly giftCardTransactionRepository: Repository<GiftCardTransaction>,
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

    const expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year from now

    const giftCard = this.giftCardRepository.create({
      code,
      amount: createGiftCardDto.amount,
      currentBalance: createGiftCardDto.amount,
      purchaserEmail: createGiftCardDto.purchaserEmail,
      purchaserName: createGiftCardDto.purchaserName,
      purchaserPhone: createGiftCardDto.purchaserPhone,
      recipientName: createGiftCardDto.recipientName,
      recipientEmail: createGiftCardDto.recipientEmail,
      personalMessage: createGiftCardDto.personalMessage,
      expiryDate,
      purchaserId,
      status: GiftCardStatus.ACTIVE,
    });

    return await this.giftCardRepository.save(giftCard);
  }

  async getGiftCardByCode(code: string): Promise<GiftCard> {
    const giftCard = await this.giftCardRepository.findOne({
      where: { code },
      relations: ['purchaser', 'currentOwner', 'transactions'],
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
      expiresAt: giftCard.expiryDate,
    };
  }

  async redeemGiftCard(redeemDto: RedeemGiftCardDto): Promise<GiftCard> {
    const giftCard = await this.getGiftCardByCode(redeemDto.code);

    // Validate gift card
    if (giftCard.status !== GiftCardStatus.ACTIVE && giftCard.status !== GiftCardStatus.PARTIALLY_REDEEMED) {
      throw new BadRequestException('Gift card is not active');
    }

    if (giftCard.expiryDate && new Date() > giftCard.expiryDate) {
      giftCard.status = GiftCardStatus.EXPIRED;
      await this.giftCardRepository.save(giftCard);
      throw new BadRequestException('Gift card has expired');
    }

    if (giftCard.currentBalance < redeemDto.amount) {
      throw new BadRequestException('Insufficient gift card balance');
    }

    // Create transaction record
    const transaction = this.giftCardTransactionRepository.create({
      giftCardId: giftCard.id,
      amount: redeemDto.amount,
      balanceBefore: giftCard.currentBalance,
      balanceAfter: giftCard.currentBalance - redeemDto.amount,
      bookingId: redeemDto.bookingId,
      redeemedByEmail: redeemDto.redeemedByEmail,
      notes: 'Gift card redemption',
    });

    await this.giftCardTransactionRepository.save(transaction);

    // Update gift card balance
    giftCard.currentBalance -= redeemDto.amount;
    
    // Update redemption dates
    if (!giftCard.firstRedemptionDate) {
      giftCard.firstRedemptionDate = new Date();
    }
    giftCard.lastRedemptionDate = new Date();
    
    // Mark as redeemed if fully used
    if (giftCard.currentBalance === 0) {
      giftCard.status = GiftCardStatus.REDEEMED;
    } else {
      giftCard.status = GiftCardStatus.PARTIALLY_REDEEMED;
    }

    return await this.giftCardRepository.save(giftCard);
  }

  async getUserGiftCards(userId: string): Promise<GiftCard[]> {
    return await this.giftCardRepository.find({
      where: [
        { purchaserId: userId },
        { currentOwnerId: userId },
      ],
      relations: ['transactions'],
      order: { purchaseDate: 'DESC' },
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
          currentOwnerId: userId,
          status: GiftCardStatus.ACTIVE,
          currentBalance: MoreThan(0),
        },
      ],
      order: { purchaseDate: 'DESC' },
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

    if (giftCard.status !== GiftCardStatus.ACTIVE && giftCard.status !== GiftCardStatus.PARTIALLY_REDEEMED) {
      throw new BadRequestException('Only active gift cards can be cancelled');
    }

    giftCard.status = GiftCardStatus.CANCELED;
    
    return await this.giftCardRepository.save(giftCard);
  }

  async getGiftCardTransactionHistory(code: string): Promise<GiftCardTransaction[]> {
    const giftCard = await this.getGiftCardByCode(code);
    
    return await this.giftCardTransactionRepository.find({
      where: { giftCardId: giftCard.id },
      order: { transactionDate: 'DESC' },
    });
  }
}