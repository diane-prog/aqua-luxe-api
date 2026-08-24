import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { hashPassword } from '../../helpers';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find({ relations: { role: true } } as any);
  }

  async findOneById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id } as any,
      relations: { role: true },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { email } as any,
      select: {
        id: true,
        email: true,
        password: true,
        fullName: true,
        avatar: true,
        isActive: true,
        roleId: true,
        refreshToken: true,
      } as any,
      relations: { role: true } as any,
    } as any);
  }

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const exists = await this.userRepository.findOne({ where: { email: dto.email } as any });
    if (exists) {
      throw new ConflictException(`User with email ${dto.email} already exists`);
    }
    const user = this.userRepository.create({
      ...dto,
      password: dto.password,
    });
    return this.userRepository.save(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOneById(id);
    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    const hashed = refreshToken ? await hashPassword(refreshToken) : null;
    await this.userRepository.update(id, { refreshToken: hashed } as any);
  }

  async updatePasswordResetToken(id: string, token: string, expires: Date): Promise<void> {
    await this.userRepository.update(id, {
      passwordResetToken: token,
      passwordResetExpires: expires,
    });
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const hashedPassword = await hashPassword(newPassword);
    await this.userRepository.update(id, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOneById(id);
    await this.userRepository.softDelete(id);
  }
}
