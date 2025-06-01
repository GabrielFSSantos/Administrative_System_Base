import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'

import { Member } from '../entities/member'

export class MemberActivatedEvent implements DomainEvent {
  public readonly ocurredAt: Date
  public readonly member: Member

  private constructor(member: Member) {
    this.member = member
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityId {
    return this.member.id
  }

  static create(member: Member): MemberActivatedEvent {
    return new MemberActivatedEvent(member)
  }
}
