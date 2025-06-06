import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { CompanyActivatedEvent } from '@/domain/companies/events/company-activated-event'
import { CreateEmailUseCase } from '@/domain/emails/use-cases/create-email-use-case'
import { SendEmailUseCase } from '@/domain/emails/use-cases/send-email-use-case'
import { CreateFailureLogUseCase } from '@/domain/failure-logs/use-cases/create-failure-log-use-case'
import { buildCompanyActivatedEmail } from '@/i18n/emails/builders/build-company-activated-email'

import { EnvServiceContract } from './services/contracts/env-service-contract'

@Injectable()
export class OnCompanyActivated implements EventHandler {
  constructor(
    private readonly createEmail: CreateEmailUseCase,
    private readonly sendEmail: SendEmailUseCase,
    private readonly envService: EnvServiceContract,
    private readonly createFailureLog: CreateFailureLogUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register<CompanyActivatedEvent>(
      (event) => this.sendCompanyActivatedEmail(event),
      CompanyActivatedEvent.name,
    )
  }

  private async sendCompanyActivatedEmail(
    { company, ocurredAt }: CompanyActivatedEvent,
  ): Promise<void> {
    const from = this.envService.get('DEFAULT_SYSTEM_EMAIL_FROM')

    const emailContent = buildCompanyActivatedEmail({
      name: company.name.toString(),
      date: ocurredAt.toLocaleString(company.locale.toString()),
      locale: company.locale.value,
    })

    const createEmailResult = await this.createEmail.execute({
      from,
      to: company.emailAddress.toString(),
      subject: emailContent.subject,
      title: emailContent.title,
      body: emailContent.body,
    })

    if (createEmailResult.isLeft()) {
      await this.createFailureLog.execute({
        context: 'OnCompanyActivated',
        errorName: createEmailResult.value.name,
        errorMessage: createEmailResult.value.message,
        stack: createEmailResult.value.stack,
        payload: {
          companyId: company.id.toString(),
          from,
          to: company.emailAddress.toString(),
          subject: emailContent.subject,
        },
      })

      return
    }

    const email = createEmailResult.value.email

    const sendEmailResult = await this.sendEmail.execute({ email })

    if (sendEmailResult.isLeft()) {
      await this.createFailureLog.execute({
        context: 'OnCompanyActivated',
        errorName: sendEmailResult.value.name,
        errorMessage: sendEmailResult.value.message,
        stack: sendEmailResult.value.stack,
        payload: {
          companyId: company.id.toString(),
          emailId: email.id.toString(),
        },
      })
    }
  }
}
