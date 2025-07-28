import { Injectable } from '@nestjs/common';
import { PromptTemplate } from '@langchain/core/prompts';

@Injectable()
export class PromptService {
  private templates: Map<string, PromptTemplate> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  private initializeTemplates(): void {
    // Exemple de template pour une conversation simple
    this.templates.set(
      'simple-chat',
      PromptTemplate.fromTemplate(
        `Tu es un assistant IA utile. Réponds à la question suivante de manière concise et précise.
        
        Question: {question}
        
        Réponse:`,
      ),
    );

    this.templates.set(
      'translate',
      PromptTemplate.fromTemplate(
        `Tu es un assistant IA utile qui connait toutes les langues. Traduit la phrase suivante dans cette {language}.
          
          Phrase: {phrase}
          
          Traduction:`,
        ),
      );

    // Vous pouvez ajouter d'autres templates ici
  }

  getTemplate(templateName: string): PromptTemplate {
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Template '${templateName}' not found`);
    }
    return template;
  }

  async formatPrompt(templateName: string, variables: Record<string, string>): Promise<string> {
    const template = this.getTemplate(templateName);
    const formattedPrompt = await template.format(variables);
    return formattedPrompt;
  }
}
