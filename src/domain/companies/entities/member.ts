import { Either, left, right } from '@/core/either'
import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { ActivationStatus } from '@/shared/ActivationStatus/value-objects/activation-status'
import { AlreadyActivatedError } from '@/shared/ActivationStatus/value-objects/errors/already-activated-error'
import { AlreadyDeactivatedError } from '@/shared/ActivationStatus/value-objects/errors/already-deactivated-error'

export interface MemberProps {
  recipientId: UniqueEntityId
  companyId: UniqueEntityId
  profileId: UniqueEntityId
  activationStatus: ActivationStatus
}

export class Member extends Entity<MemberProps> {

  get recipientId(): UniqueEntityId {
    return this.props.recipientId
  }

  get companyId(): UniqueEntityId {
    return this.props.companyId
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
