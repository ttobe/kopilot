import {
  ClovaChatCompletionsStreamSignal,
  ClovaChatCompletionsStreamToken,
} from './clova-chat-completions';

export type ClovaStreamToken =
  | ClovaChatCompletionsStreamToken
  | ClovaChatCompletionsStreamSignal;
