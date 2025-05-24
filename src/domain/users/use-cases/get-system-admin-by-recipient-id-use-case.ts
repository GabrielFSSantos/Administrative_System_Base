import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { SystemAdminsRepositoryContract } from '../repositories/contracts/system-admins-repository-contract'
import {
  GetSystemAdminByRecipientIdContract,
  IGetSystemAdminByRecipientIdUseCaseRequest,
  IGetSystemAdminByRecipientIdUseCaseResponse,
} from './contracts/get-system-admin-by-recipient-id-contract'

@Injectable()
export class GetSystemAdminByRecipientIdUseCase implements GetSystemAdminByRecipientIdContract {
  constructor(
    private systemAdminsRepository: SystemAdminsRepositoryContract,
  ) {}

  async execute({
    recipientId,
  }: IGetSystemAdminByRecipientIdUseCaseRequest): Promise<IGetSystemAdminByRecipientIdUseCaseResponse> {
    const systemAdmin = await this.systemAdminsRepository.findByRecipientId(recipientId)

    if (!systemAdmin) {
      return left(new ResourceNotFoundError())
    }

    return right({
      systemAdmin,
    })
  }
}
