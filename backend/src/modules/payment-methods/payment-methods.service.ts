import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethod } from '../../entities/payment-method.entity';
import { User } from '../../entities/user.entity';
import { CreatePaymentMethodDto, UpdatePaymentMethodDto, PaymentMethodResponseDto } from './dto/payment-method.dto';

@Injectable()
export class PaymentMethodsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userId: string, createPaymentMethodDto: CreatePaymentMethodDto): Promise<PaymentMethodResponseDto> {
    // Verify user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // If this is being set as default, remove default from other payment methods
    if (createPaymentMethodDto.isDefault) {
      await this.paymentMethodRepository.update(
        { userId, isDefault: true },
        { isDefault: false }
      );
    }

    // If this is the first payment method, make it default
    const existingCount = await this.paymentMethodRepository.count({ where: { userId } });
    const isDefault = createPaymentMethodDto.isDefault || existingCount === 0;

    const paymentMethod = this.paymentMethodRepository.create({
      ...createPaymentMethodDto,
      userId,
      isDefault,
    });

    const savedPaymentMethod = await this.paymentMethodRepository.save(paymentMethod);
    return this.formatPaymentMethodResponse(savedPaymentMethod);
  }

  async findAll(userId: string): Promise<PaymentMethodResponseDto[]> {
    const paymentMethods = await this.paymentMethodRepository.find({
      where: { userId, isActive: true },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });

    return paymentMethods.map(pm => this.formatPaymentMethodResponse(pm));
  }

  async findOne(userId: string, id: string): Promise<PaymentMethodResponseDto> {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { id, userId, isActive: true },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    return this.formatPaymentMethodResponse(paymentMethod);
  }

  async update(userId: string, id: string, updatePaymentMethodDto: UpdatePaymentMethodDto): Promise<PaymentMethodResponseDto> {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { id, userId, isActive: true },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    // If setting as default, remove default from other payment methods
    if (updatePaymentMethodDto.isDefault && !paymentMethod.isDefault) {
      await this.paymentMethodRepository.update(
        { userId, isDefault: true },
        { isDefault: false }
      );
    }

    Object.assign(paymentMethod, updatePaymentMethodDto);
    const updatedPaymentMethod = await this.paymentMethodRepository.save(paymentMethod);
    
    return this.formatPaymentMethodResponse(updatedPaymentMethod);
  }

  async remove(userId: string, id: string): Promise<void> {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { id, userId, isActive: true },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    // Don't allow deleting the default payment method if there are others
    if (paymentMethod.isDefault) {
      const otherMethods = await this.paymentMethodRepository.count({
        where: { userId, isActive: true, id: Not(id) },
      });

      if (otherMethods > 0) {
        throw new BadRequestException('Cannot delete default payment method. Please set another payment method as default first.');
      }
    }

    // Soft delete by setting isActive to false
    await this.paymentMethodRepository.update(id, { isActive: false });
  }

  async setDefault(userId: string, id: string): Promise<PaymentMethodResponseDto> {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { id, userId, isActive: true },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    // Remove default from all other payment methods
    await this.paymentMethodRepository.update(
      { userId, isDefault: true },
      { isDefault: false }
    );

    // Set this one as default
    paymentMethod.isDefault = true;
    const updatedPaymentMethod = await this.paymentMethodRepository.save(paymentMethod);
    
    return this.formatPaymentMethodResponse(updatedPaymentMethod);
  }

  async getDefault(userId: string): Promise<PaymentMethodResponseDto | null> {
    const defaultPaymentMethod = await this.paymentMethodRepository.findOne({
      where: { userId, isDefault: true, isActive: true },
    });

    if (!defaultPaymentMethod) {
      return null;
    }

    return this.formatPaymentMethodResponse(defaultPaymentMethod);
  }

  private formatPaymentMethodResponse(paymentMethod: PaymentMethod): PaymentMethodResponseDto {
    return {
      id: paymentMethod.id,
      type: paymentMethod.type,
      lastFourDigits: paymentMethod.lastFourDigits,
      cardBrand: paymentMethod.cardBrand,
      expiryMonth: paymentMethod.expiryMonth,
      expiryYear: paymentMethod.expiryYear,
      billingName: paymentMethod.billingName,
      billingEmail: paymentMethod.billingEmail,
      billingAddress: paymentMethod.billingAddress,
      billingCity: paymentMethod.billingCity,
      billingState: paymentMethod.billingState,
      billingPostalCode: paymentMethod.billingPostalCode,
      billingCountry: paymentMethod.billingCountry,
      isDefault: paymentMethod.isDefault,
      isActive: paymentMethod.isActive,
      nickname: paymentMethod.nickname,
      maskedNumber: paymentMethod.maskedNumber,
      displayName: paymentMethod.displayName,
      isExpired: paymentMethod.isExpired,
      createdAt: paymentMethod.createdAt,
      updatedAt: paymentMethod.updatedAt,
    };
  }
}

// Need to import Not from typeorm
import { Not } from 'typeorm';