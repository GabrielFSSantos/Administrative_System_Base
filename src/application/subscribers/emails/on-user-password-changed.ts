import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { CreateEmailUseCase } from '@/domain/emails/use-cases/create-email-use-case'
import { SendEmailUseCase } from '@/domain/emails/use-cases/send-email-use-case'
import { UserPasswordChangedEvent } from '@/domain/users/events/user-password-changed-event'
import { buildUserPasswordChangedEmail } from '@/i18n/emails/builders/build-user-password-changed-email'

import { EnvServiceContract } from './services/contracts/env-service-contract'

@Injectable()
export class OnUserPasswordChanged implements EventHandler {
  constructor(
    private readonly createEmail: CreateEmailUseCase,
    private readonly sendEmail: SendEmailUseCase,
    private readonly envService: EnvServiceContract,
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
    { user, ocurredAt }: UserPasswordChangedEvent,
  ): Promise<void> {
    const from = this.envService.get('DEFAULT_SYSTEM_EMAIL_FROM')

    const emailContent = buildUserPasswordChangedEmail({
      name: user.name.toString(),
      date: ocurredAt.toLocaleString(user.locale?.toString() ?? 'pt-BR'),
      locale: user.locale?.value,
    })

    const createEmailResult = await this.createEmail.execute({
      from,
      to: user.emailAddress.toString(),
      subject: emailContent.subject,
      title: emailContent.title,
      body: emailContent.body,
    })

    if (createEmailResult.isLeft()) {
      console.error(createEmailResult.value)

      return
    }

    const sendEmailResult = await this.sendEmail.execute({
      email: createEmailResult.value.email,
    })

    if (sendEmailResult.isLeft()) {
      console.error(sendEmailResult.value)
    }
  }
}
