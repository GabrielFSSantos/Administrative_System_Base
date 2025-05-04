import { FakeHasher } from 'test/fakes/cryptography/fake-hasher'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { CreateUserUseCase } from './create-user'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: CreateUserUseCase
let fakeHasher: FakeHasher

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()

    sut = new CreateUserUseCase(inMemoryUsersRepository, fakeHasher)
  })

  it('should be able to create a user', async () => {
    const result = await sut.execute({
      name: 'Test User',
      email: 'test@example.com',
      password: 'secret123',
      role: 'admin',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.items[0],
    })
  })

  it('should hash user password upon registration', async () => {
    const result = await sut.execute({
      name: 'Test User',
      email: 'test@example.com',
      password: '123456',
      role: 'admin',
    })

    const user = inMemoryUsersRepository.items[0]

    const isPasswordCorrect = await fakeHasher.compare(
      '123456',
      user.getHashedPassword(),
    )

    expect(result.isRight()).toBe(true)
    expect(isPasswordCorrect).toBe(true)
  })

  it('should not store plain text password', async () => {
    await sut.execute({
      name: 'Test User',
      email: 'test@example.com',
      password: 'plaintext',
      role: 'admin',
    })
    
    const user = inMemoryUsersRepository.items[0]

    const storedPassword = await fakeHasher.compare(
      'plaintext',
      user.getHashedPassword(),
    )

    expect(storedPassword).not.toBe('plaintext')
  })

  it('should not allow to create a user with an existing email', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: '123456',
      role: 'admin',
    }
  
    await sut.execute(userData)
    const result = await sut.execute(userData)
  
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })
  
  it('should store name, email, role and hashed password', async () => {
    await sut.execute({
      name: 'Test User',
      email: 'test@example.com',
      password: 'secret123',
      role: 'admin',
    })

    const createdUser = inMemoryUsersRepository.items[0]

    expect(createdUser).toMatchObject({
      props: expect.objectContaining({
        name: 'Test User',
        email: 'test@example.com',
        password: 'secret123-hashed',
        role: 'admin',
      }),
    })
  })
  
})
