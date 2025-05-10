import { makeSession } from 'test/factories/make-session'
import { FakeRevokeSessionUseCase } from 'test/fakes/sessions/fake-revoke-session-use-case'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { SessionExpiredError } from '@/domain/sessions/use-cases/errors/session-expired-error'

import { LogoutUserContract } from './contracts/logout-user-contract'
import { LogoutUserService } from './logout-user.service'

describe('LogoutUserService', () => {
  let service: LogoutUserContract
  let revokeSession: FakeRevokeSessionUseCase

  const createdAt = new Date('2025-05-10T16:38:07.310Z')
  const expiresAtFuture = new Date('2025-05-10T17:40:07.310Z')
  const expiresAtPast = new Date('2025-05-10T16:39:07.310Z')
  const revokedAtFuture = new Date('2025-05-10T16:40:12.310Z')

  beforeEach(() => {
    revokeSession = new FakeRevokeSessionUseCase()
    service = new LogoutUserService(revokeSession)
  })

  it('should successfully revoke a session', async () => {
    revokeSession.session = makeSession({
      recipientId: new UniqueEntityId('user-1'),
      accessToken: 'valid-token',
      createdAt,
      expiresAt: expiresAtFuture,
    })

    const result = await service.execute({
      recipientId: 'user-1',
      accessToken: 'valid-token',
    })

    expect(result.isRight()).toBe(true)
  })

  it('should return ResourceNotFoundError if session does not exist', async () => {
    revokeSession.shouldReturnNotFound = true

    const result = await service.execute({
      recipientId: 'user-1',
      accessToken: 'non-existent-token',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return SessionExpiredError if session is expired', async () => {
    revokeSession.session = makeSession({
      recipientId: new UniqueEntityId('user-1'),
      createdAt,
      expiresAt: expiresAtPast,
    })

    const result = await service.execute({
      recipientId: 'user-1',
      accessToken: 'expired-token',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(SessionExpiredError)
  })

  it('should return NotAllowedError if session belongs to another user', async () => {
    revokeSession.session = makeSession({
      recipientId: new UniqueEntityId('user-x'),
      createdAt,
      expiresAt: expiresAtFuture,
    })

    const result = await service.execute({
      recipientId: 'user-1',
      accessToken: 'token',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should return NotAllowedError if session is already revoked', async () => {
    revokeSession.session = makeSession({
      recipientId: new UniqueEntityId('user-1'),
      createdAt,
      expiresAt: expiresAtFuture,
      revokedAt: revokedAtFuture,
    })

    revokeSession.shouldReturnAlreadyRevoked = true

    const result = await service.execute({
      recipientId: 'user-1',
      accessToken: 'revoked-token',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
