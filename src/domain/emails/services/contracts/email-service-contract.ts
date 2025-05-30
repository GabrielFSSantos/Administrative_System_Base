import { Either } from '@/core/either'
import { Email } from '@/domain/emails/entities/email'
import { SendEmailError } from '@/domain/emails/use-cases/errors/send-email-error'

export abstract class EmailServiceContract {
  abstract send(email: Email): Promise<Either<SendEmailError, null>>
}
