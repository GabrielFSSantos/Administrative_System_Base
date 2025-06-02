import { makeSystemAdmin } from 'test/factories/system-admins/make-system-admin'
import { InMemorySystemAdminsRepository } from 'test/repositories/in-memory-system-admins-repository'

import { FetchManySystemAdminsContract } from '@/domain/system-admins/use-cases/contracts/fetch-many-system-admins-contract'
import { FetchManySystemAdminsUseCase } from '@/domain/system-admins/use-cases/fetch-many-system-admins-use-case'
import { InvalidPaginationParamsError } from '@/shared/errors/invalid-pagination-params-error'

let systemAdminsRepository: InMemorySystemAdminsRepository
let sut: FetchManySystemAdminsContract

describe('FetchManySystemAdminsUseCase', () => {
  beforeEach(() => {
    systemAdminsRepository = new InMemorySystemAdminsRepository()
    sut = new FetchManySystemAdminsUseCase(systemAdminsRepository)
  })

  it('should fetch up to pageSize system admins', async () => {
    for (let i = 0; i < 25; i++) {
      const systemAdmin = await makeSystemAdmin()

      await systemAdminsRepository.create(systemAdmin)
    }

    const result = await sut.execute({
      page: 1,
      pageSize: 20,
      search: undefined,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.systemAdmins).toHaveLength(20)
      expect(result.value.pagination.total).toBe(25)
      expect(result.value.pagination.page).toBe(1)
      expect(result.value.pagination.pageSize).toBe(20)
    }
  })

  it('should return correct page of system admins', async () => {
    for (let i = 0; i < 30; i++) {
      const systemAdmin = await makeSystemAdmin()

      await systemAdminsRepository.create(systemAdmin)
    }

    const result = await sut.execute({
      page: 2,
      pageSize: 10,
      search: undefined,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.systemAdmins).toHaveLength(10)
      expect(result.value.pagination.page).toBe(2)
    }
  })

  it('should return empty list if no system admins exist', async () => {
    const result = await sut.execute({
      page: 1,
      pageSize: 10,
      search: undefined,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.systemAdmins).toHaveLength(0)
      expect(result.value.pagination.total).toBe(0)
    }
  })

  it('should return error when page is less than 1', async () => {
    const result = await sut.execute({
      page: 0,
      pageSize: 10,
      search: undefined,
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidPaginationParamsError)
    }
  })

  it('should return error when pageSize is less than 1', async () => {
    const result = await sut.execute({
      page: 1,
      pageSize: 0,
      search: undefined,
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(InvalidPaginationParamsError)
    }
  })

  it('should filter system admins based on search term (by id)', async () => {
    const adminA = await makeSystemAdmin()
    const adminB = await makeSystemAdmin()

    await systemAdminsRepository.create(adminA)
    await systemAdminsRepository.create(adminB)

    const result = await sut.execute({
      page: 1,
      pageSize: 10,
      search: adminA.id.toString().substring(0, 5),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.systemAdmins.length).toBeGreaterThanOrEqual(1)
      const found = result.value.systemAdmins.some(
        (admin) => admin.id.equals(adminA.id),
      )

      expect(found).toBe(true)
    }
  })
})
