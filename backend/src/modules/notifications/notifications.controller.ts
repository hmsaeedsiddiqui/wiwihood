import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Put, 
  Query, 
  UseGuards, 
  Request,
  Patch 
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
// import { MessagesService } from './messages.service';
// import { RemindersService } from './reminders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Notifications')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
// @UseGuards(JwtAuthGuard) // Temporarily disabled for testing
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    // private readonly messagesService: MessagesService,
    // private readonly remindersService: RemindersService
  ) {}

  // Test endpoint
  @Get('test')
  @ApiOperation({ summary: 'Test notifications API' })
  @ApiResponse({ status: 200, description: 'API is working' })
  async test() {
    return { status: 'OK', message: 'Notifications API is working' };
  }

  // Messages endpoints - temporary mock responses
  @Get('messages/conversations')
  @ApiOperation({ summary: 'Get all conversations' })
  @ApiResponse({ status: 200, description: 'Conversations retrieved successfully' })
  async getConversations() {
    // Mock conversation data with customer communication
    return {
      conversations: [
        {
          id: '1',
          participants: ['provider-123', 'customer-456'],
          customerName: 'John Doe',
          customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          lastMessage: 'Hi! I just booked your Hair Cut service for tomorrow. Can we confirm the time?',
          lastMessageAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
          unreadCount: 2,
          bookingId: 'booking-789',
          serviceType: 'Hair Cut'
        },
        {
          id: '2',
          participants: ['provider-123', 'customer-789'],
          customerName: 'Emily Johnson',
          customerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          lastMessage: 'Thank you for the amazing service! I loved my new hairstyle.',
          lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          unreadCount: 0,
          bookingId: 'booking-456', 
          serviceType: 'Hair Styling'
        },
        {
          id: '3',
          participants: ['provider-123', 'customer-101'],
          customerName: 'Sarah Smith',
          customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          lastMessage: 'Can I reschedule my appointment to next week?',
          lastMessageAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          unreadCount: 1,
          bookingId: 'booking-321',
          serviceType: 'Hair Color'
        }
      ],
      total: 3
    };
  }

  @Get('messages/:conversationId')
  @ApiOperation({ summary: 'Get messages by conversation ID' })
  @ApiParam({ name: 'conversationId', description: 'Conversation ID' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
  async getMessages(@Param('conversationId') conversationId: string) {
    // Mock messages for specific conversations
    const conversationMessages = {
      '1': [
        {
          id: 'msg1',
          content: 'Hi! I just booked your Hair Cut service for tomorrow. Can we confirm the time?',
          senderId: 'customer-456',
          senderName: 'John Doe',
          timestamp: new Date(Date.now() - 10 * 60 * 1000),
          type: 'text'
        },
        {
          id: 'msg2', 
          content: 'Is 2:00 PM still available?',
          senderId: 'customer-456',
          senderName: 'John Doe', 
          timestamp: new Date(Date.now() - 8 * 60 * 1000),
          type: 'text'
        }
      ],
      '2': [
        {
          id: 'msg3',
          content: 'Thank you for the amazing service! I loved my new hairstyle.',
          senderId: 'customer-789',
          senderName: 'Emily Johnson',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          type: 'text'
        }
      ],
      '3': [
        {
          id: 'msg4',
          content: 'Can I reschedule my appointment to next week?',
          senderId: 'customer-101',
          senderName: 'Sarah Smith',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          type: 'text'
        }
      ]
    };

    const messages = conversationMessages[conversationId as keyof typeof conversationMessages] || [];
    
    return {
      conversationId,
      messages,
      total: messages.length
    };
  }

  @Post('messages')
  @ApiOperation({ summary: 'Send a new message' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async sendMessage(@Body() body: any) {
    return {
      success: true,
      message: 'Message sent successfully',
      data: body
    };
  }

  // Notification endpoints
  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiResponse({ status: 200, description: 'Notifications retrieved successfully' })
  async getUserNotifications(@Request() req: any) {
    // For testing, return mock data with realistic notifications
    console.log('getUserNotifications called - returning mock data');
    const mockData = {
      notifications: [
        {
          id: '1',
          title: 'New Booking Received',
          message: 'You have a new booking for Hair Cut service from John Doe',
          type: 'booking',
          read: false,
          createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          data: {
            actionUrl: '/provider/bookings',
            customerId: 'customer-123',
            serviceId: 'service-456',
            bookingId: 'booking-789'
          }
        },
        {
          id: '2',
          title: 'Booking Confirmed',
          message: 'Your booking with Sarah Smith has been confirmed for tomorrow at 2:00 PM',
          type: 'success',
          read: false,
          createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          data: {
            actionUrl: '/provider/calendar',
            bookingId: 'booking-456'
          }
        },
        {
          id: '3',
          title: 'Payment Received',
          message: 'You received $50 payment for completed service',
          type: 'payment',
          read: true,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          data: {
            actionUrl: '/provider/transactions',
            amount: 50,
            paymentId: 'payment-123'
          }
        },
        {
          id: '4',
          title: 'New Message',
          message: 'You have a new message from Emily Johnson about her upcoming appointment',
          type: 'message',
          read: false,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          data: {
            actionUrl: '/provider/notifications?tab=messages',
            customerId: 'customer-789',
            conversationId: 'conv-456'
          }
        }
      ],
      total: 4,
      unread: 3
    };
    console.log('Mock data prepared:', JSON.stringify(mockData, null, 2));
    return mockData;
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notifications count' })
  @ApiResponse({ status: 200, description: 'Unread count retrieved successfully' })
  async getUnreadCount(@Request() req: any) {
    try {
      // Mock unread count including notifications and messages
      return { 
        unreadCount: 5,
        notificationCount: 3,
        messageCount: 2 
      };
    } catch (error) {
      return { unreadCount: 0 };
    }
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async markAsRead(@Param('id') id: string, @Request() req: any) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }

  @Patch('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  async markAllAsRead(@Request() req: any) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new notification' })
  @ApiResponse({ status: 201, description: 'Notification created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createNotification(@Body() data: any, @Request() req: any) {
    const userId = req.user?.id || 'test-user-id';
    return this.notificationsService.create({
      ...data,
      userId: userId
    });
  }

  // Message endpoints - temporarily disabled
  /*
  @Get('messages')
  async getUserMessages(@Request() req: any) {
    return this.messagesService.findUserMessages(req.user.id);
  }

  @Get('messages/conversations')
  async getConversations(@Request() req: any) {
    return this.messagesService.getConversations(req.user.id);
  }

  @Get('messages/conversation/:userId')
  async getConversationMessages(
    @Param('userId') userId: string,
    @Request() req: any
  ) {
    return this.messagesService.getConversationMessages(req.user.id, userId);
  }

  @Post('messages')
  async sendMessage(@Body() data: any, @Request() req: any) {
    return this.messagesService.sendMessage({
      ...data,
      senderId: req.user.id
    });
  }

  @Patch('messages/:id/read')
  async markMessageAsRead(@Param('id') id: string, @Request() req: any) {
    return this.messagesService.markAsRead(id, req.user.id);
  }

  // Reminder endpoints - temporarily disabled
  @Get('reminders')
  async getUserReminders(@Request() req: any) {
    return this.remindersService.findUserReminders(req.user.id);
  }

  @Post('reminders')
  async createReminder(@Body() data: any, @Request() req: any) {
    return this.remindersService.create({
      ...data,
      userId: req.user.id
    });
  }

  @Put('reminders/:id')
  async updateReminder(
    @Param('id') id: string,
    @Body() data: any,
    @Request() req: any
  ) {
    return this.remindersService.update(id, data, req.user.id);
  }

  @Delete('reminders/:id')
  async deleteReminder(@Param('id') id: string, @Request() req: any) {
    return this.remindersService.delete(id, req.user.id);
  }
  */
}
