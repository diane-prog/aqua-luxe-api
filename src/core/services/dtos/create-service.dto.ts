import { IsString, IsOptional, IsArray, IsEnum, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceCategoryEnum } from '../../../common/enum';

export class CreateServiceDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({
    description: "URL of the cover image (upload via POST /cloudinary/upload first)",
    example: "https://res.cloudinary.com/dgwlywkfa/image/upload/v1234567890/poolbk/image.jpg",
  })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  coverImagePublicId?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  features?: string[];

  @ApiPropertyOptional({ enum: ServiceCategoryEnum })
  @IsEnum(ServiceCategoryEnum)
  @IsOptional()
  category?: ServiceCategoryEnum;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
