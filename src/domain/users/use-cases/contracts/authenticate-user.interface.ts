import { Either } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

import { WrongCredentialsError } from '../errors/wrong-credentials-error'

export interface IAuthenticateUserUseCaseRequest {
  email: string,
  password: string,
}

export type IAuthenticateUserUseCaseResponse = Either<
  WrongCredentialsError | NotAllowedError,
  {
    userId: string
    accessToken: string
    expiresAt: Date
  }
>

export interface IAuthenticateUserUseCase {
  execute(
    input: IAuthenticateUserUseCaseRequest,
  ): Promise<IAuthenticateUserUseCaseResponse>
}
