import { makeCompany } from 'test/factories/companies/make-company'
import { generateNameValueObject } from 'test/factories/value-objects/make-name'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { vi } from 'vitest'

import { InvalidPaginationParamsError } from '@/shared/errors/invalid-pagination-params-error'

import { FetchManyCompaniesContract } from './contracts/fetch-many-companies-contract'
import { FetchManyCompaniesUseCase } from './fetch-many-companies-use-case'

let companiesRepository: InMemoryCompaniesRepository
let sut: FetchManyCompaniesContract

describe('FetchManyCompaniesUseCaseTest', () => {
  beforeEach(() => {
    companiesRepository = new InMemoryCompaniesRepository()
    sut = new FetchManyCompaniesUseCase(companiesRepository)
  })

  it('should fetch up to pageSize companies', async () => {
    for (let i = 0; i < 25; i++) {
      const company = await makeCompany()

      await companiesRepository.create(company)
    }

    const result = await sut.execute({ page: 1, pageSize: 20 })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.companies).toHaveLength(20)
      expect(result.value.pagination.total).toBe(25)
      expect(result.value.pagination.page).toBe(1)
      expect(result.value.pagination.pageSize).toBe(20)
    }
  })

  it('should return correct page of companies', async () => {
    for (let i = 0; i < 30; i++) {
      const company = await makeCompany()

      await companiesRepository.create(company)
    }

    const result = await sut.execute({ page: 2, pageSize: 10 })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.companies).toHaveLength(10)
      expect(result.value.pagination.page).toBe(2)
    }
  })

  it('should return empty list if no companies exist', async () => {
    const result = await sut.execute({ page: 1, pageSize: 10 })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.companies).toHaveLength(0)
      expect(result.value.pagination.total).toBe(0)
    }
  })

  it('should call repository with correct page and pageSize', async () => {
    const spy = vi.spyOn(companiesRepository, 'findMany')

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

  it('should filter companies based on search term', async () => {
    const matchingCompany = await makeCompany({ name: generateNameValueObject('Ana Clara Ltda') })
    const otherCompany = await makeCompany({ name: generateNameValueObject('João Silva ME') })

    await companiesRepository.create(matchingCompany)
    await companiesRepository.create(otherCompany)

    const result = await sut.execute({ page: 1, pageSize: 10, search: 'ana' })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.companies).toHaveLength(1)
      expect(result.value.companies[0].name.value).toContain('Ana')
    }
  })
})
