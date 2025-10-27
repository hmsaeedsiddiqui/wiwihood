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
import { FormField } from './form-field.entity';

@Entity('form_responses')
@Index(['submissionId'])
@Index(['fieldId'])
export class FormResponse {
  @ApiProperty({ description: 'Unique identifier for the form response' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Form submission ID' })
  @Column('uuid')
  submissionId: string;

  @ApiProperty({ description: 'Form field ID' })
  @Column('uuid')
  fieldId: string;

  @ApiProperty({ description: 'Field name/key' })
  @Column({ length: 100 })
  fieldName: string;

  @ApiProperty({ description: 'Response value' })
  @Column({ type: 'text' })
  value: string;

  @ApiProperty({ description: 'File URL if field type is file' })
  @Column({ length: 500, nullable: true })
  fileUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne('FormSubmission', 'responses', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'submissionId' })
  submission: any;

  @ManyToOne(() => FormField)
  @JoinColumn({ name: 'fieldId' })
  field: FormField;
}