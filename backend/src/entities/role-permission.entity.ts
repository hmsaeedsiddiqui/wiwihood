import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from './role.entity';
import { Permission } from './permission.entity';

@Entity('role_permissions')
@Index(['roleId', 'permissionId'], { unique: true })
export class RolePermission {
  @ApiProperty({ description: 'Unique identifier for the role-permission mapping' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Role ID' })
  @Column({ type: 'uuid' })
  @Index()
  roleId: string;

  @ApiProperty({ description: 'Permission ID' })
  @Column({ type: 'uuid' })
  @Index()
  permissionId: string;

  @ApiProperty({ description: 'Assignment creation timestamp' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  // Relationships
  @ManyToOne(() => Role, (role) => role.rolePermissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'permissionId' })
  permission: Permission;
}
