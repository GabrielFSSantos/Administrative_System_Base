import { FakeHasher } from 'test/fakes/cryptography/fake-hasher'
import { generateEmailValueObject } from 'test/fakes/users/value-objects/fake-generate-email'
import { generateNameValueObject } from 'test/fakes/users/value-objects/fake-generate-name'
import { generateCPFValueObject } from 'test/fakes/users/value-objects/fake-generate-valid-cpf'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { User, UserProps} from '@/domain/users/entities/user'
import { PasswordHash } from '@/domain/users/entities/value-objects/password-hash'

export async function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityId,
) {

  const cpf = override.cpf ?? generateCPFValueObject()
  const name = override.name ?? generateNameValueObject()
  const emailAddress = override.emailAddress ?? generateEmailValueObject()
  const passwordHash = override.passwordHash ??
    await PasswordHash.generateFromPlain('Strong@123', new FakeHasher())

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
