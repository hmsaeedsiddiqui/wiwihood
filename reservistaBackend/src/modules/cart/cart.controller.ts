import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
// @UseGuards(JwtAuthGuard) // Temporarily disabled for testing
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Req() req) {
    // For testing, use a hardcoded user ID
    const userId = req.user?.id || 'test-user-id';
    return this.cartService.getCart(userId);
  }

  @Post()
  addToCart(@Req() req, @Body() body) {
    // For testing, use a hardcoded user ID
    const userId = req.user?.id || 'test-user-id';
    return this.cartService.addToCart(userId, body.serviceId, body.quantity || 1);
  }

  @Patch(':id')
  updateQuantity(@Req() req, @Param('id') id: string, @Body() body) {
    const userId = req.user?.id || 'test-user-id';
    return this.cartService.updateQuantity(userId, id, body.quantity);
  }

  @Delete(':id')
  removeFromCart(@Req() req, @Param('id') id: string) {
    const userId = req.user?.id || 'test-user-id';
    return this.cartService.removeFromCart(userId, id);
  }

  @Delete()
  clearCart(@Req() req) {
    const userId = req.user?.id || 'test-user-id';
    return this.cartService.clearCart(userId);
  }
}
