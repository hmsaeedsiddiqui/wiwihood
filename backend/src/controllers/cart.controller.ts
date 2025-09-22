import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { CartService } from '../services/cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post()
  addToCart(@Req() req, @Body() body) {
    return this.cartService.addToCart(req.user.id, body.serviceId, body.quantity || 1);
  }

  @Patch(':id')
  updateQuantity(@Req() req, @Param('id') id: string, @Body() body) {
    return this.cartService.updateQuantity(req.user.id, id, body.quantity);
  }

  @Delete(':id')
  removeFromCart(@Req() req, @Param('id') id: string) {
    return this.cartService.removeFromCart(req.user.id, id);
  }

  @Delete()
  clearCart(@Req() req) {
    return this.cartService.clearCart(req.user.id);
  }
}
