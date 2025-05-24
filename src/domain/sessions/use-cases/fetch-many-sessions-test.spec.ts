import { makeSession } from 'test/factories/sessions/make-session'
import { InMemorySessionsRepository } from 'test/repositories/in-memory-sessions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FetchManySessionsUseCase } from '@/domain/sessions/use-cases/fetch-many-sessions-use-case'

describe('Fetch Many Sessions Test', () => {
  let sessionsRepository: InMemorySessionsRepository
  let sut: FetchManySessionsUseCase

  beforeEach(() => {
    sessionsRepository = new InMemorySessionsRepository()
    sut = new FetchManySessionsUseCase(sessionsRepository)
  })

  it('should return paginated sessions', async () => {
    for (let i = 0; i < 10; i++) {
      await sessionsRepository.create(makeSession())
    }

    const result = await sut.execute({ page: 1, pageSize: 5 })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.sessions).toHaveLength(5)
      expect(result.value.pagination.page).toBe(1)
      expect(result.value.pagination.pageSize).toBe(5)
      expect(result.value.pagination.total).toBe(10)
    }
  })

  it('should return sessions filtered by recipientId', async () => {
    const userA = UniqueEntityId.create('user-a')
    const userB = UniqueEntityId.create('user-b')

    await sessionsRepository.create(makeSession({ recipientId: userA }))
    await sessionsRepository.create(makeSession({ recipientId: userB }))
    await sessionsRepository.create(makeSession({ recipientId: userA }))

    const result = await sut.execute({
      page: 1,
      pageSize: 10,
      recipientId: 'user-a',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.sessions).toHaveLength(2)
      expect(result.value.sessions.every((s) => s.recipientId.toString() === 'user-a')).toBe(true)
    }
  })

  it('should return only valid sessions when onlyValid flag is true', async () => {
    const now = Date.now()
    const createdAtPast = new Date(now - 2 * 60 * 60 * 1000) // 2h atrás
    const validExpiresAt = new Date(now + 60 * 60 * 1000) // 1h no futuro
    const expiredExpiresAt = new Date(createdAtPast.getTime() + 10 * 60 * 1000) // já expirou

    await sessionsRepository.create(makeSession({
      createdAt: new Date(),
      expiresAt: validExpiresAt,
    }))

    await sessionsRepository.create(makeSession({
      createdAt: createdAtPast,
      expiresAt: expiredExpiresAt,
    }))

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

  it('should return error for invalid pagination', async () => {
    const result = await sut.execute({
      page: 0,
      pageSize: 0,
    })

    expect(result.isLeft()).toBe(true)
  })
})
