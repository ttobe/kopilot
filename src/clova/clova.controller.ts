import { StreamInterceptor } from 'src/clova/interceptors/stream-interceptor';
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ClovaService } from './clova.service';
import { FeedbackService } from './feedback.service';
import { ParsedSentenceService } from './parsed-sentence.service';
import { PartialModificationService } from './partial-modification.service';
import { RepetitiveWordService } from './repetitive-word.service';
import { CommandValue } from './types';

@Controller('clova')
export class ClovaController {
  constructor(
    private readonly clovaService: ClovaService,
    private readonly partialModification: PartialModificationService,
    private readonly parsedSentenceService: ParsedSentenceService,
    private readonly feedbackService: FeedbackService,
    private readonly repeatedWordService: RepetitiveWordService,
  ) {}

  @Post('/partial-modification')
  getPartialModificationResult(
    @Body('input') input: string,
    @Body('command') command: CommandValue,
    @Body('systemMessage') systemMessage: string | null,
  ) {
    return this.partialModification.getResult(input, command, systemMessage);
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

  @Post('/repeated-word')
  detectRepeatedWord(@Body('text') text: string) {
    return this.repeatedWordService.getRepeatedWord(text);
  }
}
