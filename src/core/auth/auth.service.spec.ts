import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '../../libs/mailer/mailer.service';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: { findOneByEmail: jest.Mock; findOneById: jest.Mock; updateRefreshToken: jest.Mock; updatePasswordResetToken: jest.Mock; updatePassword: jest.Mock; findAll: jest.Mock };
  let jwtService: { signAsync: jest.Mock; verify: jest.Mock };
  let configService: { get: jest.Mock };
  let mailerService: { sendPasswordReset: jest.Mock; sendQuoteConfirmation: jest.Mock; sendContactConfirmation: jest.Mock };

  beforeEach(async () => {
    usersService = {
      findOneByEmail: jest.fn(),
      findOneById: jest.fn(),
      updateRefreshToken: jest.fn(),
      updatePasswordResetToken: jest.fn(),
      updatePassword: jest.fn(),
      findAll: jest.fn(),
    };
    jwtService = {
      signAsync: jest.fn().mockResolvedValue('mock-token'),
      verify: jest.fn(),
    };
    configService = {
      get: jest.fn().mockImplementation((key: string, fallback?: string) => {
        const config: Record<string, string> = {
          JWT_SECRET: 'test-secret',
          JWT_REFRESH_SECRET: 'test-refresh-secret',
          JWT_EXPIRES_IN: '15m',
        };
        return config[key] || fallback;
      }),
    };
    mailerService = {
      sendPasswordReset: jest.fn(),
      sendQuoteConfirmation: jest.fn(),
      sendContactConfirmation: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
        { provide: MailerService, useValue: mailerService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should throw UnauthorizedException for invalid email', async () => {
      usersService.findOneByEmail.mockResolvedValue(null);
      await expect(service.login({ email: 'test@test.com', password: 'pass' })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const hashedPassword = await bcrypt.hash('correct-password', 10);
      usersService.findOneByEmail.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        password: hashedPassword,
        isActive: true,
        role: { name: 'admin' },
      });
      await expect(service.login({ email: 'test@test.com', password: 'wrong' })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for inactive user', async () => {
      const hashedPassword = await bcrypt.hash('password', 10);
      usersService.findOneByEmail.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        password: hashedPassword,
        isActive: false,
        role: { name: 'admin' },
      });
      await expect(service.login({ email: 'test@test.com', password: 'password' })).rejects.toThrow(UnauthorizedException);
    });

    it('should return tokens and user on successful login', async () => {
      const hashedPassword = await bcrypt.hash('password', 10);
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        password: hashedPassword,
        fullName: 'Test User',
        avatar: null,
        isActive: true,
        role: { name: 'admin' },
      };
      usersService.findOneByEmail.mockResolvedValue(mockUser);
      usersService.updateRefreshToken.mockResolvedValue(undefined);

      const result = await service.login({ email: 'test@test.com', password: 'password' });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe('test@test.com');
    });
  });

  describe('forgotPassword', () => {
    it('should return success message even if user not found', async () => {
      usersService.findOneByEmail.mockResolvedValue(null);
      const result = await service.forgotPassword('test@test.com');
      expect(result.message).toContain('reset email');
    });

    it('should send reset email for existing user', async () => {
      usersService.findOneByEmail.mockResolvedValue({ id: '1', email: 'test@test.com' });
      usersService.updatePasswordResetToken.mockResolvedValue(undefined);
      mailerService.sendPasswordReset.mockResolvedValue(undefined);

      const result = await service.forgotPassword('test@test.com');
      expect(result.message).toContain('reset email');
      expect(mailerService.sendPasswordReset).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should clear refresh token', async () => {
      usersService.updateRefreshToken.mockResolvedValue(undefined);
      const result = await service.logout('user-id');
      expect(result.message).toContain('Logged out');
      expect(usersService.updateRefreshToken).toHaveBeenCalledWith('user-id', null);
    });
  });
});
