import {
  CommandLabel,
  CommandPosition,
  CommandSpec,
  CommandValue,
} from '../types';

export enum SystemMessage {
  LONG_DESCRIPTION = '문장을 20자 정도 더 길게 작성해줘. 어조와 문체는 유지해줘',
  SHORT_DESCRIPTION = '문장을 간결하게 바꿔줘. 어조와 문체는 유지해줘',
  SYNONYM = `
  한국어 유의어를 5개 이하로 말해줘.
  결과는 시스템 메시지 없이 유의어 목록을 대괄호로 감싼 배열만 반환해줘.
  유의어가 없다면 빈 배열을 보내줘.
  유사도가 높은 순서로 정렬해줘.`,
  SUBTITLE = `
  내용에 적합한 소제목을 작성해줘.
  소제목은 "결과를 이끌어낸 행위 + 결과 및 성과"의 형태로 작성해줘.
  독자의 시선을 사로잡을 수 있도록 매력적인 표현을 사용해줘.
  소제목은 한 문장으로 구성하고, 35자가 넘지 않도록 해줘. 소제목만 보내줘.
  예시는 다음과 같아. "끊임없는 도전의 결실, 오류를 해결하고 무중단 배포에 성공하다"
  `,
}

export const Command: Record<CommandValue, CommandSpec> = {
  LONG_DESCRIPTION: {
    label: '길게 풀어서 작성',
    position: 'DEFAULT',
    length: 20,
    stream: true,
  },
  SHORT_DESCRIPTION: {
    label: '간결하게 작성',
    position: 'DEFAULT',
    length: 40,
    stream: true,
  },
  SUBTITLE: {
    label: '소제목 작성',
    position: 'BEFORE',
    length: 200,
    stream: true,
  },
  SYNONYM: {
    label: '유의어 대체',
    position: 'DEFAULT',
    length: 1,
    stream: false,
  },
  DIRECT_COMMAND: {
    label: 'AI에게 직접 명령',
    position: 'DEFAULT',
    length: 0,
    stream: true,
  },
};

interface ModificationOption {
  value: CommandValue;
  label: CommandLabel;
  position: CommandPosition;
  length: number;
  stream: boolean;
}

export const MODIFICATION_OPTIONS: ModificationOption[] = Object.entries(
  Command,
).map(([key, { label, position, length, stream }]) => ({
  value: key as CommandValue,
  label,
  position,
  length,
  stream,
}));
