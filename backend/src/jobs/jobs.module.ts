import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { TailoredResumeController } from './tailored-resume.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [JobsController, TailoredResumeController],
  providers: [JobsService],
})
export class JobsModule {}
