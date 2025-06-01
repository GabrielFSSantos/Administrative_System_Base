import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { CreateEmailUseCase } from '@/domain/emails/use-cases/create-email-use-case'
import { SendEmailUseCase } from '@/domain/emails/use-cases/send-email-use-case'
import { SessionCreatedEvent } from '@/domain/sessions/events/create-session-event'
import { UsersRepositoryContract } from '@/domain/users/repositories/contracts/users-repository-contract'

@Injectable()
export class OnSessionCreated implements EventHandler {
  constructor(
    private readonly usersRepository: UsersRepositoryContract,
    private readonly createEmail: CreateEmailUseCase,
    private readonly sendEmail: SendEmailUseCase,
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

    const createEmailResult = await this.createEmail.execute({
      to: user.emailAddress.value,
      subject: 'Novo login detectado',
      title: 'Nova sessão iniciada',
      body: `Olá ${user.name.value}, uma nova sessão foi iniciada na sua conta em ${ocurredAt.toLocaleString()}. Se não foi você, recomendamos trocar sua senha imediatamente.`,
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
