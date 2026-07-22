import {
  IsEnum, IsInt, IsOptional, IsString, Max, Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum DeliveryStatus {
  PENDING   = 'PENDING',
  VIEWED    = 'VIEWED',
  INTERVIEW = 'INTERVIEW',
  REJECTED  = 'REJECTED',
  ACCEPTED  = 'ACCEPTED',
}

export class RegisterRecruiterDto {
  @IsString() realName: string;
  @IsOptional() @IsString() companyId?: string;
  @IsOptional() @IsString() department?: string;
  @IsOptional() @IsString() contactPhone?: string;
}

export class UpdateRecruiterDto {
  @IsOptional() @IsString() realName?: string;
  @IsOptional() @IsString() companyId?: string;
  @IsOptional() @IsString() department?: string;
  @IsOptional() @IsString() contactPhone?: string;
}

export class ListSeekersQuery {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50) limit?: number = 10;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() keyword?: string;
}

export class ListDeliveriesQuery {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50) limit?: number = 10;
  @IsOptional() @IsString() jobId?: string;
  @IsOptional() @IsEnum(DeliveryStatus) status?: DeliveryStatus;
}

export class UpdateDeliveryStatusDto {
  @IsEnum(DeliveryStatus) status: DeliveryStatus;
}

export class SendInviteDto {
  @IsString() seekerUserId: string;
  @IsString() jobId: string;
  @IsString() content: string;
}
