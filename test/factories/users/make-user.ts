import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { User, UserProps} from '@/domain/users/entities/user'

import { generateNameValueObject } from '../value-objects/make-name'
import { generateCPFValueObject } from './value-objects/make-cpf'
import { generateEmailValueObject } from './value-objects/make-email'
import { generatePasswordHashValueObject } from './value-objects/make-password-hash'

export async function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityId,
) {

  const cpf = override.cpf ?? generateCPFValueObject()
  const name = override.name ?? generateNameValueObject()
  const emailAddress = override.emailAddress ?? generateEmailValueObject()
  const passwordHash = override.passwordHash ?? await generatePasswordHashValueObject()

  const user = User.create(
    {
      cpf,
      name,
      emailAddress,
      passwordHash,
      ...override,
    },
    id,
  )

  if(user.isLeft()) {
    throw user.value
  }

  return user.value
}
