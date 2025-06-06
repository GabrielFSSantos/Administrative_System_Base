import { makeSystemAdmin } from 'test/factories/system-admins/make-system-admin'
import { makeUser } from 'test/factories/users/make-user'
import { FakeEmailService } from 'test/fakes/services/emails/fake-send-email'
import { FakeEnvService } from 'test/fakes/services/env/fake-env-service'
import { InMemoryFailureLogsRepository } from 'test/repositories/in-memory-failure-logs-repository'
import { InMemorySystemAdminsRepository } from 'test/repositories/in-memory-system-admins-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { waitFor } from 'test/utils/wait.for'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DomainEvents } from '@/core/events/domain-events'
import { CreateEmailUseCase } from '@/domain/emails/use-cases/create-email-use-case'
import { SendEmailUseCase } from '@/domain/emails/use-cases/send-email-use-case'
import { CreateFailureLogUseCase } from '@/domain/failure-logs/use-cases/create-failure-log-use-case'

import { OnSystemAdminActivated } from './on-system-admin-activated'

let fakeEmailService: FakeEmailService
let createEmailUseCase: CreateEmailUseCase
let sendEmailUseCase: SendEmailUseCase
let usersRepository: InMemoryUsersRepository
let systemAdminsRepository: InMemorySystemAdminsRepository
let failureLogsRepository: InMemoryFailureLogsRepository
let createFailureLogUseCase: CreateFailureLogUseCase
let fakeEnvService: FakeEnvService
let createSpy: any
let sendSpy: any

describe('OnSystemAdminActivatedTests', () => {
  beforeEach(() => {
    fakeEmailService = new FakeEmailService()
    createEmailUseCase = new CreateEmailUseCase()
    sendEmailUseCase = new SendEmailUseCase(fakeEmailService)

    usersRepository = new InMemoryUsersRepository()
    systemAdminsRepository = new InMemorySystemAdminsRepository()
    failureLogsRepository = new InMemoryFailureLogsRepository()
    createFailureLogUseCase = new CreateFailureLogUseCase(failureLogsRepository)
    fakeEnvService = new FakeEnvService()

    createSpy = vi.spyOn(createEmailUseCase, 'execute')
    sendSpy = vi.spyOn(sendEmailUseCase, 'execute')

    new OnSystemAdminActivated(
      usersRepository,
      createEmailUseCase,
      sendEmailUseCase,
      fakeEnvService,
      createFailureLogUseCase,
    )
  })

  it('should create and send email when system admin is activated', async () => {
    const user = await makeUser()
    const systemAdmin = await makeSystemAdmin({ recipientId: user.id })

    await usersRepository.create(user)
    await systemAdminsRepository.create(systemAdmin)

    systemAdmin.activate()
    DomainEvents.dispatchEventsForAggregate(systemAdmin.id)

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalled()
      expect(sendSpy).toHaveBeenCalled()
    })
  })

  it('should create failure log if user is not found', async () => {
    const systemAdmin = await makeSystemAdmin()

    systemAdmin.activate()
    DomainEvents.dispatchEventsForAggregate(systemAdmin.id)

    await waitFor(() => {
      expect(failureLogsRepository.items).toHaveLength(1)
      expect(failureLogsRepository.items[0].context.toString()).toBe('OnSystemAdminActivated')
      expect(failureLogsRepository.items[0].errorName.toString()).toBe('UserNotFoundError')
    })
  })

  it('should create failure log if email creation fails', async () => {
    const user = await makeUser({
      emailAddress: {
        value: 'invalid-email',
      } as any,
    })
    const systemAdmin = await makeSystemAdmin({ recipientId: user.id })

    await usersRepository.create(user)
    await systemAdminsRepository.create(systemAdmin)

    systemAdmin.activate()
    DomainEvents.dispatchEventsForAggregate(systemAdmin.id)

    await waitFor(() => {
      expect(failureLogsRepository.items).toHaveLength(1)
      expect(failureLogsRepository.items[0].context.toString()).toBe('OnSystemAdminActivated')
      expect(failureLogsRepository.items[0].errorName.toString()).toBeDefined()
    })
  })
})
