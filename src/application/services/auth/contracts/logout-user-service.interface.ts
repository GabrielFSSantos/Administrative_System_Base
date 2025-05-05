
import { Either } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { SessionExpiredError } from '@/domain/sessions/use-cases/errors/session-expired-error'

export interface ILogoutUserServiceUseCaseRequest {
  recipientId: string
  accessToken: string
}

export type ILogoutUserServiceUseCaseResponse = Either<
  ResourceNotFoundError | SessionExpiredError | NotAllowedError,
  null
>

export interface ILogoutUserService {
  execute(input: ILogoutUserServiceUseCaseRequest): 
  Promise<ILogoutUserServiceUseCaseResponse> 
}
