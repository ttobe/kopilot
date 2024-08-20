import { CommandValue } from './partial-modification';

export type TransformType =
  | CommandValue
  | 'PARSED_SENTENCE'
  | 'REPETITIVE_WORD'
  | 'FEEDBACK';
