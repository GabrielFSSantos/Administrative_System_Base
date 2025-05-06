
import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { SamePasswordError } from '../errors/same-password-error'
import { WrongCredentialsError } from '../errors/wrong-credentials-error'

export interface IEditUserPasswordUseCaseRequest {
  userId: string
  password: string
  newPassword: string
}

export type IEditUserPasswordUseCaseResponse = Either<
  ResourceNotFoundError | WrongCredentialsError | SamePasswordError,
  null
>

export abstract class EditUserPasswordContract {
  abstract execute(input: IEditUserPasswordUseCaseRequest): 
  Promise<IEditUserPasswordUseCaseResponse> 
}
