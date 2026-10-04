import { IsString, IsOptional, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTestimonialDto {
  @ApiProperty()
  @IsString()
  authorName: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: "URL of the author's avatar (upload via POST /cloudinary/upload first)",
    example: "https://res.cloudinary.com/dgwlywkfa/image/upload/v1234567890/poolbk/avatar.jpg",
  })
  @IsString()
  @IsOptional()
  authorAvatar?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  authorAvatarPublicId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  projectRef?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  order?: number;
}
