import { FakeHasher } from 'test/fakes/cryptography/fake-hasher'
import { generateValidCPF } from 'test/fakes/users/value-objects/fake-generate-valid-cpf'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { CPF } from '@/domain/users/entities/value-objects/cpf'
import { EmailAddress } from '@/domain/users/entities/value-objects/email-address'
import { WeakPasswordError } from '@/domain/users/entities/value-objects/errors/weak-password-error'
import { Name } from '@/domain/users/entities/value-objects/name'

import { CreateUserContract } from './contracts/create-user-contract'
import { CreateUserUseCase } from './create-user-use-case'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let sut: CreateUserContract

describe('Create User Use Case Test', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    sut = new CreateUserUseCase(inMemoryUsersRepository, fakeHasher)
  })

  it('should create a user with valid data', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      emailAddress: 'john@example.com',
      password: 'Secure@123',
      cpf: generateValidCPF(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.user).toEqual(inMemoryUsersRepository.items[0])
    }
  })

  it('should hash the password before storing', async () => {
    await sut.execute({
      name: 'John Doe',
      emailAddress: 'john@example.com',
      password: 'Secure@123',
      cpf: generateValidCPF(),
    })

    const user = inMemoryUsersRepository.items[0]

    const isPasswordHashed = await fakeHasher.compare('Secure@123', user.passwordHash.value)

    expect(isPasswordHashed).toBe(true)
  })

  it('should not store password in plain text', async () => {
    await sut.execute({
      name: 'John Doe',
      emailAddress: 'john@example.com',
      password: 'Plain@123',
      cpf: generateValidCPF(),
    })

    const user = inMemoryUsersRepository.items[0]

    expect(user.passwordHash.value).not.toBe('Plain@123')
  })

  it('should not allow duplicate emails', async () => {
    const data = {
      name: 'John Doe',
      emailAddress: 'john@example.com',
      password: 'Secure@123',
      cpf: generateValidCPF(),
    }

    await sut.execute(data)
    const result = await sut.execute({ ...data, cpf: generateValidCPF() })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should not allow duplicate CPF', async () => {
    const cpf = generateValidCPF()

    await sut.execute({
      name: 'User One',
      emailAddress: 'user1@example.com',
      password: 'Secure@123',
      cpf,
    })

    const result = await sut.execute({
      name: 'User Two',
      emailAddress: 'user2@example.com',
      password: 'Secure@123',
      cpf,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })

  it.skip('should reject weak passwords', async () => {
    const result = await sut.execute({
      name: 'Weak Password User',
      emailAddress: 'weak@example.com',
      password: 'weak',
      cpf: generateValidCPF(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WeakPasswordError)
  })

  it('should store valid value objects', async () => {
    await sut.execute({
      name: 'Jane Smith',
      emailAddress: 'jane@example.com',
      password: 'Secure@123',
      cpf: generateValidCPF(),
    })

    const user = inMemoryUsersRepository.items[0]

    expect(user.name).toBeInstanceOf(Name)
    expect(user.emailAddress).toBeInstanceOf(EmailAddress)
    expect(user.cpf).toBeInstanceOf(CPF)
    expect(user.passwordHash.value).toMatch(/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/)
  })
})
