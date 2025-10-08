import { Controller, Get, Post, Body, Param, UseGuards, Request, Res, Query, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CalendarService } from './calendar.service';
import { GoogleCalendarService, CalendarEventData } from './google-calendar.service';
import { CalendarEvent } from '../../entities/calendar-event.entity';
import { GoogleCalendarToken } from '../../entities/google-calendar-token.entity';

@ApiTags('Calendar')
@ApiBearerAuth()
@Controller('calendar')
export class CalendarController {
  private readonly logger = new Logger(CalendarController.name);

  constructor(
    private readonly calendarService: CalendarService,
    private readonly googleCalendarService: GoogleCalendarService,
    @InjectRepository(GoogleCalendarToken)
    private readonly googleTokenRepository: Repository<GoogleCalendarToken>,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create calendar event' })
  @ApiResponse({ status: 201, description: 'Calendar event created successfully', type: CalendarEvent })
  async create(@Body() data: Partial<CalendarEvent>): Promise<CalendarEvent> {
    return this.calendarService.create(data);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all calendar events' })
  @ApiResponse({ status: 200, description: 'Calendar events retrieved successfully', type: [CalendarEvent] })
  async findAll(): Promise<CalendarEvent[]> {
    return this.calendarService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get calendar event by ID' })
  @ApiParam({ name: 'id', description: 'Calendar event ID' })
  @ApiResponse({ status: 200, description: 'Calendar event retrieved successfully', type: CalendarEvent })
  async findOne(@Param('id') id: string): Promise<CalendarEvent | null> {
    return this.calendarService.findOne(id);
  }

  @Get('bookings/ics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Download user bookings as ICS file' })
  @ApiResponse({ status: 200, description: 'ICS file generated successfully' })
  async downloadUserBookingsICS(@Request() req: any, @Res() res: Response) {
    const icsContent = await this.calendarService.generateUserBookingICS(req.user.id);
    
    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', 'attachment; filename="my-bookings.ics"');
    res.send(icsContent);
  }

  @Get('provider/bookings/ics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Download provider bookings as ICS file' })
  @ApiResponse({ status: 200, description: 'ICS file generated successfully' })
  async downloadProviderBookingsICS(@Request() req: any, @Res() res: Response) {
    // Assuming the user has a provider relation
    const icsContent = await this.calendarService.generateProviderBookingICS(req.user.provider?.id);
    
    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', 'attachment; filename="provider-bookings.ics"');
    res.send(icsContent);
  }

  /**
   * Get Google Calendar authorization URL
   */
  @Get('google/auth-url')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Google Calendar authorization URL' })
  @ApiResponse({ status: 200, description: 'Authorization URL generated successfully' })
  async getGoogleAuthUrl(@Request() req: any) {
    try {
      if (!this.googleCalendarService.isConfigured()) {
        return {
          error: 'Google Calendar not configured',
          configured: false,
        };
      }

      const authUrl = this.googleCalendarService.getAuthUrl(req.user.id.toString());
      return {
        authUrl,
        configured: true,
      };
    } catch (error) {
      this.logger.error('Failed to get Google Calendar auth URL', error);
      throw error;
    }
  }

  /**
   * Handle Google Calendar OAuth callback
   */
  @Get('google/callback')
  @ApiOperation({ summary: 'Handle Google Calendar OAuth callback' })
  @ApiResponse({ status: 200, description: 'Google Calendar connected successfully' })
  async handleGoogleCallback(
    @Query('code') code: string,
    @Query('state') userId: string,
    @Res() res: Response,
  ) {
    try {
      if (!code) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: 'Authorization code not provided',
        });
      }

      const tokens = await this.googleCalendarService.getTokensFromCode(code);
      
      // Store tokens in database (implement this method)
      await this.storeUserGoogleTokens(Number(userId), tokens);

      return res.status(HttpStatus.OK).json({
        message: 'Google Calendar connected successfully',
        connected: true,
      });
    } catch (error) {
      this.logger.error('Failed to handle Google Calendar callback', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to connect Google Calendar',
      });
    }
  }

  /**
   * Check Google Calendar connection status
   */
  @Get('google/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check Google Calendar connection status' })
  @ApiResponse({ status: 200, description: 'Google Calendar status retrieved successfully' })
  async getGoogleCalendarStatus(@Request() req: any) {
    try {
      if (!this.googleCalendarService.isConfigured()) {
        return {
          configured: false,
          connected: false,
          message: 'Google Calendar API not configured',
        };
      }

      const userTokens = await this.getUserGoogleTokens(req.user.id);
      
      if (!userTokens) {
        return {
          configured: true,
          connected: false,
          message: 'User has not connected Google Calendar',
        };
      }

      this.googleCalendarService.setUserTokens(
        userTokens.accessToken,
        userTokens.refreshToken,
      );

      const hasPermissions = await this.googleCalendarService.checkPermissions();
      
      return {
        configured: true,
        connected: hasPermissions,
        message: hasPermissions ? 'Google Calendar connected' : 'Google Calendar permissions expired',
      };
    } catch (error) {
      this.logger.error('Failed to check Google Calendar status', error);
      return {
        configured: false,
        connected: false,
        message: 'Error checking Google Calendar status',
      };
    }
  }

  /**
   * Get user's Google Calendar list
   */
  @Get('google/calendars')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user Google Calendar list' })
  @ApiResponse({ status: 200, description: 'Google Calendar list retrieved successfully' })
  async getUserGoogleCalendars(@Request() req: any) {
    try {
      if (!this.googleCalendarService.isConfigured()) {
        throw new Error('Google Calendar not configured');
      }

      const userTokens = await this.getUserGoogleTokens(req.user.id);
      
      if (!userTokens) {
        throw new Error('User has not connected Google Calendar');
      }

      this.googleCalendarService.setUserTokens(
        userTokens.accessToken,
        userTokens.refreshToken,
      );

      const calendars = await this.googleCalendarService.getUserCalendars();
      
      return calendars.map(cal => ({
        id: cal.id,
        name: cal.summary,
        description: cal.description,
        primary: cal.primary,
        accessRole: cal.accessRole,
      }));
    } catch (error) {
      this.logger.error('Failed to get user Google Calendars', error);
      throw error;
    }
  }

  // Private helper methods
  private async getUserGoogleTokens(userId: number): Promise<{ accessToken: string; refreshToken?: string } | null> {
    const tokenRecord = await this.googleTokenRepository.findOne({
      where: { userId, isActive: true },
    });

    if (!tokenRecord) {
      return null;
    }

    return {
      accessToken: tokenRecord.accessToken,
      refreshToken: tokenRecord.refreshToken,
    };
  }

  private async storeUserGoogleTokens(userId: number, tokens: { access_token: string; refresh_token?: string }): Promise<void> {
    // Deactivate existing tokens
    await this.googleTokenRepository.update(
      { userId, isActive: true },
      { isActive: false }
    );

    // Create new token record
    const tokenRecord = this.googleTokenRepository.create({
      userId,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      isActive: true,
    });

    await this.googleTokenRepository.save(tokenRecord);
  }
}
