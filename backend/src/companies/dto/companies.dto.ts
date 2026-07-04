import { IsOptional, IsString, Max, Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchCompaniesQuery {
  @IsOptional() @IsString() keyword?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(20) limit?: number = 10;
}

export class CreateCompanyDto {
  @IsString() name: string;
  @IsOptional() @IsString() industry?: string;
  @IsOptional() @IsString() scale?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() province?: string;
}
