import { Either, left, right } from '@/core/either'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { ActivationStatus } from '@/shared/value-objects/activation-status/activation-status'
import { AlreadyActivatedError } from '@/shared/value-objects/activation-status/errors/already-activated-error'
import { AlreadyDeactivatedError } from '@/shared/value-objects/activation-status/errors/already-deactivated-error'

import { MemberActivatedEvent } from '../events/member-activated-event'

export interface MemberProps {
  recipientId: UniqueEntityId
  ownerId: UniqueEntityId
  profileId: UniqueEntityId
  activationStatus: ActivationStatus
}

export class Member extends AggregateRoot<MemberProps> {

  get recipientId(): UniqueEntityId {
    return this.props.recipientId
  }

  get ownerId(): UniqueEntityId {
    return this.props.ownerId
  }

  get profileId(): UniqueEntityId {
    return this.props.profileId
  }

  get activationStatus(): ActivationStatus {
    return this.props.activationStatus
  }

  public changeProfile(newProfileId: UniqueEntityId): void {
    if (this.props.profileId.equals(newProfileId)) {
      return
    }

    this.props.profileId = newProfileId
  }

  public isActivated(): boolean {
    return this.props.activationStatus.isActive()
  }

  public activate(): Either<
    AlreadyActivatedError, 
    null
    > {
    if (this.isActivated()) {
      return left(new AlreadyActivatedError())
    }

    this.props.activationStatus = ActivationStatus.activated()

    this.addDomainEvent(MemberActivatedEvent.create(this))

    return right(null)
  }

  public deactivate(): Either<
    AlreadyDeactivatedError, 
    null
    > {
    if (!this.isActivated()) {
      return left(new AlreadyDeactivatedError())
    }

    this.props.activationStatus = ActivationStatus.deactivated()

    return right(null)
  }

  static create(
    props: Optional<
    MemberProps,  'activationStatus'>, 
    id?: UniqueEntityId,
  ): Member {
    return new Member(
      {
        ...props,
        activationStatus: props.activationStatus ?? ActivationStatus.deactivated(),
      },
      id,
    )
  }
}
