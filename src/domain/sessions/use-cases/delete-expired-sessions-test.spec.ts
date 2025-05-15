import { makeSession } from 'test/factories/make-session'
import { InMemorySessionsRepository } from 'test/repositories/in-memory-sessions-repository'

import { DeleteExpiredSessionsContract } from '@/domain/sessions/use-cases/contracts/delete-expired-sessions-contract'
import { DeleteExpiredSessionsUseCase } from '@/domain/sessions/use-cases/delete-expired-sessions-use-case'

let inMemorySessionsRepository: InMemorySessionsRepository
let sut: DeleteExpiredSessionsContract

describe('DeleteExpiredSessionsUseCase', () => {
  beforeEach(() => {
    inMemorySessionsRepository = new InMemorySessionsRepository()
    sut = new DeleteExpiredSessionsUseCase(inMemorySessionsRepository)
  })

  it('should delete only expired sessions', async () => {
    const now = Date.now()

    const expired1 = makeSession({
      createdAt: new Date(now - 90 * 60 * 1000), // 90 min atrás
      expiresAt: new Date(now - 60 * 60 * 1000), // 60 min atrás
    })

    const expired2 = makeSession({
      createdAt: new Date(now - 20 * 60 * 1000), // 20 min atrás
      expiresAt: new Date(now - 5 * 60 * 1000), // 5 min atrás
    })

    const valid1 = makeSession({
      createdAt: new Date(now - 5 * 60 * 1000),
      expiresAt: new Date(now + 60 * 60 * 1000),
    })

    await inMemorySessionsRepository.create(expired1)
    await inMemorySessionsRepository.create(expired2)
    await inMemorySessionsRepository.create(valid1)

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(inMemorySessionsRepository.items).toHaveLength(1)
    expect(inMemorySessionsRepository.items[0].id.equals(valid1.id)).toBe(true)
  })

  it('should not delete any sessions if none are expired', async () => {
    const now = Date.now()

    const valid = makeSession({
      createdAt: new Date(now - 5 * 60 * 1000),
      expiresAt: new Date(now + 30 * 60 * 1000),
    })

    await inMemorySessionsRepository.create(valid)

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(inMemorySessionsRepository.items).toHaveLength(1)
    expect(inMemorySessionsRepository.items[0].id.equals(valid.id)).toBe(true)
  })

  it('should delete all sessions if all are expired', async () => {
    const now = Date.now()

    const expired1 = makeSession({
      createdAt: new Date(now - 60 * 60 * 1000),
      expiresAt: new Date(now - 30 * 60 * 1000),
    })

    const expired2 = makeSession({
      createdAt: new Date(now - 120 * 60 * 1000),
      expiresAt: new Date(now - 60 * 60 * 1000),
    })

    await inMemorySessionsRepository.create(expired1)
    await inMemorySessionsRepository.create(expired2)

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(inMemorySessionsRepository.items).toHaveLength(0)
  })

  it('should return right(null) even if no sessions exist', async () => {
    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(result.value).toBeNull()
    expect(inMemorySessionsRepository.items).toHaveLength(0)
  })
})
