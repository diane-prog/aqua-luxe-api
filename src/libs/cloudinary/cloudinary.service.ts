import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadApiOptions, UploadApiResponse, v2 } from 'cloudinary';
import { CLOUDINARY_PROVIDER } from './cloudinary.provider';

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
}

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(
    @Inject(CLOUDINARY_PROVIDER)
    private readonly cloudinary: typeof v2,
    private readonly configService: ConfigService,
  ) {}

  async uploadImage(
    file: any,
    folder: string = 'poolbk',
  ): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error) {
            this.logger.error(`Upload failed: ${error.message}`);
            return reject(error);
          }
          resolve({
            publicId: result!.public_id,
            url: result!.url,
            secureUrl: result!.secure_url,
            width: result!.width,
            height: result!.height,
            format: result!.format,
          });
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async uploadMultiple(
    files: any[],
    folder: string = 'poolbk',
  ): Promise<CloudinaryUploadResult[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file, folder));
    return Promise.all(uploadPromises);
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await this.cloudinary.uploader.destroy(publicId);
      this.logger.log(`Deleted image: ${publicId}`);
    } catch (error) {
      this.logger.error(`Failed to delete image: ${publicId}`);
      throw error;
    }
  }

  generateTransformedUrl(
    publicId: string,
    options: { width?: number; height?: number; crop?: string; quality?: string } = {},
  ): string {
    return this.cloudinary.url(publicId, {
      transformation: [
        {
          width: options.width || 400,
          height: options.height || 300,
          crop: options.crop || 'fill',
          quality: options.quality || 'auto',
          fetch_format: 'auto',
        },
      ],
    });
  }
}
