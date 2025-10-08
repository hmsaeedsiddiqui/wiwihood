import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
  JoinTable,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Service } from './service.entity';
import { Provider } from './provider.entity';
import { Category } from './category.entity';
import { forwardRef, Inject } from '@nestjs/common';

export enum AddonType {
  INDIVIDUAL = 'individual',
  PACKAGE = 'package',
  UPGRADE = 'upgrade',
  SEASONAL = 'seasonal',
}

@Entity('service_addons')
@Index(['providerId'])
@Index(['isActive'])
@Index(['type'])
export class ServiceAddon {
  @ApiProperty({ description: 'Unique identifier for the addon' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Addon name' })
  @Column({ length: 255 })
  name: string;

  @ApiProperty({ description: 'Addon description' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ description: 'Addon price' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: 'Additional duration in minutes' })
  @Column({ type: 'int', default: 0 })
  additionalDuration: number;

  @ApiProperty({ description: 'Addon type', enum: AddonType })
  @Column({
    type: 'enum',
    enum: AddonType,
    default: AddonType.INDIVIDUAL,
  })
  type: AddonType;

  @ApiProperty({ description: 'Is addon currently active' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Display order' })
  @Column({ type: 'int', default: 0 })
  displayOrder: number;

  @ApiProperty({ description: 'Maximum quantity per booking' })
  @Column({ type: 'int', default: 1 })
  maxQuantity: number;

  @ApiProperty({ description: 'Addon image URL' })
  @Column({ length: 500, nullable: true })
  imageUrl?: string;

  @ApiProperty({ description: 'Seasonal availability start date' })
  @Column({ type: 'date', nullable: true })
  seasonalStartDate?: Date;

  @ApiProperty({ description: 'Seasonal availability end date' })
  @Column({ type: 'date', nullable: true })
  seasonalEndDate?: Date;

  @ApiProperty({ description: 'Addon creation date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last updated date' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ApiProperty({ description: 'Provider ID' })
  @Column({ name: 'provider_id' })
  providerId: string;

  @ApiProperty({ description: 'Associated provider' })
  @ManyToOne(() => Provider, { eager: false })
  @JoinColumn({ name: 'provider_id' })
  provider: Provider;

  // @ApiProperty({ description: 'Services this addon is compatible with' })
  // @ManyToMany(() => Service, (service) => service.compatibleAddons)
  // @JoinTable({
  //   name: 'service_addon_compatibility',
  //   joinColumn: { name: 'addon_id', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'service_id', referencedColumnName: 'id' },
  // })
  // compatibleServices: Service[];

  @ApiProperty({ description: 'Categories this addon belongs to' })
  @ManyToMany(() => Category)
  @JoinTable({
    name: 'addon_categories',
    joinColumn: { name: 'addon_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];

  @ApiProperty({ description: 'Booking addon selections' })
  @OneToMany(() => BookingAddon, (bookingAddon) => bookingAddon.addon)
  bookingAddons: BookingAddon[];
}

@Entity('booking_addons')
@Index(['bookingId'])
@Index(['addonId'])
export class BookingAddon {
  @ApiProperty({ description: 'Unique identifier for the booking addon' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Quantity of addon selected' })
  @Column({ type: 'int', default: 1 })
  quantity: number;

  @ApiProperty({ description: 'Price at time of booking' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceAtBooking: number;

  @ApiProperty({ description: 'Total price (quantity × price)' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @ApiProperty({ description: 'Special instructions for addon' })
  @Column({ type: 'text', nullable: true })
  specialInstructions?: string;

  @ApiProperty({ description: 'Addon selection date' })
  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ApiProperty({ description: 'Booking ID' })
  @Column({ name: 'booking_id' })
  bookingId: string;

  @ApiProperty({ description: 'Addon ID' })
  @Column({ name: 'addon_id' })
  addonId: string;

  @ApiProperty({ description: 'Associated booking' })
  @ManyToOne('Booking', 'addons')
  @JoinColumn({ name: 'booking_id' })
  booking: any;

  @ApiProperty({ description: 'Associated addon' })
  @ManyToOne(() => ServiceAddon, (addon) => addon.bookingAddons)
  @JoinColumn({ name: 'addon_id' })
  addon: ServiceAddon;
}

@Entity('addon_packages')
@Index(['providerId'])
@Index(['isActive'])
export class AddonPackage {
  @ApiProperty({ description: 'Unique identifier for the package' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Package name' })
  @Column({ length: 255 })
  name: string;

  @ApiProperty({ description: 'Package description' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ description: 'Package price (discounted from individual addon prices)' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  packagePrice: number;

  @ApiProperty({ description: 'Original total price of individual addons' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  originalPrice: number;

  @ApiProperty({ description: 'Discount percentage' })
  @Column({ type: 'decimal', precision: 5, scale: 2 })
  discountPercentage: number;

  @ApiProperty({ description: 'Is package currently active' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Package validity start date' })
  @Column({ type: 'timestamp', nullable: true })
  validFrom?: Date;

  @ApiProperty({ description: 'Package validity end date' })
  @Column({ type: 'timestamp', nullable: true })
  validUntil?: Date;

  @ApiProperty({ description: 'Package creation date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last updated date' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ApiProperty({ description: 'Provider ID' })
  @Column({ name: 'provider_id' })
  providerId: string;

  @ApiProperty({ description: 'Associated provider' })
  @ManyToOne(() => Provider, { eager: false })
  @JoinColumn({ name: 'provider_id' })
  provider: Provider;

  @ApiProperty({ description: 'Addons included in this package' })
  @ManyToMany(() => ServiceAddon)
  @JoinTable({
    name: 'package_addons',
    joinColumn: { name: 'package_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'addon_id', referencedColumnName: 'id' },
  })
  includedAddons: ServiceAddon[];
}