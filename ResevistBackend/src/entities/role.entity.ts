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
import { User } from './user.entity';
import { Permission } from './permission.entity';
import { RolePermission } from './role-permission.entity';

@Entity('roles')
@Index(['name'], { unique: true })
export class Role {
  @ApiProperty({ description: 'Unique identifier for the role' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Role name', uniqueItems: true })
  @Column({ unique: true, length: 100 })
  name: string;

  @ApiProperty({ description: 'Role description', required: false })
  @Column({ nullable: true, type: 'text' })
  description?: string;

  @ApiProperty({ description: 'Role display name for UI' })
  @Column({ length: 100 })
  displayName: string;

  @ApiProperty({ description: 'Role color for UI display', required: false })
  @Column({ nullable: true, length: 7, default: '#6B7280' })
  color?: string;

  @ApiProperty({ description: 'Role is system role (cannot be deleted)' })
  @Column({ default: false })
  isSystem: boolean;

  @ApiProperty({ description: 'Role is active' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Role creation timestamp' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relationships
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions: RolePermission[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  permissions: Permission[];
}
