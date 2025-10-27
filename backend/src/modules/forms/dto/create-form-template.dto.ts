import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsArray, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { FormType } from '../../../entities/form-template.entity';
import { FieldType } from '../../../entities/form-field.entity';

export class CreateFormFieldDto {
  @ApiProperty({ description: 'Field name/key' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Field label' })
  @IsString()
  label: string;

  @ApiProperty({ description: 'Field type', enum: FieldType })
  @IsEnum(FieldType)
  type: FieldType;

  @ApiProperty({ description: 'Whether field is required', default: false })
  @IsBoolean()
  @IsOptional()
  required?: boolean;

  @ApiProperty({ description: 'Field placeholder', required: false })
  @IsString()
  @IsOptional()
  placeholder?: string;

  @ApiProperty({ description: 'Field help text', required: false })
  @IsString()
  @IsOptional()
  helpText?: string;

  @ApiProperty({ description: 'Field options for select/radio', required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  options?: string[];

  @ApiProperty({ description: 'Field order index', default: 0 })
  @IsOptional()
  orderIndex?: number;

  @ApiProperty({ description: 'Default value', required: false })
  @IsString()
  @IsOptional()
  defaultValue?: string;

  @ApiProperty({ description: 'Validation rules', required: false })
  @IsOptional()
  validation?: any;

  @ApiProperty({ description: 'Conditional logic', required: false })
  @IsOptional()
  conditionalLogic?: any;
}

export class CreateFormTemplateDto {
  @ApiProperty({ description: 'Form template name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Form description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Form type', enum: FormType })
  @IsEnum(FormType)
  type: FormType;

  @ApiProperty({ description: 'Whether template is active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ description: 'Whether form requires authentication', default: false })
  @IsBoolean()
  @IsOptional()
  requiresAuth?: boolean;

  @ApiProperty({ description: 'Form completion message', required: false })
  @IsString()
  @IsOptional()
  completionMessage?: string;

  @ApiProperty({ description: 'Redirect URL after submission', required: false })
  @IsString()
  @IsOptional()
  redirectUrl?: string;

  @ApiProperty({ description: 'Form settings', required: false })
  @IsOptional()
  settings?: any;

  @ApiProperty({ description: 'Form fields', type: [CreateFormFieldDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFormFieldDto)
  fields: CreateFormFieldDto[];
}