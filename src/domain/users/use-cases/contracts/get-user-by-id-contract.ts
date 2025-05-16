
import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { User } from '../../entities/user'

export interface IGetUserByIdUseCaseRequest {
  userId: string
}

export type IGetUserByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: User
  }
>

export abstract class GetUserByIdContract {
  abstract execute(input: IGetUserByIdUseCaseRequest): 
  Promise<IGetUserByIdUseCaseResponse> 
}
