import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { InvalidPaginationParamsError } from '@/shared/errors/invalid-pagination-params-error'

import { FailureLogsRepositoryContract } from '../repositories/contracts/failure-logs-repository-contract'
import {
  FetchManyFailureLogsContract,
  IFetchManyFailureLogsUseCaseRequest,
  IFetchManyFailureLogsUseCaseResponse,
} from './contracts/fetch-many-failure-logs-contract'

@Injectable()
export class FetchManyFailureLogsUseCase implements FetchManyFailureLogsContract {
  constructor(
    private readonly failureLogsRepository: FailureLogsRepositoryContract,
  ) {}

  async execute({
    context,
    startDate,
    endDate,
    limit = 10,
    offset = 0,
  }: IFetchManyFailureLogsUseCaseRequest): Promise<IFetchManyFailureLogsUseCaseResponse> {
    if (limit < 1 || offset < 0) {
      return left(new InvalidPaginationParamsError())
    }

    const { failureLog, total } = await this.failureLogsRepository.findMany({
      context,
      startDate,
      endDate,
      limit,
      offset,
    })

    return right({
      failureLog,
      total,
    })
  }
}
