import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { FailureLog } from '@/domain/failure-logs/entities/failure-log'
import { FailureLogsRepositoryContract } from '@/domain/failure-logs/repositories/contracts/failure-logs-repository-contract'

import { FailureContext } from '../entities/value-objects/failure-context'
import { FailureErrorMessage } from '../entities/value-objects/failure-error-message'
import { FailureErrorName } from '../entities/value-objects/failure-error-name'
import {
  CreateFailureLogContract,
  ICreateFailureLogUseCaseRequest,
  ICreateFailureLogUseCaseResponse,
} from './contracts/create-failure-log-contract'

@Injectable()
export class CreateFailureLogUseCase implements CreateFailureLogContract {
  constructor(private readonly failureLogsRepository: FailureLogsRepositoryContract) {}

  async execute({
    context,
    errorName,
    errorMessage,
    payload,
    stack,
  }: ICreateFailureLogUseCaseRequest): Promise<ICreateFailureLogUseCaseResponse> {
    const contextOrError = FailureContext.create(context)

    if (contextOrError.isLeft()) return left(contextOrError.value)

    const errorNameOrError = FailureErrorName.create(errorName)

    if (errorNameOrError.isLeft()) return left(errorNameOrError.value)

    const errorMessageOrError = FailureErrorMessage.create(errorMessage)

    if (errorMessageOrError.isLeft()) return left(errorMessageOrError.value)

    const failureLog = FailureLog.create({
      context: contextOrError.value,
      errorName: errorNameOrError.value,
      errorMessage: errorMessageOrError.value,
      payload,
      stack,
    })

    await this.failureLogsRepository.create(failureLog)

    return right({ 
      failureLog,
    })
  }
}
