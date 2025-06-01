import { makeSession } from 'test/factories/sessions/make-session'
import { generateAccessTokenValueObject } from 'test/factories/sessions/value-objects/make-access-token'
import { FakeRevokeSessionUseCase } from 'test/fakes/sessions/fake-revoke-session-use-case'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { SessionExpiredError } from '@/domain/sessions/use-cases/errors/session-expired-error'
import { NotAllowedError } from '@/shared/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { LogoutUserContract } from './contracts/logout-user-contract'
import { LogoutUserService } from './logout-user.service'

const now = () => new Date()
const inFuture = (minutes: number) => new Date(Date.now() + 1000 * 60 * minutes)
const inPast = (minutes: number) => new Date(Date.now() - 1000 * 60 * minutes)

describe('LogoutUserService', () => {
  let service: LogoutUserContract
  let revokeSession: FakeRevokeSessionUseCase

  beforeEach(() => {
    revokeSession = new FakeRevokeSessionUseCase()
    service = new LogoutUserService(revokeSession)
  })

  it('should successfully revoke a session', async () => {
    const recipientId = UniqueEntityId.create('user-1')
    const token = 'valid.token.abc'
    const accessToken = generateAccessTokenValueObject(token)

    revokeSession.session = makeSession({
      recipientId,
      accessToken,
      createdAt: now(),
      expiresAt: inFuture(5), // 5 minutos no futuro
    })

    const result = await service.execute({
      recipientId: recipientId.toString(),
      accessToken: token,
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
      recipientId: UniqueEntityId.create('user-1'),
      createdAt: inPast(10),
      expiresAt: inPast(5),
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
      recipientId: UniqueEntityId.create('user-x'),
      createdAt: now(),
      expiresAt: inFuture(10),
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
      recipientId: UniqueEntityId.create('user-1'),
      createdAt: inPast(10),
      expiresAt: inFuture(10),
      revokedAt: now(),
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
