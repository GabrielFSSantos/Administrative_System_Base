import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Company, CompanyProps } from '@/domain/companies/entities/company'

import { generateEmailValueObject } from '../value-objects/make-email'
import { generateNameValueObject } from '../value-objects/make-name'
import { generatePermissionList } from '../value-objects/make-permissions'
import { generateCNPJValueObject } from './value-objects/make-cnpj'

export async function makeCompany(
  override: Partial<CompanyProps> = {},
  id?: UniqueEntityId,
) {
  const cnpj = override.cnpj ?? generateCNPJValueObject()
  const name = override.name ?? generateNameValueObject()
  const emailAddress = override.emailAddress ?? generateEmailValueObject()
  const permissions = override.permissions ?? generatePermissionList(1)

  const companyOrError = Company.create(
    {
      cnpj,
      name,
      emailAddress,
      permissions,
      ...override,
    },
    id,
  )

  if (companyOrError.isLeft()) {
    throw companyOrError.value
  }

  return companyOrError.value
}
