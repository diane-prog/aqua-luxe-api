import { Repository, ObjectLiteral } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<
  T extends ObjectLiteral,
> extends Repository<T> {
  async retrieveEntity(id: string, relations?: string[]): Promise<T> {
    const entity = await this.findOne({
      where: { id } as any,
      relations: relations as any,
    });
    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }
    return entity;
  }

  async retrieveEntities(options?: any): Promise<T[]> {
    return this.find(options);
  }

  async createEntity(data: Partial<T>): Promise<T> {
    const entity = this.create(data as any);
    return this.save(entity) as any;
  }

  async updateEntity(id: string, data: Partial<T>): Promise<T> {
    const entity = await this.retrieveEntity(id);
    Object.assign(entity, data);
    return this.save(entity);
  }

  async deleteEntity(id: string): Promise<void> {
    await this.retrieveEntity(id);
    await this.softDelete(id);
  }

  async softDelete(id: string): Promise<any> {
    await this.update(id, { deleted: true } as any);
    return super.softDelete(id);
  }

  async restore(id: string): Promise<any> {
    await this.update(id, { deleted: false } as any);
    return super.restore(id);
  }
}
