import { Module } from '@nestjs/common';
import { LlmService } from './llm.service';
import { LlmController } from './llm.controller';
import { PromptService } from './prompt.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [LlmController],
  providers: [LlmService, PromptService, ConfigService],
  exports: [LlmService, PromptService],
})
export class LlmModule {}
