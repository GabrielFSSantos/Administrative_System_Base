import { CreateUserUseCase } from './create-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'
import { FakeHasher } from 'test/cryptography/fake-hasher'
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
    const result = await sut.execute(makeUser())

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.items[0],
    })
  })

  it('should hash user password upon registration', async () => {
    const result = await sut.execute(makeUser({
      password: '123456',
    }))

    const hashedPassword = await fakeHasher.generate('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword)
  })

  it('should not store plain text password', async () => {
    const userData = makeUser({ password: 'plaintext' })
    await sut.execute(userData)
  
    const storedPassword = inMemoryUsersRepository.items[0].password
    expect(storedPassword).not.toBe('plaintext')
  })

  it('should not allow to create a user with an existing email', async () => {
    const userData = makeUser({ email: 'duplicate@example.com' })
  
    await sut.execute(userData)
    const result = await sut.execute(userData)
  
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })
  
  it('should store name, email, role and hashed password', async () => {
    const userData = makeUser({
      name: 'Test User',
      email: 'test@example.com',
      password: 'secret123',
      role: 'admin',
    })
  
    const result = await sut.execute(userData)
    const user = 'user' in result.value ? result.value.user : null

    if (!user) {
      throw new Error('Expected user to be created, but got an error.')
    }
    
    expect(user.name).toBe('Test User')
    expect(user.email).toBe('test@example.com')
    expect(user.role).toBe('admin')
    expect(user.password).not.toBe('secret123')
  })
  
})
