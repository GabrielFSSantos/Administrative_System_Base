import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { CompaniesRepositoryContract } from '@/domain/companies/repositories/contracts/companies-repository-contract'
import { CreateEmailUseCase } from '@/domain/emails/use-cases/create-email-use-case'
import { SendEmailUseCase } from '@/domain/emails/use-cases/send-email-use-case'
import { MemberActivatedEvent } from '@/domain/members/events/member-activated-event'
import { UsersRepositoryContract } from '@/domain/users/repositories/contracts/users-repository-contract'

@Injectable()
export class OnMemberActivated implements EventHandler {
  constructor(
    private readonly usersRepository: UsersRepositoryContract,
    private readonly companiesRepository: CompaniesRepositoryContract,
    private readonly createEmail: CreateEmailUseCase,
    private readonly sendEmail: SendEmailUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register<MemberActivatedEvent>(
      (event) => this.sendMemberActivatedEmail(event),
      MemberActivatedEvent.name,
    )
  }

  private async sendMemberActivatedEmail(
    { member, ocurredAt }: MemberActivatedEvent,
  ): Promise<void> {
    const user = await this.usersRepository.findById(member.recipientId.toString())

    if (!user) {
      console.error(`User with ID ${member.recipientId.toString()} not found.`)

      return
    }

    const company = await this.companiesRepository.findById(member.companyId.toString())

    if (!company) {
      console.error(`Company with ID ${member.companyId.toString()} not found.`)

      return
    }

    const createEmailResult = await this.createEmail.execute({
      to: user.emailAddress.value,
      subject: 'Você foi ativado como membro de uma empresa',
      title: 'Acesso liberado',
      body: `Olá ${user.name.value}, seu acesso como membro da empresa ${company.name.value} foi ativado em ${ocurredAt.toLocaleString()}. Você já pode acessar o sistema normalmente.`,
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
