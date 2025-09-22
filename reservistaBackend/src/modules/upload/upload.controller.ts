import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
  Delete,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ApiTags, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('profile-image')
  @ApiOperation({ summary: 'Upload profile image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        userId: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('File must be an image');
    }

    try {
      const result = await this.cloudinaryService.uploadImage(
        file,
        `reservista/profiles/${userId}`,
        this.cloudinaryService.getProfileImageTransformation()
      );

      return {
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
        },
      };
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  @Post('service-image')
  @ApiOperation({ summary: 'Upload service image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        serviceId: {
          type: 'string',
        },
        providerId: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadServiceImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('serviceId') serviceId: string,
    @Body('providerId') providerId: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('File must be an image');
    }

    try {
      const result = await this.cloudinaryService.uploadImage(
        file,
        `reservista/services/${providerId}`,
        this.cloudinaryService.getServiceImageTransformation()
      );

      return {
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
        },
      };
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  @Post('service')
  @ApiOperation({ summary: 'Upload service image (frontend compatibility)' })
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
  @UseInterceptors(FileInterceptor('file'))
  async uploadService(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('File must be an image');
    }

    try {
      const result = await this.cloudinaryService.uploadImage(
        file,
        'reservista/services',
        this.cloudinaryService.getServiceImageTransformation()
      );

      return {
        success: true,
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
      };
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  @Post('shop-logo')
  @ApiOperation({ summary: 'Upload shop logo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        providerId: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadShopLogo(
    @UploadedFile() file: Express.Multer.File,
    @Body('providerId') providerId: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('File must be an image');
    }

    try {
      const result = await this.cloudinaryService.uploadImage(
        file,
        `reservista/shops/${providerId}/logo`,
        this.cloudinaryService.getShopLogoTransformation()
      );

      return {
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
        },
      };
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  @Post('shop-cover')
  @ApiOperation({ summary: 'Upload shop cover image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        providerId: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadShopCover(
    @UploadedFile() file: Express.Multer.File,
    @Body('providerId') providerId: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('File must be an image');
    }

    try {
      const result = await this.cloudinaryService.uploadImage(
        file,
        `reservista/shops/${providerId}/cover`,
        this.cloudinaryService.getShopCoverTransformation()
      );

      return {
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
        },
      };
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  @Post('shop')
  @ApiOperation({ summary: 'Upload shop image (generic)' })
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
  @UseInterceptors(FileInterceptor('file'))
  async uploadShopImage(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('File must be an image');
    }

    try {
      const result = await this.cloudinaryService.uploadImage(
        file,
        'reservista/shops/general',
        this.cloudinaryService.getServiceImageTransformation()
      );

      return {
        success: true,
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
      };
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  @Post('upload-from-url')
  @ApiOperation({ summary: 'Upload image from URL' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        imageUrl: {
          type: 'string',
          description: 'URL of the image to upload',
        },
        folder: {
          type: 'string',
          description: 'Cloudinary folder path',
        },
        type: {
          type: 'string',
          enum: ['profile', 'service', 'shop-logo', 'shop-cover'],
          description: 'Type of image for transformation',
        },
      },
    },
  })
  async uploadFromUrl(
    @Body('imageUrl') imageUrl: string,
    @Body('folder') folder: string = 'reservista',
    @Body('type') type: 'profile' | 'service' | 'shop-logo' | 'shop-cover' = 'service',
  ) {
    if (!imageUrl) {
      throw new BadRequestException('Image URL is required');
    }

    try {
      let transformation;
      switch (type) {
        case 'profile':
          transformation = this.cloudinaryService.getProfileImageTransformation();
          break;
        case 'service':
          transformation = this.cloudinaryService.getServiceImageTransformation();
          break;
        case 'shop-logo':
          transformation = this.cloudinaryService.getShopLogoTransformation();
          break;
        case 'shop-cover':
          transformation = this.cloudinaryService.getShopCoverTransformation();
          break;
        default:
          transformation = this.cloudinaryService.getServiceImageTransformation();
      }

      const result = await this.cloudinaryService.uploadImageFromUrl(
        imageUrl,
        folder,
        transformation
      );

      return {
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
        },
      };
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  @Delete('image/:publicId')
  @ApiOperation({ summary: 'Delete image from Cloudinary' })
  async deleteImage(@Param('publicId') publicId: string) {
    try {
      // Replace encoded slashes back to actual slashes
      const decodedPublicId = publicId.replace(/%2F/g, '/');
      const result = await this.cloudinaryService.deleteImage(decodedPublicId);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new BadRequestException(`Delete failed: ${error.message}`);
    }
  }
}
