import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

// 单条对话历史
export class GenerateJobHistoryDto {
  @IsString() role: string;
  @IsOptional() @IsString() content?: string;
}

// 生成职位请求体
export class GenerateJobDto {
  @IsString()
  @MaxLength(1000)
  prompt: string;

  @IsOptional()
  @IsArray()
  history?: GenerateJobHistoryDto[];
}
