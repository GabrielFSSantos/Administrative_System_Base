import { Either } from '@/core/either'
import { FailureLog } from '@/domain/failure-logs/entities/failure-log'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

export interface IFindFailureLogByIdUseCaseRequest {
  failureLogId: string
}

export type IFindFailureLogByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    failureLog: FailureLog
  }
>

export abstract class FindFailureLogByIdContract {
  abstract execute(
    input: IFindFailureLogByIdUseCaseRequest,
  ): Promise<IFindFailureLogByIdUseCaseResponse>
}
