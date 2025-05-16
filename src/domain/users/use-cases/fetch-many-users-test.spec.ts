import { makeUser } from 'test/factories/users/make-user'
import { generateNameValueObject } from 'test/factories/value-objects/make-name'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { vi } from 'vitest'

import { InvalidPaginationParamsError } from '@/shared/errors/invalid-pagination-params-error'

import { FetchManyUsersContract } from './contracts/fetch-many-users-contract'
import { FetchManyUsersUseCase } from './fetch-many-users-use-case'

let usersRepository: InMemoryUsersRepository
let sut: FetchManyUsersContract

describe('Fetch Many Users Use Case Test', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new FetchManyUsersUseCase(usersRepository)
  })

  it('should fetch up to pageSize users', async () => {
    for (let i = 0; i < 25; i++) {
      const user = await makeUser()

      await usersRepository.create(user)
    }

    const result = await sut.execute({ page: 1, pageSize: 20 })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.users).toHaveLength(20)
      expect(result.value.pagination.total).toBe(25)
      expect(result.value.pagination.page).toBe(1)
      expect(result.value.pagination.pageSize).toBe(20)
    }
  })

  it('should return correct page of users', async () => {
    for (let i = 0; i < 30; i++) {
      const user = await makeUser()

      await usersRepository.create(user)
    }

    const result = await sut.execute({ page: 2, pageSize: 10 })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.users).toHaveLength(10)
      expect(result.value.pagination.page).toBe(2)
    }
  })

  it('should return empty list if no users exist', async () => {
    const result = await sut.execute({ page: 1, pageSize: 10 })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.users).toHaveLength(0)
      expect(result.value.pagination.total).toBe(0)
    }
  })

  it('should call repository with correct page and pageSize', async () => {
    const spy = vi.spyOn(usersRepository, 'findMany')

    await sut.execute({ page: 3, pageSize: 15 })

    expect(spy).toHaveBeenCalledWith({ page: 3, pageSize: 15, search: undefined })
  })

  it('should return error when page is less than 1', async () => {
    const result = await sut.execute({ page: 0, pageSize: 10 })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidPaginationParamsError)
    }
  })

  it('should return error when pageSize is less than 1', async () => {
    const result = await sut.execute({ page: 1, pageSize: 0 })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidPaginationParamsError)
    }
  })

  it('should filter users based on search term', async () => {
    const matchingUser = await makeUser({ name: generateNameValueObject('Ana Clara')})
    const otherUser = await makeUser({ name: generateNameValueObject('João Silva')})

    await usersRepository.create(matchingUser)
    await usersRepository.create(otherUser)

    const result = await sut.execute({ page: 1, pageSize: 10, search: 'ana' })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.users).toHaveLength(1)
      expect(result.value.users[0].name.value).toContain('Ana')
    }
  })
})
