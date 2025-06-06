import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { FailureLogsRepositoryContract } from '@/domain/failure-logs/repositories/contracts/failure-logs-repository-contract'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import {
  FindFailureLogByIdContract,
  IFindFailureLogByIdUseCaseRequest,
  IFindFailureLogByIdUseCaseResponse,
} from './contracts/find-failure-log-by-id-contract'

@Injectable()
export class FindFailureLogByIdUseCase implements FindFailureLogByIdContract {
  constructor(private readonly failureLogsRepository: FailureLogsRepositoryContract) {}

  async execute({
    failureLogId,
  }: IFindFailureLogByIdUseCaseRequest): Promise<IFindFailureLogByIdUseCaseResponse> {
    const failureLog = await this.failureLogsRepository.findById(failureLogId)

    if (!failureLog) {
      return left(new ResourceNotFoundError())
    }

    return right({ failureLog })
  }
}
