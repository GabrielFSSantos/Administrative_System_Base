import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { InvalidPaginationParamsError } from '@/shared/errors/invalid-pagination-params-error'

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
    if (page < 1 || pageSize < 1) {
      return left(new InvalidPaginationParamsError())
    }

    const {sessions, total} = await this.sessionsRepository.findMany({
      page,
      pageSize,
      recipientId,
      onlyValid,
    })

    return right({
      sessions,
      pagination: {
        page,
        pageSize,
        total,
      },
    })
  }
}
