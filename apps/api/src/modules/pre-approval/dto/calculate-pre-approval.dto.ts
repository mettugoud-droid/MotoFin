import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class CalculatePreApprovalDto {
  @ApiProperty({ description: 'Session ID from preceding savings or foreclosure calculation', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @IsUUID('4', { message: 'sessionId must be a valid UUID' })
  @IsNotEmpty({ message: 'sessionId is required' })
  sessionId!: string;
}
