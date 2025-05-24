import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { SystemAdminsRepositoryContract } from '../repositories/contracts/system-admins-repository-contract'
import {
  EditSystemAdminContract,
  IEditSystemAdminUseCaseRequest,
  IEditSystemAdminUseCaseResponse,
} from './contracts/edit-system-admin-contract'

@Injectable()
export class EditSystemAdminUseCase implements EditSystemAdminContract {
  constructor(
    private systemAdminsRepository: SystemAdminsRepositoryContract,
  ) {}

  async execute({
    systemAdminId,
    profileId,
  }: IEditSystemAdminUseCaseRequest): Promise<IEditSystemAdminUseCaseResponse> {
    
    const systemAdmin = await this.systemAdminsRepository.findById(systemAdminId)

    if (!systemAdmin) {
      return left(new ResourceNotFoundError())
    }

    if (profileId && profileId !== systemAdmin.profileId.toString()) {
      systemAdmin.changeProfile(new UniqueEntityId(profileId))
    }

    await this.systemAdminsRepository.save(systemAdmin)

    return right({
      systemAdmin,
    })
  }
}
