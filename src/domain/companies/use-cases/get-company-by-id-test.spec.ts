import { makeCompany } from 'test/factories/companies/make-company'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { vi } from 'vitest'

import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { GetCompanyByIdContract } from './contracts/get-company-by-id-contract'
import { GetCompanyByIdUseCase } from './get-company-by-id-use-case'

let companiesRepository: InMemoryCompaniesRepository
let sut: GetCompanyByIdContract

describe('Get Company By ID Use Case Test', () => {
  beforeEach(() => {
    companiesRepository = new InMemoryCompaniesRepository()
    sut = new GetCompanyByIdUseCase(companiesRepository)
  })

  it('should retrieve a company by valid id', async () => {
    const company = await makeCompany()

    await companiesRepository.create(company)

    const result = await sut.execute({ companyId: company.id.toString() })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.company.id.toString()).toBe(company.id.toString())
    }
  })

  it('should return error if company does not exist', async () => {
    const result = await sut.execute({ companyId: 'non-existent-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should call repository with correct id', async () => {
    const company = await makeCompany()

    await companiesRepository.create(company)

    const spy = vi.spyOn(companiesRepository, 'findById')

    await sut.execute({ companyId: company.id.toString() })

    expect(spy).toHaveBeenCalledWith(company.id.toString())
  })
})
