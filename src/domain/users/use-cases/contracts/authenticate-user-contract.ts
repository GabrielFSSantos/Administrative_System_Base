import { Either } from '@/core/either'
import { NotAllowedError } from '@/shared/errors/not-allowed-error'

import { WrongCredentialsError } from '../errors/wrong-credentials-error'

export interface IAuthenticateUserUseCaseRequest {
  emailAddress: string,
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

export abstract class AuthenticateUserContract {
  abstract execute(
    input: IAuthenticateUserUseCaseRequest,
  ): Promise<IAuthenticateUserUseCaseResponse>
}
