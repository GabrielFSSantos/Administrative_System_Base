import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { ActivatableEntity, ActivatableRepository } from '../repositories/contracts/activatable-repository-contract'
import {
  ISetActivationStatusUseCaseRequest,
  ISetActivationStatusUseCaseResponse,
  SetActivationStatusContract,
} from './contracts/set-activation-status-contract'

@Injectable()
export class SetActivationStatusUseCase<T extends ActivatableEntity> implements SetActivationStatusContract {
  constructor(
    private readonly repository: ActivatableRepository<T>,
  ) {}

  async execute({
    entityId,
    activationStatus,
  }: ISetActivationStatusUseCaseRequest): Promise<ISetActivationStatusUseCaseResponse> {
    const entity = await this.repository.findById(entityId)

    if (!entity) {
      return left(new ResourceNotFoundError())
    }

    const result = activationStatus
      ? entity.activate()
      : entity.deactivate()

    if (result.isLeft()) {
      return left(result.value)
    }

    await this.repository.save(entity)

    return right(null)
  }
}
