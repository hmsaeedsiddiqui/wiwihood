import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { UserNotificationPreferences } from '../../entities/user-notification-preferences.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersListResponseDto } from './dto/users-list-response.dto';
import { 
  ChangePasswordDto, 
  UpdateProfileDto, 
  NotificationPreferencesDto, 
  PrivacySettingsDto 
} from './dto/settings.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserNotificationPreferences)
    private readonly notificationPreferencesRepository: Repository<UserNotificationPreferences>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { email, password, ...userData } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      status: userData.status || 'active',
      isEmailVerified: userData.isEmailVerified || false,
      isPhoneVerified: userData.isPhoneVerified || false,
      ...userData,
    });

    const savedUser = await this.userRepository.save(user);
    return this.formatUserResponse(savedUser);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    role?: string,
  ): Promise<UsersListResponseDto> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // Apply search filter
    if (search) {
      queryBuilder.where(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply role filter
    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Order by creation date
    queryBuilder.orderBy('user.createdAt', 'DESC');

    const [users, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      users: users.map(user => this.formatUserResponse(user)),
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev,
    };
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.formatUserResponse(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if email is being changed and if it's already in use
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email is already in use');
      }
    }

    // Update user
    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    return this.formatUserResponse(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(user);
  }

  // Settings Methods

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('New password and confirmation do not match');
    }

    // Find user
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'password'] // Include password for verification
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await this.userRepository.update(userId, { password: hashedNewPassword });

    return { message: 'Password changed successfully' };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user profile
    Object.assign(user, updateProfileDto);
    
    // If dateOfBirth is provided as string, convert to Date
    if (updateProfileDto.dateOfBirth) {
      user.dateOfBirth = new Date(updateProfileDto.dateOfBirth);
    }

    const updatedUser = await this.userRepository.save(user);
    return this.formatUserResponse(updatedUser);
  }

  async getNotificationPreferences(userId: string): Promise<NotificationPreferencesDto> {
    let preferences = await this.notificationPreferencesRepository.findOne({
      where: { userId },
    });

    // Create default preferences if they don't exist
    if (!preferences) {
      preferences = this.notificationPreferencesRepository.create({
        userId,
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        marketingEmails: false,
        bookingReminders: true,
        promotionalOffers: false,
      });
      preferences = await this.notificationPreferencesRepository.save(preferences);
    }

    return {
      emailNotifications: preferences.emailNotifications,
      smsNotifications: preferences.smsNotifications,
      pushNotifications: preferences.pushNotifications,
      marketingEmails: preferences.marketingEmails,
      bookingReminders: preferences.bookingReminders,
      promotionalOffers: preferences.promotionalOffers,
    };
  }

  async updateNotificationPreferences(
    userId: string, 
    notificationPreferencesDto: NotificationPreferencesDto
  ): Promise<NotificationPreferencesDto> {
    let preferences = await this.notificationPreferencesRepository.findOne({
      where: { userId },
    });

    if (!preferences) {
      preferences = this.notificationPreferencesRepository.create({
        userId,
        ...notificationPreferencesDto,
      });
    } else {
      Object.assign(preferences, notificationPreferencesDto);
    }

    const updatedPreferences = await this.notificationPreferencesRepository.save(preferences);

    return {
      emailNotifications: updatedPreferences.emailNotifications,
      smsNotifications: updatedPreferences.smsNotifications,
      pushNotifications: updatedPreferences.pushNotifications,
      marketingEmails: updatedPreferences.marketingEmails,
      bookingReminders: updatedPreferences.bookingReminders,
      promotionalOffers: updatedPreferences.promotionalOffers,
    };
  }

  async updatePrivacySettings(userId: string, privacySettingsDto: PrivacySettingsDto): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update privacy settings on user entity
    if (privacySettingsDto.gdprConsent !== undefined) {
      user.gdprConsent = privacySettingsDto.gdprConsent;
    }
    if (privacySettingsDto.marketingConsent !== undefined) {
      user.marketingConsent = privacySettingsDto.marketingConsent;
    }

    await this.userRepository.save(user);

    return { message: 'Privacy settings updated successfully' };
  }

  async enableTwoFactor(userId: string): Promise<{ message: string; secret?: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // For now, just mark as enabled - in production you'd generate a TOTP secret
    user.isTwoFactorEnabled = true;
    await this.userRepository.save(user);

    return { 
      message: 'Two-factor authentication enabled successfully',
      secret: 'MOCK_SECRET_KEY' // In production, generate actual TOTP secret
    };
  }

  async disableTwoFactor(userId: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isTwoFactorEnabled = false;
    await this.userRepository.save(user);

    return { message: 'Two-factor authentication disabled successfully' };
  }

  async deleteAccount(userId: string, password: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'password', 'email']
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Password is incorrect');
    }

    // Delete notification preferences first (foreign key constraint)
    await this.notificationPreferencesRepository.delete({ userId });

    // Delete user account
    await this.userRepository.remove(user);

    return { message: 'Account deleted successfully' };
  }

  private formatUserResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      status: user.status,
      profilePicture: user.profilePicture,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
