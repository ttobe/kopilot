import { spellCheckByDAUM } from 'hanspell';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SpellService {
  async check(sentence: string): Promise<SpellCheckResult[]> {
    try {
      const chunks = this.splitText(sentence.replace(/<br>/g, '\n'), 1000);
      let results: SpellCheckResult[] = [];

      for (const chunk of chunks) {
        let retryCount = 0;
        const maxRetries = 3;
        let success = false;

        while (!success && retryCount < maxRetries) {
          try {
            const result = await this.spellCheckAndReturn(chunk, 6000);
            results = results.concat(result as SpellCheckResult[]);
            success = true;
          } catch (error) {
            retryCount++;
            if (retryCount >= maxRetries) {
              // TODO: 적절한 로그 출력 또는 오류 처리 로직 추가
              console.error(`Failed after ${maxRetries} attempts:`, error);
            } else {
              console.warn(`Retrying... Attempt ${retryCount}`);
              await this.delay(1000); // 잠시 대기 후 재시도
            }
          }
        }
      }

      return results;
    } catch (error) {
      console.error('Error during spell check:', error); // TODO: 로그 출력으로 변경하기
      return [];
    }
  }

  // 딜레이 함수
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // 텍스트를 최대 청크 크기로 나누는 함수
  private splitText(text: string, maxChunkSize: number): string[] {
    const sentences = text.split(/(?<=[.?!])/g); // 문장 부호를 기준으로 나눔
    const chunks: string[] = [];
    let currentChunk = '';

    sentences.forEach((sentence) => {
      if ((currentChunk + sentence).length > maxChunkSize) {
        chunks.push(currentChunk);
        currentChunk = sentence;
      } else {
        currentChunk += sentence;
      }
    });

    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }

    return chunks;
  }

  // return으로 API 수정하기
  async spellCheckAndReturn(sentence: string, timeout: number) {
    return new Promise((resolve, reject) => {
      spellCheckByDAUM(
        sentence,
        timeout,
        (result) => resolve(result), // 성공 시 결과를 resolve
        () => {}, // 처리 완료 시 아무 작업 없음
        (error) => reject(error), // 에러 발생 시 reject
      );
    });
  }
}
