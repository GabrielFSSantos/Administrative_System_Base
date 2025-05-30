import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'

import { User } from '../entities/user'

export class UserPasswordChangedEvent implements DomainEvent {
  public readonly ocurredAt: Date
  public readonly user: User

  private constructor(user: User) {
    this.user = user
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityId {
    return this.user.id
  }

  static create(user: User): UserPasswordChangedEvent {
    return new UserPasswordChangedEvent(user)
  }
}
