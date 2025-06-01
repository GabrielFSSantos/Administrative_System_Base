import { makeCompany } from 'test/factories/companies/make-company'
import { makeMember } from 'test/factories/members/make-member'
import { makeUser } from 'test/factories/users/make-user'
import { FakeEmailService } from 'test/fakes/emails/fake-send-email'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryMembersRepository } from 'test/repositories/in-memory-members-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { waitFor } from 'test/utils/wait.for'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DomainEvents } from '@/core/events/domain-events'
import { CreateEmailUseCase } from '@/domain/emails/use-cases/create-email-use-case'
import { SendEmailUseCase } from '@/domain/emails/use-cases/send-email-use-case'

import { OnMemberActivated } from './on-member-activated'

let fakeEmailService: FakeEmailService
let createEmailUseCase: CreateEmailUseCase
let sendEmailUseCase: SendEmailUseCase
let usersRepository: InMemoryUsersRepository
let membersRepository: InMemoryMembersRepository
let companiesRepository: InMemoryCompaniesRepository
let createSpy: any
let sendSpy: any

describe('OnMemberActivatedTests', () => {
  beforeEach(() => {
    fakeEmailService = new FakeEmailService()
    createEmailUseCase = new CreateEmailUseCase()
    sendEmailUseCase = new SendEmailUseCase(fakeEmailService)

    usersRepository = new InMemoryUsersRepository()
    membersRepository = new InMemoryMembersRepository()
    companiesRepository = new InMemoryCompaniesRepository()

    createSpy = vi.spyOn(createEmailUseCase, 'execute')
    sendSpy = vi.spyOn(sendEmailUseCase, 'execute')

    new OnMemberActivated(
      usersRepository,
      companiesRepository,
      createEmailUseCase,
      sendEmailUseCase,
    )
  })

  it('should create and send email when member is activated', async () => {
    const user = await makeUser()
    const company = await makeCompany()
    const member = await makeMember({
      recipientId: user.id,
      companyId: company.id,
    })

    await usersRepository.create(user)
    await companiesRepository.create(company)
    await membersRepository.create(member)

    member.activate()
    DomainEvents.dispatchEventsForAggregate(member.id)

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalled()
      expect(sendSpy).toHaveBeenCalled()
    })
  })

  it('should not send email if email creation fails', async () => {
    const user = await makeUser({
      emailAddress: {
        value: 'invalid-email',
      } as any,
    })
    const company = await makeCompany()
    const member = await makeMember({
      recipientId: user.id,
      companyId: company.id,
    })

    await usersRepository.create(user)
    await companiesRepository.create(company)
    await membersRepository.create(member)

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    member.activate()
    DomainEvents.dispatchEventsForAggregate(member.id)

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalled()
      expect(sendSpy).not.toHaveBeenCalled()
      expect(errorSpy).toHaveBeenCalled()
    })

    errorSpy.mockRestore()
  })
})
