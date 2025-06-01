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

    const owner = await this.companiesRepository.findById(member.ownerId.toString())

    if (!owner) {
      console.error(`Owner with ID ${member.ownerId.toString()} not found.`)

      return
    }

    const createEmailResult = await this.createEmail.execute({
      from: owner.emailAddress.toString(),
      to: user.emailAddress.toString(),
      subject: 'Você foi ativado como membro de uma empresa',
      title: 'Acesso liberado',
      body: `Olá ${user.name.toString()}, seu acesso como membro da empresa ${owner.name.toString()} foi ativado em ${ocurredAt.toLocaleString()}. Você já pode acessar o sistema normalmente.`,
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
