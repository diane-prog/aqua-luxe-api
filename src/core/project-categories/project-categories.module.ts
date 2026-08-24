import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectCategoryEntity } from './entities/project-category.entity';
import { ProjectCategoriesService } from './project-categories.service';
import { ProjectCategoriesController } from './project-categories.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectCategoryEntity])],
  controllers: [ProjectCategoriesController],
  providers: [ProjectCategoriesService],
  exports: [ProjectCategoriesService],
})
export class ProjectCategoriesModule {}
