import { makeSession } from 'test/factories/make-session'
import { FakeRevokeSessionUseCase } from 'test/fakes/sessions/fake-revoke-session-use-case'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { SessionExpiredError } from '@/domain/sessions/use-cases/errors/session-expired-error'

import { ILogoutUserService } from './contracts/logout-user-service.interface'
import { LogoutUserService } from './logout-user.service'

describe('Logout User Service', () => {
  let service: ILogoutUserService
  let revokeSession: FakeRevokeSessionUseCase

  beforeEach(() => {
    revokeSession = new FakeRevokeSessionUseCase()
    service = new LogoutUserService(revokeSession)
  })

  it('should successfully revoke a session', async () => {
    revokeSession.session = makeSession({
      recipientId: new UniqueEntityId('correct-user-id'),
      accessToken: 'valid-token',
      expiresAt: new Date(Date.now() + 1000), 
    })

    const result = await service.execute({
      recipientId: 'correct-user-id',
      accessToken: 'valid-token',
    })

    expect(result.isRight()).toBe(true)
  })

  it('should return ResourceNotFoundError if session does not exist', async () => {
    revokeSession.shouldReturnNotFound = true

    const result = await service.execute({
      recipientId: 'any-id',
      accessToken: 'invalid-token',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return SessionExpiredError if session is expired', async () => {
    revokeSession.session = makeSession({
      expiresAt: new Date(Date.now() - 1000),
    })

    const result = await service.execute({
      recipientId: 'correct-user-id',
      accessToken: 'expired-token',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(SessionExpiredError)
  })

  it('should return NotAllowedError if session belongs to another user', async () => {
    revokeSession.session = makeSession({
      recipientId: new UniqueEntityId('different-user-id'),
    })

    const result = await service.execute({
      recipientId: 'unauthorized-user-id',
      accessToken: 'token',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should return NotAllowedError if session is already revoked', async () => {
    const session = makeSession()

    session.revoke()

    revokeSession.session = session
    revokeSession.shouldReturnAlreadyRevoked = true

    const result = await service.execute({
      recipientId: 'correct-user-id',
      accessToken: 'revoked-token',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
