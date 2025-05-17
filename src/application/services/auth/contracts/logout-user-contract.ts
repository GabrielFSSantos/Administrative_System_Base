
import { Either } from '@/core/either'
import { SessionExpiredError } from '@/domain/sessions/use-cases/errors/session-expired-error'
import { NotAllowedError } from '@/shared/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

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
