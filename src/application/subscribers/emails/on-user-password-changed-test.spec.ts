import { makeUser } from 'test/factories/users/make-user'
import { generatePasswordHashValueObject } from 'test/factories/users/value-objects/make-password-hash'
import { FakeEmailService } from 'test/fakes/services/emails/fake-send-email'
import { FakeEnvService } from 'test/fakes/services/env/fake-env-service'
import { InMemoryFailureLogsRepository } from 'test/repositories/in-memory-failure-logs-repository'
import { waitFor } from 'test/utils/wait.for'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DomainEvents } from '@/core/events/domain-events'
import { CreateEmailUseCase } from '@/domain/emails/use-cases/create-email-use-case'
import { SendEmailUseCase } from '@/domain/emails/use-cases/send-email-use-case'
import { CreateFailureLogUseCase } from '@/domain/failure-logs/use-cases/create-failure-log-use-case'

import { OnUserPasswordChanged } from './on-user-password-changed'

let fakeEmailService: FakeEmailService
let createEmailUseCase: CreateEmailUseCase
let sendEmailUseCase: SendEmailUseCase
let fakeEnvService: FakeEnvService
let failureLogsRepository: InMemoryFailureLogsRepository
let createFailureLogUseCase: CreateFailureLogUseCase

let createSpy: any
let sendSpy: any
let failureLogSpy: any

describe('OnUserPasswordChangedTests', () => {
  beforeEach(() => {
    fakeEmailService = new FakeEmailService()
    createEmailUseCase = new CreateEmailUseCase()
    sendEmailUseCase = new SendEmailUseCase(fakeEmailService)
    fakeEnvService = new FakeEnvService()
    failureLogsRepository = new InMemoryFailureLogsRepository()
    createFailureLogUseCase = new CreateFailureLogUseCase(failureLogsRepository)

    createSpy = vi.spyOn(createEmailUseCase, 'execute')
    sendSpy = vi.spyOn(sendEmailUseCase, 'execute')
    failureLogSpy = vi.spyOn(createFailureLogUseCase, 'execute')

    new OnUserPasswordChanged(
      createEmailUseCase,
      sendEmailUseCase,
      fakeEnvService,
      createFailureLogUseCase,
    )
  })

  it('should create and send email when user password is changed', async () => {
    const user = await makeUser()
    const newPasswordHash = await generatePasswordHashValueObject()

    user.changePasswordHash(newPasswordHash)

    DomainEvents.dispatchEventsForAggregate(user.id)

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalled()
      expect(sendSpy).toHaveBeenCalled()
    })
  })

  it('should create failure log if email creation fails', async () => {
    const user = await makeUser({
      emailAddress: {
        value: 'invalid-email',
      } as any,
    })

    const newPasswordHash = await generatePasswordHashValueObject()

    user.changePasswordHash(newPasswordHash)

    DomainEvents.dispatchEventsForAggregate(user.id)

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalled()
      expect(sendSpy).not.toHaveBeenCalled()
      expect(failureLogSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          context: 'on-user-password-changed',
          errorName: expect.any(String),
          errorMessage: expect.any(String),
          payload: expect.objectContaining({
            userId: user.id.toString(),
            email: user.emailAddress.toString(),
          }),
        }),
      )
    })
  })
})
