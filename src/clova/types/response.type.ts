import { Feedback } from './feedback';
import { ParsedSentence } from './parsed-sentence';
import { PartialModification } from './partial-modification';
import { RepetitiveWord } from './repetitive-word';

export type ClovaResponse =
  | Feedback[]
  | PartialModification
  | ParsedSentence
  | RepetitiveWord;
