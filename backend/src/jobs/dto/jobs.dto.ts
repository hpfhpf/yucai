import {
  IsArray, IsBoolean, IsEnum, IsInt, IsOptional,
  IsString, Min, Max,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export enum JobNature { FULL_TIME = 'FULL_TIME', PART_TIME = 'PART_TIME', INTERNSHIP = 'INTERNSHIP' }
export enum Degree { ANY = 'ANY', JUNIOR_HIGH = 'JUNIOR_HIGH', HIGH_SCHOOL = 'HIGH_SCHOOL', ASSOCIATE = 'ASSOCIATE', BACHELOR = 'BACHELOR', MASTER = 'MASTER', DOCTOR = 'DOCTOR' }
export enum CareerLevel { IC = 'IC', LEAD = 'LEAD', MGR_DIR = 'MGR_DIR', VP_C = 'VP_C' }

export class CreateJobDto {
  @IsString() title: string;
  @IsOptional() @IsEnum(JobNature) nature?: JobNature;
  @IsOptional() @IsString() province?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() district?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() salaryRange?: string;
  @IsOptional() @IsInt() @Min(0) annualSalaryMin?: number; // 年薪下限，万/年
  @IsOptional() @IsInt() @Min(0) annualSalaryMax?: number; // 年薪上限，万/年
  @IsOptional() @IsEnum(Degree) minDegree?: Degree;
  @IsOptional() @IsInt() @Min(0) minExpYears?: number;
  @IsString() description: string;
  @IsOptional() @IsArray() @IsString({ each: true }) perks?: string[];
  @IsOptional() @IsString() companyId?: string;
}

export class UpdateJobDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsEnum(JobNature) nature?: JobNature;
  @IsOptional() @IsString() province?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() district?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() salaryRange?: string;
  @IsOptional() @IsInt() @Min(0) annualSalaryMin?: number;
  @IsOptional() @IsInt() @Min(0) annualSalaryMax?: number;
  @IsOptional() @IsEnum(Degree) minDegree?: Degree;
  @IsOptional() @IsInt() @Min(0) minExpYears?: number;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) perks?: string[];
}

export class ListJobsQuery {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(50) limit?: number = 10;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() keyword?: string;
  @IsOptional() @IsEnum(JobNature) nature?: JobNature;
  @IsOptional() @IsString() salaryRange?: string;
  @IsOptional() @IsString() companyId?: string;
  // 向上跳槽过滤开关：前端传 enableFilter=true 时启用，未传则不过滤
  @IsOptional() @Transform(({ value }) => value === 'true' || value === true) enableFilter?: boolean;
}

export class DeliverJobDto {
  @IsBoolean() creditAuthorized: boolean;
}
