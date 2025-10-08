import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Review } from '../../entities/review.entity';
import { Booking, BookingStatus } from '../../entities/booking.entity';
import { User } from '../../entities/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewFilterDto, ProviderResponseDto } from './dto/review-filter.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createReviewDto: CreateReviewDto, userId: string): Promise<Review> {
    const { bookingId, ...reviewData } = createReviewDto;

    // Verify booking exists and belongs to the user
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['customer', 'provider', 'service']
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.customer.id !== userId) {
      throw new ForbiddenException('You can only review your own bookings');
    }

    // Check if booking is completed
    if (booking.status !== BookingStatus.COMPLETED) {
      throw new BadRequestException('You can only review completed bookings');
    }

    // Check if review already exists for this booking
    const existingReview = await this.reviewRepository.findOne({
      where: { bookingId }
    });

    if (existingReview) {
      throw new BadRequestException('Review already exists for this booking');
    }

    const review = this.reviewRepository.create({
      ...reviewData,
      bookingId,
      customerId: userId,
      providerId: booking.providerId,
      isPublished: reviewData.isPublished !== undefined ? reviewData.isPublished : true,
    });

    const savedReview = await this.reviewRepository.save(review);

    // Update service average rating
    await this.updateServiceRating(booking.serviceId);

    return savedReview;
  }

  async findAll(filters?: ReviewFilterDto): Promise<Review[]> {
    const queryBuilder = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.customer', 'customer')
      .leftJoinAndSelect('review.provider', 'provider')
      .leftJoinAndSelect('review.booking', 'booking')
      .leftJoinAndSelect('booking.service', 'service');

    // Apply filters
    if (filters?.providerId) {
      queryBuilder.andWhere('review.providerId = :providerId', { providerId: filters.providerId });
    }
    if (filters?.customerId) {
      queryBuilder.andWhere('review.customerId = :customerId', { customerId: filters.customerId });
    }
    if (filters?.minRating !== undefined) {
      queryBuilder.andWhere('review.rating >= :minRating', { minRating: filters.minRating });
    }
    if (filters?.maxRating !== undefined) {
      queryBuilder.andWhere('review.rating <= :maxRating', { maxRating: filters.maxRating });
    }
    if (filters?.isPublished !== undefined) {
      queryBuilder.andWhere('review.isPublished = :isPublished', { isPublished: filters.isPublished });
    }
    if (filters?.isVerified !== undefined) {
      queryBuilder.andWhere('review.isVerified = :isVerified', { isVerified: filters.isVerified });
    }
    if (filters?.search) {
      queryBuilder.andWhere(
        '(LOWER(review.title) LIKE LOWER(:search) OR LOWER(review.comment) LIKE LOWER(:search))',
        { search: `%${filters.search}%` }
      );
    }

    return await queryBuilder
      .orderBy('review.createdAt', 'DESC')
      .getMany();
  }

  async findByProvider(providerId: string, onlyPublished: boolean = true): Promise<Review[]> {
    const where: any = { providerId };
    if (onlyPublished) {
      where.isPublished = true;
    }

    return await this.reviewRepository.find({
      where,
      relations: ['customer', 'booking', 'booking.service'],
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async findByCustomer(customerId: string): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { customerId },
      relations: ['provider', 'booking', 'booking.service'],
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['customer', 'provider', 'provider.user', 'booking', 'booking.service']
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, userId: string): Promise<Review> {
    const review = await this.findOne(id);

    // Check if user has permission to update this review
    if (review.customerId !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    Object.assign(review, updateReviewDto);
    review.updatedAt = new Date();

    const savedReview = await this.reviewRepository.save(review);

    // Update service average rating if rating changed
    if (updateReviewDto.rating !== undefined) {
      await this.updateServiceRating(review.booking.serviceId);
    }

    return savedReview;
  }

  async remove(id: string, userId: string, userRole?: string): Promise<void> {
    const review = await this.findOne(id);

    // Check if user has permission to delete this review
    if (review.customerId !== userId && userRole !== 'admin') {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    const serviceId = review.booking.serviceId;
    await this.reviewRepository.remove(review);

    // Update service average rating
    await this.updateServiceRating(serviceId);
  }

  async addProviderResponse(id: string, responseDto: ProviderResponseDto, userId: string): Promise<Review> {
    const review = await this.findOne(id);

    // Check if user is the provider for this review
    if (review.provider.user.id !== userId) {
      throw new ForbiddenException('You can only respond to reviews for your services');
    }

    review.providerResponse = responseDto.providerResponse;
    review.providerResponseAt = new Date();
    review.updatedAt = new Date();

    return await this.reviewRepository.save(review);
  }

  async togglePublishedStatus(id: string, userId: string): Promise<Review> {
    const review = await this.findOne(id);

    // Check if user has permission (customer or admin)
    if (review.customerId !== userId) {
      throw new ForbiddenException('You can only change the published status of your own reviews');
    }

    review.isPublished = !review.isPublished;
    review.updatedAt = new Date();

    return await this.reviewRepository.save(review);
  }

  async toggleVerifiedStatus(id: string): Promise<Review> {
    const review = await this.findOne(id);
    review.isVerified = !review.isVerified;
    review.updatedAt = new Date();

    return await this.reviewRepository.save(review);
  }

  async getProviderStats(providerId: string): Promise<{
    totalReviews: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
  }> {
    const reviews = await this.reviewRepository.find({
      where: { providerId, isPublished: true }
    });

    if (reviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }

    const totalReviews = reviews.length;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = Math.round((totalRating / totalReviews) * 10) / 10;

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      ratingDistribution[review.rating]++;
    });

    return {
      totalReviews,
      averageRating,
      ratingDistribution
    };
  }

  async fixOrphanReviews(): Promise<{ fixed: number; message: string }> {
    try {
      // Find all reviews without provider ID
      const orphanReviews = await this.reviewRepository.find({
        where: { providerId: null },
        relations: ['booking']
      });

      let fixed = 0;

      for (const review of orphanReviews) {
        if (review.bookingId) {
          // Get the booking to find the correct provider ID
          const booking = await this.bookingRepository.findOne({
            where: { id: review.bookingId },
            relations: ['provider']
          });

          if (booking && booking.providerId) {
            // Update the review with the correct provider ID
            await this.reviewRepository.update(review.id, {
              providerId: booking.providerId
            });
            fixed++;
          }
        }
      }

      return {
        fixed,
        message: `Fixed ${fixed} orphan reviews out of ${orphanReviews.length} found.`
      };
    } catch (error) {
      throw new BadRequestException(`Failed to fix orphan reviews: ${error.message}`);
    }
  }

  private async updateServiceRating(serviceId: string): Promise<void> {
    // This would be implemented with a service reference
    // For now, we'll skip this implementation as it requires the Service entity updates
    // In a real implementation, you'd update the Service entity's averageRating and totalReviews fields
  }
}
