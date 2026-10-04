import { IsString, IsOptional, IsArray, IsEnum, IsNumber, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BlogStatusEnum } from '../../../common/enum';
import { Type } from 'class-transformer';

export class CreateBlogDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  excerpt?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  content?: string;

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

  @ApiPropertyOptional({
    description: "ID of the author (User). Get users from GET /admin/users",
    example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  })
  @IsString()
  @IsOptional()
  authorId?: string;

  @ApiPropertyOptional({
    description: "ID of the blog category. Get categories from GET /blog-categories",
    example: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ enum: BlogStatusEnum })
  @IsEnum(BlogStatusEnum)
  @IsOptional()
  status?: BlogStatusEnum;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  readingTime?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  seoTitle?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  seoDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  publishedAt?: Date;
}
