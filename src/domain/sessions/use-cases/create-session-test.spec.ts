import { InMemorySessionsRepository } from 'test/repositories/in-memory-sessions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { InvalidSessionDateExpiredError } from '../entities/errors/invalid-session-date-expired-error-error'
import { CreateSessionContract } from './contracts/create-session-contract'
import { CreateSessionUseCase } from './create-session-use-case'

describe('Create Session Test', () => {
  let inMemorySessionsRepository: InMemorySessionsRepository
  let sut: CreateSessionContract

  beforeEach(() => {
    inMemorySessionsRepository = new InMemorySessionsRepository()
    sut = new CreateSessionUseCase(inMemorySessionsRepository)
  })

  it('should create a new valid session', async () => {
    const recipientId = new UniqueEntityId('user-1')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    const result = await sut.execute({
      recipientId: recipientId.toString(),
      accessToken: 'access-token',
      expiresAt,
    })

    expect(result.isRight()).toBe(true)
  })

  it('should throw if expiresAt is in the past', async () => {
    const recipientId = new UniqueEntityId('user-2')
    const expiresAt = new Date(Date.now() - 1000)
  
    await expect(
      sut.execute({
        recipientId: recipientId.toString(),
        accessToken: 'expired-token',
        expiresAt,
      }),
    ).rejects.toThrow(InvalidSessionDateExpiredError)
  })

  it('should persist the session with correct values', async () => {
    const recipientId = new UniqueEntityId('user-3')
    const accessToken = 'stored-token'
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000)

    await sut.execute({
      recipientId: recipientId.toString(),
      accessToken,
      expiresAt,
    })

    const stored = inMemorySessionsRepository.items[0]

    expect(stored.recipientId.toString()).toBe(recipientId.toString())
    expect(stored.accessToken).toBe(accessToken)
  })
})
