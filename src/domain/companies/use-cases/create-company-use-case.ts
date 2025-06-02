import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { Company } from '@/domain/companies/entities/company'
import { CNPJ } from '@/domain/companies/entities/value-objects/cnpj'
import { CompaniesRepositoryContract } from '@/domain/companies/repositories/contracts/companies-repository-contract'
import { ActivationStatus } from '@/shared/value-objects/activation-status/activation-status'
import { EmailAddress } from '@/shared/value-objects/email-address'
import { Locale } from '@/shared/value-objects/locale/locale'
import { Name } from '@/shared/value-objects/name'
import { validateAndParsePermissions } from '@/shared/watched-lists/permission-list/helpers/validate-and-parse-permissions-helper'
import { PermissionList } from '@/shared/watched-lists/permission-list/permission-list'

import {
  CreateCompanyContract,
  ICreateCompanyUseCaseRequest,
  ICreateCompanyUseCaseResponse,
} from './contracts/create-company-contract'
import { CompanyAlreadyExistsError } from './errors/company-already-exists-error'

@Injectable()
export class CreateCompanyUseCase implements CreateCompanyContract {
  constructor(
    private readonly companiesRepository: CompaniesRepositoryContract,
  ) {}

  async execute({
    cnpj,
    name,
    emailAddress,
    permissionValues,
    locale,
  }: ICreateCompanyUseCaseRequest): Promise<ICreateCompanyUseCaseResponse> {
    const existing = await this.companiesRepository.findByCNPJ(cnpj)

    if (existing) {
      return left(new CompanyAlreadyExistsError(cnpj))
    }

    const cnpjOrError = CNPJ.create(cnpj)

    if (cnpjOrError.isLeft()) return left(cnpjOrError.value)

    const nameOrError = Name.create(name)

    if (nameOrError.isLeft()) return left(nameOrError.value)

    const emailOrError = EmailAddress.create(emailAddress)

    if (emailOrError.isLeft()) return left(emailOrError.value)

    const localeOrError = Locale.create(locale)

    if (localeOrError.isLeft()) return left(localeOrError.value)

    const permissionsOrError = validateAndParsePermissions(permissionValues)

    if (permissionsOrError.isLeft()) return left(permissionsOrError.value)

    const permissionList = PermissionList.create(permissionsOrError.value)

    const companyOrError = Company.create({
      cnpj: cnpjOrError.value,
      name: nameOrError.value,
      emailAddress: emailOrError.value,
      permissions: permissionList,
      locale: localeOrError.value,
      activationStatus: ActivationStatus.deactivated(),
    })

    if (companyOrError.isLeft()) {
      return left(companyOrError.value)
    }

    await this.companiesRepository.create(companyOrError.value)

    return right({
      company: companyOrError.value,
    })
  }
}
