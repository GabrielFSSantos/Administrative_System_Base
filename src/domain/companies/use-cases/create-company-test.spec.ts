import { generateValidCNPJ } from 'test/factories/companies/value-objects/make-cnpj'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'

import { CreateCompanyContract } from '@/domain/companies/use-cases/contracts/create-company-contract'
import { CreateCompanyUseCase } from '@/domain/companies/use-cases/create-company-use-case'
import { CompanyAlreadyExistsError } from '@/domain/companies/use-cases/errors/company-already-exists-error'

let companiesRepository: InMemoryCompaniesRepository
let sut: CreateCompanyContract

describe('Create Company Use Case', () => {
  beforeEach(() => {
    companiesRepository = new InMemoryCompaniesRepository()
    sut = new CreateCompanyUseCase(companiesRepository)
  })

  it('should create a new company successfully', async () => {
    const validCNPJ = generateValidCNPJ()

    const result = await sut.execute({
      cnpj: validCNPJ,
      name: 'Test Company',
      emailAddress: 'test@company.com',
      profileIds: ['profile-id-1'],
      permissionValues: ['create_user'],
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.company).toBeDefined()
      expect(result.value.company.cnpj.value).toBe(validCNPJ)
      expect(result.value.company.name.value).toBe('Test Company')
      expect(result.value.company.emailAddress.value).toBe('test@company.com')
    }
  })

  it('should not allow duplicate company with same CNPJ', async () => {
    const validCNPJ = generateValidCNPJ()

    await sut.execute({
      cnpj: validCNPJ,
      name: 'Test Company',
      emailAddress: 'test@company.com',
      profileIds: ['profile-id-1'],
      permissionValues: ['create_user'],
    })

    const result = await sut.execute({
      cnpj: validCNPJ,
      name: 'Another Company',
      emailAddress: 'another@company.com',
      profileIds: ['profile-id-2'],
      permissionValues: ['delete_user'],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(CompanyAlreadyExistsError)
  })

  it('should persist company in repository', async () => {
    const validCNPJ = generateValidCNPJ()

    await sut.execute({
      cnpj: validCNPJ,
      name: 'Test Company',
      emailAddress: 'test@company.com',
      profileIds: ['profile-id-1'],
      permissionValues: ['create_user'],
    })

    const stored = await companiesRepository.findByCNPJ(validCNPJ)

    expect(stored).not.toBeNull()
    expect(stored?.cnpj.value).toBe(validCNPJ)
  })
})
