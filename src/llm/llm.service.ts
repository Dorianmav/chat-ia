import { Injectable } from '@nestjs/common';
import { ChatGroq } from '@langchain/groq';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LlmService {
  private model: BaseChatModel;

  constructor(private readonly configService: ConfigService) {
    this.initializeModel();
  }

  private initializeModel(): void {
    const apiKey = this.configService.get<string>('GROQ_API_KEY');

    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not defined in environment variables');
    }

    this.model = new ChatGroq({
      apiKey,
      model: 'llama-3.3-70b-versatile',
      temperature: 0,
    });
  }

  getModel(): BaseChatModel {
    return this.model;
  }
}
