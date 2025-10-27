import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
  ParseIntPipe,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FormsService } from './forms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateFormTemplateDto } from './dto/create-form-template.dto';
import { UpdateFormTemplateDto } from './dto/update-form-template.dto';
import { CreateFormSubmissionDto, UpdateFormSubmissionDto } from './dto/create-form-submission.dto';
import { 
  FormTemplateResponseDto, 
  FormSubmissionResponseDto,
  FormsListResponseDto,
  SubmissionsListResponseDto
} from './dto/form-response.dto';
import { FormType } from '../../entities/form-template.entity';
import { SubmissionStatus } from '../../entities/form-submission.entity';

@ApiTags('Forms')
@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  // Form Templates
  @Post('templates')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new form template' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Form template created successfully',
    type: FormTemplateResponseDto 
  })
  async createTemplate(
    @Request() req,
    @Body() createFormTemplateDto: CreateFormTemplateDto,
  ): Promise<FormTemplateResponseDto> {
    const providerId = req.user.id;
    return this.formsService.createTemplate(providerId, createFormTemplateDto);
  }

  @Get('templates')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get provider form templates' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'type', required: false, enum: FormType, description: 'Filter by form type' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Form templates retrieved successfully',
    type: FormsListResponseDto 
  })
  async getProviderTemplates(
    @Request() req,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
    @Query('type') type?: FormType,
    @Query('isActive') isActive?: boolean,
  ): Promise<FormsListResponseDto> {
    const providerId = req.user.id;
    return this.formsService.getProviderTemplates(providerId, page, limit, type, isActive);
  }

  @Get('templates/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get form template by ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Form template retrieved successfully',
    type: FormTemplateResponseDto 
  })
  async getTemplate(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FormTemplateResponseDto> {
    return this.formsService.getTemplateById(id);
  }

  @Get('public/:id')
  @ApiOperation({ summary: 'Get public form template for submission' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Public form template retrieved successfully',
    type: FormTemplateResponseDto 
  })
  async getPublicTemplate(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FormTemplateResponseDto> {
    return this.formsService.getPublicTemplate(id);
  }

  @Put('templates/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update form template' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Form template updated successfully',
    type: FormTemplateResponseDto 
  })
  async updateTemplate(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFormTemplateDto: UpdateFormTemplateDto,
  ): Promise<FormTemplateResponseDto> {
    const providerId = req.user.id;
    return this.formsService.updateTemplate(id, providerId, updateFormTemplateDto);
  }

  @Delete('templates/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete form template' })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT, 
    description: 'Form template deleted successfully' 
  })
  async deleteTemplate(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const providerId = req.user.id;
    return this.formsService.deleteTemplate(id, providerId);
  }

  // Form Submissions
  @Post('templates/:templateId/submit')
  @ApiOperation({ summary: 'Submit a form' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Form submitted successfully',
    type: FormSubmissionResponseDto 
  })
  async submitForm(
    @Request() req,
    @Param('templateId', ParseUUIDPipe) templateId: string,
    @Body() createFormSubmissionDto: CreateFormSubmissionDto,
  ): Promise<FormSubmissionResponseDto> {
    const userInfo = {
      userId: req.user?.id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    };

    return this.formsService.submitForm(templateId, createFormSubmissionDto, userInfo);
  }

  @Get('submissions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get provider form submissions' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'templateId', required: false, type: String, description: 'Filter by template ID' })
  @ApiQuery({ name: 'status', required: false, enum: SubmissionStatus, description: 'Filter by status' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Form submissions retrieved successfully',
    type: SubmissionsListResponseDto 
  })
  async getProviderSubmissions(
    @Request() req,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
    @Query('templateId') templateId?: string,
    @Query('status') status?: SubmissionStatus,
  ): Promise<SubmissionsListResponseDto> {
    const providerId = req.user.id;
    
    // Validate templateId if provided
    if (templateId && !this.isValidUUID(templateId)) {
      throw new BadRequestException('Invalid template ID format');
    }

    return this.formsService.getProviderSubmissions(providerId, page, limit, templateId, status);
  }

  @Get('submissions/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get form submission by ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Form submission retrieved successfully',
    type: FormSubmissionResponseDto 
  })
  async getSubmission(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FormSubmissionResponseDto> {
    return this.formsService.getSubmissionById(id);
  }

  @Put('submissions/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update form submission status' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Form submission updated successfully',
    type: FormSubmissionResponseDto 
  })
  async updateSubmission(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSubmissionDto: UpdateFormSubmissionDto,
  ): Promise<FormSubmissionResponseDto> {
    const providerId = req.user.id;
    return this.formsService.updateSubmissionStatus(id, providerId, updateSubmissionDto);
  }

  @Delete('submissions/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete form submission' })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT, 
    description: 'Form submission deleted successfully' 
  })
  async deleteSubmission(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const providerId = req.user.id;
    return this.formsService.deleteSubmission(id, providerId);
  }

  // Statistics
  @Get('statistics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get form statistics for provider' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Form statistics retrieved successfully' 
  })
  async getFormStatistics(@Request() req) {
    const providerId = req.user.id;
    return this.formsService.getFormStatistics(providerId);
  }

  // Helper method to validate UUID
  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}