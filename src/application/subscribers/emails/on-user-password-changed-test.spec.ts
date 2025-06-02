import { makeUser } from 'test/factories/users/make-user'
import { generatePasswordHashValueObject } from 'test/factories/users/value-objects/make-password-hash'
import { FakeEmailService } from 'test/fakes/services/emails/fake-send-email'
import { FakeEnvService } from 'test/fakes/services/env/fake-env-service'
import { waitFor } from 'test/utils/wait.for'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DomainEvents } from '@/core/events/domain-events'
import { CreateEmailUseCase } from '@/domain/emails/use-cases/create-email-use-case'
import { SendEmailUseCase } from '@/domain/emails/use-cases/send-email-use-case'

import { OnUserPasswordChanged } from './on-user-password-changed'

let fakeEmailService: FakeEmailService
let createEmailUseCase: CreateEmailUseCase
let sendEmailUseCase: SendEmailUseCase
let fakeEnvService: FakeEnvService
let createSpy: any
let sendSpy: any

describe('OnUserPasswordChangedTests', () => {
  beforeEach(() => {
    fakeEmailService = new FakeEmailService()
    createEmailUseCase = new CreateEmailUseCase()
    sendEmailUseCase = new SendEmailUseCase(fakeEmailService)
    fakeEnvService = new FakeEnvService()

    createSpy = vi.spyOn(createEmailUseCase, 'execute')
    sendSpy = vi.spyOn(sendEmailUseCase, 'execute')

    new OnUserPasswordChanged(createEmailUseCase, sendEmailUseCase, fakeEnvService)
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

  it('should not send email if email creation fails', async () => {
    const user = await makeUser({
      emailAddress: {
        value: 'invalid-email',
      } as any,
    })
    const newPasswordHash = await generatePasswordHashValueObject()

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    user.changePasswordHash(newPasswordHash)

    DomainEvents.dispatchEventsForAggregate(user.id)

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalled()
      expect(sendSpy).not.toHaveBeenCalled()
      expect(errorSpy).toHaveBeenCalled()
    })

    errorSpy.mockRestore()
  })
})
