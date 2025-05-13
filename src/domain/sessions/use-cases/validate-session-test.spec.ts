import { makeSession } from 'test/factories/make-session'
import { InMemorySessionsRepository } from 'test/repositories/in-memory-sessions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { SessionAlreadyRevokedError } from '@/domain/sessions/entities/errors/session-already-revoked-error'
import { SessionExpiredError } from '@/domain/sessions/use-cases/errors/session-expired-error'
import { ValidateSessionUseCase } from '@/domain/sessions/use-cases/validate-session-use-case'

describe('Validate Session Test', () => {
  let inMemorySessionsRepository: InMemorySessionsRepository
  let sut: ValidateSessionUseCase

  beforeEach(() => {
    inMemorySessionsRepository = new InMemorySessionsRepository()
    sut = new ValidateSessionUseCase(inMemorySessionsRepository)
  })

  it('should validate a valid session successfully', async () => {
    const recipientId = new UniqueEntityId()
    const session = makeSession({
      recipientId,
      accessToken: 'valid-token',
      expiresAt: new Date(Date.now() + 1000 * 60 * 10),
    })

    await inMemorySessionsRepository.create(session)

    const result = await sut.execute({
      accessToken: 'valid-token',
      recipientId: recipientId.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.session.accessToken).toBe('valid-token')
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
    const session = makeSession({
      recipientId: new UniqueEntityId('user-1'),
      accessToken: 'token',
    })

    await inMemorySessionsRepository.create(session)

    const result = await sut.execute({
      accessToken: 'token',
      recipientId: 'user-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should return SessionExpiredError for expired session', async () => {
    const createdAt = new Date(Date.now() - 2 * 60 * 1000) // 2min atrás
    const expiresAt = new Date(Date.now() - 60 * 1000) // 1min atrás
    
    const session = makeSession({
      recipientId: new UniqueEntityId('user-1'),
      accessToken: 'expired-token',
      createdAt,
      expiresAt,
    })

    await inMemorySessionsRepository.create(session)

    const result = await sut.execute({
      accessToken: 'expired-token',
      recipientId: 'user-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(SessionExpiredError)
  })

  it('should return SessionAlreadyRevokedError for revoked session', async () => {
    const session = makeSession({
      recipientId: new UniqueEntityId('user-1'),
      accessToken: 'revoked-token',
      revokedAt: new Date(),
    })

    await inMemorySessionsRepository.create(session)

    const result = await sut.execute({
      accessToken: 'revoked-token',
      recipientId: 'user-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(SessionAlreadyRevokedError)
  })
})
