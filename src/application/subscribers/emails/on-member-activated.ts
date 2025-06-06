import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { CompaniesRepositoryContract } from '@/domain/companies/repositories/contracts/companies-repository-contract'
import { CreateEmailUseCase } from '@/domain/emails/use-cases/create-email-use-case'
import { SendEmailUseCase } from '@/domain/emails/use-cases/send-email-use-case'
import { CreateFailureLogUseCase } from '@/domain/failure-logs/use-cases/create-failure-log-use-case'
import { MemberActivatedEvent } from '@/domain/members/events/member-activated-event'
import { UsersRepositoryContract } from '@/domain/users/repositories/contracts/users-repository-contract'
import { buildMemberActivatedEmail } from '@/i18n/emails/builders/build-member-activated-email'

@Injectable()
export class OnMemberActivated implements EventHandler {
  constructor(
    private readonly usersRepository: UsersRepositoryContract,
    private readonly companiesRepository: CompaniesRepositoryContract,
    private readonly createEmail: CreateEmailUseCase,
    private readonly sendEmail: SendEmailUseCase,
    private readonly createFailureLog: CreateFailureLogUseCase,
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
      await this.createFailureLog.execute({
        context: 'OnMemberActivated',
        errorName: 'UserNotFoundError',
        errorMessage: `User with ID ${member.recipientId.toString()} not found.`,
        payload: member,
      })

      return
    }

    const company = await this.companiesRepository.findById(member.ownerId.toString())

    if (!company) {
      await this.createFailureLog.execute({
        context: 'OnMemberActivated',
        errorName: 'CompanyNotFoundError',
        errorMessage: `Company with ID ${member.ownerId.toString()} not found.`,
        payload: member,
      })

      return
    }

    const emailContent = buildMemberActivatedEmail({
      name: user.name.toString(),
      companyName: company.name.toString(),
      date: ocurredAt.toLocaleString(company.locale.toString()),
      locale: company.locale.value,
    })

    const createEmailResult = await this.createEmail.execute({
      from: company.emailAddress.toString(),
      to: user.emailAddress.toString(),
      subject: emailContent.subject,
      title: emailContent.title,
      body: emailContent.body,
    })

    if (createEmailResult.isLeft()) {
      await this.createFailureLog.execute({
        context: 'OnMemberActivated',
        errorName: createEmailResult.value.name,
        errorMessage: createEmailResult.value.message,
        payload: member,
        stack: createEmailResult.value.stack,
      })

      return
    }

    const email = createEmailResult.value.email

    const sendEmailResult = await this.sendEmail.execute({ email })

    if (sendEmailResult.isLeft()) {
      await this.createFailureLog.execute({
        context: 'OnMemberActivated',
        errorName: sendEmailResult.value.name,
        errorMessage: sendEmailResult.value.message,
        payload: member,
        stack: sendEmailResult.value.stack,
      })
    }
  }
}
