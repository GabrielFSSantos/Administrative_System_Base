import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'
import { EmailAddress } from '@/shared/value-objects/email-address'
import { Name } from '@/shared/value-objects/name'

import { CompaniesRepositoryContract } from '../repositories/contracts/companies-repository-contract'
import {
  EditCompanyContract,
  IEditCompanyUseCaseRequest,
  IEditCompanyUseCaseResponse,
} from './contracts/edit-company-contract'

@Injectable()
export class EditCompanyUseCase implements EditCompanyContract {
  constructor(
    private readonly companiesRepository: CompaniesRepositoryContract,
  ) {}

  async execute({
    companyId,
    name,
    emailAddress,
  }: IEditCompanyUseCaseRequest): Promise<IEditCompanyUseCaseResponse> {
    const company = await this.companiesRepository.findById(companyId)

    if (!company) {
      return left(new ResourceNotFoundError())
    }

    if (name && name !== company.name.value) {
      const nameOrError = Name.create(name)

      if (nameOrError.isLeft()) {
        return left(nameOrError.value)
      }

      company.changeName(nameOrError.value)
    }

    if (emailAddress && emailAddress !== company.emailAddress.value) {
      const emailOrError = EmailAddress.create(emailAddress)

      if (emailOrError.isLeft()) {
        return left(emailOrError.value)
      }

      company.changeEmail(emailOrError.value)
    }

    await this.companiesRepository.save(company)

    return right({
      company,
    })
  }
}
