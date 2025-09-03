import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private cloudinaryInstance: typeof cloudinary) {}

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'reservista',
    transformation?: any
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadOptions: any = {
        folder,
        resource_type: 'auto',
        format: 'jpg',
        quality: 'auto:good',
      };

      if (transformation) {
        uploadOptions.transformation = transformation;
      }

      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            reject(error);
          } else {
            resolve(result!);
          }
        },
      ).end(file.buffer);
    });
  }

  async uploadImageFromUrl(
    imageUrl: string,
    folder: string = 'reservista',
    transformation?: any
  ): Promise<UploadApiResponse> {
    const uploadOptions: any = {
      folder,
      resource_type: 'auto',
      format: 'jpg',
      quality: 'auto:good',
    };

    if (transformation) {
      uploadOptions.transformation = transformation;
    }

    return cloudinary.uploader.upload(imageUrl, uploadOptions);
  }

  async deleteImage(publicId: string): Promise<any> {
    return cloudinary.uploader.destroy(publicId);
  }

  generateTransformationUrl(
    publicId: string,
    transformations: any
  ): string {
    return cloudinary.url(publicId, transformations);
  }

  // Common transformation presets
  getProfileImageTransformation() {
    return {
      width: 400,
      height: 400,
      crop: 'fill',
      gravity: 'face',
      format: 'jpg',
      quality: 'auto:good'
    };
  }

  getServiceImageTransformation() {
    return {
      width: 800,
      height: 600,
      crop: 'fill',
      format: 'jpg',
      quality: 'auto:good'
    };
  }

  getShopCoverTransformation() {
    return {
      width: 1200,
      height: 600,
      crop: 'fill',
      format: 'jpg',
      quality: 'auto:good'
    };
  }

  getShopLogoTransformation() {
    return {
      width: 300,
      height: 300,
      crop: 'fill',
      format: 'jpg',
      quality: 'auto:good'
    };
  }
}
