import { Either } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { ActivationStatus } from '../../activation-status'
import { AlreadyActivatedError } from '../../errors/already-activated-error'
import { AlreadyDeactivatedError } from '../../errors/already-deactivated-error'

export interface ActivatableEntity {
  id: UniqueEntityId
  activationStatus: ActivationStatus
  isActivated(): boolean
  activate(): Either<AlreadyActivatedError, null>
  deactivate(): Either<AlreadyDeactivatedError, null>
}

export interface ActivatableRepository<T extends ActivatableEntity> {
  findById(id: string): Promise<T | null>
  save(entity: T): Promise<void>
}
