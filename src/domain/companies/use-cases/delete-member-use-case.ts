import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { MembersRepositoryContract } from '../repositories/contracts/members-repository-contract'
import {
  DeleteMemberContract,
  IDeleteMemberUseCaseRequest,
  IDeleteMemberUseCaseResponse,
} from './contracts/delete-member-contract'

@Injectable()
export class DeleteMemberUseCase implements DeleteMemberContract {
  constructor(
    private membersRepository: MembersRepositoryContract,
  ) {}

  async execute({
    memberId,
  }: IDeleteMemberUseCaseRequest): Promise<IDeleteMemberUseCaseResponse> {
    const member = await this.membersRepository.findById(memberId)

    if (!member) {
      return left(new ResourceNotFoundError())
    }

    await this.membersRepository.delete(member.id.toString())

    return right(null)
  }
}
