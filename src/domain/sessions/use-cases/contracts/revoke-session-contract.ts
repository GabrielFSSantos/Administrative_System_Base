
import { Either } from '@/core/either'
import { NotAllowedError } from '@/shared/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { SessionExpiredError } from '../errors/session-expired-error'

export interface IRevokeSessionUseCaseRequest {
  recipientId: string
  accessToken: string
}

export type IRevokeSessionUseCaseResponse = Either<
  ResourceNotFoundError | SessionExpiredError | NotAllowedError,
  null
>

export abstract class RevokeSessionContract {
  abstract execute(input: IRevokeSessionUseCaseRequest): 
  Promise<IRevokeSessionUseCaseResponse> 
}
