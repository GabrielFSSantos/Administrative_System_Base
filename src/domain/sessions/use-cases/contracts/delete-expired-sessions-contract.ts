import { Either } from '@/core/either'
import { UnexpectedError } from '@/shared/errors/unexpected-error'

export type IDeleteExpiredSessionsUseCaseResponse = Either<UnexpectedError, null>

export abstract class DeleteExpiredSessionsContract {
  abstract execute(): Promise<IDeleteExpiredSessionsUseCaseResponse>
}
