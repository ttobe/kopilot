import { Feedback } from './feedback';

export type ClovaResponse = { result: string | string[] } | Feedback[];
