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
    }   
    return { response: response };
  }

  @Post('chat')
  async chat(@Body() body: Record<string, any>) {
    const model = this.llmService.getModel();
    
    // Si un template est spécifié
    if (body.templateName) {
      // Extraire templateName du body
      const { templateName, ...templateVariables } = body;
      
      try {
        // Récupérer le template et formater les messages
        const template = this.promptService.getTemplate(templateName);
        const formattedMessages = await template.formatMessages(templateVariables);
        
        // Invoquer le modèle avec les messages formatés
        const response = await model.invoke(formattedMessages);
        return { response: response.content };
      } catch (error) {
        console.error('Error processing template:', error);
        throw new Error(`Error with template ${templateName}: ${error.message}`);
      }
    } else if (body.message) {
      // Si pas de template, utiliser simplement le message utilisateur
      const response = await model.invoke([
        new HumanMessage(body.message),
      ]);
      
      return { response: response.content };
    } else {
      throw new Error('Either templateName or message must be provided');
    }
  }

  @Get('status')
  getStatus() {
    return { status: 'LLM service is running' };
  }
}
