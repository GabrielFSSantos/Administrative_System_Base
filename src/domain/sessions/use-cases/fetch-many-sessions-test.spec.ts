import { makeSession } from 'test/factories/make-session'
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
    expect(result.value?.sessions).toHaveLength(5)
  })

  it('should return sessions filtered by recipientId', async () => {
    const userA = new UniqueEntityId('user-a')
    const userB = new UniqueEntityId('user-b')

    await sessionsRepository.create(makeSession({ recipientId: userA }))
    await sessionsRepository.create(makeSession({ recipientId: userB }))

    const result = await sut.execute({
      page: 1,
      pageSize: 10,
      recipientId: 'user-a',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.sessions.every((s) => s.recipientId.toString() === 'user-a')).toBe(true)
  })

  it('should return only valid sessions when onlyValid flag is true', async () => {
    const createdAtPast = new Date(Date.now() - 2 * 60 * 60 * 1000) // 2h atrás
    const validExpiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1h no futuro
    const expiredExpiresAt = new Date(createdAtPast.getTime() + 10 * 60 * 1000) // 10min depois do createdAt (ainda no passado)
  
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
    expect(result.value?.sessions).toHaveLength(1)
    expect(result.value?.sessions[0].isValid()).toBe(true)
  })  
})
