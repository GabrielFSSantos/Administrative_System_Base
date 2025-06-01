import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'

import { Company } from '../entities/company'

export class CompanyActivatedEvent implements DomainEvent {
  public readonly ocurredAt: Date
  public readonly company: Company

  private constructor(company: Company) {
    this.company = company
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityId {
    return this.company.id
  }

  static create(company: Company): CompanyActivatedEvent {
    return new CompanyActivatedEvent(company)
  }
}
