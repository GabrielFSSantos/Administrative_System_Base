import { makeCompany } from 'test/factories/companies/make-company'
import { generateEmailValueObject } from 'test/factories/value-objects/make-email'
import { generateLocaleValueObject } from 'test/factories/value-objects/make-locale'
import { generateNameValueObject } from 'test/factories/value-objects/make-name'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { vi } from 'vitest'

import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { SupportedLocale } from '@/shared/value-objects/locale/locale.enum'

import { EditCompanyContract } from './contracts/edit-company-contract'
import { EditCompanyUseCase } from './edit-company-use-case'

let companiesRepository: InMemoryCompaniesRepository
let sut: EditCompanyContract

describe('EditCompanyUseCaseTest', () => {
  beforeEach(() => {
    companiesRepository = new InMemoryCompaniesRepository()
    sut = new EditCompanyUseCase(companiesRepository)
  })

  it('should edit both name and email of a company', async () => {
    const company = await makeCompany()

    await companiesRepository.create(company)

    const newName = 'Updated Company Name'
    const newEmail = 'updated@company.com'

    const result = await sut.execute({
      companyId: company.id.toString(),
      name: newName,
      emailAddress: newEmail,
      permissionValues: [],
      locale: company.locale.value,
    })

    expect(result.isRight()).toBe(true)

    const updated = await companiesRepository.findById(company.id.toString())

    expect(updated?.name.toString()).toBe(generateNameValueObject(newName).toString())
    expect(updated?.emailAddress.toString()).toBe(generateEmailValueObject(newEmail).toString())
  })

  it('should edit only the name if email is not provided', async () => {
    const company = await makeCompany()

    await companiesRepository.create(company)

    const newName = 'Only Name Updated'

    const result = await sut.execute({
      companyId: company.id.toString(),
      name: newName,
      permissionValues: [],
      locale: company.locale.value,
    })

    expect(result.isRight()).toBe(true)

    const updated = await companiesRepository.findById(company.id.toString())

    expect(updated?.name.toString()).toBe(generateNameValueObject(newName).toString())
  })

  it('should edit only the email if name is not provided', async () => {
    const company = await makeCompany()

    await companiesRepository.create(company)

    const newEmail = 'newemail@company.com'

    const result = await sut.execute({
      companyId: company.id.toString(),
      emailAddress: newEmail,
      permissionValues: [],
      locale: company.locale.value,
    })

    expect(result.isRight()).toBe(true)

    const updated = await companiesRepository.findById(company.id.toString())

    expect(updated?.emailAddress.toString()).toBe(generateEmailValueObject(newEmail).toString())
  })

  it('should edit the locale if provided', async () => {
    const company = await makeCompany({
      locale: generateLocaleValueObject(SupportedLocale.PT_BR),
    })

    await companiesRepository.create(company)

    const result = await sut.execute({
      companyId: company.id.toString(),
      permissionValues: [],
      locale: SupportedLocale.EN_US,
    })

    expect(result.isRight()).toBe(true)

    const updated = await companiesRepository.findById(company.id.toString())

    expect(updated?.locale.value).toBe(SupportedLocale.EN_US)
  })

  it('should return error if company does not exist', async () => {
    const result = await sut.execute({
      companyId: 'non-existent-id',
      name: 'Does Not Matter',
      permissionValues: [],
      locale: SupportedLocale.PT_BR,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should call repository.save with updated company', async () => {
    const company = await makeCompany()

    await companiesRepository.create(company)

    const spy = vi.spyOn(companiesRepository, 'save')

    await sut.execute({
      companyId: company.id.toString(),
      name: 'Tracked Save Call',
      permissionValues: [],
      locale: company.locale.value,
    })

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ id: company.id }))
  })

  it('should update updatedAt when company is edited', async () => {
    const company = await makeCompany()

    await companiesRepository.create(company)

    const beforeUpdate = company.updatedAt

    await sut.execute({
      companyId: company.id.toString(),
      name: 'With Timestamp',
      permissionValues: [],
      locale: company.locale.value,
    })

    const updatedCompany = await companiesRepository.findById(company.id.toString())

    expect(updatedCompany?.updatedAt).not.toBe(beforeUpdate)
    expect(updatedCompany?.updatedAt).toBeInstanceOf(Date)
  })
})
