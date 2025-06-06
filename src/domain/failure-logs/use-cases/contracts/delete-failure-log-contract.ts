import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

export interface IDeleteFailureLogUseCaseRequest {
  failureLogId: string
}

export type IDeleteFailureLogUseCaseResponse = Either<
  ResourceNotFoundError,
  null
>

export abstract class DeleteFailureLogContract {
  abstract execute(
    input: IDeleteFailureLogUseCaseRequest,
  ): Promise<IDeleteFailureLogUseCaseResponse>
}
