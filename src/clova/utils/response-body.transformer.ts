import {
  ClovaChatCompletionsResponseBody,
  ClovaResponse,
  Synonyms,
} from '../types';

const HYPHEN: string = '-';
const LEFT_BRACE: string = '[';
const BRACE_REGEXP: RegExp = /\[([^\]]+)\]/;

export class ClovaResponseBodyTransformer {
  static transformIntoResult(
    body: ClovaChatCompletionsResponseBody,
  ): ClovaResponse {
    return { result: body.message.content };
  }

  static transformIntoSynonymResult(
    body: ClovaChatCompletionsResponseBody,
  ): Synonyms {
    const content = body.message.content;
    try {
      return JSON.parse(content);
    } catch (err) {
      return this.handleUnexpectedSynonymResult(content);
    }
  }

  static transformIntoFeedbackResult(
    body: ClovaChatCompletionsResponseBody,
  ): ClovaResponse {
    const sections = body.message.content.trim().split(/-\s+/);
    const result = sections
      .map((section) => {
        const [titleLine, ...descriptionLines] = section.trim().split('\n');
        if (!titleLine) return null;

        const titleMatch = titleLine.match(/^(.*?)\s*:\s*(.*)$/);
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

  private static handleUnexpectedSynonymResult(content: string): Synonyms {
    console.debug(content);
    try {
      if (content.includes(HYPHEN) && content.includes(LEFT_BRACE)) {
        return this.parseSynonymResultWithHyphenAndBrace(content);
      }
      if (content.includes(HYPHEN)) {
        return this.parseSynonymResultWithHyphen(content);
      }
      if (content.includes(LEFT_BRACE)) {
        return this.parseSynonymResultWithoutQuotationMark(content);
      }
      throw Error(content);
    } catch (err) {
      throw Error(`Failed to parse synonyms:\n ${err.message}`);
    }
  }

  private static parseSynonymResultWithHyphenAndBrace(
    content: string,
  ): string[] {
    const match: RegExpMatchArray = content.match(BRACE_REGEXP);
    if (match) {
      try {
        return JSON.parse(match[0].slice(1, -1));
      } catch (err) {
        return this.handleUnexpectedSynonymResult(match[0]);
      }
    }
    throw Error(content);
  }

  private static parseSynonymResultWithHyphen(content: string): string[] {
    return content
      .trim()
      .split(/(\n|,)/g)
      .map((item) => item.trim().replace(/(- |,)/, ''))
      .filter((item) => item);
  }

  private static parseSynonymResultWithoutQuotationMark(
    content: string,
  ): string[] {
    return content
      .replace(/(\[|\])/g, '')
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item);
  }
}
