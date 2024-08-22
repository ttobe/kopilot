import { Injectable } from '@nestjs/common';

const HYPHEN: string = '-';
const LEFT_BRACE: string = '[';
const QUOTATION_MARK: RegExp = /"/;
const BRACE_REGEXP: RegExp = /\[([^\]]+)\]/;

@Injectable()
export class ClovaResponseBodyParser {
  parseUnexpectedStringArray(input: string): string[] {
    try {
      if (input.includes(HYPHEN) && input.includes(LEFT_BRACE)) {
        return this.parseStringArrayWithHyphenAndBrace(input);
      }
      if (input.includes(HYPHEN)) {
        return this.parseStringArrayWithHyphen(input);
      }
      if (!QUOTATION_MARK.test(input)) {
        return this.parseStringArrayWithoutQuotationMark(input);
      }
      throw Error(input);
    } catch (err) {
      throw Error(`Failed to parse synonyms:\n${err.message}`);
    }
  }

  private parseStringArrayWithHyphenAndBrace(input: string): string[] {
    const match: RegExpMatchArray = input.match(BRACE_REGEXP);
    if (match) {
      const matchString = match[0].slice(1, -1);
      try {
        return JSON.parse(matchString);
      } catch (err) {
        return this.parseUnexpectedStringArray(matchString);
      }
    }
    throw Error(input);
  }

  private parseStringArrayWithHyphen(input: string): string[] {
    return input
      .trim()
      .split(/(\n|,)/g)
      .map((item: string) => item.trim().replace(/(-\s|,)/, ''))
      .filter(Boolean);
  }

  private parseStringArrayWithoutQuotationMark(input: string): string[] {
    return input
      .replace(/(\[|\])/g, '')
      .split(',')
      .map((item: string) => item.trim())
      .filter(Boolean);
  }
}
