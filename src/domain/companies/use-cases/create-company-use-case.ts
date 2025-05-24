import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { Company } from '@/domain/companies/entities/company'
import { CNPJ } from '@/domain/companies/entities/value-objects/cnpj'
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

    const company = Company.create({
      cnpj: cnpjObject.value,
      name: nameObject.value,
      emailAddress: emailAddressObject.value,
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
