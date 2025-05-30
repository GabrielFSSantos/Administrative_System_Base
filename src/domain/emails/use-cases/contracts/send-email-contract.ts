import { Either } from '@/core/either'
import { Email } from '@/domain/emails/entities/email'

import { SendEmailError } from '../errors/send-email-error'

export interface ISendEmailUseCaseRequest {
  email: Email
}

export type ISendEmailUseCaseResponse = Either<
  SendEmailError,
  {
    email: Email
  }
>

export abstract class SendEmailContract {
  abstract execute(
    request: ISendEmailUseCaseRequest,
  ): Promise<ISendEmailUseCaseResponse>
}