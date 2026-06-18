import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok', enum: ['ok', 'error'] })
  status!: string;

  @ApiProperty({ example: 'MotoFin API' })
  service!: string;

  @ApiProperty({ example: '1.0.0' })
  version!: string;

  @ApiProperty({ example: '2026-06-18T10:30:00.000Z' })
  timestamp!: string;

  @ApiProperty({ example: 123.456, description: 'Server uptime in seconds' })
  uptime!: number;

  @ApiProperty({ example: 'development', enum: ['development', 'production', 'test'] })
  environment!: string;
}
