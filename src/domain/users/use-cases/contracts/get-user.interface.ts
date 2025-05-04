
import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { User } from '../../entities/user'

export interface IGetUserUseCaseRequest {
  userId: string
}

export type IGetUserUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: User
  }
>

export interface GetUserUseCase {
  execute(input: IGetUserUseCaseRequest): Promise<IGetUserUseCaseResponse> 
}
