import { Entity, PrimaryColumn, CreateDateColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('service_addon_compatibility')
@Index(['serviceId'])
@Index(['addonId'])
export class ServiceAddonCompatibility {
  @ApiProperty({ description: 'Service ID' })
  @PrimaryColumn({ name: 'service_id' })
  serviceId: string;

  @ApiProperty({ description: 'Addon ID' })
  @PrimaryColumn({ name: 'addon_id' })
  addonId: string;

  @ApiProperty({ description: 'When compatibility was created' })
  @CreateDateColumn()
  createdAt: Date;
}