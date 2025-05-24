import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { SystemAdminsRepositoryContract } from '../repositories/contracts/system-admins-repository-contract'
import {
  GetSystemAdminByIdContract,
  IGetSystemAdminByIdUseCaseRequest,
  IGetSystemAdminByIdUseCaseResponse,
} from './contracts/get-system-admin-by-id-contract'

@Injectable()
export class GetSystemAdminByIdUseCase implements GetSystemAdminByIdContract {
  constructor(
    private systemAdminsRepository: SystemAdminsRepositoryContract,
  ) {}

  async execute({
    systemAdminId,
  }: IGetSystemAdminByIdUseCaseRequest): Promise<IGetSystemAdminByIdUseCaseResponse> {
    const systemAdmin = await this.systemAdminsRepository.findById(systemAdminId)

    if (!systemAdmin) {
      return left(new ResourceNotFoundError())
    }

    return right({
      systemAdmin,
    })
  }
}
