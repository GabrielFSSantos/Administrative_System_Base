import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { CreateEmailUseCase } from '@/domain/emails/use-cases/create-email-use-case'
import { SendEmailUseCase } from '@/domain/emails/use-cases/send-email-use-case'
import { UserPasswordChangedEvent } from '@/domain/users/events/user-password-changed-event'

@Injectable()
export class OnUserPasswordChanged implements EventHandler {
  constructor(
    private readonly createEmail: CreateEmailUseCase,
    private readonly sendEmail: SendEmailUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register<UserPasswordChangedEvent>(
      (event) => this.sendPasswordChangedEmail(event),
      UserPasswordChangedEvent.name,
    )
  }

  private async sendPasswordChangedEmail(
    {user, ocurredAt}: UserPasswordChangedEvent,
  ): Promise<void> {

    const createEmailResult = await this.createEmail.execute({
      to: user.emailAddress.value,
      subject: 'Sua senha foi alterada',
      title: 'Alteração de senha',
      body: `Olá ${user.name.value}, sua senha foi alterada em ${ocurredAt.toLocaleString()}. Se não foi você, entre em contato conosco imediatamente.`,
    })

    if (createEmailResult.isLeft()) {
      console.error(createEmailResult.value)

      return
    }

    const email = createEmailResult.value.email

    const sendEmailResult = await this.sendEmail.execute({ email })

    if (sendEmailResult.isLeft()) {
      console.error(sendEmailResult.value)
    }
  }
}
