import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SettingsEntity } from './entities/settings.entity';
import { UpdateSettingsDto } from './dtos';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(@InjectRepository(SettingsEntity) private readonly repo: Repository<SettingsEntity>) {}

  async get(): Promise<SettingsEntity> {
    let settings = await this.repo.findOne({ where: {} } as any);
    if (!settings) {
      settings = this.repo.create({});
      await this.repo.save(settings);
    }
    return settings;
  }

  async update(dto: UpdateSettingsDto): Promise<SettingsEntity> {
    const settings = await this.get();
    Object.assign(settings, dto);
    return this.repo.save(settings);
  }
}
