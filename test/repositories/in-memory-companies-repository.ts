import { Company } from '@/domain/companies/entities/company'
import { CompaniesRepositoryContract } from '@/domain/companies/repositories/contracts/companies-repository-contract'
import { IFetchManyCompaniesUseCaseRequest } from '@/domain/companies/use-cases/contracts/fetch-many-companies-contract'

export class InMemoryCompaniesRepository implements CompaniesRepositoryContract {
  public items: Company[] = []

  async findById(id: string): Promise<Company | null> {
    const company = this.items.find((item) => item.id.toString() === id)

    if (!company) {
      return null
    }

    return company
  }

  async findByCNPJ(cnpj: string): Promise<Company | null> {
    const company = this.items.find((item) => item.cnpj.value === cnpj)

    if (!company) {
      return null
    }

    return company
  }

  async findMany({ page, pageSize, search }: IFetchManyCompaniesUseCaseRequest): 
  Promise<{ companies: Company[]; total: number }> {
    let results = this.items

    if (search) {
      const term = search.toLowerCase()

      results = results.filter((company) =>
        company.name.value.toLowerCase().includes(term) ||
        company.emailAddress.value.toLowerCase().includes(term) ||
        company.cnpj.value.includes(term),
      )
    }

    const total = results.length

    const paginated = results.slice((page - 1) * pageSize, page * pageSize)

    return {
      companies: paginated,
      total,
    }
  }

  async create(company: Company): Promise<void> {
    this.items.push(company)
  }

  async save(company: Company): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === company.id)

    this.items[itemIndex] = company
  }

  async delete(id: string): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.toString() === id)

    this.items.splice(itemIndex, 1)
  }
}
