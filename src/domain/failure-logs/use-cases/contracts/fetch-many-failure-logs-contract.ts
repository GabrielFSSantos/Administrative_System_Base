import { Either } from '@/core/either'
import { FailureLog } from '@/domain/failure-logs/entities/failure-log'
import { InvalidPaginationParamsError } from '@/shared/errors/invalid-pagination-params-error'

export interface IFetchManyFailureLogsUseCaseRequest {
  context?: string
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}

export type IFetchManyFailureLogsUseCaseResponse = Either<
  InvalidPaginationParamsError,
  {
    failureLog: FailureLog[]
    total: number
  }
>

export abstract class FetchManyFailureLogsContract {
  abstract execute(
    input: IFetchManyFailureLogsUseCaseRequest,
  ): Promise<IFetchManyFailureLogsUseCaseResponse>
}
