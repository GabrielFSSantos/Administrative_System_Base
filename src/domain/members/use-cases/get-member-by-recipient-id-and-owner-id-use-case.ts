import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { MembersRepositoryContract } from '../repositories/contracts/members-repository-contract'
import {
  GetMemberByRecipientIdAndOwnerIdContract,
  IGetMemberByRecipientIdAndOwnerIdUseCaseRequest,
  IGetMemberByRecipientIdAndOwnerIdUseCaseResponse,
} from './contracts/get-member-by-recipient-id-and-owner-id-contract'

@Injectable()
export class GetMemberByRecipientIdAndOwnerIdUseCase 
implements GetMemberByRecipientIdAndOwnerIdContract {
  constructor(
    private membersRepository: MembersRepositoryContract,
  ) {}

  async execute({
    recipientId,
    ownerId,
  }: IGetMemberByRecipientIdAndOwnerIdUseCaseRequest): 
  Promise<IGetMemberByRecipientIdAndOwnerIdUseCaseResponse> {
    const member = await this.membersRepository.findByRecipientAndOwnerId({
      recipientId,
      ownerId,
    })

    if (!member) {
      return left(new ResourceNotFoundError())
    }

    return right({
      member,
    })
  }
}
