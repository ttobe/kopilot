import { StreamInterceptor } from 'src/clova/interceptors/stream-interceptor';
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { FeedbackService } from './services/feedback.service';
import { ParsedSentenceService } from './services/parsed-sentence.service';
import { PartialModificationService } from './services/partial-modification.service';
import { RepetitiveWordService } from './services/repetitive-word.service';
import { CommandValue } from './types';

@Controller('clova')
export class ClovaController {
  constructor(
    private readonly partialModification: PartialModificationService,
    private readonly parsedSentenceService: ParsedSentenceService,
    private readonly feedbackService: FeedbackService,
    private readonly repetitiveWordService: RepetitiveWordService,
  ) {}

  @Post('/partial-modification')
  getPartialModificationResult(
    @Body('input') input: string,
    @Body('command') command: CommandValue,
  ) {
    return this.partialModification.getResult(input, command);
  }

  @Post('/partial-modification/stream')
  @UseInterceptors(StreamInterceptor)
  async getPartialModificationResultForStream(
    @Body('input') input: string,
    @Body('command') command: CommandValue,
    @Body('systemMessage') systemMessage: string | null,
  ) {
    return await this.partialModification.getResultForStream(
      input,
      command,
      systemMessage,
    );
  }

  @Post('/parsed-line')
  parsedLine(@Body('text') text: string, @Body('length') length: number) {
    return this.parsedSentenceService.getParsedSentence(text, length);
  }

  @Post('/feedback')
  feedback(
    @Body('tone') tone: string,
    @Body('purpose') purpose: string,
    @Body('text') text: string,
  ) {
    return this.feedbackService.getResult(tone, purpose, text);
  }

  @Post('/repetitive-word')
  detectRepetitiveWord(@Body('text') text: string) {
    return this.repetitiveWordService.getRepetitiveWord(text);
  }
}
