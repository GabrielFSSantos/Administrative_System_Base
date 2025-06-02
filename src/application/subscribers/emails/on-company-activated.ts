import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { CompanyActivatedEvent } from '@/domain/companies/events/company-activated-event'
import { CreateEmailUseCase } from '@/domain/emails/use-cases/create-email-use-case'
import { SendEmailUseCase } from '@/domain/emails/use-cases/send-email-use-case'
import { buildCompanyActivatedEmail } from '@/i18n/emails/builders/build-company-activated-email'

import { EnvServiceContract } from './services/contracts/env-service-contract'

@Injectable()
export class OnCompanyActivated implements EventHandler {
  constructor(
    private readonly createEmail: CreateEmailUseCase,
    private readonly sendEmail: SendEmailUseCase,
    private readonly envService: EnvServiceContract,
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
