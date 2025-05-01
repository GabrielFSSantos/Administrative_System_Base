import { AuthenticateUserUseCase } from './authenticate'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeUser } from 'test/factories/make-user'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateUserUseCase

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateUserUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a new user', async () => {
    const user = makeUser({
      email: 'johndoe@exemple.com',
      password: await fakeHasher.generate('123456'),
    })

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      email: 'johndoe@exemple.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not authenticate with malformed email', async () => {
    const user = makeUser({
      email: 'johndoe@exemple.com',
      password: await fakeHasher.generate('123456'),
    })

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      email: 'invalid-email',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
  })

  it('should fail if password is wrong', async () => {
    const user = makeUser({
      email: 'johndoe@exemple.com',
      password: await fakeHasher.generate('123456'),
    })

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      email: 'johndoe@exemple.com',
      password: 'wrong-password',
    })

    expect(result.isLeft()).toBe(true)
  })

  it('should not authenticate with SQL injection string as email', async () => {
    const user = makeUser({
      email: 'johndoe@exemple.com',
      password: await fakeHasher.generate('123456'),
    })

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      // eslint-disable-next-line quotes
      email: "'; DROP TABLE users; --",
      password: 'irrelevant',
    })

    expect(result.isLeft()).toBe(true)
  })
})
