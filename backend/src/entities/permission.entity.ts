import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from './role.entity';
import { RolePermission } from './role-permission.entity';

@Entity('permissions')
@Index(['name'], { unique: true })
export class Permission {
  @ApiProperty({ description: 'Unique identifier for the permission' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Permission name', uniqueItems: true })
  @Column({ unique: true, length: 100 })
  name: string;

  @ApiProperty({ description: 'Permission description', required: false })
  @Column({ nullable: true, type: 'text' })
  description?: string;

  @ApiProperty({ description: 'Permission resource (e.g., users, bookings)' })
  @Column({ length: 50 })
  resource: string;

  @ApiProperty({ description: 'Permission action (e.g., create, read, update, delete)' })
  @Column({ length: 50 })
  action: string;

  @ApiProperty({ description: 'Permission category for grouping' })
  @Column({ length: 50 })
  category: string;

  @ApiProperty({ description: 'Permission is system permission (cannot be deleted)' })
  @Column({ default: false })
  isSystem: boolean;

  @ApiProperty({ description: 'Permission creation timestamp' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relationships
  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.permission)
  rolePermissions: RolePermission[];

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
