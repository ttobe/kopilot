import { ClovaChatCompletionsResponseBody, ClovaResponse } from '../types';

export class ClovaResponseBodyTransformer {
  static transformIntoResult(
    body: ClovaChatCompletionsResponseBody,
  ): ClovaResponse {
    return { result: body.message.content };
  }

  static transformIntoSynonymResult(
    body: ClovaChatCompletionsResponseBody,
  ): ClovaResponse {
    const content = body.message.content;
    try {
      return { result: JSON.parse(content) };
    } catch (err) {
      return this.handleUnexpectedSynonymResult(content);
    }
  }

  static transformIntoFeedbackResult(
    body: ClovaChatCompletionsResponseBody,
  ): ClovaResponse {
    const sections = body.message.content.trim().split(/\n\n/);
    const result = sections
      .map((section) => {
        const [titleLine, ...descriptionLines] = section.split('\n');
        const titleMatch = titleLine.match(/^-\s*(.*?)\s*:\s*(.*)$/);
        if (!titleMatch) return null;

        const title = titleMatch[1];
        const score = titleMatch[2];
        const description = descriptionLines.join(' ').trim();

        return {
          title: title,
          score: score,
          description: description,
        };
      })
      .filter((item) => item !== null);

    return result;
  }

  private static handleUnexpectedSynonymResult(content: string): ClovaResponse {
    if (content.includes('-')) {
      return { result: this.parseSynonymResultWithHyphen(content) };
    }
    throw Error(`Failed to parse synonyms:\n, ${content}`);
  }

  private static parseSynonymResultWithHyphen(content: string): string[] {
    return content
      .trim()
      .split('\n')
      .map((item) => item.trim().replace(/^- /, ''));
  }
}
