import { makeSession } from 'test/factories/make-session'
import { InMemorySessionsRepository } from 'test/repositories/in-memory-sessions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FetchManySessionsContract } from '@/domain/sessions/use-cases/contracts/fetch-many-sessions-contract'
import { FetchManySessionsUseCase } from '@/domain/sessions/use-cases/fetch-many-sessions-use-case'

describe('Fetch Many Sessions Test', () => {
  let inMemorySessionsRepository: InMemorySessionsRepository
  let sut: FetchManySessionsContract

  beforeEach(() => {
    inMemorySessionsRepository = new InMemorySessionsRepository()
    sut = new FetchManySessionsUseCase(inMemorySessionsRepository)
  })

  it('should fetch sessions with pagination', async () => {
    for (let i = 0; i < 10; i++) {
      await inMemorySessionsRepository.create(makeSession())
    }

    const result = await sut.execute({ page: 1, pageSize: 5 })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.sessions).toHaveLength(5)
    }
  })

  it('should filter sessions by recipientId', async () => {
    const userAId = new UniqueEntityId('user-a')
    const userBId = new UniqueEntityId('user-b')

    await inMemorySessionsRepository.create(makeSession({ recipientId: userAId }))
    await inMemorySessionsRepository.create(makeSession({ recipientId: userBId }))

    const result = await sut.execute({
      page: 1,
      pageSize: 10,
      recipientId: 'user-a',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.sessions).toHaveLength(1)
      expect(result.value.sessions[0].recipientId.toString()).toBe('user-a')
    }
  })

  it('should return only valid sessions when filtered with onlyValid flag', async () => {
    const validSession = makeSession({
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1h ahead
    })

    const expiredSession = makeSession({
      expiresAt: new Date(Date.now() - 60 * 60 * 1000), // 1h ago
    })

    await inMemorySessionsRepository.create(validSession)
    await inMemorySessionsRepository.create(expiredSession)

    const result = await sut.execute({
      page: 1,
      pageSize: 10,
      onlyValid: true,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.sessions).toHaveLength(1)
      expect(result.value.sessions[0].isValid()).toBe(true)
    }
  })
})
