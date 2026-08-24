import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { hashPassword, comparePassword } from '../../helpers';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { LoginDto } from '../users/dtos';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly otpService: OtpService,
  ) {}

  async register(dto: { email: string; password: string; fullName: string }) {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (user) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await hashPassword(dto.password);
    const created = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      fullName: dto.fullName,
      isActive: true,
    });

    this.logger.log(`User registered: ${dto.email}`);
    return { message: 'Account created successfully. Please login.' };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findOneByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    return {
      message: 'Credentials verified. Please request a verification code.',
      email: user.email,
    };
  }

  async sendOtp(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('No account found with this email');
    }

    return this.otpService.generateAndSend(email);
  }

  async verifyOtp(email: string, code: string) {
    await this.otpService.verify(email, code);

    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const userId = (user as any).id;
    const tokens = await this.generateTokens(userId, user.email);
    await this.usersService.updateRefreshToken(userId, tokens.refreshToken);

    return {
      user: {
        id: userId,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        role: user.role,
      },
      ...tokens,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      }) as any;

      const user = await this.usersService.findOneById(payload.sub);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Access denied');
      }

      const refreshTokenMatches = await comparePassword(
        refreshToken,
        (user as any).refreshToken,
      );
      if (!refreshTokenMatches) {
        throw new UnauthorizedException('Access denied');
      }

      const userId = (user as any).id;
      const tokens = await this.generateTokens(userId, user.email);
      await this.usersService.updateRefreshToken(userId, tokens.refreshToken);

      return tokens;
    } catch {
      throw new UnauthorizedException('Access denied');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      return { message: 'If an account exists, a reset email has been sent' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000);

    await this.usersService.updatePasswordResetToken(
      (user as any).id,
      resetToken,
      resetExpires,
    );

    return { message: 'If an account exists, a reset email has been sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const allUsers = await this.usersService.findAll();

    let foundUser: any = null;
    for (const u of allUsers) {
      if ((u as any).passwordResetToken === token) {
        foundUser = u;
        break;
      }
    }

    if (!foundUser || !foundUser.passwordResetExpires) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (new Date() > foundUser.passwordResetExpires) {
      throw new BadRequestException('Reset token has expired');
    }

    await this.usersService.updatePassword(foundUser.id, newPassword);
    return { message: 'Password has been reset successfully' };
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    return { message: 'Logged out successfully' };
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m') as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d' as any,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
