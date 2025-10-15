import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProvidersService } from './providers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../users/guards/roles.guard';
import { Roles } from '../users/decorators/roles.decorator';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { ProviderResponseDto } from './dto/provider-response.dto';
import { ProvidersListResponseDto } from './dto/providers-list-response.dto';

import { ProviderStatus } from '../../entities/provider.entity';

@ApiTags('Providers')
@Controller('providers')
export class ProvidersController {
  constructor(
    private readonly providersService: ProvidersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new provider profile' })
  @ApiResponse({
    status: 201,
    description: 'Provider successfully created',
    type: ProviderResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  async create(
    @Request() req,
    @Body() createProviderDto: CreateProviderDto,
  ): Promise<ProviderResponseDto> {
    return this.providersService.create(req.user.id, createProviderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all providers with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term' })
  @ApiQuery({ name: 'status', required: false, enum: ProviderStatus, description: 'Filter by status' })
  @ApiQuery({ name: 'categoryId', required: false, type: String, description: 'Filter by category' })
  @ApiQuery({ name: 'location', required: false, type: String, description: 'Filter by location' })
  @ApiResponse({
    status: 200,
    description: 'Providers retrieved successfully',
    type: ProvidersListResponseDto,
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('status') status?: ProviderStatus,
    @Query('categoryId') categoryId?: string,
    @Query('location') location?: string,
  ): Promise<ProvidersListResponseDto> {
    return this.providersService.findAll(page, limit, search, status, categoryId, location);
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get provider dashboard stats' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard stats retrieved successfully',
  })
  async getDashboardStats(@Request() req) {
    return this.providersService.getDashboardStats(req.user.id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user provider profile' })
  @ApiResponse({
    status: 200,
    description: 'Provider profile retrieved successfully',
    type: ProviderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Provider profile not found',
  })
  async getCurrentProvider(@Request() req): Promise<ProviderResponseDto> {
    return this.providersService.findByUserId(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get provider by ID' })
  @ApiParam({ name: 'id', description: 'Provider ID' })
  @ApiResponse({
    status: 200,
    description: 'Provider retrieved successfully',
    type: ProviderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Provider not found',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ProviderResponseDto> {
    return this.providersService.findOne(id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current provider profile' })
  @ApiResponse({
    status: 200,
    description: 'Provider profile updated successfully',
    type: ProviderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Provider profile not found',
  })
  async updateCurrentProvider(
    @Request() req,
    @Body() updateProviderDto: UpdateProviderDto,
  ): Promise<ProviderResponseDto> {
    const provider = await this.providersService.findByUserId(req.user.id);
    return this.providersService.update(provider.id, updateProviderDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update provider by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Provider ID' })
  @ApiResponse({
    status: 200,
    description: 'Provider updated successfully',
    type: ProviderResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Provider not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProviderDto: UpdateProviderDto,
  ): Promise<ProviderResponseDto> {
    return this.providersService.update(id, updateProviderDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete provider by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Provider ID' })
  @ApiResponse({
    status: 200,
    description: 'Provider deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Provider not found',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    await this.providersService.remove(id);
    return { message: 'Provider deleted successfully' };
  }

  @Get('me/availability')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get provider availability settings' })
  @ApiResponse({
    status: 200,
    description: 'Provider availability retrieved successfully',
  })
  async getMyAvailability(@Request() req): Promise<any> {
    return this.providersService.getAvailability(req.user.sub);
  }

  @Post('me/availability')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update provider availability settings' })
  @ApiResponse({
    status: 200,
    description: 'Provider availability updated successfully',
  })
  async updateMyAvailability(@Request() req, @Body() availabilityData: any): Promise<any> {
    return this.providersService.updateAvailability(req.user.sub, availabilityData);
  }

  @Post('me/upload-logo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload provider business logo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Logo uploaded and provider updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid file or provider not found',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadProviderLogo(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('File must be an image');
    }

    try {
      // Get current provider to get providerId for folder structure
      const provider = await this.providersService.findByUserId(req.user.id);
      
      // Upload to Cloudinary
      const result = await this.cloudinaryService.uploadImage(
        file,
        `providers/${provider.id}/logo`,
        this.cloudinaryService.getShopLogoTransformation()
      );

      // Update provider with new logo URL and public ID
      const updatedProvider = await this.providersService.update(provider.id, {
        logo: result.secure_url,
        logoPublicId: result.public_id,
      });

      return {
        success: true,
        message: 'Logo uploaded successfully',
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
        },
        provider: updatedProvider,
      };
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  @Post('me/upload-cover')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload provider cover image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Cover image uploaded and provider updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid file or provider not found',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadProviderCover(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('File must be an image');
    }

    try {
      // Get current provider to get providerId for folder structure
      const provider = await this.providersService.findByUserId(req.user.id);
      
      // Upload to Cloudinary
      const result = await this.cloudinaryService.uploadImage(
        file,
        `providers/${provider.id}/cover`,
        this.cloudinaryService.getShopCoverTransformation()
      );

      // Update provider with new cover image URL and public ID
      const updatedProvider = await this.providersService.update(provider.id, {
        coverImage: result.secure_url,
        coverImagePublicId: result.public_id,
      });

      return {
        success: true,
        message: 'Cover image uploaded successfully',
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
        },
        provider: updatedProvider,
      };
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  @Delete('me/logo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove provider logo' })
  @ApiResponse({
    status: 200,
    description: 'Logo removed successfully',
  })
  async removeProviderLogo(@Request() req) {
    try {
      const provider = await this.providersService.findByUserId(req.user.id);
      
      // Delete from Cloudinary if public ID exists
      if (provider.logoPublicId) {
        await this.cloudinaryService.deleteImage(provider.logoPublicId);
      }

      // Update provider to remove logo
      const updatedProvider = await this.providersService.update(provider.id, {
        logo: null,
        logoPublicId: null,
      });

      return {
        success: true,
        message: 'Logo removed successfully',
        provider: updatedProvider,
      };
    } catch (error) {
      throw new BadRequestException(`Remove failed: ${error.message}`);
    }
  }

  @Delete('me/cover')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove provider cover image' })
  @ApiResponse({
    status: 200,
    description: 'Cover image removed successfully',
  })
  async removeProviderCover(@Request() req) {
    try {
      const provider = await this.providersService.findByUserId(req.user.id);
      
      // Delete from Cloudinary if public ID exists
      if (provider.coverImagePublicId) {
        await this.cloudinaryService.deleteImage(provider.coverImagePublicId);
      }

      // Update provider to remove cover image
      const updatedProvider = await this.providersService.update(provider.id, {
        coverImage: null,
        coverImagePublicId: null,
      });

      return {
        success: true,
        message: 'Cover image removed successfully',
        provider: updatedProvider,
      };
    } catch (error) {
      throw new BadRequestException(`Remove failed: ${error.message}`);
    }
  }
}
