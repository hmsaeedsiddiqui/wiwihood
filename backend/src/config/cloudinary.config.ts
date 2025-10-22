import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: (configService: ConfigService) => {
    const cloudName = configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = configService.get<string>('CLOUDINARY_API_SECRET');

    // Fail fast if misconfigured to avoid confusing Cloudinary errors
    const looksLikePlaceholder = (v?: string) => !!v && /your[_-]?new|your[_-]?api|your[_-]?cloud/i.test(v);
    if (!cloudName || !apiKey || !apiSecret || looksLikePlaceholder(apiKey) || looksLikePlaceholder(apiSecret) || looksLikePlaceholder(cloudName)) {
      const maskedKey = apiKey ? apiKey.replace(/.(?=.{4})/g, '*') : 'undefined';
      const maskedSecret = apiSecret ? apiSecret.replace(/.(?=.{4})/g, '*') : 'undefined';
      const msg = `⚠️  Cloudinary configuration invalid. CLOUDINARY_CLOUD_NAME='${cloudName || 'undefined'}', CLOUDINARY_API_KEY='${maskedKey}', CLOUDINARY_API_SECRET='${maskedSecret}'. Image upload features disabled.`;
      // eslint-disable-next-line no-console
      console.warn(msg);
      return null; // Return null instead of throwing
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    // Log minimal confirmation in dev
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log('[Cloudinary] Configured with cloud_name=%s, api_key=%s', cloudName, apiKey.replace(/.(?=.{4})/g, '*'));
    }
    return cloudinary;
  },
  inject: [ConfigService],
};
