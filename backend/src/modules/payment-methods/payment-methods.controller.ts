import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { PaymentMethodsService } from './payment-methods.service';
import { CreatePaymentMethodDto, UpdatePaymentMethodDto, PaymentMethodResponseDto } from './dto/payment-method.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Payment Methods')
@ApiBearerAuth('JWT-auth')
@Controller('payment-methods')
@UseGuards(JwtAuthGuard)
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Post()
  @ApiOperation({ summary: 'Add new payment method' })
  @ApiResponse({
    status: 201,
    description: 'Payment method added successfully',
    type: PaymentMethodResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Request() req,
    @Body() createPaymentMethodDto: CreatePaymentMethodDto,
  ): Promise<PaymentMethodResponseDto> {
    return this.paymentMethodsService.create(req.user.id, createPaymentMethodDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user payment methods' })
  @ApiResponse({
    status: 200,
    description: 'User payment methods retrieved successfully',
    type: [PaymentMethodResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Request() req): Promise<PaymentMethodResponseDto[]> {
    return this.paymentMethodsService.findAll(req.user.id);
  }

  @Get('default')
  @ApiOperation({ summary: 'Get default payment method' })
  @ApiResponse({
    status: 200,
    description: 'Default payment method retrieved successfully',
    type: PaymentMethodResponseDto,
  })
  @ApiResponse({ status: 404, description: 'No default payment method found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getDefault(@Request() req): Promise<PaymentMethodResponseDto | null> {
    return this.paymentMethodsService.getDefault(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment method by ID' })
  @ApiParam({ name: 'id', description: 'Payment method ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment method retrieved successfully',
    type: PaymentMethodResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Payment method not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PaymentMethodResponseDto> {
    return this.paymentMethodsService.findOne(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update payment method' })
  @ApiParam({ name: 'id', description: 'Payment method ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment method updated successfully',
    type: PaymentMethodResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Payment method not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
  ): Promise<PaymentMethodResponseDto> {
    return this.paymentMethodsService.update(req.user.id, id, updatePaymentMethodDto);
  }

  @Patch(':id/set-default')
  @ApiOperation({ summary: 'Set payment method as default' })
  @ApiParam({ name: 'id', description: 'Payment method ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment method set as default successfully',
    type: PaymentMethodResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Payment method not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async setDefault(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PaymentMethodResponseDto> {
    return this.paymentMethodsService.setDefault(req.user.id, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete payment method' })
  @ApiParam({ name: 'id', description: 'Payment method ID' })
  @ApiResponse({
    status: 200,
    description: 'Payment method deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Payment method not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete default payment method' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async remove(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.paymentMethodsService.remove(req.user.id, id);
    return { message: 'Payment method deleted successfully' };
  }
}