
import { Either } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { Session } from '../../entities/session'

export interface IGetLastSessionByRecipientIdRequest {
  recipientId: string
}

export type IGetLastSessionByRecipientIdResponse = Either<

  ResourceNotFoundError,
  {
    session: Session
  }
>

export abstract class GetLastSessionByRecipientIdContract {
  abstract execute({
    recipientId,
  }: IGetLastSessionByRecipientIdRequest): 
  Promise<IGetLastSessionByRecipientIdResponse> 
}
