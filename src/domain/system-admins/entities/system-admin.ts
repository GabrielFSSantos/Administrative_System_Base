import { Either, left, right } from '@/core/either'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { ActivationStatus } from '@/shared/value-objects/activation-status/activation-status'
import { AlreadyActivatedError } from '@/shared/value-objects/activation-status/errors/already-activated-error'
import { AlreadyDeactivatedError } from '@/shared/value-objects/activation-status/errors/already-deactivated-error'

import { SystemAdminActivatedEvent } from '../events/system-admin-activated-event'

export interface SystemAdminProps {
  recipientId: UniqueEntityId 
  profileId: UniqueEntityId   
  activationStatus: ActivationStatus
}

export class SystemAdmin extends AggregateRoot<SystemAdminProps> {

  get recipientId(): UniqueEntityId {
    return this.props.recipientId
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

    this.addDomainEvent(SystemAdminActivatedEvent.create(this))

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
    props: Optional<SystemAdminProps, 'activationStatus'>,
    id?: UniqueEntityId,
  ): SystemAdmin {
    return new SystemAdmin(
      {
        ...props,
        activationStatus: props.activationStatus ?? ActivationStatus.deactivated(),
      },
      id,
    )
  }
}
