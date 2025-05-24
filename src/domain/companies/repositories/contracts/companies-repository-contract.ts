import { Company } from '@/domain/companies/entities/company'

import { IFetchManyCompaniesUseCaseRequest } from '../../use-cases/contracts/fetch-many-companies-contract'

export abstract class CompaniesRepositoryContract {
  abstract findById(id: string): Promise<Company | null>
  abstract findByCNPJ(cnpj: string): Promise<Company | null>
  abstract findMany(params: IFetchManyCompaniesUseCaseRequest): Promise<{
    companies: Company[]
    total: number
  }>
  abstract create(company: Company): Promise<void>
  abstract save(company: Company): Promise<void>
  abstract delete(id: string): Promise<void>
}
