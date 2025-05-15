import { generateCPFValueObject } from 'test/fakes/users/value-objects/fake-generate-cpf'
import { generateEmailValueObject } from 'test/fakes/users/value-objects/fake-generate-email'
import { generateNameValueObject } from 'test/fakes/users/value-objects/fake-generate-name'
import { generatePasswordHashValueObject } from 'test/fakes/users/value-objects/fake-generate-password-hash'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { User, UserProps} from '@/domain/users/entities/user'

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

  return user
}
