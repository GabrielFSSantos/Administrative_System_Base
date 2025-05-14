import { faker } from '@faker-js/faker'
import { FakeHasher } from 'test/fakes/cryptography/fake-hasher'
import { generateValidCPF } from 'test/fakes/users/value-objects/fake-generate-valid-cpf'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { User, UserProps} from '@/domain/users/entities/user'
import { CPF } from '@/domain/users/entities/value-objects/cpf'
import { EmailAddress } from '@/domain/users/entities/value-objects/email-address'
import { Name } from '@/domain/users/entities/value-objects/name'
import { PasswordHash } from '@/domain/users/entities/value-objects/password-hash'

export async function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityId,
) {

  const cpf = override.cpf ?? CPF.create(generateValidCPF())
  const name = override.name ?? Name.create(faker.person.firstName())
  const emailAddress = override.emailAddress ?? EmailAddress.create(faker.internet.email())
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
