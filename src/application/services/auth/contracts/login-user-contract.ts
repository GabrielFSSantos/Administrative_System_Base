
import { Either } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { SessionExpiredError } from '@/domain/sessions/use-cases/errors/session-expired-error'
import { WrongCredentialsError } from '@/domain/users/use-cases/errors/wrong-credentials-error'

export interface ILoginUserRequest {
  email: string
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
