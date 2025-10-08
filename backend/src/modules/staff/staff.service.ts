import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff, StaffStatus } from '../../entities/staff.entity';
import { Provider } from '../../entities/provider.entity';
import { User } from '../../entities/user.entity';
import { 
  CreateStaffDto, 
  UpdateStaffDto, 
  StaffResponseDto 
} from './dto/staff.dto';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createStaffDto: CreateStaffDto): Promise<StaffResponseDto> {
    // Check if email already exists
    const existingStaff = await this.staffRepository.findOne({
      where: { email: createStaffDto.email }
    });

    if (existingStaff) {
      throw new ConflictException('Staff member with this email already exists');
    }

    // Validate provider
    if (createStaffDto.providerId) {
      const provider = await this.providerRepository.findOne({
        where: { id: createStaffDto.providerId }
      });
      if (!provider) {
        throw new NotFoundException('Provider not found');
      }
    }

    // Validate user if provided
    if (createStaffDto.userId) {
      const user = await this.userRepository.findOne({
        where: { id: createStaffDto.userId }
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
    }

    const staff = this.staffRepository.create({
      ...createStaffDto,
      status: StaffStatus.ACTIVE,
    });

    const savedStaff = await this.staffRepository.save(staff);
    return this.formatStaffResponse(savedStaff);
  }

  async findAll(providerId?: string, status?: StaffStatus, isBookable?: boolean): Promise<StaffResponseDto[]> {
    const queryBuilder = this.staffRepository.createQueryBuilder('staff')
      .leftJoinAndSelect('staff.provider', 'provider')
      .leftJoinAndSelect('staff.user', 'user');

    if (providerId) {
      queryBuilder.where('staff.providerId = :providerId', { providerId });
    }

    if (status) {
      queryBuilder.andWhere('staff.status = :status', { status });
    }

    if (isBookable !== undefined) {
      queryBuilder.andWhere('staff.isBookable = :isBookable', { isBookable });
    }

    queryBuilder.orderBy('staff.firstName', 'ASC');

    const staff = await queryBuilder.getMany();
    return staff.map(member => this.formatStaffResponse(member));
  }

  async findByProvider(providerId: string): Promise<StaffResponseDto[]> {
    const provider = await this.providerRepository.findOne({
      where: { id: providerId }
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    return this.findAll(providerId, StaffStatus.ACTIVE, true);
  }

  async findAvailableStaff(providerId: string): Promise<StaffResponseDto[]> {
    const staff = await this.staffRepository.find({
      where: {
        providerId,
        status: StaffStatus.ACTIVE,
        isBookable: true,
        isPublic: true,
      },
      relations: ['provider'],
      order: { firstName: 'ASC' }
    });

    return staff.map(member => this.formatStaffResponse(member));
  }

  async findOne(id: string): Promise<StaffResponseDto> {
    const staff = await this.staffRepository.findOne({
      where: { id },
      relations: ['provider', 'user'],
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    return this.formatStaffResponse(staff);
  }

  async update(id: string, updateStaffDto: UpdateStaffDto): Promise<StaffResponseDto> {
    const staff = await this.staffRepository.findOne({
      where: { id }
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    // Check email uniqueness if email is being updated
    if (updateStaffDto.email && updateStaffDto.email !== staff.email) {
      const existingStaff = await this.staffRepository.findOne({
        where: { email: updateStaffDto.email }
      });

      if (existingStaff) {
        throw new ConflictException('Staff member with this email already exists');
      }
    }

    await this.staffRepository.update(id, updateStaffDto);
    
    const updatedStaff = await this.staffRepository.findOne({
      where: { id },
      relations: ['provider', 'user'],
    });

    return this.formatStaffResponse(updatedStaff!);
  }

  async remove(id: string): Promise<void> {
    const staff = await this.staffRepository.findOne({
      where: { id }
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    await this.staffRepository.remove(staff);
  }

  async getStaffBookings(staffId: string, startDate?: Date, endDate?: Date): Promise<any[]> {
    // This would integrate with the bookings service
    // For now, return empty array
    return [];
  }

  async getStaffAvailability(staffId: string, date: Date): Promise<any> {
    // This would integrate with provider working hours and bookings
    // For now, return basic availability
    const staff = await this.findOne(staffId);
    
    return {
      staffId,
      date,
      isAvailable: staff.isAvailable,
      workingHours: [], // Would come from provider working hours
      bookedSlots: [], // Would come from bookings
      availableSlots: [], // Calculated from working hours - booked slots
    };
  }

  async verifyStaff(id: string, status: 'approved' | 'rejected'): Promise<StaffResponseDto> {
    const staff = await this.staffRepository.findOne({
      where: { id },
      relations: ['provider']
    });

    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }

    staff.verificationStatus = status;
    staff.isVerified = status === 'approved';
    
    if (status === 'approved') {
      staff.status = StaffStatus.ACTIVE;
    } else if (status === 'rejected') {
      staff.status = StaffStatus.INACTIVE;
    }

    const updatedStaff = await this.staffRepository.save(staff);
    return this.formatStaffResponse(updatedStaff);
  }

  async getPendingVerification(): Promise<StaffResponseDto[]> {
    const pendingStaff = await this.staffRepository.find({
      where: { 
        verificationStatus: 'pending',
        isVerified: false 
      },
      relations: ['provider'],
      order: { createdAt: 'DESC' }
    });

    return pendingStaff.map(staff => this.formatStaffResponse(staff));
  }

  private formatStaffResponse(staff: Staff): StaffResponseDto {
    return {
      id: staff.id,
      firstName: staff.firstName,
      lastName: staff.lastName,
      fullName: staff.fullName,
      email: staff.email,
      phone: staff.phone,
      role: staff.role,
      status: staff.status,
      specialization: staff.specialization,
      experienceYears: staff.experienceYears,
      bio: staff.bio,
      profileImage: staff.profileImage,
      hourlyRate: staff.hourlyRate,
      commissionPercentage: staff.commissionPercentage,
      isBookable: staff.isBookable,
      isPublic: staff.isPublic,
      isAvailable: staff.isAvailable,
      verificationStatus: staff.verificationStatus,
      isVerified: staff.isVerified,
      providerId: staff.providerId,
      providerName: staff.provider?.businessName,
      userId: staff.userId,
      createdAt: staff.createdAt,
      updatedAt: staff.updatedAt,
    };
  }
}