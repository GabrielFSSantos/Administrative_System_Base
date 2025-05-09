import { Either } from '@/core/either'

import { SessionExpiredError } from '../errors/session-expired-error'

export interface ICreateSessionUseCaseRequest {
  recipientId: string,
  accessToken: string,
  expiresAt: Date,
}

export type ICreateSessionUseCaseResponse = Either<
  SessionExpiredError,
  null
>

export abstract class CreateSessionContract {
  abstract execute(input: ICreateSessionUseCaseRequest): 
  Promise<ICreateSessionUseCaseResponse>
}
