import { makeUser } from 'test/factories/make-user'
import { FakeEncrypter } from 'test/fakes/cryptography/fake-encrypter'
import { FakeHasher } from 'test/fakes/cryptography/fake-hasher'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { NotAllowedError } from '@/core/errors/not-allowed-error'

import { AuthenticateUserUseCase } from './authenticate-user-use-case'
import { AuthenticateUserContract } from './contracts/authenticate-user-contract'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateUserContract

describe('Authenticate User Test', () => {
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

  it('should be able to authenticate an user', async () => {
    const user = makeUser({
      email: 'johndoe@exemple.com',
      password: await fakeHasher.generate('123456'),
      isActive: new Date(),
    })

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      email: 'johndoe@exemple.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      userId: expect.any(String),
      accessToken: expect.any(String),
      expiresAt: expect.any(Date),
    })
  })

  it('should not authenticate an user with malformed email', async () => {
    const user = makeUser({
      email: 'johndoe@exemple.com',
      password: await fakeHasher.generate('123456'),
      isActive: new Date(),
    })

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      email: 'invalid-email',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should fail if password is wrong', async () => {
    const user = makeUser({
      email: 'johndoe@exemple.com',
      password: await fakeHasher.generate('123456'),
      isActive: new Date(),
    })

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      email: 'johndoe@exemple.com',
      password: 'wrong-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should not authenticate an user with SQL injection string as email', async () => {
    const user = makeUser({
      email: 'johndoe@exemple.com',
      password: await fakeHasher.generate('123456'),
      isActive: new Date(),
    })

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      // eslint-disable-next-line quotes
      email: "'; DROP TABLE users; --",
      password: 'irrelevant',
    })

    expect(result.isLeft()).toBe(true)
  })

  it('should not authenticate an inactive user', async () => {
    const user = makeUser({
      email: 'johndoe@exemple.com',
      password: await fakeHasher.generate('123456'),
      isActive: null,
    })
  
    await inMemoryUsersRepository.create(user)
  
    const result = await sut.execute({
      email: 'johndoe@exemple.com',
      password: '123456',
    })
  
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should generate access token with user id as subject', async () => {
    const user = makeUser({
      email: 'johndoe@exemple.com',
      password: await fakeHasher.generate('123456'),
      isActive: new Date(),
    })
  
    await inMemoryUsersRepository.create(user)
  
    const spy = vi.spyOn(fakeEncrypter, 'encrypt')
  
    await sut.execute({
      email: 'johndoe@exemple.com',
      password: '123456',
    })
  
    expect(spy).toHaveBeenCalledWith({
      sub: user.id.toString(),
    })
  })

  it('should call hashComparer.compare with correct arguments', async () => {
    const plainPassword = '123456'
    const hashedPassword = await fakeHasher.generate(plainPassword)
  
    const user = makeUser({
      email: 'johndoe@exemple.com',
      password: hashedPassword,
      isActive: new Date(),
    })
  
    await inMemoryUsersRepository.create(user)
  
    const spy = vi.spyOn(fakeHasher, 'compare')
  
    await sut.execute({
      email: 'johndoe@exemple.com',
      password: plainPassword,
    })
  
    expect(spy).toHaveBeenCalledWith(plainPassword, hashedPassword)
  })

  it('should return a valid future expiration date', async () => {
    const user = makeUser({
      email: 'johndoe@exemple.com',
      password: await fakeHasher.generate('123456'),
      isActive: new Date(),
    })
  
    await inMemoryUsersRepository.create(user)
  
    const result = await sut.execute({
      email: 'johndoe@exemple.com',
      password: '123456',
    })
  
    expect(result.isRight()).toBe(true)
  
    if (result.isRight()) {
      const { expiresAt } = result.value as { accessToken: string; expiresAt: Date }
  
      expect(expiresAt).toBeInstanceOf(Date)
      expect(expiresAt.getTime()).toBeGreaterThan(Date.now())
    }
  })
})
