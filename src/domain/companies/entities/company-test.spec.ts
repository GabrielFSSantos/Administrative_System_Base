import { makeCompany } from 'test/factories/companies/make-company'
import { generateEmailValueObject } from 'test/factories/value-objects/make-email'
import { generateNameValueObject } from 'test/factories/value-objects/make-name'
import { generatePermissionValueObject } from 'test/factories/value-objects/make-permissions'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Company } from '@/domain/companies/entities/company'
import { InvalidUpdatedAtError } from '@/shared/errors/invalid-updated-at-error'
import { EmailAddress } from '@/shared/value-objects/email-address'
import { Name } from '@/shared/value-objects/name'

describe('Company Entity Test', () => {
  it('should create a valid company with makeCompany()', async () => {
    const company = await makeCompany()

    expect(company).toBeInstanceOf(Company)
    expect(company.name).toBeInstanceOf(Name)
    expect(company.emailAddress).toBeInstanceOf(EmailAddress)
    expect(company.cnpj).toBeDefined()
  })

  it('should not create company if updatedAt is before createdAt', async () => {
    const createdAt = new Date('2025-01-02')
    const updatedAt = new Date('2025-01-01')

    const base = await makeCompany()

    const result = Company.create(
      {
        cnpj: base.cnpj,
        name: base.name,
        emailAddress: base.emailAddress,
        createdAt,
        updatedAt,
      },
    )

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidUpdatedAtError)
  })

  it('should update name and refresh updatedAt', async () => {
    const company = await makeCompany()
    const before = company.updatedAt

    const newName = generateNameValueObject('Updated Company')

    company.changeName(newName)

    expect(company.name).toBe(newName)
    expect(company.updatedAt?.getTime()).toBeGreaterThan(before?.getTime() ?? 0)
  })

  it('should update email and refresh updatedAt', async () => {
    const company = await makeCompany()
    const before = company.updatedAt

    const newEmail = generateEmailValueObject('new@email.com')

    company.changeEmail(newEmail)

    expect(company.emailAddress).toBe(newEmail)
    expect(company.updatedAt?.getTime()).toBeGreaterThan(before?.getTime() ?? 0)
  })

  it('should handle permissions correctly', async () => {
    const company = await makeCompany()
    const permission = generatePermissionValueObject('create_user')

    company.updatePermissions([permission])

    expect(company.hasPermission(permission)).toBe(true)
  })

  it('should set createdAt and updatedAt correctly if not provided', async () => {
    const company = await makeCompany()

    expect(company.createdAt).toBeInstanceOf(Date)
    expect(company.updatedAt).toBeNull()
  })

  it('should accept override values in makeCompany', async () => {
    const customName = generateNameValueObject('Custom Name')
    const company = await makeCompany({ name: customName })

    expect(company.name).toBe(customName)
  })

  it('should preserve provided UniqueEntityId', async () => {
    const customId = UniqueEntityId.create()
    const company = await makeCompany({}, customId)

    expect(company.id).toEqual(customId)
  })
})
