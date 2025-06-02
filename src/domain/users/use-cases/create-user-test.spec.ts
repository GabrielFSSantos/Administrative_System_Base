import { generateValidCPF } from 'test/factories/users/value-objects/make-cpf'
import { FakeHasher } from 'test/fakes/services/cryptography/fake-hasher'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { CPF } from '@/domain/users/entities/value-objects/cpf'
import { WeakPasswordError } from '@/domain/users/entities/value-objects/errors/weak-password-error'
import { EmailAddress } from '@/shared/value-objects/email-address'
import { SupportedLocale } from '@/shared/value-objects/locale/locale.enum'
import { Name } from '@/shared/value-objects/name'

import { CreateUserContract } from './contracts/create-user-contract'
import { CreateUserUseCase } from './create-user-use-case'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let sut: CreateUserContract

describe('CreateUserUseCaseTest', () => {
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
      locale: SupportedLocale.PT_BR,
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
      locale: SupportedLocale.PT_BR,
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
      locale: SupportedLocale.PT_BR,
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
      locale: SupportedLocale.PT_BR,
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
      locale: SupportedLocale.PT_BR,
    })

    const result = await sut.execute({
      name: 'User Two',
      emailAddress: 'user2@example.com',
      password: 'Secure@123',
      cpf,
      locale: SupportedLocale.PT_BR,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should reject weak passwords', async () => {
    const result = await sut.execute({
      name: 'Weak Password User',
      emailAddress: 'weak@example.com',
      password: 'weak',
      cpf: generateValidCPF(),
      locale: SupportedLocale.PT_BR,
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
      locale: SupportedLocale.EN_US,
    })

    const user = inMemoryUsersRepository.items[0]

    expect(user.name).toBeInstanceOf(Name)
    expect(user.emailAddress).toBeInstanceOf(EmailAddress)
    expect(user.cpf).toBeInstanceOf(CPF)
    expect(user.passwordHash.value).toMatch(/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/)
  })
})
