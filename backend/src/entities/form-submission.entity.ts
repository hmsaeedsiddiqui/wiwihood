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
import { FormTemplate } from './form-template.entity';
import { User } from './user.entity';

export enum SubmissionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  REVIEWED = 'reviewed',
  ARCHIVED = 'archived',
}

@Entity('form_submissions')
@Index(['formTemplateId'])
@Index(['submittedBy'])
@Index(['status'])
@Index(['submittedAt'])
export class FormSubmission {
  @ApiProperty({ description: 'Unique identifier for the form submission' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Form template ID' })
  @Column('uuid')
  formTemplateId: string;

  @ApiProperty({ description: 'User ID who submitted (optional for anonymous)' })
  @Column('uuid', { nullable: true })
  submittedBy: string;

  @ApiProperty({ description: 'Customer name' })
  @Column({ length: 200 })
  customerName: string;

  @ApiProperty({ description: 'Customer email' })
  @Column({ length: 255 })
  customerEmail: string;

  @ApiProperty({ description: 'Customer phone' })
  @Column({ length: 20, nullable: true })
  customerPhone: string;

  @ApiProperty({ description: 'Submission status', enum: SubmissionStatus })
  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    default: SubmissionStatus.PENDING,
  })
  status: SubmissionStatus;

  @ApiProperty({ description: 'IP address of submitter' })
  @Column({ length: 45, nullable: true })
  ipAddress: string;

  @ApiProperty({ description: 'User agent of submitter' })
  @Column({ type: 'text', nullable: true })
  userAgent: string;

  @ApiProperty({ description: 'Additional notes' })
  @Column({ type: 'text', nullable: true })
  notes: string;

  @ApiProperty({ description: 'Provider notes/comments' })
  @Column({ type: 'text', nullable: true })
  providerNotes: string;

  @CreateDateColumn()
  submittedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => FormTemplate, (template) => template.submissions)
  @JoinColumn({ name: 'formTemplateId' })
  formTemplate: FormTemplate;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'submittedBy' })
  submitter: User;

  @OneToMany('FormResponse', 'submission', { cascade: true })
  responses: any[];
}