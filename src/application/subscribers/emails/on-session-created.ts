import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { CreateEmailUseCase } from '@/domain/emails/use-cases/create-email-use-case'
import { SendEmailUseCase } from '@/domain/emails/use-cases/send-email-use-case'
import { SessionCreatedEvent } from '@/domain/sessions/events/create-session-event'
import { UsersRepositoryContract } from '@/domain/users/repositories/contracts/users-repository-contract'
import { buildSessionCreatedEmail } from '@/i18n/emails/builders/build-session-created-email'

import { EnvServiceContract } from './services/contracts/env-service-contract'

@Injectable()
export class OnSessionCreated implements EventHandler {
  constructor(
    private readonly usersRepository: UsersRepositoryContract,
    private readonly createEmail: CreateEmailUseCase,
    private readonly sendEmail: SendEmailUseCase,
    private readonly envService: EnvServiceContract,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register<SessionCreatedEvent>(
      (event) => this.sendSessionCreatedEmail(event),
      SessionCreatedEvent.name,
    )
  }

  private async sendSessionCreatedEmail(
    { session, ocurredAt }: SessionCreatedEvent,
  ): Promise<void> {
    const user = await this.usersRepository.findById(session.recipientId.toString())

    if (!user) {
      console.error(`User with ID ${session.recipientId.toString()} not found.`)

      return
    }

    const from = this.envService.get('DEFAULT_SYSTEM_EMAIL_FROM')

    const emailContent = buildSessionCreatedEmail({
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
