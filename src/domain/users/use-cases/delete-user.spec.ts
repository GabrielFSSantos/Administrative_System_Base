import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { DeleteUserUseCase } from './delete-user'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: DeleteUserUseCase

describe('Delete User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()

    sut = new DeleteUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to delete a user', async () => {
    const user = makeUser()
  
    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({userId: user.id.toString()})

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items).toHaveLength(0)

  })

  it('should throw UserNotFoundError if user does not exist', async () => {
    const result = await sut.execute({userId: 'non-existing-id'})

    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
  
  it('should call repository with correct user id', async () => {

    const spy = vi.spyOn(inMemoryUsersRepository, 'delete')

    const user = makeUser()
  
    await inMemoryUsersRepository.create(user)

    await sut.execute({userId: user.id.toString()})
  
    expect(spy).toHaveBeenCalledWith(user.id)
  })

  it('should preserve other users when one is deleted', async () => {
    const user1 = makeUser()
    const user2 = makeUser()
  
    await inMemoryUsersRepository.create(user1)
    await inMemoryUsersRepository.create(user2)
  
    await sut.execute({ userId: user1.id.toString() })
  
    expect(inMemoryUsersRepository.items).toHaveLength(1)
    expect(inMemoryUsersRepository.items[0].id.toString()).toBe(user2.id.toString())
  })

  it('should not find the user after deletion', async () => {
    const user = makeUser()
  
    await inMemoryUsersRepository.create(user)
  
    await sut.execute({ userId: user.id.toString() })
  
    const found = await inMemoryUsersRepository.findById(user.id.toString())

    expect(found).toBeNull()
  })
})
