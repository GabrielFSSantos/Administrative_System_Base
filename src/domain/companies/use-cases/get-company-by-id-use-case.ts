import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { CompaniesRepositoryContract } from '../repositories/contracts/companies-repository-contract'
import {
  GetCompanyByIdContract,
  IGetCompanyByIdUseCaseRequest,
  IGetCompanyByIdUseCaseResponse,
} from './contracts/get-company-by-id-contract'

@Injectable()
export class GetCompanyByIdUseCase implements GetCompanyByIdContract {
  constructor(
    private readonly companiesRepository: CompaniesRepositoryContract,
  ) {}

  async execute({
    companyId,
  }: IGetCompanyByIdUseCaseRequest): Promise<IGetCompanyByIdUseCaseResponse> {
    const company = await this.companiesRepository.findById(companyId)

    if (!company) {
      return left(new ResourceNotFoundError())
    }

    return right({
      company,
    })
  }
}
