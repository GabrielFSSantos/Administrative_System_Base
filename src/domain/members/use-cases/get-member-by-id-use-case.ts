import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { MembersRepositoryContract } from '../repositories/contracts/members-repository-contract'
import {
  GetMemberByIdContract,
  IGetMemberByIdUseCaseRequest,
  IGetMemberByIdUseCaseResponse,
} from './contracts/get-member-by-id-contract'

@Injectable()
export class GetMemberByIdUseCase implements GetMemberByIdContract {
  constructor(
    private membersRepository: MembersRepositoryContract,
  ) {}

  async execute({
    memberId,
  }: IGetMemberByIdUseCaseRequest): Promise<IGetMemberByIdUseCaseResponse> {
    const member = await this.membersRepository.findById(memberId)

    if (!member) {
      return left(new ResourceNotFoundError())
    }

    return right({
      member,
    })
  }
}
