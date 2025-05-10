import { makeSession } from 'test/factories/make-session'
import { InMemorySessionsRepository } from 'test/repositories/in-memory-sessions-repository'

import { DeleteExpiredSessionsUseCase } from '@/domain/sessions/use-cases/delete-expired-sessions-use-case'

import { DeleteExpiredSessionsContract } from './contracts/delete-expired-sessions-contract'

describe('Delete Expired Sessions Test', () => {
  let inMemorySessionsRepository: InMemorySessionsRepository
  let sut: DeleteExpiredSessionsContract

  beforeEach(() => {
    inMemorySessionsRepository = new InMemorySessionsRepository()
    sut = new DeleteExpiredSessionsUseCase(inMemorySessionsRepository)
  })

  it('should delete only expired sessions', async () => {
    const now = new Date()

    const expired1 = makeSession({
      createdAt: new Date(now.getTime() - 70 * 60 * 1000), // 70min atrás
      expiresAt: new Date(now.getTime() - 60 * 60 * 1000), // 60min atrás
    })

    const expired2 = makeSession({
      createdAt: new Date(now.getTime() - 10 * 60 * 1000), // 10min atrás
      expiresAt: new Date(now.getTime() - 5 * 60 * 1000),  // 5min atrás
    })

    const valid = makeSession({
      createdAt: new Date(now.getTime() - 5 * 60 * 1000), // 5min atrás
      expiresAt: new Date(now.getTime() + 60 * 60 * 1000), // 1h no futuro
    })

    await inMemorySessionsRepository.create(expired1)
    await inMemorySessionsRepository.create(expired2)
    await inMemorySessionsRepository.create(valid)

    await sut.execute()

    expect(inMemorySessionsRepository.items).toHaveLength(1)
    expect(inMemorySessionsRepository.items[0].id.toString()).toBe(valid.id.toString())
  })

  it('should not delete sessions if none are expired', async () => {
    const now = new Date()

    const session = makeSession({
      createdAt: new Date(now.getTime() - 5 * 60 * 1000),
      expiresAt: new Date(now.getTime() + 60 * 60 * 1000),
    })

    await inMemorySessionsRepository.create(session)

    await sut.execute()

    expect(inMemorySessionsRepository.items).toHaveLength(1)
  })

  it('should remove all sessions if all are expired', async () => {
    const now = new Date()

    const expired1 = makeSession({
      createdAt: new Date(now.getTime() - 20 * 60 * 1000),
      expiresAt: new Date(now.getTime() - 10 * 60 * 1000),
    })

    const expired2 = makeSession({
      createdAt: new Date(now.getTime() - 30 * 60 * 1000),
      expiresAt: new Date(now.getTime() - 15 * 60 * 1000),
    })

    await inMemorySessionsRepository.create(expired1)
    await inMemorySessionsRepository.create(expired2)

    await sut.execute()

    expect(inMemorySessionsRepository.items).toHaveLength(0)
  })
})
