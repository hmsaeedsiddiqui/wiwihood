import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, calendar_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export interface GoogleCalendarConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  enabled: boolean;
}

export interface CalendarEventData {
  summary: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendeeEmails?: string[];
  reminderMinutes?: number[];
}

@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);
  private readonly oauth2Client: OAuth2Client;
  private readonly calendar: calendar_v3.Calendar;
  private readonly config: GoogleCalendarConfig;

  constructor(private readonly configService: ConfigService) {
    this.config = {
      clientId: this.configService.get<string>('GOOGLE_CALENDAR_CLIENT_ID', ''),
      clientSecret: this.configService.get<string>('GOOGLE_CALENDAR_CLIENT_SECRET', ''),
      redirectUri: this.configService.get<string>('GOOGLE_CALENDAR_REDIRECT_URI', ''),
      enabled: this.configService.get<string>('GOOGLE_CALENDAR_ENABLED', 'false') === 'true',
    };

    if (this.isConfigured()) {
      this.oauth2Client = new google.auth.OAuth2(
        this.config.clientId,
        this.config.clientSecret,
        this.config.redirectUri
      );

      this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
    } else {
      this.logger.warn('Google Calendar not configured. Set GOOGLE_CALENDAR_CLIENT_ID and GOOGLE_CALENDAR_CLIENT_SECRET');
    }
  }

  /**
   * Check if Google Calendar is properly configured
   */
  isConfigured(): boolean {
    return !!(
      this.config.enabled &&
      this.config.clientId &&
      this.config.clientId !== 'placeholder_get_from_google_console' &&
      this.config.clientSecret &&
      this.config.clientSecret !== 'placeholder_get_from_google_console'
    );
  }

  /**
   * Generate OAuth consent URL for user authorization
   */
  getAuthUrl(userId: string): string {
    if (!this.isConfigured()) {
      throw new Error('Google Calendar not configured');
    }

    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: userId, // Pass user ID in state for callback handling
      prompt: 'consent',
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokensFromCode(code: string): Promise<{ access_token: string; refresh_token?: string }> {
    if (!this.isConfigured()) {
      throw new Error('Google Calendar not configured');
    }

    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);
      
      return {
        access_token: tokens.access_token!,
        refresh_token: tokens.refresh_token || undefined,
      };
    } catch (error) {
      this.logger.error('Failed to get tokens from authorization code', error);
      throw new Error('Failed to authorize with Google Calendar');
    }
  }

  /**
   * Set user tokens for API calls
   */
  setUserTokens(accessToken: string, refreshToken?: string): void {
    if (!this.isConfigured()) {
      throw new Error('Google Calendar not configured');
    }

    this.oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  /**
   * Create a calendar event
   */
  async createEvent(eventData: CalendarEventData, calendarId: string = 'primary'): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Google Calendar not configured');
    }

    try {
      const event: calendar_v3.Schema$Event = {
        summary: eventData.summary,
        description: eventData.description,
        start: {
          dateTime: eventData.startTime.toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: eventData.endTime.toISOString(),
          timeZone: 'UTC',
        },
        location: eventData.location,
        attendees: eventData.attendeeEmails?.map(email => ({ email })),
        reminders: {
          useDefault: false,
          overrides: eventData.reminderMinutes?.map(minutes => ({
            method: 'popup',
            minutes,
          })) || [{ method: 'popup', minutes: 15 }],
        },
        status: 'confirmed',
      };

      const response = await this.calendar.events.insert({
        calendarId,
        requestBody: event,
        sendUpdates: 'all',
      });

      this.logger.log(`Created Google Calendar event: ${response.data.id}`);
      return response.data.id!;
    } catch (error) {
      this.logger.error('Failed to create Google Calendar event', error);
      throw new Error('Failed to create calendar event');
    }
  }

  /**
   * Update a calendar event
   */
  async updateEvent(
    eventId: string,
    eventData: Partial<CalendarEventData>,
    calendarId: string = 'primary'
  ): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('Google Calendar not configured');
    }

    try {
      const updateData: calendar_v3.Schema$Event = {};

      if (eventData.summary) updateData.summary = eventData.summary;
      if (eventData.description) updateData.description = eventData.description;
      if (eventData.startTime) {
        updateData.start = {
          dateTime: eventData.startTime.toISOString(),
          timeZone: 'UTC',
        };
      }
      if (eventData.endTime) {
        updateData.end = {
          dateTime: eventData.endTime.toISOString(),
          timeZone: 'UTC',
        };
      }
      if (eventData.location) updateData.location = eventData.location;
      if (eventData.attendeeEmails) {
        updateData.attendees = eventData.attendeeEmails.map(email => ({ email }));
      }

      await this.calendar.events.update({
        calendarId,
        eventId,
        requestBody: updateData,
        sendUpdates: 'all',
      });

      this.logger.log(`Updated Google Calendar event: ${eventId}`);
    } catch (error) {
      this.logger.error('Failed to update Google Calendar event', error);
      throw new Error('Failed to update calendar event');
    }
  }

  /**
   * Delete a calendar event
   */
  async deleteEvent(eventId: string, calendarId: string = 'primary'): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('Google Calendar not configured');
    }

    try {
      await this.calendar.events.delete({
        calendarId,
        eventId,
        sendUpdates: 'all',
      });

      this.logger.log(`Deleted Google Calendar event: ${eventId}`);
    } catch (error) {
      this.logger.error('Failed to delete Google Calendar event', error);
      throw new Error('Failed to delete calendar event');
    }
  }

  /**
   * Get user's calendar list
   */
  async getUserCalendars(): Promise<calendar_v3.Schema$CalendarListEntry[]> {
    if (!this.isConfigured()) {
      throw new Error('Google Calendar not configured');
    }

    try {
      const response = await this.calendar.calendarList.list();
      return response.data.items || [];
    } catch (error) {
      this.logger.error('Failed to get user calendars', error);
      throw new Error('Failed to get calendars');
    }
  }

  /**
   * Check if user has granted calendar permissions
   */
  async checkPermissions(): Promise<boolean> {
    if (!this.isConfigured()) {
      return false;
    }

    try {
      await this.calendar.calendarList.list();
      return true;
    } catch (error) {
      return false;
    }
  }
}