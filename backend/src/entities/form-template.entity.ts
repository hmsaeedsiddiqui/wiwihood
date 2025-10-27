import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Provider } from './provider.entity';

export enum FormType {
  CONSULTATION = 'consultation',
  CONSENT = 'consent',
  FEEDBACK = 'feedback',
  MEDICAL = 'medical',
  CUSTOM = 'custom',
}

@Entity('form_templates')
@Index(['providerId'])
@Index(['type'])
@Index(['isActive'])
export class FormTemplate {
  @ApiProperty({ description: 'Unique identifier for the form template' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Form template name' })
  @Column({ length: 200 })
  name: string;

  @ApiProperty({ description: 'Form description' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Form type', enum: FormType })
  @Column({
    type: 'enum',
    enum: FormType,
    default: FormType.CUSTOM,
  })
  type: FormType;

  @ApiProperty({ description: 'Provider ID who owns this template' })
  @Column('uuid')
  providerId: string;

  @ApiProperty({ description: 'Whether the template is active' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Whether form requires authentication' })
  @Column({ default: false })
  requiresAuth: boolean;

  @ApiProperty({ description: 'Form completion message' })
  @Column({ type: 'text', nullable: true })
  completionMessage: string;

  @ApiProperty({ description: 'Redirect URL after form submission' })
  @Column({ length: 500, nullable: true })
  redirectUrl: string;

  @ApiProperty({ description: 'Form settings as JSON' })
  @Column({ type: 'json', nullable: true })
  settings: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Provider)
  @JoinColumn({ name: 'providerId' })
  provider: Provider;

  @OneToMany('FormField', 'formTemplate', { cascade: true })
  fields: any[];

  @OneToMany('FormSubmission', 'formTemplate')
  submissions: any[];
}