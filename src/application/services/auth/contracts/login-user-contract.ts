
import { Either } from '@/core/either'
import { SessionExpiredError } from '@/domain/sessions/use-cases/errors/session-expired-error'
import { WrongCredentialsError } from '@/domain/users/use-cases/errors/wrong-credentials-error'
import { NotAllowedError } from '@/shared/errors/not-allowed-error'

export interface ILoginUserRequest {
  emailAddress: string
  password: string
}

export type ILoginUserResponse = Either<
  WrongCredentialsError | NotAllowedError | SessionExpiredError,
  {
    accessToken: string
  }
>

export abstract class LoginUserContract  {
  abstract execute(input: ILoginUserRequest): Promise<ILoginUserResponse> 
}
