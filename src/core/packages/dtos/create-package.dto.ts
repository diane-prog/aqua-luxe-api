import { IsString, IsOptional, IsArray, IsBoolean, IsNumber, IsEnum, IsPositive } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PackagePeriodEnum } from '../../../common/enum';

export class CreatePackageDto {
  @ApiProperty({ example: 'Premium Pool Package' })
  @IsString()
  name: string;

  @ApiProperty({ example: 199.99 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiPropertyOptional({ enum: PackagePeriodEnum })
  @IsEnum(PackagePeriodEnum)
  @IsOptional()
  period?: PackagePeriodEnum;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  features?: string[];

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isHighlighted?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}
