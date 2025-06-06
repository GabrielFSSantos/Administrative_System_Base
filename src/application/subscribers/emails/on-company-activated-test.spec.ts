import { makeCompany } from 'test/factories/companies/make-company'
import { generateLocaleValueObject } from 'test/factories/value-objects/make-locale'
import { FakeEmailService } from 'test/fakes/services/emails/fake-send-email'
import { FakeEnvService } from 'test/fakes/services/env/fake-env-service'
import { waitFor } from 'test/utils/wait.for'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DomainEvents } from '@/core/events/domain-events'
import { CreateEmailUseCase } from '@/domain/emails/use-cases/create-email-use-case'
import { SendEmailUseCase } from '@/domain/emails/use-cases/send-email-use-case'
import { CreateFailureLogUseCase } from '@/domain/failure-logs/use-cases/create-failure-log-use-case'
import { SupportedLocale } from '@/shared/value-objects/locale/locale.enum'

import { OnCompanyActivated } from './on-company-activated'

let fakeEmailService: FakeEmailService
let createEmailUseCase: CreateEmailUseCase
let sendEmailUseCase: SendEmailUseCase
let fakeEnvService: FakeEnvService
let fakeFailureLogUseCase: CreateFailureLogUseCase
let createSpy: any
let sendSpy: any
let failureSpy: any

describe('OnCompanyActivatedTests', () => {
  beforeEach(() => {
    fakeEmailService = new FakeEmailService()
    createEmailUseCase = new CreateEmailUseCase()
    sendEmailUseCase = new SendEmailUseCase(fakeEmailService)
    fakeEnvService = new FakeEnvService()
    fakeFailureLogUseCase = {
      execute: vi.fn().mockResolvedValue(undefined),
    } as any

    createSpy = vi.spyOn(createEmailUseCase, 'execute')
    sendSpy = vi.spyOn(sendEmailUseCase, 'execute')
    failureSpy = vi.spyOn(fakeFailureLogUseCase, 'execute')

    new OnCompanyActivated(
      createEmailUseCase,
      sendEmailUseCase,
      fakeEnvService,
      fakeFailureLogUseCase,
    )
  })

  it('should create and send email when company is activated', async () => {
    const company = await makeCompany()

    company.activate()
    DomainEvents.dispatchEventsForAggregate(company.id)

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalled()
      expect(sendSpy).toHaveBeenCalled()
      expect(failureSpy).not.toHaveBeenCalled()
    })
  })

  it('should log failure when email creation fails', async () => {
    const company = await makeCompany({
      emailAddress: {
        value: 'invalid-email',
      } as any,
    })

    company.activate()
    DomainEvents.dispatchEventsForAggregate(company.id)

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalled()
      expect(sendSpy).not.toHaveBeenCalled()
      expect(failureSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          context: 'OnCompanyActivated',
          errorName: expect.any(String),
          errorMessage: expect.any(String),
          payload: expect.objectContaining({
            companyId: company.id.toString(),
          }),
        }),
      )
    })
  })

  it('should log failure when send email fails', async () => {
    const company = await makeCompany()

    // força erro no envio
    fakeEmailService.shouldFail = true

    company.activate()
    DomainEvents.dispatchEventsForAggregate(company.id)

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalled()
      expect(sendSpy).toHaveBeenCalled()
      expect(failureSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          context: 'OnCompanyActivated',
          errorName: expect.any(String),
          errorMessage: expect.any(String),
          payload: expect.objectContaining({
            emailId: expect.any(String),
            companyId: company.id.toString(),
          }),
        }),
      )
    })
  })

  it('should create email in English when company locale is en-US', async () => {
    const company = await makeCompany({
      locale: generateLocaleValueObject(SupportedLocale.EN_US),
    })

    company.activate()
    DomainEvents.dispatchEventsForAggregate(company.id)

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'Your company has been activated',
        }),
      )
    })
  })
})
