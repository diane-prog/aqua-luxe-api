import { IsString, IsEmail, IsOptional, IsNumber, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateQuoteRequestDto {
  @ApiProperty({ example: 'Jane Smith' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+1234567890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  serviceTypeId?: string;

  @ApiPropertyOptional({ example: '123 Pool Street, Miami FL' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: 'I want a 15x30 vinyl pool with landscaping.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '$20,000 - $30,000' })
  @IsString()
  @IsOptional()
  budgetRange?: string;

  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  preferredDate?: Date;
}
