import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { SystemAdmin } from '@/domain/users/entities/system-admin'
import { SystemAdminsRepositoryContract } from '@/domain/users/repositories/contracts/system-admins-repository-contract'
import { ActivationStatus } from '@/shared/ActivationStatus/value-objects/activation-status'

import {
  CreateSystemAdminContract,
  ICreateSystemAdminUseCaseRequest,
  ICreateSystemAdminUseCaseResponse,
} from './contracts/create-system-admin-contract'
import { SystemAdminAlreadyExistsError } from './errors/system-admin-already-exists-error'

@Injectable()
export class CreateSystemAdminUseCase implements CreateSystemAdminContract {
  constructor(
    private readonly systemAdminsRepository: SystemAdminsRepositoryContract,
  ) {}

  async execute({
    recipientId,
    profileId,
  }: ICreateSystemAdminUseCaseRequest): Promise<ICreateSystemAdminUseCaseResponse> {
    const existing = await this.systemAdminsRepository.findByRecipientId(recipientId)

    if (existing) {
      return left(new SystemAdminAlreadyExistsError(recipientId))
    }

    const systemAdmin = SystemAdmin.create({
      recipientId: new UniqueEntityId(recipientId),
      profileId: new UniqueEntityId(profileId),
      activationStatus: ActivationStatus.deactivated(),
    })

    await this.systemAdminsRepository.create(systemAdmin)

    return right({
      systemAdmin,
    })
  }
}
