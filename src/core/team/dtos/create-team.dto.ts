import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateTeamDto {
  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({
    description: "URL of the photo (upload via POST /cloudinary/upload first)",
    example: "https://res.cloudinary.com/dgwlywkfa/image/upload/v1234567890/poolbk/photo.jpg",
  })
  @IsString()
  @IsOptional()
  photo?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  photoPublicId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({
    description: "Social links array",
    example: [{ platform: "facebook", url: "https://facebook.com/john" }],
  })
  @IsArray()
  @IsOptional()
  socialLinks?: { platform: string; url: string }[];

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}