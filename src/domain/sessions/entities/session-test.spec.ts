import { generateAccessTokenValueObject } from 'test/factories/sessions/value-objects/make-access-token'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InvalidSessionDateExpiredError } from '@/domain/sessions/entities/errors/invalid-session-date-expired-error-error'
import { InvalidSessionDateRevokedError } from '@/domain/sessions/entities/errors/invalid-session-date-revoked-error-error'
import { SessionAlreadyRevokedError } from '@/domain/sessions/entities/errors/session-already-revoked-error'
import { Session } from '@/domain/sessions/entities/session'

describe('SessionEntityTest', () => {
  const validToken = generateAccessTokenValueObject()
  const now = new Date()

  it('should create a valid session', () => {
    const result = Session.create({
      recipientId: UniqueEntityId.create(),
      accessToken: validToken,
      expiresAt: new Date(now.getTime() + 60000),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value).toBeInstanceOf(Session)
    }
  })

  it('should not create session if expiresAt is before createdAt', () => {
    const result = Session.create({
      recipientId: UniqueEntityId.create(),
      accessToken: validToken,
      createdAt: new Date('2025-01-01T10:00:00'),
      expiresAt: new Date('2025-01-01T09:00:00'),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidSessionDateExpiredError)
  })

  it('should not create session if revokedAt is before createdAt', () => {
    const result = Session.create({
      recipientId: UniqueEntityId.create(),
      accessToken: validToken,
      createdAt: new Date('2025-01-01T10:00:00'),
      revokedAt: new Date('2025-01-01T09:00:00'),
      expiresAt: new Date('2025-01-01T11:00:00'),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidSessionDateRevokedError)
  })

  it('should revoke a session successfully', () => {
    const result = Session.create({
      recipientId: UniqueEntityId.create(),
      accessToken: validToken,
      expiresAt: new Date(now.getTime() + 60000),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      const session = result.value

      expect(session.isRevoked()).toBe(false)

      const revokeResult = session.revoke()

      expect(revokeResult.isRight()).toBe(true)
      expect(session.isRevoked()).toBe(true)
    }
  })

  it('should not revoke an already revoked session', () => {
    const result = Session.create({
      recipientId: UniqueEntityId.create(),
      accessToken: validToken,
      expiresAt: new Date(now.getTime() + 60000),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      const session = result.value

      const first = session.revoke()
      const second = session.revoke()

      expect(first.isRight()).toBe(true)
      expect(second.isLeft()).toBe(true)
      expect(second.value).toBeInstanceOf(SessionAlreadyRevokedError)
    }
  })

  it('should check if session is expired', () => {
    const result = Session.create({
      recipientId: UniqueEntityId.create(),
      accessToken: validToken,
      createdAt: new Date(Date.now() - 2 * 60000),
      expiresAt: new Date(Date.now() - 1 * 60000),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      const session = result.value

      expect(session.isExpired()).toBe(true)
    }
  })

  it('should check if session is valid', () => {
    const result = Session.create({
      recipientId: UniqueEntityId.create(),
      accessToken: validToken,
      expiresAt: new Date(Date.now() + 60000),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      const session = result.value

      expect(session.isValid()).toBe(true)

      session.revoke()
      expect(session.isValid()).toBe(false)
    }
  })

  it('should check if session belongs to a recipient', () => {
    const recipientId = UniqueEntityId.create()
    const otherId = UniqueEntityId.create()

    const result = Session.create({
      recipientId,
      accessToken: validToken,
      expiresAt: new Date(Date.now() + 60000),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      const session = result.value

      expect(session.belongsTo(recipientId.toString())).toBe(true)
      expect(session.belongsTo(otherId.toString())).toBe(false)
    }
  })
})
