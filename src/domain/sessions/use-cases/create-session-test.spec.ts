import { generateFakeJwt } from 'test/factories/sessions/value-objects/make-access-token'
import { InMemorySessionsRepository } from 'test/repositories/in-memory-sessions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InvalidSessionDateExpiredError } from '@/domain/sessions/entities/errors/invalid-session-date-expired-error'
import { InvalidAccessTokenError } from '@/domain/sessions/entities/value-objects/errors/invalid-access-token-error'
import { CreateSessionUseCase } from '@/domain/sessions/use-cases/create-session-use-case'

let inMemorySessionsRepository: InMemorySessionsRepository
let sut: CreateSessionUseCase

describe('Create Session Use Case Test', () => {
  beforeEach(() => {
    inMemorySessionsRepository = new InMemorySessionsRepository()
    sut = new CreateSessionUseCase(inMemorySessionsRepository)
  })

  it('should create a valid session and persist it', async () => {
    const recipientId = UniqueEntityId.create().toString()
    const accessToken = generateFakeJwt()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    const result = await sut.execute({
      recipientId,
      accessToken,
      expiresAt,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      const session = result.value.session

      expect(session.accessToken.value).toBe(accessToken)
      expect(session.recipientId.toString()).toBe(recipientId)
      expect(inMemorySessionsRepository.items).toContainEqual(session)
    }
  })

  it('should not create session with invalid access token (wrong format)', async () => {
    const result = await sut.execute({
      recipientId: UniqueEntityId.create().toString(),
      accessToken: 'invalid-token',
      expiresAt: new Date(Date.now() + 60000),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAccessTokenError)
  })

  it('should not create session with empty access token', async () => {
    const result = await sut.execute({
      recipientId: UniqueEntityId.create().toString(),
      accessToken: '',
      expiresAt: new Date(Date.now() + 60000),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAccessTokenError)
  })

  it('should not create session if expiresAt is before createdAt', async () => {
    const result = await sut.execute({
      recipientId: UniqueEntityId.create().toString(),
      accessToken: generateFakeJwt(),
      expiresAt: new Date(Date.now() - 60000),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidSessionDateExpiredError)
  })

  it('not should handle expiresAt < createdAt (via makeSession simulation)', async () => {
    const now = new Date()
    const recipientId = UniqueEntityId.create()
    const accessToken = generateFakeJwt()

    const result = await sut.execute({
      recipientId: recipientId.toString(),
      accessToken,
      expiresAt: new Date(now.getTime() - 1000), // 1 segundo no passado
    })

    expect(result.isLeft()).toBe(true)
  })

  it('should allow multiple sessions with different recipientIds', async () => {
    const result1 = await sut.execute({
      recipientId: UniqueEntityId.create().toString(),
      accessToken: generateFakeJwt(),
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    })

    const result2 = await sut.execute({
      recipientId: UniqueEntityId.create().toString(),
      accessToken: generateFakeJwt(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    })

    expect(result1.isRight()).toBe(true)
    expect(result2.isRight()).toBe(true)
    expect(inMemorySessionsRepository.items).toHaveLength(2)
  })

  it('should return an AccessToken value object inside session', async () => {
    const result = await sut.execute({
      recipientId: UniqueEntityId.create().toString(),
      accessToken: generateFakeJwt(),
      expiresAt: new Date(Date.now() + 60000),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.session.accessToken).toHaveProperty('value')
      expect(typeof result.value.session.accessToken.value).toBe('string')
    }
  })
})
