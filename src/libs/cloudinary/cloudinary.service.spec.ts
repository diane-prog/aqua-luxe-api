import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryService } from './cloudinary.service';
import { CLOUDINARY_PROVIDER } from './cloudinary.provider';
import { ConfigService } from '@nestjs/config';

describe('CloudinaryService', () => {
  let service: CloudinaryService;
  let cloudinary: any;

  beforeEach(async () => {
    cloudinary = {
      uploader: {
        upload_stream: jest.fn(),
        destroy: jest.fn().mockResolvedValue({ result: 'ok' }),
      },
      url: jest.fn().mockReturnValue('https://res.cloudinary.com/test/image/upload/v1/test.jpg'),
    };

    const configService = {
      get: jest.fn().mockReturnValue('test-value'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CloudinaryService,
        { provide: CLOUDINARY_PROVIDER, useValue: cloudinary },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get(CloudinaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadImage', () => {
    it('should upload image and return result', async () => {
      const mockFile = { buffer: Buffer.from('test') } as Express.Multer.File;
      const mockResult = {
        public_id: 'test/id',
        url: 'http://test.com/image.jpg',
        secure_url: 'https://test.com/image.jpg',
        width: 800,
        height: 600,
        format: 'jpg',
      };

      cloudinary.uploader.upload_stream.mockImplementation((opts: any, cb: Function) => {
        cb(null, mockResult);
        return { end: jest.fn() };
      });

      const result = await service.uploadImage(mockFile, 'test-folder');
      expect(result.publicId).toBe('test/id');
      expect(result.width).toBe(800);
    });
  });

  describe('deleteImage', () => {
    it('should delete image by publicId', async () => {
      await service.deleteImage('test/public-id');
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('test/public-id');
    });
  });

  describe('generateTransformedUrl', () => {
    it('should generate a transformed URL', () => {
      const url = service.generateTransformedUrl('test/id', { width: 400, height: 300 });
      expect(cloudinary.url).toHaveBeenCalled();
      expect(url).toContain('cloudinary');
    });
  });
});
