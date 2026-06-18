import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiMetaDto {
  @ApiProperty({ example: '2026-06-18T10:30:00.000Z' })
  timestamp!: string;

  @ApiPropertyOptional({ example: '/api/v1/calculator/savings' })
  path?: string;

  @ApiPropertyOptional({ example: 'GET' })
  method?: string;

  @ApiPropertyOptional({ example: 150 })
  responseTimeMs?: number;

  @ApiPropertyOptional({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  requestId?: string;
}

export class ApiSuccessResponseDto<T> {
  @ApiProperty({ example: true })
  success!: true;

  @ApiProperty()
  data!: T;

  @ApiProperty()
  meta!: ApiMetaDto;
}

export class ApiErrorDetailDto {
  @ApiProperty({ example: 'currentEmi' })
  field!: string;

  @ApiProperty({ example: 'min' })
  constraint!: string;

  @ApiProperty({ example: 'currentEmi must not be less than 1' })
  message!: string;
}

export class ApiErrorBodyDto {
  @ApiProperty({ example: 'VALIDATION_ERROR' })
  code!: string;

  @ApiProperty({ example: 'Input validation failed' })
  message!: string;

  @ApiPropertyOptional({ type: [ApiErrorDetailDto] })
  details?: ApiErrorDetailDto[];
}

export class ApiErrorResponseDto {
  @ApiProperty({ example: false })
  success!: false;

  @ApiProperty()
  error!: ApiErrorBodyDto;

  @ApiProperty()
  meta!: ApiMetaDto;
}
