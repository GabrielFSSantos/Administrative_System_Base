import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { CreateEmailUseCase } from '@/domain/emails/use-cases/create-email-use-case'
import { SendEmailUseCase } from '@/domain/emails/use-cases/send-email-use-case'
import { CreateFailureLogUseCase } from '@/domain/failure-logs/use-cases/create-failure-log-use-case'
import { SystemAdminActivatedEvent } from '@/domain/system-admins/events/system-admin-activated-event'
import { UsersRepositoryContract } from '@/domain/users/repositories/contracts/users-repository-contract'
import { buildSystemAdminActivatedEmail } from '@/i18n/emails/builders/build-system-admin-activated-email'

import { EnvServiceContract } from './services/contracts/env-service-contract'

@Injectable()
export class OnSystemAdminActivated implements EventHandler {
  constructor(
    private readonly usersRepository: UsersRepositoryContract,
    private readonly createEmail: CreateEmailUseCase,
    private readonly sendEmail: SendEmailUseCase,
    private readonly envService: EnvServiceContract,
    private readonly createFailureLog: CreateFailureLogUseCase,
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
      await this.createFailureLog.execute({
        context: 'OnSystemAdminActivated',
        errorName: 'UserNotFoundError',
        errorMessage: `User with ID ${systemAdmin.recipientId.toString()} not found.`,
      })

      return
    }

    const from = this.envService.get('DEFAULT_SYSTEM_EMAIL_FROM')

    const emailContent = buildSystemAdminActivatedEmail({
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
      await this.createFailureLog.execute({
        context: 'OnSystemAdminActivated',
        errorName: createEmailResult.value.name,
        errorMessage: createEmailResult.value.message,
        stack: createEmailResult.value.stack,
      })

      return
    }

    const sendEmailResult = await this.sendEmail.execute({
      email: createEmailResult.value.email,
    })

    if (sendEmailResult.isLeft()) {
      await this.createFailureLog.execute({
        context: 'OnSystemAdminActivated',
        errorName: sendEmailResult.value.name,
        errorMessage: sendEmailResult.value.message,
        stack: sendEmailResult.value.stack,
      })
    }
  }
}
