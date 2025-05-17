import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Member, MemberProps } from '@/domain/companies/entities/member'

import { generateActivationStatusValueObject } from './value-objects/make-activation-status'

export async function makeMember(
  override: Partial<MemberProps> = {},
  id?: UniqueEntityId,
): Promise<Member> {
  const recipientId = override.recipientId ?? new UniqueEntityId()
  const companyId = override.companyId ?? new UniqueEntityId()
  const profileId = override.profileId ?? new UniqueEntityId()
  const activationStatus = override.activationStatus ?? generateActivationStatusValueObject(false)

  const member = Member.create(
    {
      recipientId,
      companyId,
      profileId,
      activationStatus,
      ...override,
    },
    id,
  )

  return member
}
