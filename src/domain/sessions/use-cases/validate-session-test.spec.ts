import { makeSession } from 'test/factories/make-session'
import { InMemorySessionsRepository } from 'test/repositories/in-memory-sessions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { GetLastSessionByRecipientIdUseCase } from '@/domain/sessions/use-cases/get-last-session-by-recipient-id-use-case'

let inMemorySessionsRepository: InMemorySessionsRepository
let sut: GetLastSessionByRecipientIdUseCase

describe('Get Last Session By RecipientId Test', () => {
  beforeEach(() => {
    inMemorySessionsRepository = new InMemorySessionsRepository()
    sut = new GetLastSessionByRecipientIdUseCase(inMemorySessionsRepository)
  })

  it('should return the most recent session for a recipient', async () => {
    const recipientId = new UniqueEntityId('recipient-01')

    const olderSession = makeSession({
      recipientId,
      createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    })

    const recentSession = makeSession({
      recipientId,
      createdAt: new Date(),
    })

    await inMemorySessionsRepository.create(olderSession)
    await inMemorySessionsRepository.create(recentSession)

    const result = await sut.execute({ recipientId: recipientId.toString() })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.session.id.toString()).toBe(recentSession.id.toString())
    }
  })

  it('should return ResourceNotFoundError if no session is found for recipient', async () => {
    const result = await sut.execute({ recipientId: 'non-existent-recipient' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
