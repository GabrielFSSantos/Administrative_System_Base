
import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { User } from '../../entities/user'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

export interface IEditUserUseCaseRequest {
  userId: string
  name?: string
  email?: string
  role?: string
  isActive?: boolean
}

export type IEditUserUseCaseResponse = Either<
  ResourceNotFoundError | UserAlreadyExistsError,
  {
    user: User
  }
>

export interface IEditUserUseCase {
  execute(input: IEditUserUseCaseRequest): Promise<IEditUserUseCaseResponse>
}
