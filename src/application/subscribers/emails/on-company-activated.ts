import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { CompanyActivatedEvent } from '@/domain/companies/events/company-activated-event'
import { CreateEmailUseCase } from '@/domain/emails/use-cases/create-email-use-case'
import { SendEmailUseCase } from '@/domain/emails/use-cases/send-email-use-case'

@Injectable()
export class OnCompanyActivated implements EventHandler {
  constructor(
    private readonly createEmail: CreateEmailUseCase,
    private readonly sendEmail: SendEmailUseCase,
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
    {company, ocurredAt}: CompanyActivatedEvent,
  ): Promise<void> {

    const createEmailResult = await this.createEmail.execute({
      to: company.emailAddress.value,
      subject: 'Sua empresa foi ativada',
      title: 'Parabéns!',
      body: `Olá ${company.name.value}, sua empresa foi ativada com sucesso em ${ocurredAt.toLocaleString()}. Agora você já pode acessar o sistema com todas as funcionalidades liberadas.`,
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
