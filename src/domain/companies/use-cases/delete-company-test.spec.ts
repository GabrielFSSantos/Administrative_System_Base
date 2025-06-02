import { makeCompany } from 'test/factories/companies/make-company'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { vi } from 'vitest'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { DeleteCompanyContract } from './contracts/delete-company-contract'
import { DeleteCompanyUseCase } from './delete-company-use-case'

let companiesRepository: InMemoryCompaniesRepository
let sut: DeleteCompanyContract

describe('DeleteCompanyUseCaseTest', () => {
  beforeEach(() => {
    companiesRepository = new InMemoryCompaniesRepository()
    sut = new DeleteCompanyUseCase(companiesRepository)
  })

  it('should delete a company by ID', async () => {
    const company = await makeCompany()

    await companiesRepository.create(company)

    const result = await sut.execute({ companyId: company.id.toString() })

    expect(result.isRight()).toBe(true)
    expect(companiesRepository.items).toHaveLength(0)
  })

  it('should return ResourceNotFoundError if company does not exist', async () => {
    const result = await sut.execute({ companyId: UniqueEntityId.create().toString() })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should call repository.delete with the correct company ID', async () => {
    const company = await makeCompany()

    await companiesRepository.create(company)

    const deleteSpy = vi.spyOn(companiesRepository, 'delete')

    await sut.execute({ companyId: company.id.toString() })

    expect(deleteSpy).toHaveBeenCalledWith(company.id.toString())
  })
})
