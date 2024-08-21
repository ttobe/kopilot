import { Injectable } from '@nestjs/common';
import {
  DIRECT_COMMAND_DETAILS,
  FEEDBACK_DETAILS,
  LONG_DESCRIPTION_DETAILS,
  PARSED_SENTENCE_DETAILS,
  REPETITIVE_WORD_DETAILS,
  SHORT_DESCRIPTION_DETAILS,
  SUBTITLE_DETAILS,
  SYNONYM_DETAILS,
} from '../constants';
import {
  ChatMessage,
  ClovaChatCompletionsRequestBody,
  TransformType,
} from '../types';

@Injectable()
export class ClovaRequestBodyTransformer {
  transformIntoChatCompletions(
    transformType: TransformType,
    chatMessages: ChatMessage[],
  ): ClovaChatCompletionsRequestBody {
    switch (transformType) {
      case 'SYNONYM':
        return this.makeSynonym(chatMessages);
      case 'LONG_DESCRIPTION':
        return this.makeLongDescription(chatMessages);
      case 'SHORT_DESCRIPTION':
        return this.makeShortDescription(chatMessages);
      case 'SUBTITLE':
        return this.makeSubtitle(chatMessages);
      case 'DIRECT_COMMAND':
        return this.makeDirectCommand(chatMessages);
      case 'FEEDBACK':
        return this.makeFeedback(chatMessages);
      case 'PARSED_SENTENCE':
        return this.makeParsedSentence(chatMessages);
      case 'REPETITIVE_WORD':
        return this.makeRepetitiveWord(chatMessages);
      default:
        throw new Error('invalid transformType');
    }
  }

  private makeSynonym(
    messages: ChatMessage[],
  ): ClovaChatCompletionsRequestBody {
    return { ...SYNONYM_DETAILS, messages };
  }

  private makeLongDescription(
    messages: ChatMessage[],
  ): ClovaChatCompletionsRequestBody {
    return { ...LONG_DESCRIPTION_DETAILS, messages };
  }

  private makeShortDescription(
    messages: ChatMessage[],
  ): ClovaChatCompletionsRequestBody {
    return { ...SHORT_DESCRIPTION_DETAILS, messages };
  }

  private makeSubtitle(
    messages: ChatMessage[],
  ): ClovaChatCompletionsRequestBody {
    return { ...SUBTITLE_DETAILS, messages };
  }

  private makeDirectCommand(
    messages: ChatMessage[],
  ): ClovaChatCompletionsRequestBody {
    return { ...DIRECT_COMMAND_DETAILS, messages };
  }

  private makeFeedback(
    messages: ChatMessage[],
  ): ClovaChatCompletionsRequestBody {
    return { ...FEEDBACK_DETAILS, messages };
  }

  private makeParsedSentence(
    messages: ChatMessage[],
  ): ClovaChatCompletionsRequestBody {
    return { ...PARSED_SENTENCE_DETAILS, messages };
  }

  private makeRepetitiveWord(
    messages: ChatMessage[],
  ): ClovaChatCompletionsRequestBody {
    return { ...REPETITIVE_WORD_DETAILS, messages };
  }
}
