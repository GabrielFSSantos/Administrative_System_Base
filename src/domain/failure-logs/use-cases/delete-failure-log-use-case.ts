import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { FailureLogsRepositoryContract } from '@/domain/failure-logs/repositories/contracts/failure-logs-repository-contract'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import {
  DeleteFailureLogContract,
  IDeleteFailureLogUseCaseRequest,
  IDeleteFailureLogUseCaseResponse,
} from './contracts/delete-failure-log-contract'

@Injectable()
export class DeleteFailureLogUseCase implements DeleteFailureLogContract {
  constructor(private readonly failureLogsRepository: FailureLogsRepositoryContract) {}

  async execute({
    failureLogId,
  }: IDeleteFailureLogUseCaseRequest): Promise<IDeleteFailureLogUseCaseResponse> {
    const exists = await this.failureLogsRepository.findById(failureLogId)

    if (!exists) {
      return left(new ResourceNotFoundError())
    }

    await this.failureLogsRepository.delete(failureLogId)

    return right(null)
  }
}
