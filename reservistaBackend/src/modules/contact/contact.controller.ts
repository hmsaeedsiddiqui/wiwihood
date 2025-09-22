import { Controller, Get, Post, Body, Param, Delete, Put, HttpStatus, HttpException } from '@nestjs/common';
import { ContactService, CreateContactMessageDto } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  async findAll() {
    try {
      return await this.contactService.findAll();
    } catch (error) {
      throw new HttpException('Failed to retrieve contact messages', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
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
  async markAsRead(@Param('id') id: string) {
    try {
      await this.contactService.markAsRead(id);
      return { success: true, message: 'Message marked as read' };
    } catch (error) {
      throw new HttpException('Failed to mark message as read', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id/reply')
  async reply(@Param('id') id: string, @Body() body: { adminResponse: string }) {
    try {
      if (!body.adminResponse) {
        throw new HttpException('Admin response is required', HttpStatus.BAD_REQUEST);
      }

      await this.contactService.reply(id, body.adminResponse);
      return { success: true, message: 'Reply sent successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to send reply', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.contactService.remove(id);
      return { success: true, message: 'Contact message deleted successfully' };
    } catch (error) {
      throw new HttpException('Failed to delete contact message', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}