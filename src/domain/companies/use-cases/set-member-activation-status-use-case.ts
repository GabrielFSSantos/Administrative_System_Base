import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { MembersRepositoryContract } from '../repositories/contracts/members-repository-contract'
import {
  ISetMemberActivationStatusUseCaseRequest,
  ISetMemberActivationStatusUseCaseResponse,
  SetMemberActivationStatusContract,
} from './contracts/set-member-activation-status-contract'

@Injectable()
export class SetMemberActivationStatusUseCase implements SetMemberActivationStatusContract {
  constructor(
    private readonly membersRepository: MembersRepositoryContract,
  ) {}

  async execute({
    memberId,
    activationStatus,
  }: ISetMemberActivationStatusUseCaseRequest): Promise<ISetMemberActivationStatusUseCaseResponse> {
    const member = await this.membersRepository.findById(memberId)

    if (!member) {
      return left(new ResourceNotFoundError())
    }

    const result = activationStatus
      ? member.activate()
      : member.deactivate()

    if (result.isLeft()) {
      return left(result.value)
    }

    await this.membersRepository.save(member)

    return right(null)
  }
}
