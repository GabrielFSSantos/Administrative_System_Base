
import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { User } from '../../entities/user'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

export interface IEditUserUseCaseRequest {
  userId: string
  name?: string
  emailAddress?: string
}

export type IEditUserUseCaseResponse = Either<
  ResourceNotFoundError | UserAlreadyExistsError,
  {
    user: User
  }
>

export abstract class EditUserContract {
  abstract execute(input: IEditUserUseCaseRequest): Promise<IEditUserUseCaseResponse>
}
