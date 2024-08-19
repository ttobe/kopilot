import { Inject, Injectable } from '@nestjs/common';
import {
  ClovaChatCompletionsResponseBody,
  ClovaResponse,
  Synonyms,
} from '../types';
import { ClovaResponseBodyParser } from './response-body.parser';

@Injectable()
export class ClovaResponseBodyTransformer {
  constructor(
    @Inject(ClovaResponseBodyParser)
    private readonly clovaResponseBodyParser,
  ) {}

  transformIntoResult(body: ClovaChatCompletionsResponseBody): ClovaResponse {
    return { result: body.message.content };
  }

  transformIntoSynonymResult(body: ClovaChatCompletionsResponseBody): Synonyms {
    const content = body.message.content;
    try {
      return JSON.parse(content);
    } catch (err) {
      return this.clovaResponseBodyParser.parseUnexpectedStringArray(content);
    }
  }

  transformIntoFeedbackResult(
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
}
