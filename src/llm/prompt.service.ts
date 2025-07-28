import { Injectable } from '@nestjs/common';
import { PromptTemplate, ChatPromptTemplate } from '@langchain/core/prompts';

@Injectable()
export class PromptService {
  private templates: Map<string, ChatPromptTemplate> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  /**
   * Initialise les templates de prompts
   * Ces templates sont conçus pour être utilisés comme SystemMessage
   * dans les conversations avec le modèle LLM
   */
  private initializeTemplates(): void {
    // Template pour une conversation simple
    this.templates.set(
      'simple-chat',
      ChatPromptTemplate.fromMessages([
        ["system", "Tu es un assistant IA utile. Réponds à la question suivante de manière concise et précise."],
        ["user", "{question}"],
      ]),
    );

    // Template pour la traduction
    this.templates.set(
      'translate',
      ChatPromptTemplate.fromMessages([
        ["system", "Tu es un assistant IA utile qui connait toutes les langues."],
        ["user", "Traduit la phrase suivante en {language}: {phrase}"],
      ]),
    );

    // Template pour le résumé de texte
    this.templates.set(
        'summarize',
        ChatPromptTemplate.fromMessages([
            ["system", "Tu es un assistant IA expert en résumé qui résume de manière concise et précise un texte tout en gardant le sens, la nature et la structure du texte."],
            ["user", "Résume le texte suivant: {text}"],
        ]),
    );

    // Template pour les problèmes mathématiques (utilise ChatPromptTemplate)
    const systemTemplate = "Tu es un assistant IA expert en mathématiques qui peut résoudre des problèmes mathématiques complexes.";
    
    const mathPromptTemplate = ChatPromptTemplate.fromMessages([
      ["system", systemTemplate],
      ["user", "{problem}"],
    ]);
    
    this.templates.set('math', mathPromptTemplate);

    // Vous pouvez ajouter d'autres templates ici
  }

  getTemplate(templateName: string): ChatPromptTemplate {
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Template '${templateName}' not found`);
    }
    return template;
  }

  async formatPrompt(templateName: string, variables: Record<string, string>): Promise<string> {
    const template = this.getTemplate(templateName);
    const formattedMessages = await template.formatMessages(variables);
    // Joindre le contenu de tous les messages avec des sauts de ligne
    return formattedMessages.map(msg => msg.content).join('\n');
  }
}
