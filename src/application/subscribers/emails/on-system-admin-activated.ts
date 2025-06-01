import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { CreateEmailUseCase } from '@/domain/emails/use-cases/create-email-use-case'
import { SendEmailUseCase } from '@/domain/emails/use-cases/send-email-use-case'
import { SystemAdminActivatedEvent } from '@/domain/system-admins/events/system-admin-activated-event'
import { UsersRepositoryContract } from '@/domain/users/repositories/contracts/users-repository-contract'

@Injectable()
export class OnSystemAdminActivated implements EventHandler {
  constructor(
    private readonly usersRepository: UsersRepositoryContract,
    private readonly createEmail: CreateEmailUseCase,
    private readonly sendEmail: SendEmailUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register<SystemAdminActivatedEvent>(
      (event) => this.sendSystemAdminActivatedEmail(event),
      SystemAdminActivatedEvent.name,
    )
  }

  private async sendSystemAdminActivatedEmail(
    { systemAdmin, ocurredAt }: SystemAdminActivatedEvent,
  ): Promise<void> {
    const user = await this.usersRepository.findById(systemAdmin.recipientId.toString())

    if (!user) {
      console.error(`User with ID ${systemAdmin.recipientId.toString()} not found.`)

      return
    }

    const createEmailResult = await this.createEmail.execute({
      to: user.emailAddress.value,
      subject: 'Você foi ativado como administrador do sistema',
      title: 'Acesso liberado',
      body: `Olá ${user.name.value}, seu acesso como administrador do sistema foi ativado em ${ocurredAt.toLocaleString()}. Você já pode acessar todas as funcionalidades administrativas disponíveis.`,
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
