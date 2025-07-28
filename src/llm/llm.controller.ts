import { Controller, Post, Body, Get } from '@nestjs/common';
import { LlmService } from './llm.service';
import { PromptService } from './prompt.service';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

@Controller('llm')
export class LlmController {
  constructor(
    private readonly llmService: LlmService,
    private readonly promptService: PromptService,
  ) {}

  @Post('test')
  async test() {
    const model = this.llmService.getModel();
    const messages = [
        new SystemMessage("Translate the following from English into French"),
        new HumanMessage("hi!"),
      ];
    const response = await model.invoke(messages);

    const responsestream = await model.stream(messages);

    // Pour tester le stream
    const responsestreamcontent = [];
    for await (const chunk of responsestream) {
      responsestreamcontent.push(chunk);
      console.log(chunk.content);
    }   
    return { response: response };
  }

  @Post('chat')
  async chat(@Body() body: Record<string, any>) {
    const model = this.llmService.getModel();
    let userMessage = body.message;
    
    // Utiliser un template si spécifié
    if (body.templateName) {
      // Extraire templateName du body
      const { templateName, ...templateVariables } = body;
      
      // Utiliser toutes les variables du body pour le template
      userMessage = await this.promptService.formatPrompt(
        templateName,
        templateVariables
      );
    }
    
    const response = await model.invoke([
      new HumanMessage(userMessage),
    ]);
    
    return { response: response.content };
  }

  @Get('status')
  getStatus() {
    return { status: 'LLM service is running' };
  }
}
