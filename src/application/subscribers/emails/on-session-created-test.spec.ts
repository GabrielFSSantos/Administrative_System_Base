import { makeSession } from 'test/factories/sessions/make-session'
import { makeUser } from 'test/factories/users/make-user'
import { FakeEmailService } from 'test/fakes/services/emails/fake-send-email'
import { FakeEnvService } from 'test/fakes/services/env/fake-env-service'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { waitFor } from 'test/utils/wait.for'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DomainEvents } from '@/core/events/domain-events'
import { CreateEmailUseCase } from '@/domain/emails/use-cases/create-email-use-case'
import { SendEmailUseCase } from '@/domain/emails/use-cases/send-email-use-case'

import { OnSessionCreated } from './on-session-created'

let fakeEmailService: FakeEmailService
let createEmailUseCase: CreateEmailUseCase
let sendEmailUseCase: SendEmailUseCase
let usersRepository: InMemoryUsersRepository
let fakeEnvService: FakeEnvService
let createSpy: any
let sendSpy: any

describe('OnSessionCreatedTests', () => {
  beforeEach(() => {
    fakeEmailService = new FakeEmailService()
    createEmailUseCase = new CreateEmailUseCase()
    sendEmailUseCase = new SendEmailUseCase(fakeEmailService)
    usersRepository = new InMemoryUsersRepository()
    fakeEnvService = new FakeEnvService()

    createSpy = vi.spyOn(createEmailUseCase, 'execute')
    sendSpy = vi.spyOn(sendEmailUseCase, 'execute')

    new OnSessionCreated(
      usersRepository,
      createEmailUseCase,
      sendEmailUseCase,
      fakeEnvService,
    )
  })

  it('should create and send email when session is created', async () => {
    const user = await makeUser()
    const session = await makeSession({ recipientId: user.id })

    await usersRepository.create(user)

    DomainEvents.dispatchEventsForAggregate(session.id)

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

    const session = await makeSession({ recipientId: user.id })

    await usersRepository.create(user)

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    DomainEvents.dispatchEventsForAggregate(session.id)

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalled()
      expect(sendSpy).not.toHaveBeenCalled()
      expect(errorSpy).toHaveBeenCalled()
    })

    errorSpy.mockRestore()
  })
})
