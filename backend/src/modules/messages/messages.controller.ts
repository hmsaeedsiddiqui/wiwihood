import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Messages')
@Controller('messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('conversations')
  @ApiOperation({ summary: 'Get user conversations' })
  @ApiResponse({
    status: 200,
    description: 'Conversations retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          providerId: { type: 'string' },
          customerId: { type: 'string' },
          providerName: { type: 'string' },
          customerName: { type: 'string' },
          lastMessage: {
            type: 'object',
            properties: {
              content: { type: 'string' },
              timestamp: { type: 'string' },
              senderType: { type: 'string', enum: ['customer', 'provider'] }
            }
          },
          unreadCount: { type: 'number' }
        }
      }
    }
  })
  async getConversations(@Request() req) {
    const userId = req.user?.id || '123e4567-e89b-12d3-a456-426614174000';
    const userRole = req.user?.role || 'customer';
    
    // Mock conversations data
    const mockConversations = [
      {
        id: 'conv-1',
        providerId: 'prov-1',
        customerId: 'customer-1',
        providerName: 'Elite Hair Studio',
        customerName: 'John Doe',
        providerLogo: '/provider1.jpg',
        lastMessage: {
          id: 'msg-1',
          content: 'Your appointment is confirmed for tomorrow at 2 PM',
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
          senderType: 'provider',
          read: false
        },
        unreadCount: 2,
        bookingId: 'book-123',
        service: {
          name: 'Hair Cut & Style',
          date: '2024-01-25'
        }
      },
      {
        id: 'conv-2',
        providerId: 'prov-2',
        customerId: 'customer-1',
        providerName: 'Beauty Lounge',
        customerName: 'John Doe',
        providerLogo: '/provider2.jpg',
        lastMessage: {
          id: 'msg-2',
          content: 'Thank you for choosing our service!',
          timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
          senderType: 'customer',
          read: true
        },
        unreadCount: 0,
        bookingId: 'book-124',
        service: {
          name: 'Facial Treatment',
          date: '2024-01-28'
        }
      }
    ];

    return mockConversations;
  }

  @Get('conversations/:conversationId/messages')
  @ApiOperation({ summary: 'Get messages in a conversation' })
  @ApiParam({ name: 'conversationId', description: 'Conversation ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Messages per page' })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        messages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              content: { type: 'string' },
              senderId: { type: 'string' },
              senderType: { type: 'string', enum: ['customer', 'provider'] },
              timestamp: { type: 'string' },
              read: { type: 'boolean' },
              messageType: { type: 'string', enum: ['text', 'image', 'booking_update'] }
            }
          }
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            totalPages: { type: 'number' }
          }
        }
      }
    }
  })
  async getMessages(
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 50,
    @Request() req
  ) {
    const userId = req.user?.id || '123e4567-e89b-12d3-a456-426614174000';
    
    // Mock messages data
    const mockMessages = [
      {
        id: 'msg-1',
        content: 'Hello! I have a question about my upcoming appointment.',
        senderId: 'customer-1',
        senderType: 'customer',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: true,
        messageType: 'text'
      },
      {
        id: 'msg-2',
        content: 'Hi! Of course, I\'m happy to help. What would you like to know?',
        senderId: 'prov-1',
        senderType: 'provider',
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        read: true,
        messageType: 'text'
      },
      {
        id: 'msg-3',
        content: 'Can I reschedule to 3 PM instead of 2 PM tomorrow?',
        senderId: 'customer-1',
        senderType: 'customer',
        timestamp: new Date(Date.now() - 2400000).toISOString(),
        read: true,
        messageType: 'text'
      },
      {
        id: 'msg-4',
        content: 'Let me check my schedule... Yes, 3 PM is available! I\'ll update your booking.',
        senderId: 'prov-1',
        senderType: 'provider',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        read: true,
        messageType: 'text'
      },
      {
        id: 'msg-5',
        content: 'Your appointment is confirmed for tomorrow at 3 PM. See you then!',
        senderId: 'prov-1',
        senderType: 'provider',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        read: false,
        messageType: 'booking_update'
      }
    ];

    const total = mockMessages.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMessages = mockMessages.slice(startIndex, endIndex);

    return {
      messages: paginatedMessages,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages
      }
    };
  }

  @Post('conversations/:conversationId/messages')
  @ApiOperation({ summary: 'Send a message in a conversation' })
  @ApiParam({ name: 'conversationId', description: 'Conversation ID' })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        content: { type: 'string' },
        senderId: { type: 'string' },
        senderType: { type: 'string' },
        timestamp: { type: 'string' },
        read: { type: 'boolean' }
      }
    }
  })
  async sendMessage(
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
    @Body() createMessageDto: CreateMessageDto,
    @Request() req
  ) {
    const userId = req.user?.id || '123e4567-e89b-12d3-a456-426614174000';
    const userRole = req.user?.role || 'customer';

    // Mock message creation
    const newMessage = {
      id: `msg-${Date.now()}`,
      content: createMessageDto.content,
      senderId: userId,
      senderType: userRole,
      timestamp: new Date().toISOString(),
      read: true,
      messageType: createMessageDto.messageType || 'text'
    };

    console.log(`Message sent in conversation ${conversationId}:`, newMessage);

    return newMessage;
  }

  @Post('conversations')
  @ApiOperation({ summary: 'Start a new conversation with a provider' })
  @ApiResponse({
    status: 201,
    description: 'Conversation started successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        providerId: { type: 'string' },
        customerId: { type: 'string' },
        createdAt: { type: 'string' }
      }
    }
  })
  async startConversation(
    @Body() body: { providerId: string; initialMessage?: string },
    @Request() req
  ) {
    const userId = req.user?.id || '123e4567-e89b-12d3-a456-426614174000';
    
    // Mock conversation creation
    const newConversation = {
      id: `conv-${Date.now()}`,
      providerId: body.providerId,
      customerId: userId,
      createdAt: new Date().toISOString()
    };

    console.log('New conversation started:', newConversation);

    // If initial message provided, create it
    if (body.initialMessage) {
      const initialMessage = {
        id: `msg-${Date.now()}`,
        content: body.initialMessage,
        senderId: userId,
        senderType: 'customer',
        timestamp: new Date().toISOString(),
        read: true
      };
      
      console.log('Initial message sent:', initialMessage);
    }

    return newConversation;
  }

  @Get('conversations/:conversationId/mark-read')
  @ApiOperation({ summary: 'Mark messages as read' })
  @ApiParam({ name: 'conversationId', description: 'Conversation ID' })
  @ApiResponse({
    status: 200,
    description: 'Messages marked as read successfully'
  })
  async markAsRead(
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
    @Request() req
  ) {
    const userId = req.user?.id || '123e4567-e89b-12d3-a456-426614174000';
    
    console.log(`Marked messages as read in conversation ${conversationId} for user ${userId}`);
    
    return { success: true, message: 'Messages marked as read' };
  }
}