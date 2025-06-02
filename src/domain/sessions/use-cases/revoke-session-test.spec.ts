import { makeSession } from 'test/factories/sessions/make-session'
import { generateAccessTokenValueObject } from 'test/factories/sessions/value-objects/make-access-token'
import { InMemorySessionsRepository } from 'test/repositories/in-memory-sessions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { SessionAlreadyRevokedError } from '@/domain/sessions/entities/errors/session-already-revoked-error'
import { SessionExpiredError } from '@/domain/sessions/use-cases/errors/session-expired-error'
import { RevokeSessionUseCase } from '@/domain/sessions/use-cases/revoke-session-use-case'
import { NotAllowedError } from '@/shared/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

describe('RevokeSessionTest', () => {
  let inMemorySessionsRepository: InMemorySessionsRepository
  let sut: RevokeSessionUseCase

  beforeEach(() => {
    inMemorySessionsRepository = new InMemorySessionsRepository()
    sut = new RevokeSessionUseCase(inMemorySessionsRepository)
  })

  it('should revoke a valid session', async () => {
    const recipientId = UniqueEntityId.create('user-1')
    const token = 'valid.token.abc'
    const session = makeSession({
      recipientId,
      accessToken: generateAccessTokenValueObject(token),
      expiresAt: new Date(Date.now() + 1000 * 60 * 10),
    })

    await inMemorySessionsRepository.create(session)

    const result = await sut.execute({
      recipientId: recipientId.toString(),
      accessToken: token,
    })

    expect(result.isRight()).toBe(true)
  })

  it('should return ResourceNotFoundError if session does not exist', async () => {
    const token = 'non.existent.token'

    const result = await sut.execute({
      recipientId: 'user-x',
      accessToken: token,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return NotAllowedError if recipientId does not match', async () => {
    const token = 'token.not.allowed'
    const session = makeSession({
      recipientId: UniqueEntityId.create('user-a'),
      accessToken: generateAccessTokenValueObject(token),
    })

    await inMemorySessionsRepository.create(session)

    const result = await sut.execute({
      recipientId: 'user-b',
      accessToken: token,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should return SessionExpiredError if session is expired', async () => {
    const now = new Date()
    const token = 'expired.token.test'
    const session = makeSession({
      recipientId: UniqueEntityId.create('user-1'),
      accessToken: generateAccessTokenValueObject(token),
      createdAt: new Date(now.getTime() - 10 * 60 * 1000),
      expiresAt: new Date(now.getTime() - 5 * 60 * 1000),
    })

    await inMemorySessionsRepository.create(session)

    const result = await sut.execute({
      recipientId: 'user-1',
      accessToken: token,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(SessionExpiredError)
  })

  it('should return SessionAlreadyRevokedError if session is already revoked', async () => {
    const now = new Date()
    const token = 'revoked.token.test'

    const session = makeSession({
      recipientId: UniqueEntityId.create('user-1'),
      accessToken: generateAccessTokenValueObject(token),
      createdAt: now,
      revokedAt: new Date(now.getTime() + 100),
    })

    await inMemorySessionsRepository.create(session)

    const result = await sut.execute({
      recipientId: 'user-1',
      accessToken: token,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(SessionAlreadyRevokedError)
  })

  it('should persist revoked session', async () => {
    const token = 'persist.token.abc'
    const accessToken = generateAccessTokenValueObject(token)

    const session = makeSession({
      recipientId: UniqueEntityId.create('user-1'),
      accessToken,
      expiresAt: new Date(Date.now() + 60 * 1000),
    })

    await inMemorySessionsRepository.create(session)

    await sut.execute({
      recipientId: 'user-1',
      accessToken: token,
    })

    const stored = inMemorySessionsRepository.items.find(
      (s) => s.accessToken.toString() === token,
    )

    expect(stored?.isRevoked()).toBe(true)
  })
})
