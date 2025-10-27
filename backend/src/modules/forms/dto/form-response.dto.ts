import { ApiProperty } from '@nestjs/swagger';
import { FormType } from '../../../entities/form-template.entity';
import { FieldType } from '../../../entities/form-field.entity';
import { SubmissionStatus } from '../../../entities/form-submission.entity';

export class FormFieldResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  label: string;

  @ApiProperty({ enum: FieldType })
  type: FieldType;

  @ApiProperty()
  required: boolean;

  @ApiProperty({ required: false })
  placeholder?: string;

  @ApiProperty({ required: false })
  helpText?: string;

  @ApiProperty({ required: false })
  options?: string[];

  @ApiProperty()
  orderIndex: number;

  @ApiProperty({ required: false })
  defaultValue?: string;

  @ApiProperty({ required: false })
  validation?: any;

  @ApiProperty({ required: false })
  conditionalLogic?: any;
}

export class FormTemplateResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ enum: FormType })
  type: FormType;

  @ApiProperty()
  providerId: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  requiresAuth: boolean;

  @ApiProperty({ required: false })
  completionMessage?: string;

  @ApiProperty({ required: false })
  redirectUrl?: string;

  @ApiProperty({ required: false })
  settings?: any;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [FormFieldResponseDto] })
  fields: FormFieldResponseDto[];

  @ApiProperty({ required: false })
  submissionsCount?: number;
}

export class FormResponseDetailDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  fieldName: string;

  @ApiProperty()
  value: string;

  @ApiProperty({ required: false })
  fileUrl?: string;

  @ApiProperty()
  createdAt: Date;
}

export class FormSubmissionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  formTemplateId: string;

  @ApiProperty({ required: false })
  submittedBy?: string;

  @ApiProperty()
  customerName: string;

  @ApiProperty()
  customerEmail: string;

  @ApiProperty({ required: false })
  customerPhone?: string;

  @ApiProperty({ enum: SubmissionStatus })
  status: SubmissionStatus;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty({ required: false })
  providerNotes?: string;

  @ApiProperty()
  submittedAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [FormResponseDetailDto] })
  responses: FormResponseDetailDto[];

  @ApiProperty({ required: false })
  formTemplate?: FormTemplateResponseDto;
}

export class FormsListResponseDto {
  @ApiProperty({ type: [FormTemplateResponseDto] })
  templates: FormTemplateResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}

export class SubmissionsListResponseDto {
  @ApiProperty({ type: [FormSubmissionResponseDto] })
  submissions: FormSubmissionResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}