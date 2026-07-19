import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export enum Gender {
  UNKNOWN = 'UNKNOWN',
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum Degree {
  ANY = 'ANY',
  JUNIOR_HIGH = 'JUNIOR_HIGH',
  HIGH_SCHOOL = 'HIGH_SCHOOL',
  ASSOCIATE = 'ASSOCIATE',
  BACHELOR = 'BACHELOR',
  MASTER = 'MASTER',
  DOCTOR = 'DOCTOR',
}

export enum CareerLevel {
  IC = 'IC',
  LEAD = 'LEAD',
  MGR_DIR = 'MGR_DIR',
  VP_C = 'VP_C',
}

export class UpdateProfileDto {
  @IsOptional() @IsString() realName?: string;
  @IsOptional() @IsEnum(Gender) gender?: Gender;
  @IsOptional() @IsDateString() birthDate?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsDateString() workStartDate?: string; // 参加工作时间
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() roleTitle?: string;
  @IsOptional() @IsInt() @Min(0) currentAnnualSalary?: number; // 当前综合年薪，万/年
  @IsOptional() @IsEnum(CareerLevel) currentLevel?: CareerLevel; // 当前职级
}

export class UpdateSelfDescDto {
  @IsOptional() @IsString() selfDesc?: string;
}

export class CreateEducationDto {
  @IsString() school: string;
  @IsOptional() @IsString() major?: string;
  @IsOptional() @IsEnum(Degree) degree?: Degree;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
}

export class UpdateEducationDto {
  @IsOptional() @IsString() school?: string;
  @IsOptional() @IsString() major?: string;
  @IsOptional() @IsEnum(Degree) degree?: Degree;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
}

export class CreateWorkExpDto {
  @IsString() company: string;
  @IsOptional() @IsString() companyId?: string;
  @IsString() title: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsInt() @Min(0) salaryMin?: number;
  @IsOptional() @IsInt() @Min(0) salaryMax?: number;
  @IsOptional() @IsArray() @IsString({ each: true }) skillTags?: string[];
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
}

export class UpdateWorkExpDto {
  @IsOptional() @IsString() company?: string;
  @IsOptional() @IsString() companyId?: string;
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsInt() @Min(0) salaryMin?: number;
  @IsOptional() @IsInt() @Min(0) salaryMax?: number;
  @IsOptional() @IsArray() @IsString({ each: true }) skillTags?: string[];
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
}

export class CreateProjectExpDto {
  @IsString() name: string;
  @IsOptional() @IsString() role?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) techTags?: string[];
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
}

export class UpdateProjectExpDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() role?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) techTags?: string[];
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
}

export class ConfirmCertDto {
  @IsOptional() @IsString() relationship?: string;   // SUPERVISOR | COLLEAGUE | HR
  @IsOptional() @IsString() recommendation?: string;
  @IsOptional() @IsDateString() knowFrom?: string;
  @IsOptional() @IsDateString() knowTo?: string;
  @IsOptional() anonymous?: boolean;
}
