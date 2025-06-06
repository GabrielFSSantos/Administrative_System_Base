import { Either } from '@/core/either'
import { FailureLog } from '@/domain/failure-logs/entities/failure-log'

import { InvalidFailureLogDataError } from '../errors/invalid-failure-log-data-error'

export interface ICreateFailureLogUseCaseRequest {
  context: string
  errorName: string
  errorMessage: string
  payload?: unknown
  stack?: string
}

export type ICreateFailureLogUseCaseResponse = Either<
  InvalidFailureLogDataError,
  {
    failureLog: FailureLog
  }
>

export abstract class CreateFailureLogContract {
  abstract execute(
    input: ICreateFailureLogUseCaseRequest,
  ): Promise<ICreateFailureLogUseCaseResponse>
}
