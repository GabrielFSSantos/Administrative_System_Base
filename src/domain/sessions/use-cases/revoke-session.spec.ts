import { RevokeSessionUseCase } from './revoke-session'
import { InMemorySessionsRepository } from 'test/repositories/in-memory-sessions-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'
import { makeSession } from 'test/factories/make-session'

let inMemorySessionsRepository:InMemorySessionsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: RevokeSessionUseCase

describe('Revoke Session', () => {
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
      token: 'new-token',
    })

    await inMemorySessionsRepository.create(session)

    const result = await sut.execute({
      recipientId: user.id.toString(),
      accessToken: 'new-token',
    })

    expect(result.isRight()).toBe(true)
  })

  it('should return error if session is expired', async () => {
    const user = makeUser()

    await inMemoryUsersRepository.create(user)

    const session = makeSession({
      recipientId: user.id,
      token: 'expired-token',
      expiresAt: new Date(Date.now() - 1000),
    })

    await inMemorySessionsRepository.create(session)

    const result = await sut.execute({
      recipientId: user.id.toString(),
      accessToken: session.token,
    })
  
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(Error)
  })

  it('should return error if recipientId does not match session owner', async () => {
    const user = makeUser()
    
    await inMemoryUsersRepository.create(user)
  
    const session = makeSession({
      recipientId: user.id,
      token: 'token-mismatch',
    })
  
    await inMemorySessionsRepository.create(session)
  
    const result = await sut.execute({
      recipientId: 'wrong-id',
      accessToken: session.token,
    })
  
    expect(result.isLeft()).toBe(true)
  })

  it('should return error if session is already revoked', async () => {
    const user = makeUser()

    await inMemoryUsersRepository.create(user)
  
    const session = makeSession({
      recipientId: user.id,
      token: 'revoked-token',
      revokedAt: new Date(),
    })
  
    await inMemorySessionsRepository.create(session)
  
    const result = await sut.execute({
      recipientId: user.id.toString(),
      accessToken: session.token,
    })
  
    expect(result.isLeft()).toBe(true)
  })

  it('should call revoke on sessionsRepository with correct session', async () => {
    const user = makeUser()

    await inMemoryUsersRepository.create(user)
  
    const session = makeSession({
      recipientId: user.id,
      token: 'valid-token',
    })
  
    await inMemorySessionsRepository.create(session)
  
    await sut.execute({
      recipientId: user.id.toString(),
      accessToken: session.token,
    })

    expect(inMemorySessionsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          token: 'valid-token',
        }),
      ]),
    )
  })
})
