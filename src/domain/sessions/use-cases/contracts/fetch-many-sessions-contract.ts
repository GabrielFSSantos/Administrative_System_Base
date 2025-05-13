import { Either } from '@/core/either'
import { Session } from '@/domain/sessions/entities/session'

export interface IFetchManySessionsUseCaseRequest {
  page: number
  pageSize: number
  recipientId?: string
  onlyValid?: boolean
}

export type IFetchManySessionsUseCaseResponse = Either<
  null,
  {
    sessions: Session[]
  }
>

export abstract class FetchManySessionsContract {
  abstract execute(
    input: IFetchManySessionsUseCaseRequest
  ): Promise<IFetchManySessionsUseCaseResponse>
}
