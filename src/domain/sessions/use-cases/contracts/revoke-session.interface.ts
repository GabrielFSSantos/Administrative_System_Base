
import { Either } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { SessionExpiredError } from '../errors/session-expired-error'

export interface IRevokeSessionUseCaseRequest {
  recipientId: string
  accessToken: string
}

export type IRevokeSessionUseCaseResponse = Either<
  ResourceNotFoundError | SessionExpiredError | NotAllowedError,
  null
>

export interface IRevokeSessionUseCase {
  execute(input: IRevokeSessionUseCaseRequest): Promise<IRevokeSessionUseCaseResponse> 
}
