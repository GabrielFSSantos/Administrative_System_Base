import { makeUser } from 'test/factories/make-user'
import { FakeHasher } from 'test/fakes/cryptography/fake-hasher'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { vi } from 'vitest'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { PasswordHash } from '../entities/value-objects/password-hash'
import { EditUserPasswordContract } from './contracts/edit-user-password-contract'
import { EditUserPasswordUseCase } from './edit-user-password-use-case'
import { SamePasswordError } from './errors/same-password-error'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

let usersRepository: InMemoryUsersRepository
let hasher: FakeHasher
let sut: EditUserPasswordContract

describe('Edit User Password Use Case Test', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    hasher = new FakeHasher()
    sut = new EditUserPasswordUseCase(usersRepository, hasher, hasher)
  })

  it('should update user password when current is valid and new is different', async () => {
    const currentPassword = 'OldPass@1'
    const newPassword = 'NewPass@1'
    const hashedPassword = await PasswordHash.generateFromPlain(currentPassword, hasher)

    const user = await makeUser({ passwordHash: hashedPassword })

    await usersRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      password: currentPassword,
      newPassword,
    })

    expect(result.isRight()).toBe(true)
  })

  it('should return error if user is not found', async () => {
    const result = await sut.execute({
      userId: 'non-existent-id',
      password: 'Valid@123',
      newPassword: 'NewValid@123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return error if current password is incorrect', async () => {
    const hashedPassword = await PasswordHash.generateFromPlain('Valid@123', hasher)

    const user = await makeUser({ passwordHash: hashedPassword })

    await usersRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      password: 'Wrong@123',
      newPassword: 'NewValid@123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should return error if new password matches current', async () => {
    const samePassword = 'SamePass@1'
    const hash = await PasswordHash.generateFromPlain(samePassword, hasher)

    const user = await makeUser({ passwordHash: hash })

    await usersRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      password: samePassword,
      newPassword: samePassword,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(SamePasswordError)
  })

  it('should store new hashed password on success', async () => {
    const oldPassword = 'OldOne@1'
    const newPassword = 'NewOne@1'
    const oldHash = await PasswordHash.generateFromPlain(oldPassword, hasher)

    const user = await makeUser({ passwordHash: oldHash })

    await usersRepository.create(user)

    await sut.execute({
      userId: user.id.toString(),
      password: oldPassword,
      newPassword,
    })

    const isUpdated = await user.passwordHash.compareWith(newPassword, hasher)

    expect(isUpdated).toBe(true)
  })

  it('should call save repository method', async () => {
    const spy = vi.spyOn(usersRepository, 'save')
    const hashed = await PasswordHash.generateFromPlain('Initial@1', hasher)

    const user = await makeUser({ passwordHash: hashed })

    await usersRepository.create(user)

    await sut.execute({
      userId: user.id.toString(),
      password: 'Initial@1',
      newPassword: 'Updated@1',
    })

    expect(spy).toHaveBeenCalledWith(user)
  })
})
