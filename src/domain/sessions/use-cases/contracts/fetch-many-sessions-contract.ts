import { Either } from '@/core/either'
import { Session } from '@/domain/sessions/entities/session'
import { InvalidPaginationParamsError } from '@/shared/errors/invalid-pagination-params-error'

export interface IFetchManySessionsUseCaseRequest {
  page: number
  pageSize: number
  recipientId?: string
  onlyValid?: boolean
}

export type IFetchManySessionsUseCaseResponse = Either<
  InvalidPaginationParamsError,
  {
    sessions: Session[]
    pagination: {
      page: number
      pageSize: number
      total: number
    },
  }
>

export abstract class FetchManySessionsContract {
  abstract execute(
    input: IFetchManySessionsUseCaseRequest
  ): Promise<IFetchManySessionsUseCaseResponse>
}
