import { IsString, IsOptional, IsArray, IsEnum, IsNumber, IsDate, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatusEnum } from '../../../common/enum';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  completionDays?: number;

  @ApiPropertyOptional({
    description: "ID of the project category. Get categories from GET /project-categories",
    example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  client?: string;

  @ApiPropertyOptional({ enum: ProjectStatusEnum })
  @IsEnum(ProjectStatusEnum)
  @IsOptional()
  status?: ProjectStatusEnum;
}
