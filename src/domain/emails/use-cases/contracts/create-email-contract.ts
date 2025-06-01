import { Either } from '@/core/either'
import { Email } from '@/domain/emails/entities/email'
import { InvalidEmailAddressError } from '@/shared/value-objects/errors/invalid-email-address-error'

export interface ICreateEmailUseCaseRequest {
  to: string
  from: string
  subject: string
  title: string
  body: string
  actionLink?: string | null
}

export type ICreateEmailUseCaseResponse = Either<
  InvalidEmailAddressError,
  {
    email: Email
  }
>

export abstract class CreateEmailContract {
  abstract execute(
    request: ICreateEmailUseCaseRequest,
  ): Promise<ICreateEmailUseCaseResponse>
}
