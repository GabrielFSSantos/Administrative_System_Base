import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { ActivationStatus } from './value-objects/activation-status'

export interface MemberProps {
  companyId: UniqueEntityId
  recipientId: UniqueEntityId
  roleId: UniqueEntityId
  activationStatus: ActivationStatus
}

export class Member extends Entity<MemberProps> {

  get roleId(): UniqueEntityId {
    return this.props.roleId
  }

  set roleId(roleId: UniqueEntityId) {
    this.props.roleId = roleId
  }

  get activationStatus(): ActivationStatus {
    return this.props.activationStatus
  }

  public isActivated(): boolean {
    return this.props.activationStatus.isActive()
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
