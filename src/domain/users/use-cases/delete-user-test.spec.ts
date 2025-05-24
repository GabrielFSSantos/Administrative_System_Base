import { makeUser } from 'test/factories/users/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { vi } from 'vitest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { DeleteUserContract } from './contracts/delete-user-contract'
import { DeleteUserUseCase } from './delete-user-use-case'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: DeleteUserContract

describe('Delete User Use Case Test', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new DeleteUserUseCase(inMemoryUsersRepository)
  })

  it('should delete a user by ID', async () => {
    const user = await makeUser()

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({ userId: user.id.toString() })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items).toHaveLength(0)
  })

  it('should return ResourceNotFoundError if user does not exist', async () => {
    const result = await sut.execute({ userId: new UniqueEntityId().toString() })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should call repository.delete with the correct user ID', async () => {
    const user = await makeUser()

    await inMemoryUsersRepository.create(user)

    const deleteSpy = vi.spyOn(inMemoryUsersRepository, 'delete')

    await sut.execute({ userId: user.id.toString() })

    expect(deleteSpy).toHaveBeenCalledWith(user.id.toString())
  })

  it('should preserve other users after deletion', async () => {
    const user1 = await makeUser()
    const user2 = await makeUser()

    await inMemoryUsersRepository.create(user1)
    await inMemoryUsersRepository.create(user2)

    await sut.execute({ userId: user1.id.toString() })

    expect(inMemoryUsersRepository.items).toHaveLength(1)
    expect(inMemoryUsersRepository.items[0].id.toString()).toBe(user2.id.toString())
  })

  it('should not find user after it is deleted', async () => {
    const user = await makeUser()

    await inMemoryUsersRepository.create(user)

    await sut.execute({ userId: user.id.toString() })

    const result = await inMemoryUsersRepository.findById(user.id.toString())

    expect(result).toBeNull()
  })

  it('should not throw when trying to delete user twice', async () => {
    const user = await makeUser()

    await inMemoryUsersRepository.create(user)

    await sut.execute({ userId: user.id.toString() })
    const result = await sut.execute({ userId: user.id.toString() })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
