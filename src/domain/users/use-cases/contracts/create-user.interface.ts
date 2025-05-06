
import { Either } from '@/core/either'

import { User } from '../../entities/user'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

export interface ICreateUserUseCaseRequest {
  name: string
  email: string
  password: string
  roleId: string
}

export type ICreateUserUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User
  }
>

export interface ICreateUserUseCase {
  execute(input: ICreateUserUseCaseRequest): Promise<ICreateUserUseCaseResponse> 
}
