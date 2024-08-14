import {
  ClovaChatCompletionsStreamSignal,
  ClovaChatCompletionsStreamToken,
  ClovaEvent,
  ClovaStreamToken,
} from '../types';

export class ClovaEventParser {
  private static EVENT_PATTERN =
    /id:(?<id>[^\n]+)\nevent:(?<event>[^\n]+)\ndata:(\n)*(?<data>\{.*\})/;

  private buffer: string = '';

  parse(events: Buffer): ClovaStreamToken[] {
    this.buffer += events.toString();
    const tokens: ClovaStreamToken[] = [];

    while (this.hasCompleteEvent()) {
      const { singleEvent, remainingBuffer } = this.extractEventString();
      const token = this.parseSingleEvent(singleEvent);
      if (token) {
        tokens.push(token);
      }
      this.buffer = remainingBuffer;
    }
    return tokens;
  }

  private hasCompleteEvent(): boolean {
    return ClovaEventParser.EVENT_PATTERN.test(this.buffer);
  }

  private extractEventString(): {
    singleEvent: string;
    remainingBuffer: string;
  } {
    const match = ClovaEventParser.EVENT_PATTERN.exec(this.buffer);
    if (!match || !match.groups) {
      throw new Error('Failed to extract single event');
    }

    const { index } = match;
    const singleEvent = match[0];
    const remainingBuffer = this.buffer.slice(index + singleEvent.length);

    return { singleEvent, remainingBuffer };
  }

  private parseSingleEvent(singleEvent: string): ClovaStreamToken | null {
    const match = singleEvent.match(ClovaEventParser.EVENT_PATTERN);

    if (!match || !match.groups) {
      console.error('Failed to parse single event:', singleEvent);
      return null;
    }

    const { event, data } = match.groups;
    switch (event as ClovaEvent) {
      case 'token':
        return JSON.parse(data) as ClovaChatCompletionsStreamToken;
      case 'signal':
        return JSON.parse(data) as ClovaChatCompletionsStreamSignal;
      default:
        return null;
    }
  }
}
