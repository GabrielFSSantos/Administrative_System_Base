
import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

export interface IDeleteUserUseCaseRequest {
  userId: string
}

export type IDeleteUserUseCaseResponse = Either<
  ResourceNotFoundError,
  null
>

export abstract class DeleteUserContract {
  abstract execute(input: IDeleteUserUseCaseRequest): Promise<IDeleteUserUseCaseResponse> 
}
