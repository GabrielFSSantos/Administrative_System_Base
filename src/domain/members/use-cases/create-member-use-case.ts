import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Member } from '@/domain/members/entities/member'
import { MembersRepositoryContract } from '@/domain/members/repositories/contracts/members-repository-contract'
import { ActivationStatus } from '@/shared/value-objects/ActivationStatus/activation-status'

import {
  CreateMemberContract,
  ICreateMemberUseCaseRequest,
  ICreateMemberUseCaseResponse,
} from './contracts/create-member-contract'
import { MemberAlreadyExistsError } from './errors/member-already-exists-error'

@Injectable()
export class CreateMemberUseCase implements CreateMemberContract {
  constructor(
    private readonly membersRepository: MembersRepositoryContract,
  ) {}

  async execute({
    recipientId,
    companyId,
    profileId,
  }: ICreateMemberUseCaseRequest): Promise<ICreateMemberUseCaseResponse> {
    const existing = await this.membersRepository.findByRecipientAndCompanyId({
      recipientId,
      companyId,
    })

    if (existing) {
      return left(new MemberAlreadyExistsError(recipientId, companyId))
    }

    const member = Member.create({
      recipientId: UniqueEntityId.create(recipientId),
      companyId: UniqueEntityId.create(companyId),
      profileId: UniqueEntityId.create(profileId),
      activationStatus: ActivationStatus.deactivated(),
    })

    await this.membersRepository.create(member)

    return right({
      member,
    })
  }
}
