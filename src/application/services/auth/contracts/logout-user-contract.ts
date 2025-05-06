
import { Either } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { SessionExpiredError } from '@/domain/sessions/use-cases/errors/session-expired-error'

export interface ILogoutUserRequest {
  recipientId: string
  accessToken: string
}

export type ILogoutUserResponse = Either<
  ResourceNotFoundError | SessionExpiredError | NotAllowedError,
  null
>

export abstract class LogoutUserContract {
  abstract execute(input: ILogoutUserRequest): 
  Promise<ILogoutUserResponse> 
}
