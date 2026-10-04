import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Administrator role' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: "Array of permission IDs. Get permissions from GET /admin/permissions",
    example: ["a1b2c3d4-e5f6-7890-abcd-ef1234567890"],
  })
  @IsOptional()
  permissionIds?: string[];
}
