import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GiftCardsService } from './gift-cards.service';
import { CreateGiftCardDto, RedeemGiftCardDto, GiftCardBalanceDto } from './dto/gift-card.dto';
import { GiftCard, GiftCardTransaction } from '../../entities/gift-card.entity';

@ApiTags('Gift Cards')
@Controller('gift-cards')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class GiftCardsController {
  constructor(private readonly giftCardsService: GiftCardsService) {}

  @Post()
  @ApiOperation({ summary: 'Purchase a gift card' })
  @ApiResponse({
    status: 201,
    description: 'Gift card created successfully',
    type: GiftCard,
  })
  async createGiftCard(
    @Body() createGiftCardDto: CreateGiftCardDto,
    @Request() req: any,
  ): Promise<GiftCard> {
    return await this.giftCardsService.createGiftCard(createGiftCardDto, req.user.id);
  }

  @Get('my-cards')
  @ApiOperation({ summary: 'Get user gift cards' })
  @ApiResponse({
    status: 200,
    description: 'User gift cards retrieved successfully',
    type: [GiftCard],
  })
  async getMyGiftCards(@Request() req: any): Promise<GiftCard[]> {
    return await this.giftCardsService.getUserGiftCards(req.user.id);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active gift cards for user' })
  @ApiResponse({
    status: 200,
    description: 'Active gift cards retrieved successfully',
    type: [GiftCard],
  })
  async getActiveGiftCards(@Request() req: any): Promise<GiftCard[]> {
    return await this.giftCardsService.getActiveGiftCards(req.user.id);
  }

  @Post('check-balance')
  @ApiOperation({ summary: 'Check gift card balance' })
  @ApiResponse({
    status: 200,
    description: 'Gift card balance retrieved successfully',
  })
  async checkBalance(@Body() balanceDto: GiftCardBalanceDto): Promise<{
    balance: number;
    status: string;
    expiresAt: Date;
  }> {
    return await this.giftCardsService.checkBalance(balanceDto.code);
  }

  @Post('redeem')
  @ApiOperation({ summary: 'Redeem gift card' })
  @ApiResponse({
    status: 200,
    description: 'Gift card redeemed successfully',
    type: GiftCard,
  })
  async redeemGiftCard(@Body() redeemDto: RedeemGiftCardDto): Promise<GiftCard> {
    return await this.giftCardsService.redeemGiftCard(redeemDto);
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get gift card details by code' })
  @ApiParam({ name: 'code', description: 'Gift card code' })
  @ApiResponse({
    status: 200,
    description: 'Gift card details retrieved successfully',
    type: GiftCard,
  })
  async getGiftCard(@Param('code') code: string): Promise<GiftCard> {
    return await this.giftCardsService.getGiftCardByCode(code);
  }

  @Get(':code/usage-history')
  @ApiOperation({ summary: 'Get gift card usage history' })
  @ApiParam({ name: 'code', description: 'Gift card code' })
  @ApiResponse({
    status: 200,
    description: 'Gift card usage history retrieved successfully',
  })
  async getUsageHistory(@Param('code') code: string) {
    return await this.giftCardsService.getGiftCardTransactionHistory(code);
  }

  @Put(':code/transfer')
  @ApiOperation({ summary: 'Transfer gift card to another user' })
  @ApiParam({ name: 'code', description: 'Gift card code' })
  @ApiResponse({
    status: 200,
    description: 'Gift card transferred successfully',
    type: GiftCard,
  })
  async transferGiftCard(
    @Param('code') code: string,
    @Body() body: { recipientEmail: string },
  ): Promise<GiftCard> {
    return await this.giftCardsService.transferGiftCard(code, body.recipientEmail);
  }

  @Delete(':code')
  @ApiOperation({ summary: 'Cancel gift card' })
  @ApiParam({ name: 'code', description: 'Gift card code' })
  @ApiResponse({
    status: 200,
    description: 'Gift card cancelled successfully',
    type: GiftCard,
  })
  async cancelGiftCard(
    @Param('code') code: string,
    @Body() body?: { reason?: string },
  ): Promise<GiftCard> {
    return await this.giftCardsService.cancelGiftCard(code, body?.reason);
  }
}