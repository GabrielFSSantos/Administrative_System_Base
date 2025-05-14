import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { vi } from 'vitest'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { GetUserContract } from './contracts/get-user-contract'
import { GetUserUseCase } from './get-user-use-case'

let usersRepository: InMemoryUsersRepository
let sut: GetUserContract

describe('GetUserUseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserUseCase(usersRepository)
  })

  it('should retrieve a user by valid id', async () => {
    const user = await makeUser()

    await usersRepository.create(user)

    const result = await sut.execute({ userId: user.id.toString() })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.user.id.toString()).toBe(user.id.toString())
      expect(result.value.user.name.value).toBe(user.name.value)
      expect(result.value.user.emailAddress.value).toBe(user.emailAddress.value)
      expect(result.value.user.cpf.value).toBe(user.cpf.value)
    }
  })

  it('should return error if user does not exist', async () => {
    const result = await sut.execute({ userId: 'non-existent-id' })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })

  it('should call repository with correct id', async () => {
    const user = await makeUser()

    await usersRepository.create(user)

    const spy = vi.spyOn(usersRepository, 'findById')

    await sut.execute({ userId: user.id.toString() })

    expect(spy).toHaveBeenCalledWith(user.id.toString())
  })

  it('should not retrieve a user after deletion', async () => {
    const user = await makeUser()

    await usersRepository.create(user)
    await usersRepository.delete(user.id)

    const result = await sut.execute({ userId: user.id.toString() })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })
})
