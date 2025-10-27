import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormTemplate, FormType } from '../../entities/form-template.entity';
import { FormField } from '../../entities/form-field.entity';
import { FormSubmission, SubmissionStatus } from '../../entities/form-submission.entity';
import { FormResponse } from '../../entities/form-response.entity';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';
import { CreateFormSubmissionDto, UpdateFormSubmissionDto } from './dto/create-form-submission.dto';
import { 
  FormTemplateResponseDto, 
  FormSubmissionResponseDto,
  FormsListResponseDto,
  SubmissionsListResponseDto
} from './dto/form-response.dto';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(FormTemplate)
    private readonly formTemplateRepository: Repository<FormTemplate>,
    @InjectRepository(FormField)
    private readonly formFieldRepository: Repository<FormField>,
    @InjectRepository(FormSubmission)
    private readonly formSubmissionRepository: Repository<FormSubmission>,
    @InjectRepository(FormResponse)
    private readonly formResponseRepository: Repository<FormResponse>,
  ) {}

  // Form Templates
  async createTemplate(providerId: string, createFormTemplateDto: CreateFormTemplateDto): Promise<FormTemplateResponseDto> {
    const { fields, ...templateData } = createFormTemplateDto;

    // Create form template
    const template = this.formTemplateRepository.create({
      ...templateData,
      providerId,
    });

    const savedTemplate = await this.formTemplateRepository.save(template);

    // Create form fields
    if (fields && fields.length > 0) {
      const formFields = fields.map((field, index) => 
        this.formFieldRepository.create({
          ...field,
          formTemplateId: savedTemplate.id,
          orderIndex: field.orderIndex ?? index,
        })
      );

      await this.formFieldRepository.save(formFields);
    }

    return this.getTemplateById(savedTemplate.id);
  }

  async getProviderTemplates(
    providerId: string, 
    page = 1, 
    limit = 10,
    type?: FormType,
    isActive?: boolean
  ): Promise<FormsListResponseDto> {
    const queryBuilder = this.formTemplateRepository
      .createQueryBuilder('template')
      .leftJoinAndSelect('template.fields', 'fields')
      .leftJoin('template.submissions', 'submissions')
      .addSelect('COUNT(submissions.id)', 'submissionsCount')
      .where('template.providerId = :providerId', { providerId })
      .groupBy('template.id')
      .addGroupBy('fields.id')
      .orderBy('template.createdAt', 'DESC')
      .addOrderBy('fields.orderIndex', 'ASC');

    if (type) {
      queryBuilder.andWhere('template.type = :type', { type });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('template.isActive = :isActive', { isActive });
    }

    const total = await queryBuilder.getCount();
    const templates = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    // Get submissions count for each template
    const templatesWithCount = await Promise.all(
      templates.map(async (template) => {
        const submissionsCount = await this.formSubmissionRepository.count({
          where: { formTemplateId: template.id }
        });
        return { ...template, submissionsCount };
      })
    );

    return {
      templates: templatesWithCount,
      total,
      page,
      limit,
    };
  }

  async getTemplateById(id: string): Promise<FormTemplateResponseDto> {
    const template = await this.formTemplateRepository.findOne({
      where: { id },
      relations: ['fields'],
      order: { fields: { orderIndex: 'ASC' } }
    });

    if (!template) {
      throw new NotFoundException('Form template not found');
    }

    const submissionsCount = await this.formSubmissionRepository.count({
      where: { formTemplateId: id }
    });

    return { ...template, submissionsCount };
  }

  async getPublicTemplate(id: string): Promise<FormTemplateResponseDto> {
    const template = await this.formTemplateRepository.findOne({
      where: { id, isActive: true },
      relations: ['fields'],
      order: { fields: { orderIndex: 'ASC' } }
    });

    if (!template) {
      throw new NotFoundException('Form template not found or inactive');
    }

    return template;
  }

  async updateTemplate(
    id: string, 
    providerId: string, 
    updateFormTemplateDto: UpdateFormTemplateDto
  ): Promise<FormTemplateResponseDto> {
    const template = await this.formTemplateRepository.findOne({
      where: { id, providerId }
    });

    if (!template) {
      throw new NotFoundException('Form template not found');
    }

    const { fields, ...templateData } = updateFormTemplateDto;

    // Update template
    await this.formTemplateRepository.update(id, templateData);

    // Update fields if provided
    if (fields) {
      // Delete existing fields
      await this.formFieldRepository.delete({ formTemplateId: id });

      // Create new fields
      if (fields.length > 0) {
        const formFields = fields.map((field, index) => 
          this.formFieldRepository.create({
            ...field,
            formTemplateId: id,
            orderIndex: field.orderIndex ?? index,
          })
        );

        await this.formFieldRepository.save(formFields);
      }
    }

    return this.getTemplateById(id);
  }

  async deleteTemplate(id: string, providerId: string): Promise<void> {
    const template = await this.formTemplateRepository.findOne({
      where: { id, providerId }
    });

    if (!template) {
      throw new NotFoundException('Form template not found');
    }

    // Check if there are submissions
    const submissionsCount = await this.formSubmissionRepository.count({
      where: { formTemplateId: id }
    });

    if (submissionsCount > 0) {
      throw new BadRequestException('Cannot delete template with existing submissions');
    }

    await this.formTemplateRepository.remove(template);
  }

  // Form Submissions
  async submitForm(
    templateId: string, 
    createFormSubmissionDto: CreateFormSubmissionDto,
    userInfo?: { userId?: string, ipAddress?: string, userAgent?: string }
  ): Promise<FormSubmissionResponseDto> {
    const template = await this.formTemplateRepository.findOne({
      where: { id: templateId, isActive: true },
      relations: ['fields']
    });

    if (!template) {
      throw new NotFoundException('Form template not found or inactive');
    }

    const { responses, ...submissionData } = createFormSubmissionDto;

    // Create submission
    const submission = this.formSubmissionRepository.create({
      ...submissionData,
      formTemplateId: templateId,
      submittedBy: userInfo?.userId,
      ipAddress: userInfo?.ipAddress,
      userAgent: userInfo?.userAgent,
      status: SubmissionStatus.COMPLETED,
    });

    const savedSubmission = await this.formSubmissionRepository.save(submission);

    // Create responses
    if (responses && responses.length > 0) {
      const formResponses = responses.map(response => 
        this.formResponseRepository.create({
          ...response,
          submissionId: savedSubmission.id,
          fieldId: template.fields.find(f => f.name === response.fieldName)?.id,
        })
      );

      await this.formResponseRepository.save(formResponses);
    }

    return this.getSubmissionById(savedSubmission.id);
  }

  async getProviderSubmissions(
    providerId: string,
    page = 1,
    limit = 10,
    templateId?: string,
    status?: SubmissionStatus
  ): Promise<SubmissionsListResponseDto> {
    const queryBuilder = this.formSubmissionRepository
      .createQueryBuilder('submission')
      .leftJoinAndSelect('submission.responses', 'responses')
      .leftJoinAndSelect('submission.formTemplate', 'template')
      .where('template.providerId = :providerId', { providerId })
      .orderBy('submission.submittedAt', 'DESC');

    if (templateId) {
      queryBuilder.andWhere('submission.formTemplateId = :templateId', { templateId });
    }

    if (status) {
      queryBuilder.andWhere('submission.status = :status', { status });
    }

    const total = await queryBuilder.getCount();
    const submissions = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      submissions,
      total,
      page,
      limit,
    };
  }

  async getSubmissionById(id: string): Promise<FormSubmissionResponseDto> {
    const submission = await this.formSubmissionRepository.findOne({
      where: { id },
      relations: ['responses', 'formTemplate', 'formTemplate.fields']
    });

    if (!submission) {
      throw new NotFoundException('Form submission not found');
    }

    return submission;
  }

  async updateSubmissionStatus(
    id: string,
    providerId: string,
    updateSubmissionDto: UpdateFormSubmissionDto
  ): Promise<FormSubmissionResponseDto> {
    const submission = await this.formSubmissionRepository.findOne({
      where: { id },
      relations: ['formTemplate']
    });

    if (!submission) {
      throw new NotFoundException('Form submission not found');
    }

    if (submission.formTemplate.providerId !== providerId) {
      throw new ForbiddenException('Not authorized to update this submission');
    }

    await this.formSubmissionRepository.update(id, updateSubmissionDto);

    return this.getSubmissionById(id);
  }

  async deleteSubmission(id: string, providerId: string): Promise<void> {
    const submission = await this.formSubmissionRepository.findOne({
      where: { id },
      relations: ['formTemplate']
    });

    if (!submission) {
      throw new NotFoundException('Form submission not found');
    }

    if (submission.formTemplate.providerId !== providerId) {
      throw new ForbiddenException('Not authorized to delete this submission');
    }

    await this.formSubmissionRepository.remove(submission);
  }

  // Statistics
  async getFormStatistics(providerId: string) {
    const templates = await this.formTemplateRepository.count({
      where: { providerId }
    });

    const submissions = await this.formSubmissionRepository
      .createQueryBuilder('submission')
      .leftJoin('submission.formTemplate', 'template')
      .where('template.providerId = :providerId', { providerId })
      .getCount();

    const pendingSubmissions = await this.formSubmissionRepository
      .createQueryBuilder('submission')
      .leftJoin('submission.formTemplate', 'template')
      .where('template.providerId = :providerId', { providerId })
      .andWhere('submission.status = :status', { status: SubmissionStatus.PENDING })
      .getCount();

    return {
      totalTemplates: templates,
      totalSubmissions: submissions,
      pendingSubmissions,
    };
  }
}