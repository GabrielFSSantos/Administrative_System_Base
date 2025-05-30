import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { Company } from '@/domain/companies/entities/company'
import { CNPJ } from '@/domain/companies/entities/value-objects/cnpj'
import { ActivationStatus } from '@/shared/ActivationStatus/value-objects/activation-status'
import { validateAndParsePermissions } from '@/shared/PermissionList/helpers/validate-and-parse-permissions-helper'
import { PermissionList } from '@/shared/PermissionList/permission-list'
import { EmailAddress } from '@/shared/value-objects/email-address'
import { Name } from '@/shared/value-objects/name'

import { CompaniesRepositoryContract } from '../repositories/contracts/companies-repository-contract'
import { CreateCompanyContract, ICreateCompanyUseCaseRequest, ICreateCompanyUseCaseResponse } from './contracts/create-company-contract'
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
  }: ICreateCompanyUseCaseRequest): Promise<ICreateCompanyUseCaseResponse> {

    const existing = await this.companiesRepository.findByCNPJ(cnpj)

    if (existing) {
      return left(new CompanyAlreadyExistsError(cnpj))
    }

    const cnpjObject = CNPJ.create(cnpj)

    if (cnpjObject.isLeft()) {
      return left(cnpjObject.value)
    }

    const nameObject = Name.create(name)

    if (nameObject.isLeft()) {
      return left(nameObject.value)
    }

    const emailAddressObject = EmailAddress.create(emailAddress)

    if (emailAddressObject.isLeft()) {
      return left(emailAddressObject.value)
    }

    const permissionsOrError = validateAndParsePermissions(permissionValues)

    if (permissionsOrError.isLeft()) {
      return left(permissionsOrError.value)
    }
    const permissionList = PermissionList.create(permissionsOrError.value)

    const company = Company.create({
      cnpj: cnpjObject.value,
      name: nameObject.value,
      emailAddress: emailAddressObject.value,
      permissions: permissionList,
      activationStatus: ActivationStatus.deactivated(),
    })

    if (company.isLeft()) {
      return left(company.value)
    }

    await this.companiesRepository.create(company.value)

    return right({
      company: company.value,
    })
  }
}
