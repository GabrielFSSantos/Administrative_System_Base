import { makeSession } from 'test/factories/make-session'
import { makeUser } from 'test/factories/make-user'
import { InMemorySessionsRepository } from 'test/repositories/in-memory-sessions-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { RevokeSessionContract } from './contracts/revoke-session-contract'
import { SessionExpiredError } from './errors/session-expired-error'
import { RevokeSessionUseCase } from './revoke-session-use-case'

let inMemorySessionsRepository: InMemorySessionsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: RevokeSessionContract

describe('Revoke Session Test', () => {
  beforeEach(() => {
    inMemorySessionsRepository = new InMemorySessionsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()

    sut = new RevokeSessionUseCase(
      inMemorySessionsRepository,
    )
  })

  it('should be able to revoke a session', async () => {
    const user = makeUser()

    await inMemoryUsersRepository.create(user)

    const session = makeSession({
      recipientId: user.id,
      accessToken: 'new-accessToken',
    })

    await inMemorySessionsRepository.create(session)

    const result = await sut.execute({
      recipientId: user.id.toString(),
      accessToken: 'new-accessToken',
    })

    expect(result.isRight()).toBe(true)
  })

  it('should return ResourceNotFoundError if session is not found', async () => {
    const result = await sut.execute({
      recipientId: 'any-id',
      accessToken: 'non-existent-token',
    })
  
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return error if session is expired', async () => {
    const user = makeUser()

    await inMemoryUsersRepository.create(user)

    const session = makeSession({
      recipientId: user.id,
      accessToken: 'expired-accessToken',
      expiresAt: new Date(Date.now() - 1000),
    })

    await inMemorySessionsRepository.create(session)

    const result = await sut.execute({
      recipientId: user.id.toString(),
      accessToken: session.accessToken,
    })
  
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(SessionExpiredError)
  })

  it('should return error if recipientId does not match session owner', async () => {
    const user = makeUser()
    
    await inMemoryUsersRepository.create(user)
  
    const session = makeSession({
      recipientId: user.id,
      accessToken: 'token-mismatch',
    })
  
    await inMemorySessionsRepository.create(session)
  
    const result = await sut.execute({
      recipientId: 'wrong-id',
      accessToken: session.accessToken,
    })
  
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should return error if session is already revoked', async () => {
    const user = makeUser()

    await inMemoryUsersRepository.create(user)
  
    const session = makeSession({
      recipientId: user.id,
      accessToken: 'revoked-accessToken',
      revokedAt: new Date(),
    })
  
    await inMemorySessionsRepository.create(session)
  
    const result = await sut.execute({
      recipientId: user.id.toString(),
      accessToken: session.accessToken,
    })
  
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should call revoke on sessionsRepository with correct session', async () => {
    const user = makeUser()

    await inMemoryUsersRepository.create(user)
  
    const session = makeSession({
      recipientId: user.id,
      accessToken: 'valid-accessToken',
    })
  
    await inMemorySessionsRepository.create(session)
  
    await sut.execute({
      recipientId: user.id.toString(),
      accessToken: session.accessToken,
    })

    expect(inMemorySessionsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          accessToken: 'valid-accessToken',
        }),
      ]),
    )
  })
})
