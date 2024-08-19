import { RedisManager } from 'src/common/cache/redis/redis.manager';
import { Inject, Injectable } from '@nestjs/common';
import {
  ClovaChatCompletionsRequestHeadersForHCX003,
  ClovaChatCompletionsRequestHeadersForStream,
  SystemMessage,
} from '../constants';
import {
  ChatMessage,
  ChatRole,
  ClovaRequestHeader,
  ClovaResponse,
  CommandValue,
  Synonyms,
} from '../types';
import {
  ClovaRequestBodyTransformer,
  ClovaResponseBodyTransformer,
  axiosPost,
  fetchPost,
} from '../utils';

@Injectable()
export class PartialModificationService {
  private readonly baseApiUrl: string = process.env.CLOVASTUDIO_API_BASE_URL;
  private readonly chatCompletionsEndPoint: string =
    process.env.CHAT_COMPLETIONS_HCX003_ENDPOINT;

  private readonly chatCompletionsHeaders: ClovaRequestHeader =
    ClovaChatCompletionsRequestHeadersForHCX003;
  private readonly chatCompletionsHeadersForStream: ClovaRequestHeader =
    ClovaChatCompletionsRequestHeadersForStream;

  constructor(
    @Inject(RedisManager)
    private readonly redisManager: RedisManager,
    @Inject(ClovaRequestBodyTransformer)
    private readonly clovaRequestBodyTransformer,
    @Inject(ClovaResponseBodyTransformer)
    private readonly clovaResponseBodyTransformer,
  ) {}

  async getResult(
    input: string,
    command: CommandValue,
  ): Promise<ClovaResponse> {
    return await this.requestChatCompletions(input, command);
  }

  async getResultForStream(
    input: string,
    command: CommandValue,
    systemMessage: string | null,
  ): Promise<any> {
    return this.requestChatCompletionsForStream(input, command, systemMessage);
  }

  private async requestChatCompletions(
    input: string,
    command: CommandValue,
  ): Promise<ClovaResponse> {
    const cachedResult: Synonyms | undefined =
      await this.redisManager.get<Synonyms>(input);
    if (cachedResult) {
      this.redisManager.set<Synonyms>(input, cachedResult);
      return { result: cachedResult };
    }
    const chatMessages: ChatMessage[] = this.makeChatMessagesForDefault(
      input,
      command,
    );

    const { data }: any = await axiosPost(
      `${this.baseApiUrl}${this.chatCompletionsEndPoint}`,
      this.clovaRequestBodyTransformer.transformIntoChatCompletions(
        command,
        chatMessages,
      ),
      this.chatCompletionsHeaders,
    );

    const synonyms: Synonyms =
      this.clovaResponseBodyTransformer.transformIntoSynonymResult(data.result);
    if (synonyms.length) {
      this.redisManager.set(input, synonyms);
    }
    return { result: synonyms };
  }

  private async requestChatCompletionsForStream(
    input: string,
    command: CommandValue,
    systemMessage: string | null,
  ): Promise<any> {
    const chatMessages: ChatMessage[] = this.makeChatMessages(
      input,
      command,
      systemMessage,
    );

    return await fetchPost(
      `${this.baseApiUrl}${this.chatCompletionsEndPoint}`,
      this.clovaRequestBodyTransformer.transformIntoChatCompletions(
        command,
        chatMessages,
      ),
      this.chatCompletionsHeadersForStream,
    );
  }

  private makeChatMessages(
    input: string,
    command: CommandValue,
    systemMessage: string | null,
  ): ChatMessage[] {
    return command === 'DIRECT_COMMAND'
      ? this.makeChatMessagesForDirectCommand(input, systemMessage)
      : this.makeChatMessagesForDefault(input, command);
  }

  private makeChatMessagesForDefault(
    selectedText: string,
    selectedButton: string,
  ): ChatMessage[] {
    return [
      { role: ChatRole.USER, content: selectedText },
      { role: ChatRole.SYSTEM, content: SystemMessage[selectedButton] },
    ];
  }

  private makeChatMessagesForDirectCommand(
    selectedText: string,
    systemMessage: string,
  ): ChatMessage[] {
    return [
      { role: ChatRole.USER, content: selectedText },
      { role: ChatRole.SYSTEM, content: systemMessage },
    ];
  }
}
