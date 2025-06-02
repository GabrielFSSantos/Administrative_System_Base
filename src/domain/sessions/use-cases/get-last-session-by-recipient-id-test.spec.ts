import { makeSession } from 'test/factories/sessions/make-session'
import { InMemorySessionsRepository } from 'test/repositories/in-memory-sessions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { GetLastSessionByRecipientIdUseCase } from '@/domain/sessions/use-cases/get-last-session-by-recipient-id-use-case'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { GetLastSessionByRecipientIdContract } from './contracts/get-last-session-by-recipient-id-contract'

describe('GetLastSessionByRecipientIdTest', () => {
  let inMemorySessionsRepository: InMemorySessionsRepository
  let sut: GetLastSessionByRecipientIdContract

  beforeEach(() => {
    inMemorySessionsRepository = new InMemorySessionsRepository()
    sut = new GetLastSessionByRecipientIdUseCase(inMemorySessionsRepository)
  })

  it('should return the most recent session for a valid recipientId', async () => {
    const recipientId = UniqueEntityId.create('recipient-01')

    const olderSession = makeSession({
      recipientId,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5h atrás
    })

    const recentSession = makeSession({
      recipientId,
      createdAt: new Date(), // agora
    })

    await inMemorySessionsRepository.create(olderSession)
    await inMemorySessionsRepository.create(recentSession)

    const result = await sut.execute({
      recipientId: recipientId.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.session.id.toString()).toBe(recentSession.id.toString())
    }
  })

  it('should return ResourceNotFoundError if no session is found for recipientId', async () => {
    const result = await sut.execute({
      recipientId: UniqueEntityId.create('non-existent-id').toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should ignore sessions from different recipientId', async () => {
    const sessionA = makeSession({
      recipientId: UniqueEntityId.create('user-A'),
    })

    const sessionB = makeSession({
      recipientId: UniqueEntityId.create('user-B'),
    })

    await inMemorySessionsRepository.create(sessionA)
    await inMemorySessionsRepository.create(sessionB)

    const result = await sut.execute({
      recipientId: 'user-C', // não existe
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
