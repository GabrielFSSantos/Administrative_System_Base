import { makeUser } from 'test/factories/make-user'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'

import { FetchManyUsersContract } from './contracts/fetch-many-users-contract'
import { FetchManyUsersUseCase } from './fetch-many-users-use-case'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: FetchManyUsersContract

describe('Fetch Many Users Test', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()

    sut = new FetchManyUsersUseCase(inMemoryUsersRepository)
  })

  it('should be able to fetch many users', async () => {
    for (let i = 0; i < 25; i++) {
      const user = makeUser()
  
      await inMemoryUsersRepository.create(user)
    }
  
    const result = await sut.execute({ page: 1, pageSize: 20})

    expect(result.isRight()).toBe(true)
    expect(result.value?.users).toHaveLength(20)
  })

  it('should return empty list if no users exist', async () => {
    const result = await sut.execute({ page: 1, pageSize: 20})

    expect(result.value?.users).toHaveLength(0)
  })

  it('should call repository with correct page number', async () => {
    const spy = vi.spyOn(inMemoryUsersRepository, 'findMany')
  
    await sut.execute({ page: 5, pageSize: 20})
  
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ page: 5, pageSize: 20}))
  })
})
