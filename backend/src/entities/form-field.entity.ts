import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum FieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  EMAIL = 'email',
  PHONE = 'phone',
  NUMBER = 'number',
  DATE = 'date',
  SELECT = 'select',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  FILE = 'file',
}

@Entity('form_fields')
@Index(['formTemplateId'])
@Index(['orderIndex'])
export class FormField {
  @ApiProperty({ description: 'Unique identifier for the form field' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Form template ID' })
  @Column('uuid')
  formTemplateId: string;

  @ApiProperty({ description: 'Field name/key' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ description: 'Field label displayed to user' })
  @Column({ length: 200 })
  label: string;

  @ApiProperty({ description: 'Field type', enum: FieldType })
  @Column({
    type: 'enum',
    enum: FieldType,
  })
  type: FieldType;

  @ApiProperty({ description: 'Whether field is required' })
  @Column({ default: false })
  required: boolean;

  @ApiProperty({ description: 'Field placeholder text' })
  @Column({ length: 200, nullable: true })
  placeholder: string;

  @ApiProperty({ description: 'Field help text' })
  @Column({ type: 'text', nullable: true })
  helpText: string;

  @ApiProperty({ description: 'Field validation rules as JSON' })
  @Column({ type: 'json', nullable: true })
  validation: any;

  @ApiProperty({ description: 'Field options for select/radio fields' })
  @Column({ type: 'json', nullable: true })
  options: string[];

  @ApiProperty({ description: 'Field order in form' })
  @Column({ default: 0 })
  orderIndex: number;

  @ApiProperty({ description: 'Field default value' })
  @Column({ type: 'text', nullable: true })
  defaultValue: string;

  @ApiProperty({ description: 'Field conditional logic' })
  @Column({ type: 'json', nullable: true })
  conditionalLogic: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne('FormTemplate', 'fields', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'formTemplateId' })
  formTemplate: any;
}