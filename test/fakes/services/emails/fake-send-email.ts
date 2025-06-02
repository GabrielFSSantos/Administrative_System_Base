import { Either, left, right } from '@/core/either'
import { Email } from '@/domain/emails/entities/email'
import { EmailServiceContract } from '@/domain/emails/services/contracts/email-service-contract'
import { SendEmailError } from '@/domain/emails/use-cases/errors/send-email-error'

export class FakeEmailService implements EmailServiceContract {
  public sentEmails: Email[] = []
  public shouldFail = false

  async send(email: Email): Promise<Either<SendEmailError, null>> {
    if (this.shouldFail) {
      return left(new SendEmailError(email.to.toString(), 'Simulated failure'))
    }

    this.sentEmails.push(email)

    return right(null)
  }
}
