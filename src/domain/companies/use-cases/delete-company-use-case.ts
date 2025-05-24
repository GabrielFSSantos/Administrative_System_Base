import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { CompaniesRepositoryContract } from '../repositories/contracts/companies-repository-contract'
import {
  DeleteCompanyContract,
  IDeleteCompanyUseCaseRequest,
  IDeleteCompanyUseCaseResponse,
} from './contracts/delete-company-contract'

@Injectable()
export class DeleteCompanyUseCase implements DeleteCompanyContract {
  constructor(
    private readonly companiesRepository: CompaniesRepositoryContract,
  ) {}

  async execute({
    companyId,
  }: IDeleteCompanyUseCaseRequest): Promise<IDeleteCompanyUseCaseResponse> {
    const company = await this.companiesRepository.findById(companyId)

    if (!company) {
      return left(new ResourceNotFoundError())
    }

    await this.companiesRepository.delete(company.id.toString())

    return right(null)
  }
}
