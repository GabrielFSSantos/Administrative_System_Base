import { makeSession } from 'test/factories/make-session'
import { InMemorySessionsRepository } from 'test/repositories/in-memory-sessions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { SessionAlreadyRevokedError } from '@/domain/sessions/entities/errors/session-already-revoked-error'
import { SessionExpiredError } from '@/domain/sessions/use-cases/errors/session-expired-error'
import { RevokeSessionUseCase } from '@/domain/sessions/use-cases/revoke-session-use-case'

describe('Revoke Session Test', () => {
  let inMemorySessionsRepository: InMemorySessionsRepository
  let sut: RevokeSessionUseCase

  beforeEach(() => {
    inMemorySessionsRepository = new InMemorySessionsRepository()
    sut = new RevokeSessionUseCase(inMemorySessionsRepository)
  })

  it('should revoke a valid session', async () => {
    const recipientId = new UniqueEntityId('user-1')
    const session = makeSession({
      recipientId,
      accessToken: 'valid-token',
      expiresAt: new Date(Date.now() + 1000 * 60 * 10),
    })

    await inMemorySessionsRepository.create(session)

    const result = await sut.execute({
      recipientId: recipientId.toString(),
      accessToken: 'valid-token',
    })

    expect(result.isRight()).toBe(true)
  })

  it('should return ResourceNotFoundError if session does not exist', async () => {
    const result = await sut.execute({
      recipientId: 'user-x',
      accessToken: 'not-found-token',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return NotAllowedError if recipientId does not match', async () => {
    const session = makeSession({
      recipientId: new UniqueEntityId('user-a'),
      accessToken: 'token-a',
    })

    await inMemorySessionsRepository.create(session)

    const result = await sut.execute({
      recipientId: 'user-b',
      accessToken: 'token-a',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should return SessionExpiredError if session is expired', async () => {
    const now = new Date()
    const session = makeSession({
      recipientId: new UniqueEntityId('user-1'),
      accessToken: 'expired-token',
      createdAt: new Date(now.getTime() - 10 * 60 * 1000),
      expiresAt: new Date(now.getTime() - 5 * 60 * 1000),
    })

    await inMemorySessionsRepository.create(session)

    const result = await sut.execute({
      recipientId: 'user-1',
      accessToken: 'expired-token',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(SessionExpiredError)
  })

  it('should return SessionAlreadyRevokedError if session is already revoked', async () => {
    const session = makeSession({
      recipientId: new UniqueEntityId('user-1'),
      accessToken: 'revoked-token',
      revokedAt: new Date(),
    })

    await inMemorySessionsRepository.create(session)

    const result = await sut.execute({
      recipientId: 'user-1',
      accessToken: 'revoked-token',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(SessionAlreadyRevokedError)
  })

  it('should persist revoked session', async () => {
    const session = makeSession({
      recipientId: new UniqueEntityId('user-1'),
      accessToken: 'persist-token',
      expiresAt: new Date(Date.now() + 60 * 1000),
    })

    await inMemorySessionsRepository.create(session)

    await sut.execute({
      recipientId: 'user-1',
      accessToken: 'persist-token',
    })

    const stored = inMemorySessionsRepository.items.find(
      (s) => s.accessToken === 'persist-token',
    )

    expect(stored?.isRevoked()).toBe(true)
  })
})
