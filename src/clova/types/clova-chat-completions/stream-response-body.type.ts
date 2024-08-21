import { ClovaStopReason } from '../clova-common';
import { ChatMessage } from './chat-message.type';

// https://api.ncloud-docs.com/docs/clovastudio-chatcompletions
export type ClovaChatCompletionsStreamToken = {
  id?: string;

  message?: ChatMessage;

  stopReason?: ClovaStopReason;

  inputLength?: number;
};

export type ClovaChatCompletionsStreamResult = {
  message?: ChatMessage;

  stopReason?: ClovaStopReason;

  inputLength?: number;
  outputLength?: number;

  aiFilter?: any[];
};

export type ClovaChatCompletionsStreamSignal = {
  data?: string;
};
