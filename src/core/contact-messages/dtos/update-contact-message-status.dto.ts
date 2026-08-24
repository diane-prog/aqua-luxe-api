import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ContactMessageStatusEnum } from '../../../common/enum';

export class UpdateContactMessageStatusDto {
  @ApiProperty({ enum: ContactMessageStatusEnum })
  @IsEnum(ContactMessageStatusEnum)
  status: ContactMessageStatusEnum;
}
