import { Injectable } from '@nestjs/common'

import { right } from '@/core/either'

import { SessionsRepositoryContract } from '../repositories/contracts/sessions-repository-contract'
import {
  FetchManySessionsContract,
  IFetchManySessionsUseCaseRequest,
  IFetchManySessionsUseCaseResponse,
} from './contracts/fetch-many-sessions-contract'

@Injectable()
export class FetchManySessionsUseCase implements FetchManySessionsContract {
  constructor(
    private readonly sessionsRepository: SessionsRepositoryContract,
  ) {}

  async execute({
    page,
    pageSize,
    recipientId,
    onlyValid,
  }: IFetchManySessionsUseCaseRequest): Promise<IFetchManySessionsUseCaseResponse> {
    const sessions = await this.sessionsRepository.findMany({
      page,
      pageSize,
      recipientId,
      onlyValid,
    })

    return right({
      sessions,
    })
  }
}
