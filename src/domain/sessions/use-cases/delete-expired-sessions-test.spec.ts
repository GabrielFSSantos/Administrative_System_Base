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
    const expired1 = makeSession({
      expiresAt: new Date(Date.now() - 1000 * 60 * 60), // 1h atrás
    })

    const expired2 = makeSession({
      expiresAt: new Date(Date.now() - 1000 * 60 * 5), // 5min atrás
    })

    const valid = makeSession({
      expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1h no futuro
    })

    await inMemorySessionsRepository.create(expired1)
    await inMemorySessionsRepository.create(expired2)
    await inMemorySessionsRepository.create(valid)

    await sut.execute()

    expect(inMemorySessionsRepository.items).toHaveLength(1)
    expect(inMemorySessionsRepository.items[0].id.toString()).toBe(valid.id.toString())
  })

  it('should not delete sessions if none are expired', async () => {
    const session1 = makeSession({
      expiresAt: new Date(Date.now() + 1000 * 60 * 60), // futuro
    })

    await inMemorySessionsRepository.create(session1)

    await sut.execute()

    expect(inMemorySessionsRepository.items).toHaveLength(1)
  })

  it('should remove all sessions if all are expired', async () => {
    const expired1 = makeSession({
      expiresAt: new Date(Date.now() - 1000 * 60 * 10),
    })

    const expired2 = makeSession({
      expiresAt: new Date(Date.now() - 1000 * 60 * 20),
    })

    await inMemorySessionsRepository.create(expired1)
    await inMemorySessionsRepository.create(expired2)

    await sut.execute()

    expect(inMemorySessionsRepository.items).toHaveLength(0)
  })
})
