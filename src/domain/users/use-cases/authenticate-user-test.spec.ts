import { makeUser } from 'test/factories/make-user'
import { FakeEncrypter } from 'test/fakes/cryptography/fake-encrypter'
import { FakeHasher } from 'test/fakes/cryptography/fake-hasher'
import { generatePasswordHashValueObject } from 'test/fakes/users/value-objects/fake-generate-password-hash'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { vi } from 'vitest'

import { AuthenticateUserUseCase } from './authenticate-user-use-case'
import { AuthenticateUserContract } from './contracts/authenticate-user-contract'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

let usersRepository: InMemoryUsersRepository
let hashComparer: FakeHasher
let encrypter: FakeEncrypter
let sut: AuthenticateUserContract

describe('Authenticate User Use Case Test', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    hashComparer = new FakeHasher()
    encrypter = new FakeEncrypter()

    sut = new AuthenticateUserUseCase(usersRepository, hashComparer, encrypter)
  })

  it('should authenticate a user with valid credentials', async () => {
    const password = 'Strong@123'
    const hashedPassword = await generatePasswordHashValueObject(password)
    const user = await makeUser({ passwordHash: hashedPassword })

    await usersRepository.create(user)

    const result = await sut.execute({
      emailAddress: user.emailAddress.value,
      password,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      userId: user.id.toString(),
      accessToken: expect.any(String),
      expiresAt: expect.any(Date),
    })
  })

  it('should fail if email does not exist', async () => {
    const result = await sut.execute({
      emailAddress: 'not@found.com',
      password: 'DoesntMatter@1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should fail if password is incorrect', async () => {
    const hashedPassword = await generatePasswordHashValueObject('ValidPass@1')
    const user = await makeUser({ passwordHash: hashedPassword })

    await usersRepository.create(user)

    const result = await sut.execute({
      emailAddress: user.emailAddress.value,
      password: 'WrongPass@1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should call hashComparer.compare with correct values', async () => {
    const plain = 'Secret@123'
    const hash = await hashComparer.generate(plain)
    const hashedPassword = await generatePasswordHashValueObject(plain)

    const user = await makeUser({ passwordHash: hashedPassword })

    await usersRepository.create(user)

    const spy = vi.spyOn(hashComparer, 'compare')

    await sut.execute({ emailAddress: user.emailAddress.value, password: plain })

    expect(spy).toHaveBeenCalledWith(plain, hash)
  })

  it('should generate a token with user id as subject', async () => {
    const password = 'TokenTest@1'
    const hashedPassword = await generatePasswordHashValueObject(password)
    const user = await makeUser({ passwordHash: hashedPassword })

    await usersRepository.create(user)

    const spy = vi.spyOn(encrypter, 'encrypt')

    await sut.execute({ emailAddress: user.emailAddress.value, password })

    expect(spy).toHaveBeenCalledWith({ sub: user.id.toString() })
  })

  it('should return a token with future expiration date', async () => {
    const password = 'FutureTest@2'
    const hashedPassword = await generatePasswordHashValueObject(password)
    const user = await makeUser({ passwordHash: hashedPassword })

    await usersRepository.create(user)

    const result = await sut.execute({
      emailAddress: user.emailAddress.value,
      password,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.expiresAt.getTime()).toBeGreaterThan(Date.now())
    }
  })
})
