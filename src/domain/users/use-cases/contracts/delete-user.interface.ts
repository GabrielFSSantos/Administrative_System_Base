
import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

export interface IDeleteUserUseCaseRequest {
  userId: string
}

export type IDeleteUserUseCaseResponse = Either<
  ResourceNotFoundError,
  null
>

export interface IDeleteUserUseCase {
  execute(input: IDeleteUserUseCaseRequest): Promise<IDeleteUserUseCaseResponse> 
}
