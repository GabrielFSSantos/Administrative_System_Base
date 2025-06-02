import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Company, CompanyProps } from '@/domain/companies/entities/company'

import { generateActivationStatusValueObject } from '../value-objects/make-activation-status'
import { generateEmailValueObject } from '../value-objects/make-email'
import { generateLocaleValueObject } from '../value-objects/make-locale'
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
  const activationStatus = override.activationStatus ?? generateActivationStatusValueObject(false)
  const locale = override.locale ?? generateLocaleValueObject()

  const companyOrError = Company.create(
    {
      cnpj,
      name,
      emailAddress,
      permissions,
      activationStatus,
      locale,
      ...override,
    },
    id,
  )

  if (companyOrError.isLeft()) {
    throw companyOrError.value
  }

  return companyOrError.value
}
