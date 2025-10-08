import { Controller, Get, Post, Body, Param, Delete, Put, HttpStatus, HttpException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { CreateContactMessageDto, ReplyContactDto } from './dto/contact.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Contact')
@Controller('contact')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  @ApiOperation({ summary: 'Get all contact messages' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all contact messages',
    example: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'John Doe',
        email: 'john.doe@example.com',
        subject: 'General Inquiry',
        message: 'I would like to know more about your services.',
        status: 'unread',
        adminResponse: null,
        respondedAt: null,
        createdAt: '2025-10-06T10:00:00.000Z',
        updatedAt: '2025-10-06T10:00:00.000Z'
      }
    ]
  })
  async findAll() {
    try {
      return await this.contactService.findAll();
    } catch (error) {
      throw new HttpException('Failed to retrieve contact messages', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific contact message' })
  @ApiParam({ 
    name: 'id', 
    description: 'Contact message ID (UUID format)', 
    example: '550e8400-e29b-41d4-a716-446655440000' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the contact message',
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'John Doe',
      email: 'john.doe@example.com',
      subject: 'General Inquiry',
      message: 'I would like to know more about your services.',
      status: 'unread',
      adminResponse: null,
      respondedAt: null,
      createdAt: '2025-10-06T10:00:00.000Z',
      updatedAt: '2025-10-06T10:00:00.000Z'
    }
  })
  @ApiResponse({ status: 404, description: 'Contact message not found' })
  async findOne(@Param('id') id: string) {
    try {
      const message = await this.contactService.findOne(id);
      if (!message) {
        throw new HttpException('Contact message not found', HttpStatus.NOT_FOUND);
      }
      return message;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to retrieve contact message', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new contact message' })
  @ApiBody({ 
    type: CreateContactMessageDto,
    examples: {
      'General Inquiry': {
        summary: 'General inquiry example',
        value: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          subject: 'General Inquiry',
          message: 'I would like to know more about your services and pricing.'
        }
      },
      'Support Request': {
        summary: 'Support request example',
        value: {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          subject: 'Technical Support',
          message: 'I am having trouble with my booking confirmation. Can you help?'
        }
      },
      'Partnership Inquiry': {
        summary: 'Partnership inquiry example',
        value: {
          name: 'Business Owner',
          email: 'business@company.com',
          subject: 'Partnership Opportunity',
          message: 'We are interested in partnering with your platform as a service provider.'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Contact message created successfully',
    example: {
      success: true,
      message: 'Contact message sent successfully',
      data: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'John Doe',
        email: 'john.doe@example.com',
        subject: 'General Inquiry',
        message: 'I would like to know more about your services and pricing.',
        status: 'unread',
        adminResponse: null,
        respondedAt: null,
        createdAt: '2025-10-06T10:00:00.000Z',
        updatedAt: '2025-10-06T10:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() createContactMessageDto: CreateContactMessageDto) {
    try {
      // Basic validation
      if (!createContactMessageDto.name || !createContactMessageDto.email || !createContactMessageDto.message) {
        throw new HttpException('Name, email, and message are required', HttpStatus.BAD_REQUEST);
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(createContactMessageDto.email)) {
        throw new HttpException('Invalid email format', HttpStatus.BAD_REQUEST);
      }

      const savedMessage = await this.contactService.create(createContactMessageDto);
      return {
        success: true,
        message: 'Contact message sent successfully',
        data: savedMessage
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to send contact message', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id/mark-read')
  @ApiOperation({ summary: 'Mark contact message as read' })
  @ApiParam({ 
    name: 'id', 
    description: 'Contact message ID (UUID format)', 
    example: '550e8400-e29b-41d4-a716-446655440000' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Message marked as read successfully',
    example: {
      success: true,
      message: 'Message marked as read'
    }
  })
  @ApiResponse({ status: 404, description: 'Contact message not found' })
  async markAsRead(@Param('id') id: string) {
    try {
      const result = await this.contactService.markAsRead(id);
      if (result.affected === 0) {
        throw new HttpException('Contact message not found', HttpStatus.NOT_FOUND);
      }
      return { success: true, message: 'Message marked as read' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to mark message as read', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id/reply')
  @ApiOperation({ summary: 'Reply to contact message' })
  @ApiParam({ 
    name: 'id', 
    description: 'Contact message ID (UUID format)', 
    example: '550e8400-e29b-41d4-a716-446655440000' 
  })
  @ApiBody({ 
    type: ReplyContactDto,
    examples: {
      'General Response': {
        summary: 'General response example',
        value: {
          adminResponse: 'Thank you for your inquiry. We will get back to you within 24 hours with detailed information about our services.'
        }
      },
      'Support Response': {
        summary: 'Support response example',
        value: {
          adminResponse: 'We have received your technical support request. Our team will investigate the issue and contact you shortly with a resolution.'
        }
      },
      'Partnership Response': {
        summary: 'Partnership response example',
        value: {
          adminResponse: 'Thank you for your interest in partnering with us. We will review your proposal and schedule a meeting to discuss further details.'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Reply sent successfully',
    example: {
      success: true,
      message: 'Reply sent successfully'
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Contact message not found' })
  async reply(@Param('id') id: string, @Body() replyDto: ReplyContactDto) {
    try {
      if (!replyDto.adminResponse) {
        throw new HttpException('Admin response is required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.contactService.reply(id, replyDto.adminResponse);
      if (result.affected === 0) {
        throw new HttpException('Contact message not found', HttpStatus.NOT_FOUND);
      }
      return { success: true, message: 'Reply sent successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to send reply', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete contact message' })
  @ApiParam({ 
    name: 'id', 
    description: 'Contact message ID (UUID format)', 
    example: '550e8400-e29b-41d4-a716-446655440000' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Contact message deleted successfully',
    example: {
      success: true,
      message: 'Contact message deleted successfully'
    }
  })
  @ApiResponse({ status: 404, description: 'Contact message not found' })
  async remove(@Param('id') id: string) {
    try {
      const result = await this.contactService.remove(id);
      if (result.affected === 0) {
        throw new HttpException('Contact message not found', HttpStatus.NOT_FOUND);
      }
      return { success: true, message: 'Contact message deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to delete contact message', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}