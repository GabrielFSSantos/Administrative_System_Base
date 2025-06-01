import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'

import { Session } from '../entities/session'

export class SessionCreatedEvent implements DomainEvent {
  public readonly ocurredAt: Date
  public readonly session: Session

  private constructor(session: Session) {
    this.session = session
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityId {
    return this.session.id
  }

  static create(session: Session): SessionCreatedEvent {
    return new SessionCreatedEvent(session)
  }
}
