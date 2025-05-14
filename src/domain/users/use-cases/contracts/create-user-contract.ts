
import { Either } from '@/core/either'

import { User } from '../../entities/user'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

export interface ICreateUserUseCaseRequest {
  cpf: string
  name: string
  emailAddress: string
  password: string
}

export type ICreateUserUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User
  }
>

export abstract class CreateUserContract {
  abstract execute(input: ICreateUserUseCaseRequest): Promise<ICreateUserUseCaseResponse> 
}
