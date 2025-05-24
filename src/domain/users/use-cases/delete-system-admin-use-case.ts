import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { SystemAdminsRepositoryContract } from '../repositories/contracts/system-admins-repository-contract'
import {
  DeleteSystemAdminContract,
  IDeleteSystemAdminUseCaseRequest,
  IDeleteSystemAdminUseCaseResponse,
} from './contracts/delete-system-admin-contract'

@Injectable()
export class DeleteSystemAdminUseCase implements DeleteSystemAdminContract {
  constructor(
    private systemAdminsRepository: SystemAdminsRepositoryContract,
  ) {}

  async execute({
    systemAdminId,
  }: IDeleteSystemAdminUseCaseRequest): Promise<IDeleteSystemAdminUseCaseResponse> {
    const systemAdmin = await this.systemAdminsRepository.findById(systemAdminId)

    if (!systemAdmin) {
      return left(new ResourceNotFoundError())
    }

    await this.systemAdminsRepository.delete(systemAdmin.id)

    return right(null)
  }
}
