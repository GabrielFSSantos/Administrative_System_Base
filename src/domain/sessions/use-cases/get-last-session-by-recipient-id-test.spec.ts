import { makeSession } from 'test/factories/make-session'
import { InMemorySessionsRepository } from 'test/repositories/in-memory-sessions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { GetLastSessionByRecipientIdUseCase } from '@/domain/sessions/use-cases/get-last-session-by-recipient-id-use-case'

import { GetLastSessionByRecipientIdContract } from './contracts/get-last-session-by-recipient-id-contract'

describe('Get Last Session By RecipientId Test', () => {
  let inMemorySessionsRepository: InMemorySessionsRepository
  let sut: GetLastSessionByRecipientIdContract

  beforeEach(() => {
    inMemorySessionsRepository = new InMemorySessionsRepository()
    sut = new GetLastSessionByRecipientIdUseCase(inMemorySessionsRepository)
  })

  it('should return the last session for a given recipientId', async () => {
    const recipientId = new UniqueEntityId('user-123')

    const olderSession = makeSession({
      recipientId,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia atrás
    })

    const newerSession = makeSession({
      recipientId,
      createdAt: new Date(), // agora
    })

    await inMemorySessionsRepository.create(olderSession)
    await inMemorySessionsRepository.create(newerSession)

    const result = await sut.execute({ recipientId: recipientId.toString() })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.session.id.toString()).toBe(newerSession.id.toString())
    }
  })

  it('should return ResourceNotFoundError if no session exists for recipientId', async () => {
    const result = await sut.execute({
      recipientId: new UniqueEntityId().toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
