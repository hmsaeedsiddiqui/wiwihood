import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../entities/notification.entity';

export interface ReviewRequestNotification {
  bookingId: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  providerName: string;
  serviceName: string;
  completedAt: Date;
  reviewUrl: string;
}

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async sendReviewRequest(data: ReviewRequestNotification): Promise<void> {
    try {
      // Create in-app notification
      await this.createInAppNotification(data);
      
      // Send email notification (in production, integrate with email service)
      await this.sendEmailNotification(data);
      
      // Schedule follow-up reminder (in production, integrate with job queue)
      await this.scheduleReviewReminder(data);
      
    } catch (error) {
      console.error('Failed to send review request notification:', error);
    }
  }

  private async createInAppNotification(data: ReviewRequestNotification): Promise<void> {
    const notification = this.notificationRepository.create({
      userId: data.customerId,
      type: 'review_request',
      title: 'Share Your Experience',
      message: `How was your experience with ${data.providerName}? Your review helps other customers make informed decisions.`,
      data: {
        bookingId: data.bookingId,
        providerName: data.providerName,
        serviceName: data.serviceName,
        reviewUrl: data.reviewUrl,
      },
      isRead: false,
    });

    await this.notificationRepository.save(notification);
    console.log(`In-app notification created for user ${data.customerId}`);
  }

  private async sendEmailNotification(data: ReviewRequestNotification): Promise<void> {
    // In production, integrate with email service like SendGrid, AWS SES, etc.
    const emailTemplate = this.generateReviewRequestEmail(data);
    
    console.log('Email notification would be sent:');
    console.log(`To: ${data.customerEmail}`);
    console.log(`Subject: ${emailTemplate.subject}`);
    console.log(`Body: ${emailTemplate.body.substring(0, 200)}...`);
    
    // Example integration:
    // await this.emailService.send({
    //   to: data.customerEmail,
    //   subject: emailTemplate.subject,
    //   html: emailTemplate.body,
    // });
  }

  private async scheduleReviewReminder(data: ReviewRequestNotification): Promise<void> {
    // In production, integrate with job queue like Bull, Agenda, etc.
    const reminderDate = new Date(data.completedAt);
    reminderDate.setDate(reminderDate.getDate() + 3); // Remind after 3 days
    
    console.log(`Review reminder would be scheduled for ${reminderDate.toISOString()}`);
    
    // Example integration:
    // await this.queueService.add('review-reminder', {
    //   bookingId: data.bookingId,
    //   customerId: data.customerId,
    // }, {
    //   delay: reminderDate.getTime() - Date.now(),
    // });
  }

  private generateReviewRequestEmail(data: ReviewRequestNotification): { subject: string; body: string } {
    const subject = `Share your experience with ${data.providerName}`;
    
    const body = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Review Request</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .service-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4f46e5; }
        .cta-button { display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
        .stars { color: #fbbf24; font-size: 24px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>How was your experience?</h1>
        </div>
        
        <div class="content">
            <p>Hi ${data.customerName},</p>
            
            <p>Thank you for choosing our platform! We hope you had a great experience with your recent service.</p>
            
            <div class="service-info">
                <h3>Service Details</h3>
                <p><strong>Service:</strong> ${data.serviceName}</p>
                <p><strong>Provider:</strong> ${data.providerName}</p>
                <p><strong>Completed:</strong> ${data.completedAt.toLocaleDateString()}</p>
            </div>
            
            <p>Your feedback is incredibly valuable to us and helps other customers make informed decisions. It only takes a minute to share your experience!</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <div class="stars">★ ★ ★ ★ ★</div>
                <p style="margin: 10px 0;">Rate your experience</p>
                <a href="${data.reviewUrl}" class="cta-button">Write Review</a>
            </div>
            
            <p><strong>Why your review matters:</strong></p>
            <ul>
                <li>Helps other customers find great service providers</li>
                <li>Provides valuable feedback to improve services</li>
                <li>Builds trust in our community</li>
                <li>Takes less than 2 minutes to complete</li>
            </ul>
            
            <p>If you have any concerns or issues with your service, please don't hesitate to contact our support team.</p>
            
            <p>Thank you for being part of our community!</p>
            
            <p>Best regards,<br>The Reservista Team</p>
        </div>
        
        <div class="footer">
            <p>This email was sent because you completed a service booking. If you no longer want to receive review requests, you can update your preferences in your account settings.</p>
        </div>
    </div>
</body>
</html>
    `;
    
    return { subject, body };
  }

  async markNotificationAsRead(notificationId: string, userId: string): Promise<void> {
    await this.notificationRepository.update(
      { id: notificationId, userId },
      { isRead: true, readAt: new Date() }
    );
  }

  async getUserNotifications(userId: string, limit: number = 20): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: { userId, isRead: false },
    });
  }
}
