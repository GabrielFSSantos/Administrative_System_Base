import { generateFakeJwt } from 'test/fakes/sessions/value-objects/fake-generate-access-toke'
import { InMemorySessionsRepository } from 'test/repositories/in-memory-sessions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InvalidAccessTokenError } from '@/domain/sessions/entities/value-objects/errors/invalid-access-token-error'
import { CreateSessionUseCase } from '@/domain/sessions/use-cases/create-session-use-case'

let inMemorySessionsRepository: InMemorySessionsRepository
let sut: CreateSessionUseCase

describe('Create Session Use Case Test', () => {
  beforeEach(() => {
    inMemorySessionsRepository = new InMemorySessionsRepository()
    sut = new CreateSessionUseCase(inMemorySessionsRepository)
  })

  it('should create a session with valid access token', async () => {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
    const recipientId = new UniqueEntityId().toString()
    const accessToken = generateFakeJwt()

    const result = await sut.execute({
      recipientId,
      accessToken,
      expiresAt,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.session).toEqual(inMemorySessionsRepository.items[0])
      expect(result.value.session.accessToken.value).toBe(accessToken)
    }
  })

  it('should store a session with proper expiration', async () => {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)
    const result = await sut.execute({
      recipientId: new UniqueEntityId().toString(),
      accessToken: generateFakeJwt(),
      expiresAt,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      const session = result.value.session

      expect(session.expiresAt.getTime()).toBeCloseTo(expiresAt.getTime(), -2)
    }
  })

  it('should return error if access token is invalid', async () => {
    const result = await sut.execute({
      recipientId: new UniqueEntityId().toString(),
      accessToken: 'invalid.token',
      expiresAt: new Date(Date.now() + 60000),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAccessTokenError)
  })

  it('should not create session if token is empty', async () => {
    const result = await sut.execute({
      recipientId: new UniqueEntityId().toString(),
      accessToken: '',
      expiresAt: new Date(Date.now() + 60000),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAccessTokenError)
  })

  it('should store multiple sessions for different recipients', async () => {
    const now = Date.now()

    await sut.execute({
      recipientId: new UniqueEntityId().toString(),
      accessToken: generateFakeJwt(),
      expiresAt: new Date(now + 5 * 60 * 1000),
    })

    await sut.execute({
      recipientId: new UniqueEntityId().toString(),
      accessToken: generateFakeJwt(),
      expiresAt: new Date(now + 10 * 60 * 1000),
    })

    expect(inMemorySessionsRepository.items).toHaveLength(2)
  })

  it('should store AccessToken as ValueObject', async () => {
    const result = await sut.execute({
      recipientId: new UniqueEntityId().toString(),
      accessToken: generateFakeJwt(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.session.accessToken).toHaveProperty('value')
    }
  })
})
