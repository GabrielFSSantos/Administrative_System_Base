import { makeUser } from 'test/factories/make-user'
import { generateNameValueObject } from 'test/fakes/users/value-objects/fake-generate-name'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { vi } from 'vitest'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { EmailAddress } from '@/domain/users/entities/value-objects/email-address'

import { EditUserContract } from './contracts/edit-user-contract'
import { EditUserUseCase } from './edit-user-use-case'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: EditUserContract

describe('Edit User Use Case Test', () => {
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

    expect(updated?.name.value).toBe(generateNameValueObject(newName).value)
    expect(updated?.emailAddress.value).toBe(EmailAddress.create(newEmail).value)
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

    expect(updated?.name.value).toBe(generateNameValueObject(newName).value)
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

    expect(updated?.emailAddress.value).toBe(EmailAddress.create(newEmail).value)
  })

  it('should not allow editing to an email that already exists for another user', async () => {
    const user1 = await makeUser({ emailAddress: EmailAddress.create('email1@test.com') })
    const user2 = await makeUser({ emailAddress: EmailAddress.create('email2@test.com') })

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
