import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { MembersRepositoryContract } from '../repositories/contracts/members-repository-contract'
import {
  GetMemberByRecipientIdAndCompanyIdContract,
  IGetMemberByRecipientIdAndCompanyIdUseCaseRequest,
  IGetMemberByRecipientIdAndCompanyIdUseCaseResponse,
} from './contracts/get-member-by-recipient-id-and-company-id-contract'

@Injectable()
export class GetMemberByRecipientIdAndCompanyIdUseCase 
implements GetMemberByRecipientIdAndCompanyIdContract {
  constructor(
    private membersRepository: MembersRepositoryContract,
  ) {}

  async execute({
    recipientId,
    companyId,
  }: IGetMemberByRecipientIdAndCompanyIdUseCaseRequest): 
  Promise<IGetMemberByRecipientIdAndCompanyIdUseCaseResponse> {
    const member = await this.membersRepository.findByRecipientAndCompanyId({
      recipientId,
      companyId,
    })

    if (!member) {
      return left(new ResourceNotFoundError())
    }

    return right({
      member,
    })
  }
}
