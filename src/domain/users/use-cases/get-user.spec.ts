import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { GetUserUseCase } from './get-user'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: GetUserUseCase

describe('Get User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()

    sut = new GetUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to get a user', async () => {
    const user = makeUser()
  
    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({userId: user.id.toString()})

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.items[0],
    })

  })

  it('should throw UserNotFoundError if user does not exist', async () => {
    const result = await sut.execute({userId: 'non-existing-id'})

    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
  
  it('should call repository with correct user id', async () => {

    const spy = vi.spyOn(inMemoryUsersRepository, 'findById')

    const user = makeUser()
  
    await inMemoryUsersRepository.create(user)

    await sut.execute({userId: user.id.toString()})
  
    expect(spy).toHaveBeenCalledWith(user.id.toString())
  })
})
