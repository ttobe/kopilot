import { Module } from '@nestjs/common';
import { ClovaController } from './clova.controller';
import { FeedbackService } from './services/feedback.service';
import { ParsedSentenceService } from './services/parsed-sentence.service';
import { PartialModificationService } from './services/partial-modification.service';
import { RepetitiveWordService } from './services/repetitive-word.service';
import {
  ClovaRequestBodyTransformer,
  ClovaResponseBodyParser,
  ClovaResponseBodyTransformer,
} from './utils';

@Module({
  controllers: [ClovaController],
  providers: [
    PartialModificationService,
    ParsedSentenceService,
    FeedbackService,
    RepetitiveWordService,
    ClovaRequestBodyTransformer,
    ClovaResponseBodyTransformer,
    ClovaResponseBodyParser,
  ],
})
export class ClovaModule {}
