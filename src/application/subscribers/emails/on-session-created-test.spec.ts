import { makeSession } from 'test/factories/sessions/make-session'
import { makeUser } from 'test/factories/users/make-user'
import { FakeEmailService } from 'test/fakes/services/emails/fake-send-email'
import { FakeEnvService } from 'test/fakes/services/env/fake-env-service'
import { InMemoryFailureLogsRepository } from 'test/repositories/in-memory-failure-logs-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { waitFor } from 'test/utils/wait.for'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DomainEvents } from '@/core/events/domain-events'
import { CreateEmailUseCase } from '@/domain/emails/use-cases/create-email-use-case'
import { SendEmailUseCase } from '@/domain/emails/use-cases/send-email-use-case'
import { CreateFailureLogUseCase } from '@/domain/failure-logs/use-cases/create-failure-log-use-case'
import { EmailAddress } from '@/shared/value-objects/email-address'

import { OnSessionCreated } from './on-session-created'

let fakeEmailService: FakeEmailService
let createEmailUseCase: CreateEmailUseCase
let sendEmailUseCase: SendEmailUseCase
let usersRepository: InMemoryUsersRepository
let fakeEnvService: FakeEnvService
let failureLogsRepository: InMemoryFailureLogsRepository
let createFailureLogUseCase: CreateFailureLogUseCase

let createSpy: any
let sendSpy: any

describe('OnSessionCreatedTests', () => {
  beforeEach(() => {
    fakeEmailService = new FakeEmailService()
    createEmailUseCase = new CreateEmailUseCase()
    sendEmailUseCase = new SendEmailUseCase(fakeEmailService)
    usersRepository = new InMemoryUsersRepository()
    fakeEnvService = new FakeEnvService()
    failureLogsRepository = new InMemoryFailureLogsRepository()
    createFailureLogUseCase = new CreateFailureLogUseCase(failureLogsRepository)

    createSpy = vi.spyOn(createEmailUseCase, 'execute')
    sendSpy = vi.spyOn(sendEmailUseCase, 'execute')

    new OnSessionCreated(
      usersRepository,
      createEmailUseCase,
      sendEmailUseCase,
      fakeEnvService,
      createFailureLogUseCase,
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
      emailAddress: EmailAddress.create('invalid-email').value as EmailAddress,
    })

    const session = await makeSession({ recipientId: user.id })

    await usersRepository.create(user)

    DomainEvents.dispatchEventsForAggregate(session.id)

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalled()
      expect(sendSpy).not.toHaveBeenCalled()
      expect(failureLogsRepository.items.length).toBe(1)
      expect(failureLogsRepository.items[0].context.value).toBe('OnSessionCreated')
    })
  })

  it('should log failure if user is not found', async () => {
    const session = await makeSession()

    DomainEvents.dispatchEventsForAggregate(session.id)

    await waitFor(() => {
      expect(failureLogsRepository.items.length).toBe(1)
      expect(failureLogsRepository.items[0].errorName.value).toBe('UserNotFoundError')
    })
  })
})
