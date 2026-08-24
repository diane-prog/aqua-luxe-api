import { IsEnum, IsOptional, IsNumber, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { QuoteRequestStatusEnum } from '../../../common/enum';

export class UpdateQuoteRequestStatusDto {
  @ApiProperty({ enum: QuoteRequestStatusEnum })
  @IsEnum(QuoteRequestStatusEnum)
  status: QuoteRequestStatusEnum;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  estimatedPrice?: number;
}
