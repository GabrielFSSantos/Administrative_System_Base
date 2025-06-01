import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'

import { SystemAdmin } from '../entities/system-admin'

export class SystemAdminActivatedEvent implements DomainEvent {
  public readonly ocurredAt: Date
  public readonly systemAdmin: SystemAdmin

  private constructor(systemAdmin: SystemAdmin) {
    this.systemAdmin = systemAdmin
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityId {
    return this.systemAdmin.id
  }

  static create(systemAdmin: SystemAdmin): SystemAdminActivatedEvent {
    return new SystemAdminActivatedEvent(systemAdmin)
  }
}
