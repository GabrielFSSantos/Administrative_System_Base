import { Either } from '@/core/either'
import { NotAllowedError } from '@/shared/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { Session } from '../../entities/session'
import { SessionExpiredError } from '../errors/session-expired-error'

export interface IValidateSessionUseCaseRequest {
  accessToken: string
  recipientId: string
}

export type IValidateSessionUseCaseResponse = Either<
  ResourceNotFoundError | SessionExpiredError | NotAllowedError,
  {
    session: Session
  }
>

export abstract class ValidateSessionContract {
  abstract execute(input: IValidateSessionUseCaseRequest): 
  Promise<IValidateSessionUseCaseResponse>
}
