import { Either } from '@/core/either'

export type IDeleteExpiredSessionsUseCaseResponse = Either<null, null>

export abstract class DeleteExpiredSessionsContract {
  abstract execute(): Promise<IDeleteExpiredSessionsUseCaseResponse>
}
