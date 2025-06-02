import { makeUser } from 'test/factories/users/make-user'
import { generateEmailValueObject } from 'test/factories/value-objects/make-email'
import { generateLocaleValueObject } from 'test/factories/value-objects/make-locale'
import { generateNameValueObject } from 'test/factories/value-objects/make-name'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { vi } from 'vitest'

import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { SupportedLocale } from '@/shared/value-objects/locale/locale.enum'

import { EditUserContract } from './contracts/edit-user-contract'
import { EditUserUseCase } from './edit-user-use-case'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: EditUserContract

describe('EditUserUseCaseTest', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new EditUserUseCase(usersRepository)
  })

  it('should edit both name and email of a user', async () => {
    const user = await makeUser()

    await usersRepository.create(user)

    const newName = 'Updated Name'
    const newEmail = 'updated@example.com'

    const result = await sut.execute({
      userId: user.id.toString(),
      name: newName,
      emailAddress: newEmail,
    })

    expect(result.isRight()).toBe(true)

    const updated = await usersRepository.findById(user.id.toString())

    expect(updated?.name.toString()).toBe(generateNameValueObject(newName).toString())
    expect(updated?.emailAddress.toString()).toBe(generateEmailValueObject(newEmail).toString())
  })

  it('should edit only the name if email is not provided', async () => {
    const user = await makeUser()

    await usersRepository.create(user)

    const newName = 'Only Name Updated'

    const result = await sut.execute({
      userId: user.id.toString(),
      name: newName,
    })

    expect(result.isRight()).toBe(true)

    const updated = await usersRepository.findById(user.id.toString())

    expect(updated?.name.toString()).toBe(generateNameValueObject(newName).toString())
  })

  it('should edit only the email if name is not provided', async () => {
    const user = await makeUser()

    await usersRepository.create(user)

    const newEmail = 'newemail@example.com'

    const result = await sut.execute({
      userId: user.id.toString(),
      emailAddress: newEmail,
    })

    expect(result.isRight()).toBe(true)

    const updated = await usersRepository.findById(user.id.toString())

    expect(updated?.emailAddress.toString()).toBe(generateEmailValueObject(newEmail).toString())
  })

  it('should edit locale if provided', async () => {
    const user = await makeUser({
      locale: generateLocaleValueObject(SupportedLocale.PT_BR),
    })

    await usersRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      locale: SupportedLocale.EN_US,
    })

    expect(result.isRight()).toBe(true)

    const updated = await usersRepository.findById(user.id.toString())

    expect(updated?.locale.value).toBe(SupportedLocale.EN_US)
  })

  it('should not allow editing to an email that already exists for another user', async () => {
    const user1 = await makeUser({ emailAddress: generateEmailValueObject('email1@test.com') })
    const user2 = await makeUser({ emailAddress: generateEmailValueObject('email2@test.com') })

    await usersRepository.create(user1)
    await usersRepository.create(user2)

    const result = await sut.execute({
      userId: user1.id.toString(),
      emailAddress: 'email2@test.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should return error if user does not exist', async () => {
    const result = await sut.execute({
      userId: 'non-existent-id',
      name: 'Does Not Matter',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should call repository.save with updated user', async () => {
    const user = await makeUser()

    await usersRepository.create(user)

    const spy = vi.spyOn(usersRepository, 'save')

    await sut.execute({
      userId: user.id.toString(),
      name: 'Tracked Save Call',
    })

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ id: user.id }))
  })

  it('should update updatedAt when user is edited', async () => {
    const user = await makeUser()

    await usersRepository.create(user)

    const beforeUpdate = user.updatedAt

    await sut.execute({
      userId: user.id.toString(),
      name: 'With Timestamp',
    })

    const updatedUser = await usersRepository.findById(user.id.toString())

    expect(updatedUser?.updatedAt).not.toBe(beforeUpdate)
    expect(updatedUser?.updatedAt).toBeInstanceOf(Date)
  })
})
