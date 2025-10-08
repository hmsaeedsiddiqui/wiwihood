import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CartService } from './cart.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
// @UseGuards(JwtAuthGuard) // Temporarily disabled for testing
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  getCart(@Req() req) {
    // For testing, use a hardcoded user ID
    const userId = req.user?.id || 'test-user-id';
    return this.cartService.getCart(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  addToCart(@Req() req, @Body() body) {
    // For testing, use a hardcoded user ID
    const userId = req.user?.id || 'test-user-id';
    return this.cartService.addToCart(userId, body.serviceId, body.quantity || 1);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiParam({ name: 'id', description: 'Cart item ID' })
  @ApiResponse({ status: 200, description: 'Cart item updated successfully' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  updateQuantity(@Req() req, @Param('id') id: string, @Body() body) {
    const userId = req.user?.id || 'test-user-id';
    return this.cartService.updateQuantity(userId, id, body.quantity);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiParam({ name: 'id', description: 'Cart item ID' })
  @ApiResponse({ status: 200, description: 'Item removed from cart successfully' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  removeFromCart(@Req() req, @Param('id') id: string) {
    const userId = req.user?.id || 'test-user-id';
    return this.cartService.removeFromCart(userId, id);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
  clearCart(@Req() req) {
    const userId = req.user?.id || 'test-user-id';
    return this.cartService.clearCart(userId);
  }
}
