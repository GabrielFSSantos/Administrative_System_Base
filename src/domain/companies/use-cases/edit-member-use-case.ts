import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/shared/errors/resource-not-found-error'

import { MembersRepositoryContract } from '../repositories/contracts/members-repository-contract'
import {
  EditMemberContract,
  IEditMemberUseCaseRequest,
  IEditMemberUseCaseResponse,
} from './contracts/edit-member-contract'

@Injectable()
export class EditMemberUseCase implements EditMemberContract {
  constructor(
    private membersRepository: MembersRepositoryContract,
  ) {}

  async execute({
    memberId,
    profileId,
  }: IEditMemberUseCaseRequest): Promise<IEditMemberUseCaseResponse> {
    const member = await this.membersRepository.findById(memberId)

    if (!member) {
      return left(new ResourceNotFoundError())
    }

    if (profileId && profileId !== member.profileId.toString()) {
      member.changeProfile(UniqueEntityId.create(profileId))
    }

    await this.membersRepository.save(member)

    return right({
      member,
    })
  }
}
