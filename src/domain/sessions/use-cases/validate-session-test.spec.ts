import { makeSession } from 'test/factories/sessions/make-session'
import { generateAccessTokenValueObject } from 'test/factories/sessions/value-objects/make-access-token'
import { InMemorySessionsRepository } from 'test/repositories/in-memory-sessions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { SessionAlreadyRevokedError } from '@/domain/sessions/entities/errors/session-already-revoked-error'
import { SessionExpiredError } from '@/domain/sessions/use-cases/errors/session-expired-error'
import { ValidateSessionUseCase } from '@/domain/sessions/use-cases/validate-session-use-case'
import { NotAllowedError } from '@/shared/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

describe('ValidateSessionTest', () => {
  let inMemorySessionsRepository: InMemorySessionsRepository
  let sut: ValidateSessionUseCase

  beforeEach(() => {
    inMemorySessionsRepository = new InMemorySessionsRepository()
    sut = new ValidateSessionUseCase(inMemorySessionsRepository)
  })

  it('should validate a valid session successfully', async () => {
    const accessToken = generateAccessTokenValueObject()

    const recipientId = UniqueEntityId.create()
    const session = makeSession({
      recipientId,
      accessToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 10),
    })

    await inMemorySessionsRepository.create(session)

    const result = await sut.execute({
      accessToken: accessToken.toString(),
      recipientId: recipientId.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.session.accessToken.value).toBe(accessToken.value)
    }
  })

  it('should return ResourceNotFoundError for nonexistent token', async () => {
    const result = await sut.execute({
      accessToken: 'non-existent',
      recipientId: 'any-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return NotAllowedError for mismatched recipientId', async () => {
    const accessToken = generateAccessTokenValueObject()

    const session = makeSession({
      recipientId: UniqueEntityId.create('user-1'),
      accessToken,
    })

    await inMemorySessionsRepository.create(session)

    const result = await sut.execute({
      accessToken: accessToken.toString(),
      recipientId: 'user-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should return SessionExpiredError for expired session', async () => {
    const accessToken = generateAccessTokenValueObject()
    
    const createdAt = new Date(Date.now() - 2 * 60 * 1000) // 2min atrás
    const expiresAt = new Date(Date.now() - 60 * 1000) // 1min atrás
    
    const session = makeSession({
      recipientId: UniqueEntityId.create('user-1'),
      accessToken,
      createdAt,
      expiresAt,
    })

    await inMemorySessionsRepository.create(session)

    const result = await sut.execute({
      accessToken: accessToken.toString(),
      recipientId: 'user-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(SessionExpiredError)
  })

  it('should return SessionAlreadyRevokedError for revoked session', async () => {
    const accessToken = generateAccessTokenValueObject()

    const createdAt = new Date()
    const revokedAt = new Date(createdAt.getTime() + 1) // +1ms para garantir ordem correta

    const session = makeSession({
      recipientId: UniqueEntityId.create('user-1'),
      accessToken,
      createdAt,
      revokedAt,
    })

    await inMemorySessionsRepository.create(session)

    const result = await sut.execute({
      accessToken: accessToken.toString(),
      recipientId: 'user-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(SessionAlreadyRevokedError)
  })

})
