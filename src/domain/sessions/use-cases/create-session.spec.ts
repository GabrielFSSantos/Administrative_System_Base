import { FakeEncrypter } from 'test/fakes/cryptography/fake-encrypter'
import { InMemorySessionsRepository } from 'test/repositories/in-memory-sessions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Session } from '../entities/session'
import { ICreateSessionUseCase } from './contracts/create-session.interface'
import { CreateSessionUseCase } from './create-session'
import { SessionExpiredError } from './errors/session-expired-error'

let inMemorySessionsRepository: InMemorySessionsRepository
let fakeEncrypter: FakeEncrypter
let sut: ICreateSessionUseCase

describe('Create Session', () => {
  beforeEach(() => {
    inMemorySessionsRepository = new InMemorySessionsRepository()
    fakeEncrypter = new FakeEncrypter()

    sut = new CreateSessionUseCase(
      inMemorySessionsRepository,
    )
  })

  it('should be able to create a new session', async () => {
    const recipientId = new UniqueEntityId().toString()

    const {accessToken, expiresAt} = await fakeEncrypter.encrypt({
      sub: recipientId.toString(),
    })

    const result = await sut.execute({
      recipientId,
      accessToken,
      expiresAt,
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not create session if expiresAt is in the past', async () => {
    const recipientId = new UniqueEntityId().toString()
  
    const result = await sut.execute({
      recipientId,
      accessToken: 'fake-token',
      expiresAt: new Date(Date.now() - 1000),
    })
  
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(SessionExpiredError)
  })

  it('should store the session in the repository with correct values', async () => {
    const recipientId = new UniqueEntityId()
    const { accessToken, expiresAt } = await fakeEncrypter.encrypt({
      sub: recipientId.toString(),
    })
  
    await sut.execute({
      recipientId: recipientId.toString(),
      accessToken,
      expiresAt,
    })
  
    expect(inMemorySessionsRepository.items).toHaveLength(1)
    const session = inMemorySessionsRepository.items[0]
  
    expect(session.recipientId.toString()).toBe(recipientId.toString())
    expect(session.accessToken).toBe(accessToken)
    expect(session.expiresAt.getTime()).toBe(expiresAt.getTime())
  })

  it('should call isExpired before saving', async () => {
    const recipientId = new UniqueEntityId()
    const { accessToken, expiresAt } = await fakeEncrypter.encrypt({
      sub: recipientId.toString(),
    })
  
    const spy = vi.spyOn(Session.prototype, 'isExpired')
  
    await sut.execute({
      recipientId: recipientId.toString(),
      accessToken,
      expiresAt,
    })
  
    expect(spy).toHaveBeenCalled()
  })
})
