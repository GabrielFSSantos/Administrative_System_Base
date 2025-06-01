import { makeCompany } from 'test/factories/companies/make-company'
import { FakeEmailService } from 'test/fakes/emails/fake-send-email'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { waitFor } from 'test/utils/wait.for'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DomainEvents } from '@/core/events/domain-events'
import { CreateEmailUseCase } from '@/domain/emails/use-cases/create-email-use-case'
import { SendEmailUseCase } from '@/domain/emails/use-cases/send-email-use-case'

import { OnCompanyActivated } from './on-company-activated'

let fakeEmailService: FakeEmailService
let createEmailUseCase: CreateEmailUseCase
let sendEmailUseCase: SendEmailUseCase
let companiesRepository: InMemoryCompaniesRepository
let createSpy: any
let sendSpy: any

describe('OnCompanyActivatedTests', () => {
  beforeEach(() => {
    fakeEmailService = new FakeEmailService()
    createEmailUseCase = new CreateEmailUseCase()
    sendEmailUseCase = new SendEmailUseCase(fakeEmailService)

    companiesRepository = new InMemoryCompaniesRepository()

    createSpy = vi.spyOn(createEmailUseCase, 'execute')
    sendSpy = vi.spyOn(sendEmailUseCase, 'execute')

    new OnCompanyActivated(
      createEmailUseCase,
      sendEmailUseCase,
    )
  })

  it('should create and send email when company is activated', async () => {
    const company = await makeCompany()

    await companiesRepository.create(company)

    company.activate()
    DomainEvents.dispatchEventsForAggregate(company.id)

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalled()
      expect(sendSpy).toHaveBeenCalled()
    })
  })

  it('should not send email if email creation fails', async () => {
    const company = await makeCompany({
      emailAddress: {
        value: 'invalid-email',
      } as any,
    })

    await companiesRepository.create(company)

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    company.activate()
    DomainEvents.dispatchEventsForAggregate(company.id)

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalled()
      expect(sendSpy).not.toHaveBeenCalled()
      expect(errorSpy).toHaveBeenCalled()
    })

    errorSpy.mockRestore()
  })
})
