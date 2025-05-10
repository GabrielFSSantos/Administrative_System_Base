import { Either } from '@/core/either'

import { Session } from '../../entities/session'
import { SessionExpiredError } from '../errors/session-expired-error'

export interface ICreateSessionUseCaseRequest {
  recipientId: string,
  accessToken: string,
  expiresAt: Date,
}

export type ICreateSessionUseCaseResponse = Either<
  SessionExpiredError,
  {
    session: Session
  }
>

export abstract class CreateSessionContract {
  abstract execute(input: ICreateSessionUseCaseRequest): 
  Promise<ICreateSessionUseCaseResponse>
}
