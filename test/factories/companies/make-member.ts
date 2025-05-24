import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Member, MemberProps } from '@/domain/companies/entities/member'

import { generateActivationStatusValueObject } from '../value-objects/make-activation-status'

export async function makeMember(
  override: Partial<MemberProps> = {},
  id?: UniqueEntityId,
): Promise<Member> {
  const recipientId = override.recipientId ?? UniqueEntityId.create()
  const companyId = override.companyId ?? UniqueEntityId.create()
  const profileId = override.profileId ?? UniqueEntityId.create()
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
