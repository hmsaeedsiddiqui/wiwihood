import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
  Tree,
  TreeParent,
  TreeChildren,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Service } from './service.entity';

@Entity('categories')
@Tree('closure-table')
@Index(['name'])
@Index(['isActive'])
export class Category {
  @ApiProperty({ description: 'Unique identifier for the category' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Category name' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ description: 'Category description', required: false })
  @Column({ nullable: true, type: 'text' })
  description?: string;

  @ApiProperty({ description: 'Category slug for URLs' })
  @Column({ unique: true, length: 100 })
  slug: string;

  @ApiProperty({ description: 'Category icon name or URL', required: false })
  @Column({ nullable: true, length: 255 })
  icon?: string;

  @ApiProperty({ description: 'Category banner image URL', required: false })
  @Column({ nullable: true, length: 500 })
  bannerImage?: string;

  @ApiProperty({ description: 'Category display order' })
  @Column({ default: 0 })
  sortOrder: number;

  @ApiProperty({ description: 'Category is active' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Category is featured' })
  @Column({ default: false })
  isFeatured: boolean;

  @ApiProperty({ description: 'SEO meta title', required: false })
  @Column({ nullable: true, length: 200 })
  metaTitle?: string;

  @ApiProperty({ description: 'SEO meta description', required: false })
  @Column({ nullable: true, length: 500 })
  metaDescription?: string;

  @ApiProperty({ description: 'SEO meta keywords', required: false })
  @Column({ nullable: true, length: 500 })
  metaKeywords?: string;

  @ApiProperty({ description: 'Category creation timestamp' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Tree relationships for hierarchical categories
  @TreeParent()
  parent: Category;

  @TreeChildren()
  children: Category[];

  // Service relationships
  @OneToMany(() => Service, (service) => service.category)
  services: Service[];

  // Virtual properties
  @ApiProperty({ description: 'Full category path' })
  get fullPath(): string {
    // Will be implemented with tree traversal logic
    return this.name;
  }

  @ApiProperty({ description: 'Service count in this category' })
  get serviceCount(): number {
    return this.services?.length || 0;
  }
}
